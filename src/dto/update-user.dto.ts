import { IsString, IsEmail, IsNumber, Min, IsOptional } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  password?: string;
}