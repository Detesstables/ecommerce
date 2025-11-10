import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional() // La descripción puede ser opcional
  descripcion: string;

  @IsNumber()
  @Min(1) // El precio debe ser al menos 1 centavo
  @Type(() => Number) // ¡Importante! Convierte el string a número
  precio: number;

  @IsInt()
  @Min(0)
  @Type(() => Number) // ¡Importante!
  stock: number;

  @IsInt()
  @Type(() => Number) // ¡Importante!
  categoria_id: number;
}