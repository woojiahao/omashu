import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailRegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
