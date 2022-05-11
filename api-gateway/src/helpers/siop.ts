import { Singleton } from "@helpers/decorators/singleton";
import { AuthEvents } from "interfaces";
import { ServiceRequestsBase } from "@helpers/serviceRequestsBase";

/**
 * SIOP service
 */
@Singleton
export class Siop extends ServiceRequestsBase {
  public target: string = "auth-service";

  public async createAuthenticationRequest(): Promise<string> {
    return await this.request(AuthEvents.GET_SIOP_AUTH_REQUEST);
  }

  public async processAuthenticationResponse(
    id_token: string
  ): Promise<string> {
    return await this.request(AuthEvents.REGISTER_OR_LOGIN_USER_USING_SIOP, {
      id_token,
    });
  }

  public async getStatus(qrCodeState: string): Promise<string> {
    return await this.request(AuthEvents.LOGIN_STATUS_SIOP, {
      qrCodeState,
    });
  }
}
