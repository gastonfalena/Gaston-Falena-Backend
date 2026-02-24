import { IsString, IsNumber, IsOptional, Min } from "class-validator";

export class UpdateItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity?: number;
}
