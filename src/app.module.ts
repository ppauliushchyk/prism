import { join } from "path";

import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";

import configuration from "../config/configuration";

import { AppController } from "./app.controller";
import { DatabaseService } from "./database.service";
import { PaymentController } from "./payment/payment.controller";
import { ProviderModule } from "./provider/provider.module";
import { ProviderService } from "./provider/provider.service";
import { PurchaseController } from "./purchase/purchase.controller";
import { PurchaseService } from "./purchase/purchase.service";

@Module({
  controllers: [AppController, PaymentController, PurchaseController],
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    HttpModule,
    ProviderModule,
    RouterModule.register([{ module: ProviderModule, path: "provider" }]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "../public"),
      serveRoot: "/public/",
    }),
  ],
  providers: [DatabaseService, ProviderService, PurchaseService],
})
export class AppModule {}
