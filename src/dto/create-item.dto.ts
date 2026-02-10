import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity?: number;

  @IsMongoId()
  @IsNotEmpty()
  containerId!: string;
}
