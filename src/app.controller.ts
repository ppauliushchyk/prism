import { Body, Controller, Get, Logger, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";

import { ValidationPipe } from "./pipes/validation.pipe";
import { ProviderService } from "./provider/provider.service";
import {
  CreatePaymentDto,
  createPaymentSchema,
} from "./schemas/payment.schema";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name, { timestamp: true });

  constructor(
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
  ) {}

  @Get("/")
  root(@Req() req: Request, @Res() res: Response) {
    const ips = (
      (req.headers["cf-connecting-ip"] as string) ??
      (req.headers["x-real-ip"] as string) ??
      (req.headers["x-forwarded-for"] as string) ??
      req.socket.remoteAddress ??
      ""
    ).split(",");
    const ip = ips[0].trim();

    this.logger.log("Payment Form Visited", {
      agent: req.headers["user-agent"],
      browser: req.headers["sec-ch-ua"],
      ip,
      platform: req.headers["sec-ch-ua-platform"],
    });

    return res.render("index");
  }

  @Post("/")
  async createPayment(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ValidationPipe(createPaymentSchema))
    body: { data: CreatePaymentDto; errors?: any },
  ) {
    const agent = req.headers["user-agent"];

    const ips = (
      (req.headers["cf-connecting-ip"] as string) ??
      (req.headers["x-real-ip"] as string) ??
      (req.headers["x-forwarded-for"] as string) ??
      req.socket.remoteAddress ??
      ""
    ).split(",");
    const ip = ips[0].trim();

    const platform = req.headers["sec-ch-ua-platform"];

    this.logger.log("Payment Form Submitted", {
      agent,
      browser: req.headers["sec-ch-ua"],
      ip,
      platform,
    });

    if (body.errors) {
      return res.render("index", {
        data: { amount: body.data.amount },
        errors: body.errors,
      });
    }

    const { data } = body;

    try {
      const purchase = await this.providerService.createPurchaseAsync({
        amount: data.amount,
        currency: data.currency,
        platform: (platform as string) ?? "",
      });

      const { payment, result } = await this.providerService.createPaymentAsync(
        {
          cc_cvv: data.cc_cvv,
          cc_expiration: data.cc_expiration,
          cc_name: data.cc_name,
          cc_number: data.cc_number,
          direct_post_url: purchase.direct_post_url,
          purchase_id: purchase.id,
          remote_ip: ip,
          user_agent: (agent as string) ?? "",
        },
      );

      if (result.status === "3DS_required") {
        const base_url = this.configService.getOrThrow<string>("base_url");

        return res.render("confirm", {
          md: result.MD,
          method: result.Method,
          pa_req: result.PaReq,
          term_url: `${base_url}/purchase/${purchase.id}/${payment.id}/confirm`,
          url: result.URL,
        });
      }

      return res.redirect(`/purchase/${purchase.id}`);
    } catch {
      return res.redirect("/payment/failed");
    }
  }
}
