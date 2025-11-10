import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

// --- GUARDIA LOCOO ---
import { RolesGuard } from './roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from 'src/generated/client/enums';

@Controller('auth') // Ruta base: /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // Ruta completa: POST /auth/login
  @HttpCode(HttpStatus.OK) // Por estándar, un login exitoso devuelve un 200 OK
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // --- ENDPOINT DE PRUEBA ---
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard) // <-- ¡AQUÍ ESTÁ EL GUARDIA!
  @Roles(Role.ADMIN)                  // ¡Solo dejamos pasar a los ADMIN!
  getProfile(@Request() req) {
    // 'req.user' existe gracias al 'return payload' de nuestra JwtStrategy
    return req.user;
  }
  // --------------------------
}