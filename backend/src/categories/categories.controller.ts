import { Controller, Get, Post, Body, UseGuards, UsePipes, ValidationPipe, Param, ParseIntPipe, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/generated/client/enums';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories') // Ruta base: /categories
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // --- Endpoint para crear Categoría (Solo Admin) ---
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Guardia de Token y Guardia de Rol
  @Roles(Role.ADMIN)                  // Solo 'ADMIN' nadie mas waxo loco sii
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // --- AÑADE ESTE ENDPOINT ---
  @Put(':id') // La ruta será PUT /categories/1 (por ejemplo)
  @UseGuards(JwtAuthGuard, RolesGuard) // Protegido para Admins
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number, // Captura el '1' de la URL
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }
  
  // --- Endpoint para listar Categorías (Público) ---
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }
}