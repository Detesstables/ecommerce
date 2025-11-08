import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { Role } from 'src/generated/client/enums';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8) 
  contraseña: string; 

  @IsEnum(Role) // Validamos que sea 'ADMIN' o 'CLIENTE'
  @IsNotEmpty()
  rol: Role;
}