import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Usamos 'jwt' porque es el nombre que le dimos a nuestra estrategia
// (PassportStrategy(Strategy) se registra como 'jwt' por defecto)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}