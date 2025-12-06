import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:8080",
      "http://127.0.0.1:3000",
      "http://80.78.243.218:7777",
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  app.setGlobalPrefix("api");

  // 🔹 Swagger konfigurasiýa
  const config = new DocumentBuilder()
    .setTitle("My API")
    .setDescription("Backend API documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // UI: http://localhost:3000/api/docs
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}`);
  console.log(`Swagger docs on http://localhost:${port}/api/docs`);
}

bootstrap();
