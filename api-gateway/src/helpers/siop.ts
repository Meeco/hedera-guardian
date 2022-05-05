import { Singleton } from "@helpers/decorators/singleton";
import { Request } from "express";
import {
  ApplicationStates,
  AuthEvents,
  MessageAPI,
  UserRole,
} from "interfaces";
import { ServiceRequestsBase } from "@helpers/serviceRequestsBase";
import { IAuthUser } from "@auth/auth.interface";

/**
 * SIOP service
 */
@Singleton
export class Siop extends ServiceRequestsBase {
  public target: string = "auth-service";

  public async createAuthenticationRequest(): Promise<string> {
    return await this.request(AuthEvents.GET_SIOP_AUTH_REQUEST);
  }
}
