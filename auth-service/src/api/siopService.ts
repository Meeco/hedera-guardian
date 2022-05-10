import * as DID_SIOP from "did-siop";
import { AuthEvents, MessageError, MessageResponse } from "interfaces";

export class SIOPService {
  constructor(private channel) {
    this.registerListeners();
    this.getRp().then((rp) => {
      this._rp = rp;
    });
  }

  private _rp: any = undefined;

  registerListeners(): void {
    this.channel.response(
      AuthEvents.GET_SIOP_AUTH_REQUEST,
      async (msg, res) => {
        const { token } = msg.payload;

        try {
          res.send(
            new MessageResponse(await this.createAuthenticationRequest())
          );
        } catch (e) {
          res.send(new MessageError(e.message));
        }
      }
    );
  }

  public get rp() {
    return this._rp;
  }

  private async createAuthenticationRequest() {
    const reqURI = await this._rp.generateRequest();
    return reqURI;
  }

  public async verifyAuthResponse(authResponseJWT) {
    try {
      const verifiedAuthResponseWithJWT =
        await this._rp.verifyAuthenticationResponseJwt(authResponseJWT, {
          audience: process.env.SIOP_REDIRECT_URI,
        });

      console.log(
        `verified Auth Response JWT:  ${verifiedAuthResponseWithJWT.jwt}`
      );

      // TODO: retrieve state and nonce from DB and validate
      // if(!verifiedAuthResponseWithJWT.jwt || verifiedAuthResponseWithJWT.payload.state != "b32f0087fc9816eb813fd11f" || verifiedAuthResponseWithJWT.payload.nonce!= "qBrR7mqnY3Qr49dAZycPF8FzgE83m6H0c2l0bzP4xSg")
    } catch (e) {
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
