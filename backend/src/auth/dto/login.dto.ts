import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {

  @IsEmail(undefined, 
    { message: 'El correo electrónico debe ser una dirección válida.' }
  )
  @IsNotEmpty(
    { message: 'El correo electrónico no puede estar vacío.' }
  )
  email: string;

  @IsString()
  @MinLength(8, 
    { message: 'La contraseña debe tener al menos 8 caracteres.' }
  )
  @IsNotEmpty(
    { message: 'La contraseña no puede estar vacío.' }
  )
  contraseña: string;
}