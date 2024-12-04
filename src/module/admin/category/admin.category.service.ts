import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestUser } from 'express';
import { Category } from 'src/module/category/category.entity';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class AdminCategoryService {
    private readonly logger = new Logger(AdminCategoryService.name);

    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) {}

    async getAllCategories(req: RequestUser): Promise<string> {
        const categories = await this.categoryRepository.find().catch((error) => {
            throw new HttpException(
                { message: 'Error fetching categories!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (categories.length === 0) {
            throw new HttpException(
                { message: 'No categories found!' },
                HttpStatus.NO_CONTENT,
            );
        }

        return JSON.stringify(categories);
    }

    async createCategory(categoryBody: CategoryDto, req: RequestUser): Promise<string> {
        const newCategory = this.categoryRepository.create({
            categoryName: categoryBody.categoryName,
        });

        const savedCategory = await this.categoryRepository.save(newCategory).catch((error) => {
            throw new HttpException(
                { message: 'Error creating category!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify(savedCategory);
    }
    
    async deleteCategoryById(id: string, req: RequestUser): Promise<string> {
        if (!id) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const category = await this.categoryRepository.findOne({ where: { id } }).catch((error) => {
            throw new HttpException(
                { message: 'Error fetching category!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!category) {
            throw new HttpException(
                { message: 'Category not found!' },
                HttpStatus.NOT_FOUND,
            );
        }

        await this.categoryRepository.remove(category).catch((error) => {
            throw new HttpException(
                { message: 'Error deleting category!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify({ message: 'Category deleted successfully' });
    }
}
