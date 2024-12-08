import { Injectable, Logger } from "@nestjs/common";

import { DatabaseService } from "../database.service";

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger(PurchaseService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async readAsync(params: { id: string }) {
    this.logger.log("Read Purchase Initiated");

    try {
      const purchase = await this.databaseService.purchase.findUniqueOrThrow({
        where: { id: params.id },
      });

      this.logger.log("Read Purchase Completed");

      return purchase;
    } catch (error) {
      this.logger.error("Read Purchase Failed", error.message);

      throw error;
    }
  }
}
