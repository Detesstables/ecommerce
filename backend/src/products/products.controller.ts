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
import { Role } from 'src/generated/client/enums'; // Tu import se ve así
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('productos')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // --- 1. Crear Producto  ---
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('imagen', { 
      storage: diskStorage({
        destination: './public/uploads', 
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = file.mimetype.split('/')[1] || 'jpg';
          cb(null, `${uniqueSuffix}.${extension}`);
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    const imagenUrl = file ? `/uploads/${file.filename}` : null;
    return this.productsService.create(createProductDto, imagenUrl);
  }

  // --- 2. Listar Productos  ---
  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  // --- 3. Ver un Producto  ---
  @Get(':id')
  @UseGuards(JwtAuthGuard) 
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const producto = await this.productsService.findOne(id);
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  // --- 4. Actualizar Producto ---
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors( 
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = file.mimetype.split('/')[1] || 'jpg';
          cb(null, `${uniqueSuffix}.${extension}`);
        },
      }),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File, 
    @Body() updateProductDto: UpdateProductDto, 
  ) {
    const imagenUrl = file ? `/uploads/${file.filename}` : undefined;
    
    return this.productsService.update(id, updateProductDto, imagenUrl);
  }

  // --- 5. Eliminar Producto  ---
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}