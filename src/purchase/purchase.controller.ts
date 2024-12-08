import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";

import { ProviderService } from "../provider/provider.service";

import { PurchaseService } from "./purchase.service";

@Controller("/purchase")
export class PurchaseController {
  private readonly logger = new Logger(PurchaseController.name, {
    timestamp: true,
  });

  constructor(
    private readonly providerService: ProviderService,
    private readonly purchaseService: PurchaseService,
  ) {}

  @Get("/:id")
  async root(
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ips = (
      (req.headers["cf-connecting-ip"] as string) ??
      (req.headers["x-real-ip"] as string) ??
      (req.headers["x-forwarded-for"] as string) ??
      req.socket.remoteAddress ??
      ""
    ).split(",");
    const ip = ips[0].trim();

    this.logger.log("Purchase Visited", {
      agent: req.headers["user-agent"],
      browser: req.headers["sec-ch-ua"],
      ip,
      platform: req.headers["sec-ch-ua-platform"],
    });

    try {
      const purchase = await this.purchaseService.readAsync({ id });

      if (purchase.status === "paid") {
        return res.render("successful");
      }

      if (
        purchase.status === "created" ||
        purchase.status === "pending_execute"
      ) {
        return res.render("pending");
      }

      return res.render("failed");
    } catch {
      return res.render("failed");
    }
  }

  @Post("/:purchaseId/:paymentId/confirm")
  async successful(
    @Body() body: any,
    @Param("paymentId", ParseIntPipe) paymentId: number,
    @Param("purchaseId") purchaseId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ips = (
      (req.headers["cf-connecting-ip"] as string) ??
      (req.headers["x-real-ip"] as string) ??
      (req.headers["x-forwarded-for"] as string) ??
      req.socket.remoteAddress ??
      ""
    ).split(",");
    const ip = ips[0].trim();

    this.logger.log("Purchase Confirm Submitted", {
      agent: req.headers["user-agent"],
      browser: req.headers["sec-ch-ua"],
      ip,
      platform: req.headers["sec-ch-ua-platform"],
    });

    try {
      await this.providerService.confirmPaymentAsync({
        md: body.MD,
        pa_res: body.PaRes,
        payment_id: paymentId,
        purchase_id: purchaseId,
      });

      return res.redirect(`/purchase/${purchaseId}`);
    } catch {
      return res.redirect("/payment/failed");
    }
  }
}
