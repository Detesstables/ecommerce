import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from 'src/generated/client/enums';
import { Prisma } from '@prisma/client'; 
// Usamos KnownError para el tipado de errores
import { PrismaClientKnownRequestError as KnownError } from '@prisma/client/runtime/library'; 

export interface JwtPayload {
  sub: number;
  email: string;
  rol: Role;
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Ejecuta el Procedimiento Almacenado sp_registrar_pedido_y_descontar_stock.
   */
  async createOrder(productId: number, user: JwtPayload, quantity: number) { 
    
    // 1. Prepara el payload con el ID y la CANTIDAD que viene del frontend
    const productsJson = JSON.stringify([
        { id: productId, cantidad: quantity } 
    ]);

    try {
      // --- ¡SOLUCIÓN 3: USAR $executeRawUnsafe! ---
      // Esto evita el error de tipado de `sql` (TS2724)
      // Usamos $1 (usuario) and $2 (json) como parámetros.
      await this.prisma.$executeRawUnsafe(
        'CALL sp_registrar_pedido_y_descontar_stock($1, $2::jsonb)',
        user.sub,
        productsJson 
      );
      
      return {
        message: "Venta registrada exitosamente. Transacción completada y Stock actualizado.",
        success: true
      };

    } catch (error) {
      const errorMessage = error.message as string;
      
      // Manejo de errores desde el SP (RAISE EXCEPTION por falta de stock)
      if (errorMessage.includes('Stock insuficiente')) {
        throw new BadRequestException('Fallo la compra: Stock insuficiente para uno o más productos.');
      }
      
      if (error instanceof KnownError && error.code === 'P2025') {
        throw new NotFoundException('Producto no encontrado en el sistema.');
      }

      // Si es otro error de la base de datos (Ej: tabla no existe, columna mal tipada)
      throw new InternalServerErrorException(`Error de la base de datos: ${errorMessage}`);
    }
  }
}