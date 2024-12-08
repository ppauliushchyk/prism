import { Module } from "@nestjs/common";

import { DatabaseService } from "../database.service";

import { CallbackController } from "./callback/callback.controller";
import { CallbackService } from "./callback/callback.service";

@Module({
  controllers: [CallbackController],
  providers: [DatabaseService, CallbackService],
})
export class ProviderModule {}
