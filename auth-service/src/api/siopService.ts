import { RP, SIOP } from "@sphereon/did-auth-siop";
import { AuthEvents, MessageError, MessageResponse } from "interfaces";

export class SIOPService {
  constructor(private channel) {
    this.registerListeners();
  }

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

  private async createAuthenticationRequest() {
    const rp = this.getRP();

    const reqURI = await rp.createAuthenticationRequest();
    // console.log(reqURI.encodedUri);
    return reqURI.encodedUri;
  }

  private getRP() {
    const rpKeys = {
      hexPrivateKey: process.env.SIOP_KEY,
      did: process.env.SIOP_DID,
      didKey: process.env.SIOP_DID_KEY,
    };
    // The relying party (web) private key and DID and DID key (public key)
    return RP.builder()
      .redirect(process.env.SIOP_REDIRECT_URI)
      .requestBy(SIOP.PassBy.VALUE)
      .internalSignature(rpKeys.hexPrivateKey, rpKeys.did, rpKeys.didKey)
      .addDidMethod("key")
      .registrationBy(SIOP.PassBy.VALUE)
      .build();
  }

  public static async verifyAuthResponse(authResponseJWT) {
    const rpKeys = {
      hexPrivateKey: process.env.SIOP_KEY,
      did: process.env.SIOP_DID,
      didKey: process.env.SIOP_DID_KEY,
    };

    const rp = RP.builder()
      .redirect(process.env.SIOP_REDIRECT_URI)
      .requestBy(SIOP.PassBy.VALUE)
      .internalSignature(rpKeys.hexPrivateKey, rpKeys.did, rpKeys.didKey)
      .addDidMethod("key")
      .registrationBy(SIOP.PassBy.VALUE)
      .build();

    try {
      const verifiedAuthResponseWithJWT =
        await rp.verifyAuthenticationResponseJwt(authResponseJWT, {
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
}
