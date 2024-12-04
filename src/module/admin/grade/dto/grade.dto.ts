import { IsString, IsNotEmpty } from 'class-validator';

export class GradeDto {
    @IsString()
    @IsNotEmpty()
    gradeName: string;
}
