import { IsOptional, IsString, IsUUID, IsDate, IsArray } from 'class-validator';

export class ModuleDto {
    @IsUUID()
    id: string;

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

    @IsDate()
    createdAt: Date;

    @IsDate()
    updatedAt: Date;

    @IsUUID()
    categoryId: string;

    @IsUUID()
    professionId: string;
}
