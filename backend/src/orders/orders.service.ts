import {
  Injectable,
  NotFoundException,
  ConflictException, 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from 'src/generated/client/enums';

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
    // Usamos una transacción para asegurar la integridad de los datos
    // Si algo falla aquí (ej. no hay stock), NADA se guarda en la BD.
    
    return this.prisma.$transaction(async (tx) => {
      // 1. Buscar el producto y bloquearlo para la transacción
      const producto = await tx.producto.findUnique({
        where: { id: productId },
      });

      if (!producto) {
        throw new NotFoundException('Producto no encontrado');
      }

      // 2. Comprobar si hay suficiente stock
      if (producto.stock < this.CANTIDAD_A_COMPRAR) {
        // ¡Cumple con el requisito! Error 409 Conflict
        throw new ConflictException('No hay stock suficiente');
      }

      // 3. Crear la cabecera del Pedido
      // (Aquí usamos el estado de pago simulado)
      const pedido = await tx.pedido.create({
        data: {
          usuario_id: user.sub, // ID del cliente desde el token
          estadoPago: 'APROBADO', // Simulación de pago exitoso
        },
      });

      // 4. Crear el detalle del Pedido (el Item)
      const itemPedido = await tx.itemPedido.create({
        data: {
          pedido_id: pedido.id,
          producto_id: producto.id,
          cantidad: this.CANTIDAD_A_COMPRAR,
          // Guardamos el precio en el momento de la compra
          precio_unitario_al_comprar: producto.precio, 
        },
      });

      // 5. Reducir el stock del producto
      await tx.producto.update({
        where: { id: productId },
        data: {
          stock: producto.stock - this.CANTIDAD_A_COMPRAR,
        },
      });

      // 6. Devolver el item creado
      return itemPedido;
    });
  }
}