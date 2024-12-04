import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { RoleEnum } from '../../../role/role.enum';

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

    @IsString()
    @IsArray()
    roles: RoleEnum[];
}
