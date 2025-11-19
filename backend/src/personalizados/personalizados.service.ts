import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonalizadoDto } from './dto/create-personalizado.dto';
import { EstadoPedido } from 'src/generated/client/enums'; 
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; 
import { Prisma } from '@prisma/client'; 
import { UpdatePersonalizadoDto } from './dto/update-personalizado.dto';
import { PedidoPersonalizado } from 'src/generated/client/client';

@Injectable()
export class PersonalizadosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crea una nueva solicitud de pedido personalizado (DML - INSERT).
   * @param userId ID del usuario logueado.
   * @param dto Datos del formulario (título, descripción, presupuesto).
   * @param referenciaImgUrl Ruta donde Multer guardó la imagen.
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
        }
      )
      ;
    } catch (error) {
        // Manejamos errores únicos o de integridad (ej. si el título fuera unique)
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
        usuario: {
          select: { nombre: true, email: true, numero: true }, // Incluye datos del cliente
        },
      },
      orderBy: { fecha_creacion: 'desc' },
    });
  }
  
  // ----------------------------------------------------------------------
  // MÉTODO PARA EL DESAFÍO EN VIVO (DDL/DML)
  // ----------------------------------------------------------------------

  /**
   * Genera una cotización para un pedido, usando una tabla temporal (DDL/DML Demo).
   */
  async generateCustomQuote(requestId: number, costoSugerido: number, costoDiseno: number) {
    
    // El objetivo es demostrar CREATE TEMP TABLE, INSERT, SELECT SUM, UPDATE, y DROP TABLE.

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
        // Usamos el Enum correcto, que es el que la base de datos espera
        estado: EstadoPedido.PENDIENTE, 
      },
    });

    // 5. DDL: Elimina la tabla temporal (Garantiza la limpieza)
    await this.prisma.$executeRawUnsafe(
      `DROP TABLE "Costeo_Pedido_${requestId}";`
    );

    return {
      message: `Presupuesto de $${totalEstimate} CLP generado y solicitud actualizada a REVISION.`,
      total: totalEstimate,
    };
  }


  // METODO 1: Listar solo PENDIENTES y COTIZADOS para la vista de Admin (DML: SELECT)
  async findAllPending(): Promise<PedidoPersonalizado[]> {
    return this.prisma.pedidoPersonalizado.findMany({
      where: {
        estado: {
          in: [EstadoPedido.PENDIENTE, EstadoPedido.COTIZADO],
        },
      },
      include: {
        usuario: { // Incluye el usuario para que el admin sepa quién lo pidió
          select: { nombre: true, email: true },
        },
      },
      orderBy: {
        fecha_creacion: 'asc',
      },
    });
  }

  // METODO 2: Actualizar el estado y cotizar (DML: UPDATE)
  async updateStatus(id: number, updateDto: UpdatePersonalizadoDto): Promise<PedidoPersonalizado> {
    
    // Si no lo encuentra, lanza una excepción que NestJS maneja como 404
    const existingOrder = await this.prisma.pedidoPersonalizado.findUnique({ where: { id } });
    if (!existingOrder) {
      throw new NotFoundException(`Pedido personalizado con ID ${id} no encontrado.`);
    }

    // EJECUCIÓN DEL DML
    const updatedOrder = await this.prisma.pedidoPersonalizado.update({
      where: { id },
      data: {
        estado: updateDto.estado,
        presupuesto_final: updateDto.presupuesto_final,
        observacion_admin: updateDto.observacion_admin,
      } as any,
    });

    return updatedOrder;
  }
}