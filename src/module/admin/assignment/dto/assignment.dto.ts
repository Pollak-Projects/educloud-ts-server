import { IsOptional, IsString, IsUUID } from 'class-validator';

export class AssignmentDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsUUID()
    gradeId: string;

    @IsUUID()
    categoryId: string;

    @IsUUID()
    professionId: string;
}
