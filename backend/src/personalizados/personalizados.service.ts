import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonalizadoDto } from './dto/create-personalizado.dto';
import { UpdatePersonalizadoDto } from './dto/update-personalizado.dto'; // Importamos el DTO de actualización
import { EstadoPedido } from 'src/generated/client/enums'; // Importamos el Enum
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; 
import { Prisma } from '@prisma/client'; 
// Asumo que el tipo PedidoPersonalizado está disponible aquí para que el array de findAllPending compile
import { PedidoPersonalizado } from 'src/generated/client/client'; 

@Injectable()
export class PersonalizadosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crea una nueva solicitud de pedido personalizado (DML - INSERT).
   */
  async createRequest(userId: number, dto: CreatePersonalizadoDto, referenciaImgUrl: string | null) {
    
    const presupuesto = dto.presupuesto_estimado;

    try {
        return this.prisma.pedidoPersonalizado.create({
          data: {
            usuario_id: userId,
            titulo: dto.titulo,
            descripcion_cliente: dto.descripcion_cliente,
            referencia_img_url: referenciaImgUrl,
            presupuesto_estimado: presupuesto, 
            estado: EstadoPedido.PENDIENTE, 
          },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new ConflictException('Ya existe una solicitud con ese título o ID.');
        }
        throw new InternalServerErrorException('Error al registrar la solicitud.');
    }
  }

  /**
   * Obtiene todas las solicitudes para la vista de administrador.
   */
  async findAll() {
    return this.prisma.pedidoPersonalizado.findMany({
      include: {
        usuario: { select: { nombre: true, email: true, numero: true } },
      },
      orderBy: { fecha_creacion: 'desc' },
    });
  }
  
  // ----------------------------------------------------------------------
  // MÉTODOS DEL DESAFÍO EN VIVO (DDL/DML)
  // ----------------------------------------------------------------------

  /**
   * Genera una cotización para un pedido, usando una tabla temporal (DDL/DML Demo).
   * Este es el ejemplo de DDL/DML que se ejecuta en vivo.
   */
  async generateCustomQuote(requestId: number, costoSugerido: number, costoDiseno: number) {
    // ... (Lógica de las tablas temporales) ...
    // NOTA: Esta función es para demostrar DDL/DML, y no se usa en el flujo principal del frontend.

    // 1. DDL: Crea la tabla temporal para el cálculo
    await this.prisma.$executeRawUnsafe(
      `CREATE TEMPORARY TABLE "Costeo_Pedido_${requestId}" (
        concepto TEXT,
        costo INTEGER
      );`
    );

    // 2. DML: Inserta los costos de prueba
    await this.prisma.$executeRawUnsafe(
      `INSERT INTO "Costeo_Pedido_${requestId}" (concepto, costo) VALUES 
      ('Tinta/Material', ${costoSugerido}), 
      ('Diseño Gráfico', ${costoDiseno});`
    );

    // 3. DML: Calcula el total
    const result = await this.prisma.$queryRawUnsafe<{ sum: number }[]>(
      `SELECT SUM(costo) FROM "Costeo_Pedido_${requestId}";`
    );
    const totalEstimate = result[0]?.sum || 0;

    // 4. DML: Actualiza el pedido con el presupuesto total y cambia el estado a REVISION
    await this.prisma.pedidoPersonalizado.update({
      where: { id: requestId },
      data: {
        presupuesto_estimado: totalEstimate,
        estado: EstadoPedido.COTIZADO, 
      },
    });

    // 5. DDL: Elimina la tabla temporal (Garantiza la limpieza)
    await this.prisma.$executeRawUnsafe(
      `DROP TABLE "Costeo_Pedido_${requestId}";`
    );

    return {
      message: `Presupuesto de $${totalEstimate} CLP generado y solicitud actualizada a COTIZADO.`,
      total: totalEstimate,
    };
  }


  // METODO 1: Listar solo PENDIENTES y COTIZADOS para la vista de Admin (DML: SELECT)
  async findAllPending(): Promise<any[]> {
    return this.prisma.pedidoPersonalizado.findMany({
      where: {
        estado: {
          in: [EstadoPedido.PENDIENTE, EstadoPedido.COTIZADO],
        },
      },
      include: {
        usuario: { select: { nombre: true, email: true } },
      },
      orderBy: { fecha_creacion: 'asc' },
    });
  }

  // --- MÉTODO CRÍTICO: UPDATE STATUS Y CREATE PRODUCT (CIERRE DE FLUJO) ---
  async updateStatus(id: number, updateDto: UpdatePersonalizadoDto): Promise<any> { 
    
    // 1. Verificar existencia del pedido
    const existingOrder = await this.prisma.pedidoPersonalizado.findUnique({ where: { id } });
    if (!existingOrder) {
      throw new NotFoundException(`Pedido personalizado con ID ${id} no encontrado.`);
    }

    // 2. Lógica DML: COTIZAR (Crea Producto Temporal y Vincula)
    if (updateDto.estado === EstadoPedido.COTIZADO) {
        
        // Validación de precio
        if (!updateDto.presupuesto_final || updateDto.presupuesto_final <= 0) {
             throw new BadRequestException('Debe proporcionar un presupuesto final mayor a cero para cotizar.');
        }

        // --- DML: CREATE PRODUCT (El producto que el cliente va a pagar) ---
        const nuevoProducto = await this.prisma.producto.create({
            data: {
                nombre: `Personalizado #${id} - ${existingOrder.titulo}`,
                descripcion: `Cotización Final (Pedido: ${id}). ${existingOrder.descripcion_cliente}`,
                precio: updateDto.presupuesto_final,
                stock: 1, // Stock 1, ya que es un producto único
                categoria_id: 1, // Usamos una categoría genérica de prueba (ID 1)
                imagenUrl: existingOrder.referencia_img_url || null, 
            }
        });
        
        // 3. DML: Actualizar el Pedido Personalizado (Estado + FK al Producto)
        const updatedOrder = await this.prisma.pedidoPersonalizado.update({
            where: { id },
            data: {
                estado: EstadoPedido.COTIZADO,
                presupuesto_final: updateDto.presupuesto_final,
                observacion_admin: updateDto.observacion_admin,
                producto_id: nuevoProducto.id, // <-- ¡VINCULAMOS EL PRODUCTO CREADO!
            },
        });
        
        return {
            ...updatedOrder,
            productoFinalId: nuevoProducto.id,
            message: 'Producto creado y cotización finalizada.',
        };
    }
    
    // 4. Lógica DML: RECHAZAR / Otros estados
    else if (updateDto.estado === EstadoPedido.RECHAZADO) {
        // Ejecución DML: Actualizar el registro a RECHAZADO
        const updatedOrder = await this.prisma.pedidoPersonalizado.update({
            where: { id },
            data: {
                estado: EstadoPedido.RECHAZADO,
                observacion_admin: updateDto.observacion_admin,
                presupuesto_final: null,
            },
        });
        return { ...updatedOrder, message: 'Solicitud rechazada con éxito.' };
    }

    // 5. Comportamiento por defecto (ej. mover a EN PREPARACIÓN)
    // El 'as any' es necesario por la forma en que el DTO maneja campos opcionales.
    return this.prisma.pedidoPersonalizado.update({ 
        where: { id }, 
        data: updateDto as any // DML: Update de estado general
    });
  }

  async getQuotationDetails(id: number) {
    // Traemos el pedido, asegurando que esté en estado COTIZADO
    const pedido = await this.prisma.pedidoPersonalizado.findUnique({
        where: { id},
        select: { // Seleccionamos solo los campos necesarios
            id: true,
            titulo: true,
            descripcion_cliente: true,
            presupuesto_final: true,
            producto_id: true,
            estado: true,
            observacion_admin: true,
            usuario: { select: { nombre: true, email: true } },
        },
    });

    if (!pedido) {
        throw new NotFoundException(`Cotización con ID ${id} no encontrada.`);
    }

    return pedido;
}

async comprarProductoPersonalizado(id: number) {
  const pedido = await this.prisma.pedidoPersonalizado.findUnique({
    where: { id },
    include: { producto: true },
  });

  if (!pedido) {
    throw new NotFoundException('El pedido no existe');
  }

  if (!pedido.producto_id) {
    throw new BadRequestException('El admin no ha asignado un producto todavía');
  }

  return {
    message: 'Compra realizada correctamente',
    producto: pedido.producto,
  };
}


async findAllByUserId(userId: number): Promise<PedidoPersonalizado[]> {
    return this.prisma.pedidoPersonalizado.findMany({
        where: { usuario_id: userId },
        orderBy: { fecha_creacion: 'desc' },
    });
}
}