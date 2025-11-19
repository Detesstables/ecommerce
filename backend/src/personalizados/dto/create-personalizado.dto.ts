import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, Min, IsInt } from 'class-validator';

export class CreatePersonalizadoDto {
  @IsString()
  @IsNotEmpty({ message: 'El título de la idea es obligatorio.' })
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción de tu idea es obligatoria.' })
  descripcion_cliente: string;

  @IsString()
  @IsOptional()
  referencia_img_url?: string;

  @IsInt()
  @Min(1000) 
  @IsOptional()
  @Type(() => Number)
  presupuesto_estimado?: number;
}