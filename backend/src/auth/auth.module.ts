import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport'; 
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'ESTO-ES-UN-SECRETO-TEMPORAL', // <-- ¡IMPORTANTE! (despues tendre que cambiarlo o dejarlo asi fhdfhdfh)
      signOptions: { expiresIn: '1h' }, // El token expira en 1 hora o cuando querai loco asd
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
