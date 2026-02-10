import { IsString, MaxLength, IsOptional } from "class-validator";

export class UpdateContainerDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;
}
