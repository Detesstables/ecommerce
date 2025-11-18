import { Module } from '@nestjs/common';
import { PersonalizadosService } from './personalizados.service';
import { PersonalizadosController } from './personalizados.controller';

@Module({
  providers: [PersonalizadosService],
  controllers: [PersonalizadosController]
})
export class PersonalizadosModule {}
