/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('Eldercare API')
    .setDescription('The elder care API description')
    .setVersion('1.0')
    .build();
  const options: SwaggerDocumentOptions =  {
      operationIdFactory: (
        controllerKey: string,
        methodKey: string
      ) => methodKey
    };
  const document = SwaggerModule.createDocument(app, config,options);
  SwaggerModule.setup('doc', app, document);


  await app.listen(3000);
  console.log("server is ready at http://localhost:3000")
}
bootstrap();
