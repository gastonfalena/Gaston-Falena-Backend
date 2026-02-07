import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateHouseDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre de la casa es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre es demasiado largo' })
  name: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsOptional() // No es obligatorio poner una descripción
  @MaxLength(200, { message: 'La descripción no puede superar los 200 caracteres' })
  description?: string;

  @IsString({ message: 'La ubicación debe ser un texto' })
  @IsNotEmpty({ message: 'La ubicación (ej: ciudad o dirección) es obligatoria' })
  location: string;
}