import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

import configuration from "../config/configuration";

import { AppController } from "./app.controller";
import { DatabaseService } from "./database.service";
import { ProviderService } from "./provider/provider.service";

describe("AppController", () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      imports: [ConfigModule.forRoot({ load: [configuration] }), HttpModule],
      providers: [DatabaseService, ProviderService],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
