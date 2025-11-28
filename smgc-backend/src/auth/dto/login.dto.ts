import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email;

    @IsString()
    @MinLength(6)
    password;
}
