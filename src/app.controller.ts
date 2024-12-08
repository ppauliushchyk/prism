import { Controller, Get, Logger, Req, Res } from "@nestjs/common";

import { Request, Response } from "express";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name, { timestamp: true });

  @Get("/")
  root(@Req() req: Request, @Res() res: Response) {
    this.logger.log("Payment Form Visited", {
      agent: req.headers["user-agent"],
      browser: req.headers["sec-ch-ua"],
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip,
      platform: req.headers["sec-ch-ua-platform"],
    });

    return res.render("index");
  }
}
