import { Module } from "@nestjs/common";
import { CallbackController } from "./callback/callback.controller";

@Module({ controllers: [CallbackController] })
export class ProviderModule {}
