// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { Role } from 'src/generated/client/enums';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // Para buscar usuarios
    private jwtService: JwtService,     // Para crear el token
  ) {}

  async login(loginDto: LoginDto) {
    // 1. Verificar si el usuario existe
    // (Añadiremos este método 'findByEmail' al UsersService)
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Comparar la contraseña (texto plano) con el hash (guardado)
    const isPasswordMatching = await bcrypt.compare(
      loginDto.contraseña,
      user.contraseña_hash,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Si todo está bien, creamos el "payload" del token
    //    (la información que irá dentro del pase de backstage)
    const payload: JwtPayload = {
      sub: user.id, // 'sub' (subject) es el estándar para el ID
      email: user.email,
      rol: user.rol,
    };

    // 4. Firmar y devolver el token
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

// (Es una buena práctica definir la estructura del payload)
export interface JwtPayload {
  sub: number;
  email: string;
  rol: Role;
}

/* Esa interface JwtPayload es nuestra "etiqueta de contrato" que le dice a TypeScript: "Oye, un JwtPayload debe tener exactamente estas 
tres cosas: un sub (que es un número), un email (que es un string) y un rol (que es de tipo Role)". */