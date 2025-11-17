import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsPhoneNumber, IsNumber, Min, MaxLength } from 'class-validator';
import { Role } from 'src/generated/client/enums'; 

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20, { message: 'La contraseña no puede tener más de 20 caracteres' }) 
  contraseña: string; 

  @IsEnum(Role)
  @IsNotEmpty()
  rol: Role;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('CL', { message: 'El número de teléfono no es válido.' }) 
  numero: string;

  // --- CAMPOS CORRECTOS (se quedan) ---
  @IsString()
  @IsNotEmpty({ message: 'El detalle de la dirección no debe estar vacío' }) // (Bono: mensaje de error)
  direccion_detalle: string; 

  @IsNumber()
  @Min(1, { message: 'La región seleccionada no es válida' }) // (Bono: mensaje de error)
  region_id: number; 
}