import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') // Ruta base: /users esto es para la api
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register') // Ruta completa: POST /users/register
  @UsePipes(new ValidationPipe({ whitelist: true })) // ¡Activa la validación! la que hicimos en CreateUserDto
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}