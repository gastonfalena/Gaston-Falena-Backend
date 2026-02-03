import { IsString, IsEmail, IsNumber, Min, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNumber()
  @Min(0)
  age?: number;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
