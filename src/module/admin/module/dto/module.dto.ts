import { IsOptional, IsString, IsUUID, IsDate, IsArray } from 'class-validator';

export class ModuleDto {
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
