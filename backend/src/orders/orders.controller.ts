import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/generated/client/enums';

@Controller('comprar') // Ruta base: /comprar
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post(':id') // Ruta completa: POST /comprar/1 (para el producto ID 1)
  @UseGuards(JwtAuthGuard, RolesGuard) // Guardia de Token y Guardia de Rol
  @Roles(Role.CLIENTE)                 // ¡SOLO CLIENTES!
  createOrder(
    @Param('id', ParseIntPipe) id: number, // El ID del producto
    @Request() req, // Para obtener el 'user' del token
  ) {
    const user = req.user; // { sub: 2, email: 'cliente@...', rol: 'CLIENTE' }
    return this.ordersService.createOrder(id, user);
  }
}