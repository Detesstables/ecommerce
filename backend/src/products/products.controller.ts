import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/generated/client/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('productos') // Ruta base: /productos
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // --- 1. Crear Producto (ADMIN + Subida de Imagen) ---
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('imagen', { // 'imagen' es el nombre del campo
      storage: diskStorage({
        destination: './public/uploads', // Carpeta donde se guarda
        filename: (req, file, cb) => {
          // Generar nombre único
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = file.mimetype.split('/')[1] || 'jpg'; // Seguridad
          cb(null, `${uniqueSuffix}.${extension}`);
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    // El 'file' es opcional
    const imagenUrl = file ? `/uploads/${file.filename}` : null;
    return this.productsService.create(createProductDto, imagenUrl);
  }

  // --- 2. Listar Productos (PÚBLICO + Filtros) ---
  // Cumple: GET /api/productos
  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  // --- 3. Ver un Producto (PROTEGIDO) ---
  // Cumple: GET /api/productos/:id (requiere token)
  @Get(':id')
  @UseGuards(JwtAuthGuard) // Solo usuarios logueados
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const producto = await this.productsService.findOne(id);
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  // --- 4. Actualizar Producto (ADMIN) ---
  // Cumple: PUT /api/productos/:id
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto, // Debería ser un UpdateProductDto
  ) {
    // (Por ahora, esta ruta no manejará la subida de una *nueva* imagen,
    // solo la actualización de los campos de texto/números)
    return this.productsService.update(id, updateProductDto);
  }

  // --- 5. Eliminar Producto (ADMIN) ---
  // Cumple: DELETE /api/productos/:id
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}