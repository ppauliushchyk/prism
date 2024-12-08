import { Body, Controller, Get, Logger, Post, Req, Res } from "@nestjs/common";

import { Request, Response } from "express";
import {
  CreatePaymentDto,
  createPaymentSchema,
} from "./schemas/payment.schema";
import { ValidationPipe } from "./pipes/validation.pipe";

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

  @Post("/")
  async createPayment(
    @Res() res: Response,
    @Body(new ValidationPipe(createPaymentSchema))
    dto: { data: CreatePaymentDto; errors?: any },
  ) {
    if (dto.errors) {
      return res.render("index", {
        data: { amount: dto.data.amount },
        errors: dto.errors,
      });
    }
  }
}
