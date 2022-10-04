import * as DID_SIOP from "did-siop";
import { getMongoRepository } from "typeorm";
import {
  AuthEvents,
  MessageError,
  MessageResponse,
  UserRole,
} from "interfaces";
import crypto from "crypto";
import { User } from "@entity/user";
import { Logger } from "logger-helper";
import { sign } from "jsonwebtoken";
import { SiopSession } from "@entity/siop-session";

export class SIOPService {
  constructor(private channel) {
    this.registerListeners();
    this.getRp().then((rp) => {
      this._rp = rp;
    });
  }

  private _rp: any = undefined;
  private static MOCKED_NONCE = "mocked-nonce";
  private static MOCKED_STATE = "mocked-state";

  public get rp() {
    return this._rp;
  }

  registerListeners(): void {
    this.channel.response(
      AuthEvents.GET_SIOP_AUTH_REQUEST,
      async (msg, res) => {
        // randomly generated state and nonce
        const nonce = SIOPService.MOCKED_NONCE;
        // Math.random().toString(36).substring(2, 15) +
        // Math.random().toString(36).substring(2, 15);

        const state = SIOPService.MOCKED_STATE;
        // Math.random().toString(36).substring(2, 15) +
        // Math.random().toString(36).substring(2, 15);

        // save in db
        const sessionRepo = getMongoRepository(SiopSession);
        const siopSession = sessionRepo.create({
          nonce,
          state,
        });
        await sessionRepo.save(siopSession);

        try {
          res.send(
            new MessageResponse(await this.createAuthenticationRequest())
          );
        } catch (e) {
          res.send(new MessageError(e.message));
        }
      }
    );

    this.channel.response(AuthEvents.LOGIN_STATUS_SIOP, async (msg, res) => {
      console.log(`nonce ${JSON.stringify(msg.payload)}`);
      const { nonce, state } = msg.payload;
      console.log(`nonce ${nonce}`);
      console.log(`state ${state}`);

      try {
        const sessionRepo = getMongoRepository(SiopSession);
        let siopSession = await sessionRepo.findOne({
          nonce: nonce,
          state: state,
        });

        if (siopSession && siopSession.username) {
          const userRepository = getMongoRepository(User);
          let user = await userRepository.findOne({
            username: siopSession.username,
          });
          if (user) {
            const accessToken = this.generateAccessToken(user);
            res.send(
              new MessageResponse({
                username: user.username,
                did: user.did,
                role: user.role,
                accessToken: accessToken,
              })
            );
          } else {
            res.send(new MessageError("unknown user"));
          }
        }
        res.send(new MessageResponse(siopSession));
      } catch (e) {
        res.send(new MessageError(e.message));
      }
    });

    this.channel.response(
      AuthEvents.REGISTER_OR_LOGIN_USER_USING_SIOP,
      async (msg, res) => {
        console.log(`message received ${JSON.stringify(msg)}`);
        try {
          const authResponse = msg.payload.id_token;
          // validate
          let verifiedAuthResponseWithJWT;
          try {
            verifiedAuthResponseWithJWT = await this.verifyAuthResponse(
              authResponse
            );
          } catch (e) {
            console.log(e);
            res.send(new MessageError(`Invalid Response ${e.message}`));
          }

          // try login first
          const userRepository = getMongoRepository(User);

          const username = verifiedAuthResponseWithJWT.payload.did;
          const nonce = SIOPService.MOCKED_NONCE; //verifiedAuthResponseWithJWT.payload.nonce
          const state = SIOPService.MOCKED_STATE; //verifiedAuthResponseWithJWT.payload.state
          let user = await userRepository.findOne({ username: username });
          console.log(`user ${JSON.stringify(user)}`);
          if (!user) {
            //create new
            const password =
              Math.random().toString(36).substring(2, 15) +
              Math.random().toString(36).substring(2, 15);
            const passwordDigest = crypto
              .createHash("sha256")
              .update(password)
              .digest("hex");

            console.log(`username ${username}`);

            user = userRepository.create({
              username: "Vijay Shiyani",
              password: passwordDigest,
              role: UserRole.USER,
              did: null,
              parent: null,
              hederaAccountId: null,
            });
          }

          user = await userRepository.save(user);

          console.log(`user ${JSON.stringify(user)}`);

          //generate new token
          const accessToken = this.generateAccessToken(user);

          //update siop session using nonce and state
          await getMongoRepository(SiopSession).update(
            {
              nonce: SIOPService.MOCKED_NONCE,
              state: SIOPService.MOCKED_STATE,
            },
            {
              nonce: SIOPService.MOCKED_NONCE,
              state: SIOPService.MOCKED_STATE,
              username: user.username,
            }
          );

          res.send(
            new MessageResponse({
              username: user.username,
              did: user.did,
              role: user.role,
              accessToken: accessToken,
            })
          );
        } catch (e) {
          new Logger().error(e.toString(), ["AUTH_SERVICE"]);
          res.send(new MessageError(e.message));
        }
      }
    );
  }

  private generateAccessToken(user: User) {
    return sign(
      {
        username: user.username,
        did: user.did,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET
    );
  }

  private async createAuthenticationRequest() {
    /**
     *
     * TODO: generate request with state and nonce
     * store state and nonce to DB
     *
     */
    const reqURI = await this._rp.generateRequest();
    return reqURI;
  }

  private async verifyAuthResponse(authResponseJWT) {
    try {
      console.log("validating response" + JSON.stringify(authResponseJWT));
      const verifiedAuthResponseWithJWT = await this._rp.validateResponse(
        authResponseJWT
      );

      console.log(
        "validating response" + JSON.stringify(verifiedAuthResponseWithJWT)
      );
      console.log(verifiedAuthResponseWithJWT);
      console.log(`is valid:  ${verifiedAuthResponseWithJWT.payload.did}`);

      return verifiedAuthResponseWithJWT;
      // TODO: retrieve state and nonce from DB and validate
      // if(!verifiedAuthResponseWithJWT.jwt || verifiedAuthResponseWithJWT.payload.state != "b32f0087fc9816eb813fd11f" || verifiedAuthResponseWithJWT.payload.nonce!= "qBrR7mqnY3Qr49dAZycPF8FzgE83m6H0c2l0bzP4xSg")
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  private async getRp() {
    const rpKeys = {
      hexPrivateKey: process.env.SIOP_KEY,
      did: process.env.SIOP_DID,
      didKey: process.env.SIOP_DID_KEY,
    };
    // The relying party (web) private key and DID and DID key (public key)
    const rp = await DID_SIOP.RP.getRP(
      process.env.SIOP_REDIRECT_URI, // RP's redirect_uri
      rpKeys.did, // RP's did
      {
        jwks_uri: `https://uniresolver.io/1.0/identifiers/${rpKeys.did};transform-keys=jwks`,
        id_token_signed_response_alg: ["ES256K", "ES256K-R", "EdDSA", "RS256"],
      }
    );

    rp.addSigningParams(
      rpKeys.hexPrivateKey,
      rpKeys.didKey,
      DID_SIOP.KEY_FORMATS.BASE58,
      DID_SIOP.ALGORITHMS["EdDSA"]
    );

    return rp;
  }
}
