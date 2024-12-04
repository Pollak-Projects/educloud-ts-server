import { IsString, IsNotEmpty, IsDateString, isNotEmpty } from 'class-validator';

export class UserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    displayName: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsDateString()
    @IsNotEmpty()
    birthDate: Date;
}
