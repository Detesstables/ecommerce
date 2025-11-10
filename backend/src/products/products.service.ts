import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Prisma } from 'src/generated/client/client';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // --- Lógica para Crear Producto (con imagen) ---
  async create(createProductDto: CreateProductDto, imagenUrl: string | null) {
    // Validamos que la categoría exista
    const categoria = await this.prisma.categoria.findUnique({
      where: { id: createProductDto.categoria_id },
    });
    if (!categoria) {
      throw new NotFoundException('La categoría no existe');
    }

    return this.prisma.producto.create({
      data: {
        ...createProductDto,
        imagenUrl: imagenUrl, // Añadimos la URL de la imagen
      },
    });
  }

  // --- Lógica para Listar Productos (con filtros) ---
// --- Lógica para Listar Productos (con filtros) ---
findAll(query: QueryProductDto) {
    const { nombre, precioMin, precioMax, categoria_id } = query;

    // Construimos la cláusula 'where' dinámicamente
    const where: Prisma.ProductoWhereInput = {};

    // --- ARREGLO 1: 'mode' eliminado ---
    if (nombre) {
      // 'contains' es como un 'LIKE %nombre%'
      // (Eliminamos 'mode: "insensitive"' porque SQLite no lo soporta)
      where.nombre = { contains: nombre };
    }

    // --- ARREGLO 2: Construcción segura del filtro de precio ---
    const precioFilter: Prisma.IntFilter = {};
    if (precioMin) {
      precioFilter.gte = precioMin; // gte = >=
    }
    if (precioMax) {
      precioFilter.lte = precioMax; // lte = <=
    }
    // Solo añadimos el filtro de precio si se especificó min o max
    if (precioMin || precioMax) {
      where.precio = precioFilter;
    }
    // --------------------------------------------------------

    if (categoria_id) {
      where.categoria_id = categoria_id;
    }

    return this.prisma.producto.findMany({
      where: where,
      include: {
        // Incluimos la info de la categoría
        categoria: {
          select: { nombre: true },
        },
      },
    });
  }

  // --- Lógica para Ver un Producto ---
  findOne(id: number) {
    return this.prisma.producto.findUnique({
      where: { id: id },
      include: { categoria: true },
    });
  }

  // --- Lógica para Actualizar Producto ---
async update(id: number, updateProductDto: UpdateProductDto) {
    // Primero, verifica que el producto exista
    const producto = await this.prisma.producto.findUnique({
      where: { id: id },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Si se envía un 'categoria_id', verifica que exista
    if (updateProductDto.categoria_id) {
      const categoria = await this.prisma.categoria.findUnique({
        where: { id: updateProductDto.categoria_id },
      });
      if (!categoria) {
        throw new NotFoundException(
          `La categoría con ID ${updateProductDto.categoria_id} no existe`,
        );
      }
    }

    try {
      // Actualiza el producto
      return await this.prisma.producto.update({
        where: { id: id },
        data: updateProductDto,
      });
    } catch (error) {
      // Manejar otros errores (ej. si el 'nombre' nuevo ya existe)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe un producto con ese nombre');
      }
      throw error;
    }
  }

  // --- Lógica para Eliminar Producto ---
  async remove(id: number) {
    try {
      return await this.prisma.producto.delete({
        where: { id: id },
      });
    } catch (e) {
      // Esto fallará si el producto está en un Pedido (constraint)
      // En un proyecto real, se haría un 'borrado lógico'
      throw new NotFoundException(`Producto con ID ${id} no se pudo eliminar o no existe`);
    }
  }
}