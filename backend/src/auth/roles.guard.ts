import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/generated/client/enums';
import { ROLES_KEY } from './decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles REQUERIDOS del decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay decorador @Roles, se permite el acceso (público)
    if (!requiredRoles) {
      return true;
    }

    // 2. Obtener el usuario (con su rol) del token
    // (Esto lo inyectó nuestro JwtStrategy en el paso anterior)
    const { user } = context.switchToHttp().getRequest();

    // 3. Comprobar si el rol del usuario está en la lista de roles requeridos
    //    (En 'user.rol' tenemos 'ADMIN' o 'CLIENTE')
    return requiredRoles.includes(user.rol);
  }
}