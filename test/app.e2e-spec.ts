import { join } from "path";

import { INestApplication } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Test, TestingModule } from "@nestjs/testing";
import { engine } from "express-handlebars";
import * as request from "supertest";

import { AppModule } from "../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication<NestExpressApplication>();

    // @ts-expect-error valid
    app.engine(
      "hbs",
      engine({
        defaultLayout: "index",
        extname: "hbs",
        layoutsDir: join(__dirname, "..", "views", "layouts"),
        partialsDir: join(__dirname, "..", "views", "partials"),
      }),
    );
    // @ts-expect-error valid
    app.setViewEngine("hbs");

    await app.init();
  });

  describe("/", () => {
    it("should render", async () => {
      const response = await request(app.getHttpServer()).get("/");

      expect(response.status).toBe(200);
      expect(response.text).toContain("Payment Form");
    });
  });

  describe("/payment", () => {
    describe("/cancelled", () => {
      it("should render", async () => {
        const response = await request(app.getHttpServer()).get(
          "/payment/cancelled",
        );

        expect(response.status).toBe(200);
        expect(response.text).toContain("Payment Cancelled");
      });
    });

    describe("/failed", () => {
      it("should render", async () => {
        const response = await request(app.getHttpServer()).get(
          "/payment/failed",
        );

        expect(response.status).toBe(200);
        expect(response.text).toContain("Payment Failed");
      });
    });

    describe("/pending", () => {
      it("should render", async () => {
        const response = await request(app.getHttpServer()).get(
          "/payment/pending",
        );

        expect(response.status).toBe(200);
        expect(response.text).toContain("Pending Payment");
      });
    });

    describe("/successful", () => {
      it("should render", async () => {
        const response = await request(app.getHttpServer()).get(
          "/payment/successful",
        );

        expect(response.status).toBe(200);
        expect(response.text).toContain("Payment Successful");
      });
    });
  });
});
