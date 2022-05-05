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
    // The relying party (web) private key and DID and DID key (public key)
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
      .addPresentationDefinitionClaim({
        definition: {
          id: "9a809146-4ea5-4bd4-bcd8-4e6c28c347af",
          input_descriptors: [
            {
              id: "8d78910f-d5b5-4db5-81fe-44dfabd5559a",
              schema: [
                {
                  uri: "https://meecodevstorage0.blob.core.windows.net/credentials/id/1.0/schema.json",
                },
              ],
            },
          ],
        },
        location: SIOP.PresentationLocation.VP_TOKEN, // Toplevel vp_token response expected. This also can be ID_TOKEN
      })
      .build();

    const reqURI = await rp.createAuthenticationRequest();
    // console.log(reqURI.encodedUri);
    return reqURI.encodedUri;
  }
}
