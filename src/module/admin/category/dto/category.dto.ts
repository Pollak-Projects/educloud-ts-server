import { IsString, IsNotEmpty, IsDateString, isNotEmpty } from 'class-validator';

export class CategoryDto {
    @IsString()
    @IsNotEmpty()
    categoryName: string;
}
