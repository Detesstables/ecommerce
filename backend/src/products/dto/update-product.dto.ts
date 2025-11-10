import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// Esto hace que todos los campos de CreateProductDto sean opcionales
export class UpdateProductDto extends PartialType(CreateProductDto) {}