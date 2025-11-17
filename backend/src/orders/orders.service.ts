import {
  Injectable,
  NotFoundException,
  ConflictException, 
  InternalServerErrorException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from 'src/generated/client/enums';
import { Prisma } from '@prisma/client'; 
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

// Re-importamos la interfaz del payload para saber quién es el usuario
export interface JwtPayload {
  sub: number;
  email: string;
  rol: Role;
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Asumimos que la cantidad es 1, basado en el endpoint POST /comprar/:id
  private readonly CANTIDAD_A_COMPRAR = 1;

async createOrder(productId: number, user: JwtPayload) {
    const quantity = 1;

    try {
      // Llamamos a la función SQL (Procedimiento Almacenado) que hace TODO
      const result = await this.prisma.$queryRawUnsafe<{ pedido_id: number; stock_restante: number }[]>(
        `SELECT * FROM fn_process_order($1, $2, $3)`, 
        user.sub,         
        productId,        
        quantity          
      );
      
      return {
        message: "Venta registrada exitosamente mediante Procedimiento Almacenado.",
        orderId: result[0]?.pedido_id,
        newStock: result[0]?.stock_restante,
      };

    } catch (error) {
      const errorMessage = error.message as string;
      
      if (errorMessage.includes('409:')) {
        throw new ConflictException(errorMessage.replace('409: ', ''));
      }
      
      // Manejamos el error 404
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Producto no encontrado en el sistema.');
      }

      throw new InternalServerErrorException('Error desconocido en la base de datos.');
    }
  }
}