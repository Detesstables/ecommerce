import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Nuestro servicio de BD
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs'; // Para hashear la contraseña

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // 1. Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseña_hash = await bcrypt.hash(
      createUserDto.contraseña,
      salt,
    );

    // 2. Crear el usuario en la BD
    const newUser = await this.prisma.usuario.create({
      data: {
        nombre: createUserDto.nombre,
        email: createUserDto.email,
        rol: createUserDto.rol,
        contraseña_hash: contraseña_hash, // ¡Guardamos el hash, no la clave!
      },
    });

    // 3. (Importante) No devolver la contraseña en la respuesta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contraseña_hash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}