import { IsOptional, IsString } from 'class-validator';

export class AssignmentDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    grade?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    categoryId: string;

    @IsString()
    professionId: string;
}
