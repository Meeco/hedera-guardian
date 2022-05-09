import { Request, Response, Router } from "express";
import { Siop } from "@helpers/siop";

/**
 * SIOP account route
 */
export const siopAPI = Router();

siopAPI.post("/callback", async (req: Request, res: Response) => {
  console.log(`Request received: ${JSON.stringify(req.body, null, 2)}`);
  const siop = new Siop();

  /**
   * Process requests and authenticate user if seems valid
   */
  res
    .status(200)
    .json(await siop.processAuthenticationResponse(req.body.id_token));
});

siopAPI.get("/status", async (req: Request, res: Response) => {
  /**
   * TODO: potentially we'll need an endpoint where guardian frontent can check if generated QR code was used for authentication
   * and redirect user to profile/error page
   *
   * might use nonce or state to identify which login status is being checked
   */
  res.status(201).json();
});

/**
 * get Authentication Request for OP (OpenId Provider - Wallet)
 */
siopAPI.get("/authenticationRequest", async (req: Request, res: Response) => {
  const siop = new Siop();

  const requestUri = await siop.createAuthenticationRequest();
  res.status(201).json({
    requestUri,
  });
});
