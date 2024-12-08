import { Controller, HttpCode, Logger, Post, Req } from "@nestjs/common";
import { Request } from "express";

@Controller("/callback")
export class CallbackController {
  private readonly logger = new Logger(CallbackController.name, {
    timestamp: true,
  });

  @Post("/success")
  @HttpCode(200)
  success(@Req() req: Request) {
    const ips = (
      (req.headers["cf-connecting-ip"] as string) ??
      (req.headers["x-real-ip"] as string) ??
      (req.headers["x-forwarded-for"] as string) ??
      req.socket.remoteAddress ??
      ""
    ).split(",");
    const ip = ips[0].trim();

    this.logger.log("Incoming Callback Received", {
      callback_type: "success",
      ip,
    });

    return null;
  }
}
