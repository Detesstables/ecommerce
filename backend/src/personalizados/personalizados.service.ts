import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonalizadoDto } from './dto/create-personalizado.dto';
import { UpdatePersonalizadoDto } from './dto/update-personalizado.dto';

import { EstadoPedido } from 'src/generated/client/enums';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { PedidoPersonalizado } from 'src/generated/client/client';

@Injectable()
export class PersonalizadosService {
  constructor(private prisma: PrismaService) {}

  // =========================================================
  // CREAR SOLICITUD
  // =========================================================
  async createRequest(
    userId: number,
    dto: CreatePersonalizadoDto,
    referenciaImgUrl: string | null,
  ) {
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
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Ya existe una solicitud con ese título o ID.',
        );
      }
      throw new InternalServerErrorException(
        'Error al registrar la solicitud.',
      );
    }
  }

  // =========================================================
  // LISTAR TODOS (ADMIN)
  // =========================================================
  async findAll() {
    return this.prisma.pedidoPersonalizado.findMany({
      include: {
        usuario: {
          select: { nombre: true, email: true, numero: true },
        },
      },
      orderBy: { fecha_creacion: 'desc' },
    });
  }

  // =========================================================
  // GENERAR COTIZACIÓN (DDL/DML)
  // =========================================================
  async generateCustomQuote(
    requestId: number,
    costoSugerido: number,
    costoDiseno: number,
  ) {
    await this.prisma.$executeRawUnsafe(
      `CREATE TEMPORARY TABLE "Costeo_Pedido_${requestId}" (
        concepto TEXT,
        costo INTEGER
      );`,
    );

    await this.prisma.$executeRawUnsafe(
      `INSERT INTO "Costeo_Pedido_${requestId}" (concepto, costo) VALUES 
      ('Tinta/Material', ${costoSugerido}), 
      ('Diseño Gráfico', ${costoDiseno});`,
    );

    const result = await this.prisma.$queryRawUnsafe<{ sum: number }[]>(
      `SELECT SUM(costo) FROM "Costeo_Pedido_${requestId}";`,
    );

    const totalEstimate = result[0]?.sum || 0;

    await this.prisma.pedidoPersonalizado.update({
      where: { id: requestId },
      data: {
        presupuesto_estimado: totalEstimate,
        estado: EstadoPedido.COTIZADO,
      },
    });

    await this.prisma.$executeRawUnsafe(
      `DROP TABLE "Costeo_Pedido_${requestId}";`,
    );

    return {
      message: `Presupuesto de $${totalEstimate} CLP generado con éxito.`,
      total: totalEstimate,
    };
  }

  // =========================================================
  // LISTAR SOLO PENDIENTES Y COTIZADOS
  // =========================================================
  async findAllPending(): Promise<PedidoPersonalizado[]> {
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

  // =========================================================
  // UPDATE STATUS DEFINITIVAMENTE CORREGIDO
  // =========================================================
  async updateStatus(
    id: number,
    updateDto: UpdatePersonalizadoDto,
  ): Promise<PedidoPersonalizado> {
    const existingOrder =
      await this.prisma.pedidoPersonalizado.findUnique({
        where: { id },
      });

    if (!existingOrder) {
      throw new NotFoundException(
        `Pedido personalizado con ID ${id} no encontrado.`,
      );
    }

    // -------------------------------------------------------
    // ⭐ CORRECCIÓN CRÍTICA:
    //    Convertimos el string que viene del front a Enum real
    // -------------------------------------------------------
    const estadoMapped =
      EstadoPedido[
        updateDto.estado as keyof typeof EstadoPedido
      ];

    if (!estadoMapped) {
      throw new BadRequestException(
        `El estado '${updateDto.estado}' no es válido.`,
      );
    }

    const updatedOrder = await this.prisma.pedidoPersonalizado.update({
      where: { id },
      data: {
        estado: estadoMapped,
        presupuesto_final: updateDto.presupuesto_final ?? null,
        observacion_admin: updateDto.observacion_admin ?? null,
      },
    });

    return updatedOrder;
  }
}
