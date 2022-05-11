import { Request, Response, Router } from "express";
import { Siop } from "@helpers/siop";
import { Logger } from "logger-helper";

/**
 * SIOP account route
 */
export const siopAPI = Router();

siopAPI.post("/callback", async (req: Request, res: Response) => {
  console.log(`Request received: ${JSON.stringify(req.body, null, 2)}`);
  console.log(`id_token: ${JSON.stringify(req.body.id_token, null, 2)}`);
  const siop = new Siop();
  try {
    res
      .status(200)
      .json(await siop.processAuthenticationResponse(req.body.id_token));
  } catch (e) {
    new Logger().error(e.message, ["API_GATEWAY"]);
    res.status(500).send({ code: 500, message: e.message });
  }
});

siopAPI.post("/status", async (req: Request, res: Response) => {
  const siop = new Siop();
  try {
    console.log(`request received with body ${JSON.stringify(req.body)}`);
    let qrCodeState = req.body;
    if (qrCodeState && qrCodeState.nonce && qrCodeState.state) {
      res.status(200).json(await siop.getStatus(qrCodeState));
    } else {
      res.status(400).json({
        code: 400,
        message: "invalid request: missing nonce or state",
      });
    }
  } catch (e) {
    console.log(e);
    new Logger().error(e.message, ["API_GATEWAY"]);
    res.status(500).send({ code: 500, message: e.message });
  }
});

siopAPI.get("/authenticationRequest", async (req: Request, res: Response) => {
  const siop = new Siop();

  const requestUri = await siop.createAuthenticationRequest();
  res.status(201).json({
    requestUri,
  });
});
