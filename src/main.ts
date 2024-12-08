import { join } from "path";

import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { engine } from "express-handlebars";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose", "fatal"],
  });

  app.enableCors();

  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));

  app.engine(
    "hbs",
    engine({
      defaultLayout: "index",
      extname: "hbs",
      layoutsDir: join(__dirname, "..", "views", "layouts"),
      partialsDir: join(__dirname, "..", "views", "partials"),
    }),
  );

  app.setViewEngine("hbs");

  app.set("view options", { layout: "layout" });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
