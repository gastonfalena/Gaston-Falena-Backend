import { IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class UpdateHouseDto {
  @IsString({ message: "El nombre debe ser un texto" })
  @IsOptional()
  @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
  @MaxLength(50, { message: "El nombre es demasiado largo" })
  name?: string;

  @IsString({ message: "La descripción debe ser un texto" })
  @IsOptional()
  @MaxLength(200, {
    message: "La descripción no puede superar los 200 caracteres",
  })
  description?: string;

  @IsString({ message: "La ubicación debe ser un texto" })
  @IsOptional()
  location?: string;
}
