import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  Body
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/generated/client/enums';

@Controller('orders') // La ruta base del frontend
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post(':id') // POST /orders/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENTE) 
  createOrder(
    @Param('id', ParseIntPipe) productId: number, // ID del producto (del URL)
    @Request() req, 
    @Body() body: { quantity: number } // Cantidad del producto (del body)
  ) {
    const user = req.user; 
    
    // Enviamos el ID del producto, el usuario logueado, y la cantidad.
    return this.ordersService.createOrder(productId, user, body.quantity); 
  }
}