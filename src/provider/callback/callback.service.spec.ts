import { Test, TestingModule } from "@nestjs/testing";

import { DatabaseService } from "../../database.service";

import { CallbackService } from "./callback.service";

describe("CallbackService", () => {
  let service: CallbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService, CallbackService],
    }).compile();

    service = module.get<CallbackService>(CallbackService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
