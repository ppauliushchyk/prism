import { AppModule } from "./app.module";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { engine } from "express-handlebars";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose", "fatal"],
  });

  app.enableCors();
  app.use(helmet());

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
