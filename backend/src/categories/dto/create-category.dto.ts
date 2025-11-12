import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString() 
  @IsOptional() 
  imagenUrl?: string;

  @IsString()
  @IsOptional() 
  descripcion?: string;
}