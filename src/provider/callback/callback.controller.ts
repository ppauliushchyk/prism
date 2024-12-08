import { Body, Controller, HttpCode, Logger, Post, Req } from "@nestjs/common";
import { Request } from "express";

import { ValidationPipe } from "../../pipes/validation.pipe";
import {
  CreateCallbackDto,
  createCallbackSchema,
} from "../../schemas/callback.schema";

import { CallbackService } from "./callback.service";

@Controller("/callback")
export class CallbackController {
  private readonly logger = new Logger(CallbackController.name, {
    timestamp: true,
  });

  constructor(private readonly callbackService: CallbackService) {}

  @Post("/success")
  @HttpCode(200)
  async success(
    @Body(new ValidationPipe(createCallbackSchema))
    body: { data: CreateCallbackDto; errors?: any },
    @Req() req: Request,
  ) {
    const ips = (
      (req.headers["cf-connecting-ip"] as string) ??
      (req.headers["x-real-ip"] as string) ??
      (req.headers["x-forwarded-for"] as string) ??
      req.socket.remoteAddress ??
      ""
    ).split(",");
    const ip = ips[0].trim();

    this.logger.log("Success Callback Received", { ip });

    await this.callbackService.createAsync({
      ip,
      payload: JSON.stringify(body.data),
    });

    const { data } = body;

    await this.callbackService.processAsync({
      id: data.id,
      status: data.status,
    });

    return null;
  }
}
