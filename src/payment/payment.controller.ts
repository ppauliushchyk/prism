import { Controller, Get, Logger, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

@Controller("/payment")
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name, {
    timestamp: true,
  });

  @Get("/cancelled")
  cancelled(@Req() req: Request, @Res() res: Response) {
    const ips = (
      (req.headers["cf-connecting-ip"] as string) ??
      (req.headers["x-real-ip"] as string) ??
      (req.headers["x-forwarded-for"] as string) ??
      req.socket.remoteAddress ??
      ""
    ).split(",");
    const ip = ips[0].trim();

    this.logger.log("Payment Cancelled Visited", {
      agent: req.headers["user-agent"],
      browser: req.headers["sec-ch-ua"],
      ip,
      platform: req.headers["sec-ch-ua-platform"],
    });

    return res.render("cancelled");
  }

  @Get("/failed")
  failed(@Req() req: Request, @Res() res: Response) {
    const ips = (
      (req.headers["cf-connecting-ip"] as string) ??
      (req.headers["x-real-ip"] as string) ??
      (req.headers["x-forwarded-for"] as string) ??
      req.socket.remoteAddress ??
      ""
    ).split(",");
    const ip = ips[0].trim();

    this.logger.log("Payment Failed Visited", {
      agent: req.headers["user-agent"],
      browser: req.headers["sec-ch-ua"],
      ip,
      platform: req.headers["sec-ch-ua-platform"],
    });

    return res.render("failed");
  }

  @Get("/pending")
  pending(@Req() req: Request, @Res() res: Response) {
    const ips = (
      (req.headers["cf-connecting-ip"] as string) ??
      (req.headers["x-real-ip"] as string) ??
      (req.headers["x-forwarded-for"] as string) ??
      req.socket.remoteAddress ??
      ""
    ).split(",");
    const ip = ips[0].trim();

    this.logger.log("Pending Payment Visited", {
      agent: req.headers["user-agent"],
      browser: req.headers["sec-ch-ua"],
      ip,
      platform: req.headers["sec-ch-ua-platform"],
    });

    return res.render("pending");
  }

  @Get("/successful")
  successful(@Req() req: Request, @Res() res: Response) {
    const ips = (
      (req.headers["cf-connecting-ip"] as string) ??
      (req.headers["x-real-ip"] as string) ??
      (req.headers["x-forwarded-for"] as string) ??
      req.socket.remoteAddress ??
      ""
    ).split(",");
    const ip = ips[0].trim();

    this.logger.log("Payment Successful Visited", {
      agent: req.headers["user-agent"],
      browser: req.headers["sec-ch-ua"],
      ip,
      platform: req.headers["sec-ch-ua-platform"],
    });

    return res.render("successful");
  }
}
