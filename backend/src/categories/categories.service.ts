import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Lógica para POST /categories
  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.categoria.create({
      data: createCategoryDto,
    });
  }
  // Lógica para PUT /categories/:id 
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const updatedCategory = await this.prisma.categoria.update({
        where: { id: id },
        data: updateCategoryDto,
      });
      return updatedCategory;
    } catch (error) {
      // Manejamos el error por si la categoría no existe
      throw new NotFoundException(`Categoría con ID ${id} no encontrada.`);
    }
  }
  // ----

  // Lógica para GET /categories nos servira para las tablas dps
  findAll() {
    return this.prisma.categoria.findMany();
  }
}