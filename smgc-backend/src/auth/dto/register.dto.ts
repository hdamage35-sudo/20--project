import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email;

    @IsString()
    @MinLength(3)
    name;

    @IsString()
    @MinLength(6)
    password;
}
