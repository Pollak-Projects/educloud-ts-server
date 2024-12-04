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
        private categoryRepository: Repository<Category>,
    ) {}

    async getAllCategories(req: RequestUser): Promise<string> {
        this.logger.log('Fetching all Categories');
        this.logger.verbose(`Fetching all Categories by token: ${JSON.stringify(req.token)}`);

        const categories = await this.categoryRepository.find().catch((error) => {
            this.logger.error(`Error fetching Categories by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error fetching categories!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (categories.length === 0) {
            this.logger.verbose(`No Categories found by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'No categories found!' }, HttpStatus.NO_CONTENT);
        }

        this.logger.verbose(`Fetched all Categories by token`);

        return JSON.stringify(categories);
    }

    async createCategory(categoryBody: CategoryDto, req: RequestUser): Promise<string> {
        this.logger.log(`Creating category ${JSON.stringify(categoryBody)}`);
        this.logger.verbose(`Creating category ${JSON.stringify(categoryBody)} by token ${JSON.stringify(req.token)}`);

        const newCategory = this.categoryRepository.create({
            categoryName: categoryBody.categoryName,
        });

        const savedCategory = await this.categoryRepository.save(newCategory).catch((error) => {
            this.logger.error(`Error creating category by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error creating category!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        this.logger.verbose(`Category created: ${JSON.stringify(categoryBody)} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(savedCategory);
    }

    async deleteCategoryById(id: string, req: RequestUser): Promise<string> {
        this.logger.log(`Deleting category by id: ${id}`);
        this.logger.verbose(`Deleting category by id: ${id} by token ${JSON.stringify(req.token)}`);

        if (!id) {
            this.logger.error(`Missing required fields id: ${id} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const category = await this.categoryRepository.findOne({ where: { id } }).catch((error) => {
            this.logger.error(`Error fetching categories by id: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error fetching category!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!category) {
            this.logger.error(`Category not found by id: ${id} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Category not found!' }, HttpStatus.NOT_FOUND);
        }

        await this.categoryRepository.remove(category).catch((error) => {
            this.logger.error(`Error deleting category by id: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error deleting category!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        this.logger.verbose(`Category deleted by id: ${id} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify({ message: 'Category deleted successfully' });
    }
}
