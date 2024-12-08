import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PaymentController } from "./payment/payment.controller";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { ProviderModule } from "./provider/provider.module";
import configuration from "../config/configuration";
import { RouterModule } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    HttpModule,
    ProviderModule,
    RouterModule.register([{ module: ProviderModule, path: "provider" }]),
  ],
  controllers: [AppController, PaymentController],
  providers: [AppService],
})
export class AppModule {}
