import { ConflictException ,Injectable } from '@nestjs/common'; // Para errores y manejar inyección de dependencias
import { PrismaService } from '../prisma/prisma.service'; // Nuestro servicio de BD
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs'; // Para hashear la contraseña
import { Prisma } from 'src/generated/client/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

async create(createUserDto: CreateUserDto) {
  // 1. Hashear la contraseña (esto queda igual)
  const salt = await bcrypt.genSalt(10);
  const contraseña_hash = await bcrypt.hash(
    createUserDto.contraseña,
    salt,
  );

  // 2. Intentar crear el usuario
  try {
    const newUser = await this.prisma.usuario.create({
      data: {
        nombre: createUserDto.nombre,
        email: createUserDto.email,
        rol: createUserDto.rol,
        contraseña_hash: contraseña_hash,
        direccion: createUserDto.direccion,
      },
    });

    // 3. Devolver el usuario 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contraseña_hash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;

  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' // Si es el error 'P2002' (duplicado)
    ) {
      // Lanza un error 409 Conflict (mucho más limpio)
      throw new ConflictException('El correo electrónico ya está en uso.');
    }
    throw error;
  }
}

/*   Metodo que encuentra el email para luego validarlo en auth.service.ts */
  async findByEmail(email: string) {
  // Usamos 'findUnique' de Prisma para buscar por el email
  return this.prisma.usuario.findUnique({
    where: { email: email },
  });
}
}