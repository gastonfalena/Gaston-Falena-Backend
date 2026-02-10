import { IsString, IsNotEmpty, IsMongoId, MaxLength } from "class-validator";

export class CreateContainerDto {
  @IsString({ message: "El nombre debe ser texto" })
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  @MaxLength(50, { message: "El nombre es muy largo" })
  name!: string;

  @IsMongoId({ message: "El ID de la casa no es válido" })
  @IsNotEmpty({ message: "Debes especificar la casa" })
  houseId!: string;
}
