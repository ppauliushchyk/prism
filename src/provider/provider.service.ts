import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosError } from "axios";
import { catchError, lastValueFrom, map } from "rxjs";

import { DatabaseService } from "../database.service";

type PaymentBasic = {
  callback_url: undefined;
  status: "executed" | "authorized" | "pending" | "error";
};

type PaymentSecure = {
  callback_url: string;
  MD: string;
  Method: string;
  PaReq: string;
  status: "3DS_required";
  URL: string;
};

export type Payment = PaymentBasic | PaymentSecure;

@Injectable()
export class ProviderService {
  private readonly logger = new Logger(ProviderService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly httpService: HttpService,
  ) {}

  async createPurchaseAsync(params: {
    amount: number;
    currency: string;
    platform: string;
  }) {
    this.logger.log("Create Purchase Initiated");

    try {
      const { api_key, api_url, brand_id, success_callback } =
        this.configService.getOrThrow<{
          api_key: string;
          api_url: string;
          brand_id: string;
          success_callback: string;
        }>("payment_provider");
      const { cancel_redirect, failure_redirect, success_redirect } =
        this.configService.getOrThrow<{
          cancel_redirect: string;
          failure_redirect: string;
          success_redirect: string;
        }>("redirect");

      const result = await lastValueFrom(
        this.httpService
          .post(
            `${api_url}/purchases/`,
            {
              brand_id,
              client: { email: "test@test.com" },
              purchase: {
                currency: params.currency,
                products: [{ name: "test", price: params.amount }],
              },
              cancel_redirect,
              failure_redirect,
              success_callback,
              success_redirect,
            },
            {
              headers: {
                Authorization: `Bearer ${api_key}`,
                "Content-Type": "application/json",
              },
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error("Create Purchase Failed", error.message);
              throw error;
            }),
            map((response) => {
              this.logger.log("Create Purchase Requested");
              return response.data;
            }),
          ),
      );

      const purchase = await this.databaseService.purchase.create({
        data: {
          direct_post_url: result.direct_post_url,
          id: result.id,
          status: result.status,
        },
      });

      this.logger.log("Create Purchase Completed");

      return purchase;
    } catch (error) {
      this.logger.error("Create Purchase Failed", error.message);

      throw error;
    }
  }

  async updatePurchaseAsync(params: { id: string }) {
    this.logger.log("Update Purchase Initiated");

    try {
      const { api_key, api_url } = this.configService.getOrThrow<{
        api_key: string;
        api_url: string;
      }>("payment_provider");

      const result = await lastValueFrom(
        this.httpService
          .get(`${api_url}/purchases/${params.id}/`, {
            headers: {
              Authorization: `Bearer ${api_key}`,
              "Content-Type": "application/json",
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error("Update Purchase Failed", error.message);
              throw error;
            }),
            map((response) => {
              this.logger.log("Update Purchase Requested");
              return response.data;
            }),
          ),
      );

      const purchase = await this.databaseService.purchase.update({
        data: { status: result.status },
        where: { id: params.id },
      });

      this.logger.log("Update Purchase Completed");

      return purchase;
    } catch (error) {
      this.logger.error("Update Purchase Failed", error.message);

      throw error;
    }
  }

  async createPaymentAsync(params: {
    cc_cvv: string;
    cc_expiration: string;
    cc_name: string;
    cc_number: string;
    direct_post_url: string;
    purchase_id: string;
    remote_ip: string;
    user_agent: string;
  }) {
    this.logger.log("Create Payment Initiated");

    try {
      const { token } = this.configService.getOrThrow<{ token: string }>(
        "payment_provider",
      );

      const result = await lastValueFrom(
        this.httpService
          .post(
            `${params.direct_post_url}?s2s=true`,
            {
              card_number: params.cc_number,
              cardholder_name: params.cc_name,
              cvc: params.cc_cvv,
              expires: params.cc_expiration,
              remote_ip: params.remote_ip,
              user_agent: params.user_agent,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error("Create Payment Failed", error.message);
              throw error;
            }),
            map((response) => {
              this.logger.log("Create Payment Requested");
              return response.data;
            }),
          ),
      );

      const payment = await this.databaseService.payment.create({
        data: {
          callback_url: result.callback_url,
          purchaseId: params.purchase_id,
          status: result.status,
        },
      });

      await this.updatePurchaseAsync({ id: params.purchase_id });

      this.logger.log("Create Payment Completed");

      return { payment, result };
    } catch (error) {
      this.logger.error("Create Payment Failed", error.message);

      throw error;
    }
  }

  async confirmPaymentAsync(params: {
    md: string;
    pa_res: string;
    payment_id: number;
    purchase_id: string;
  }) {
    this.logger.log("Confirm Payment Initiated");

    try {
      const { id, callback_url } =
        await this.databaseService.payment.findUniqueOrThrow({
          where: { id: params.payment_id, purchaseId: params.purchase_id },
        });

      const result = await lastValueFrom(
        this.httpService
          .post(
            `${callback_url}`,
            new URLSearchParams({ MD: params.md, PaRes: params.pa_res }),
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error("Confirm Payment Failed", error.message);
              throw error;
            }),
            map((response) => {
              this.logger.log("Confirm Payment Requested");
              return response.data;
            }),
          ),
      );

      const payment = await this.databaseService.payment.update({
        data: { status: result.status },
        where: { id },
      });

      await this.updatePurchaseAsync({ id: payment.purchaseId });

      this.logger.log("Confirm Payment Completed");

      return { result };
    } catch (error) {
      this.logger.error("Confirm Payment Failed", error.message);

      throw error;
    }
  }
}
