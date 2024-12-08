import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

import configuration from "../../config/configuration";
import { DatabaseService } from "../database.service";
import { ProviderService } from "../provider/provider.service";

import { PurchaseController } from "./purchase.controller";
import { PurchaseService } from "./purchase.service";

describe("PurchaseController", () => {
  let controller: PurchaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      imports: [ConfigModule.forRoot({ load: [configuration] }), HttpModule],
      providers: [DatabaseService, ProviderService, PurchaseService],
    }).compile();

    controller = module.get<PurchaseController>(PurchaseController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
