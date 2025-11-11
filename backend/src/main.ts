import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// ¡CAMBIO 1! Importa la plataforma Express
import { NestExpressApplication } from '@nestjs/platform-express';
// ¡CAMBIO 2! Importa 'join'
import { join } from 'path';

async function bootstrap() {
  // ¡CAMBIO 3! Especifica el tipo <NestExpressApplication>
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  // ¡CAMBIO 4! Añade esta línea para servir archivos estáticos
  // Esto hace que la carpeta 'public' sea accesible
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // ¡CAMBIO 5! Hacemos la validación global (con 'transform')
  // Esto nos ahorra poner @UsePipes en cada controlador
  // 'transform: true' activa el @Type(() => Number) de los DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // No deja pasar propiedades extra
      transform: true,   // Transforma los datos (ej. string a number)
    }),
  );

  await app.listen(3000);
}
bootstrap();