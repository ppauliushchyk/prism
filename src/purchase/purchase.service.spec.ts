import { Test, TestingModule } from "@nestjs/testing";

import { DatabaseService } from "../database.service";

import { PurchaseService } from "./purchase.service";

describe("PurchaseService", () => {
  let service: PurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService, PurchaseService],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
