import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryProductDto {
  @IsString()
  @IsOptional() // Todos los filtros son opcionales
  nombre?: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  precioMin?: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  precioMax?: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  categoria_id?: number;
}