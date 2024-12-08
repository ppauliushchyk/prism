import { Injectable, Logger } from "@nestjs/common";

import { DatabaseService } from "../../database.service";

@Injectable()
export class CallbackService {
  private readonly logger = new Logger(CallbackService.name, {
    timestamp: true,
  });

  constructor(private readonly databaseService: DatabaseService) {}

  async createAsync(params: { ip: string; payload: string }) {
    this.logger.log("Create Callback Initiated");

    try {
      await this.databaseService.callback.create({ data: params });
      this.logger.log("Create Callback Completed");
    } catch (error) {
      if (error instanceof Error) {
        this.logger.log("Create Callback Failed", error.message);
        return;
      }

      this.logger.log("Create Callback Failed");
    }
  }

  async processAsync(params: { id: string; status: string }) {
    this.logger.log("Process Callback Initiated");

    try {
      const purchase = await this.databaseService.purchase.findUniqueOrThrow({
        where: { id: params.id },
      });

      await this.databaseService.purchase.update({
        data: { status: params.status },
        where: { id: purchase.id },
      });

      this.logger.log("Process Callback Completed");
    } catch (error) {
      if (error instanceof Error) {
        this.logger.log("Process Callback Failed", error.message);
        return;
      }

      this.logger.log("Process Callback Failed");
    }
  }
}
