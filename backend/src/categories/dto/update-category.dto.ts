import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// Esto crea un 'CreateCategoryDto' donde todos los campos son opcionales, asi no sera obligatorio tener que enviar todos los campos al actualizar
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}