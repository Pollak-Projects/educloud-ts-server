import { IsString, IsNotEmpty } from 'class-validator';

export class ProfessionDto {
    @IsString()
    @IsNotEmpty()
    professionName: string;
}
