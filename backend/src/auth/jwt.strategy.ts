import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './auth.service'; // Reutilizamos la interface obvioo

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      // 1. Dónde buscar el token: en el Header 'Authorization' como 'Bearer'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. No ignorar si el token expiró (¡falla si expira!)
      ignoreExpiration: false,
      // 3. El mismo 'secret' que usamos para firmar en el auth.module.ts
      secretOrKey: 'ESTO-ES-UN-SECRETO-TEMPORAL',
    });
  }

  // 4. Este método se llama DESPUÉS de que el token se valida (firma y expiración)
  //    El 'payload' es el objeto que pusimos dentro del token (id, email, rol)
  async validate(payload: JwtPayload) {
    // Opcional pero recomendado: Verificamos si el usuario aún existe
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('El usuario del token ya no existe');
    }

    // 5. Lo que retornemos aquí, NestJS lo inyectará en el 'Request'
    //    Esto es clave: devolvemos el payload para saber quién es el usuario
    return payload;
  }
}