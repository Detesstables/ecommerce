import { IsInt, IsOptional, IsString, Min, IsEnum } from 'class-validator';
import { EstadoPedido } from 'src/generated/client/enums';

export class UpdatePersonalizadoDto {
  // El nuevo estado es OBLIGATORIO para esta acción
  @IsEnum(EstadoPedido)
  estado!: EstadoPedido;

  // El precio final y la observación son OPCIONALES.
  // Si el admin RECHAZA, solo llena la observación.
  // Si el admin COTIZA, llena el precio final.
  @IsOptional()
  @IsInt()
  @Min(1)
  presupuesto_final?: number;

  @IsOptional()
  @IsString()
  observacion_admin?: string;
}