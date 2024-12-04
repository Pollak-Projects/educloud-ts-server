import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Query,
    Body,
    Req
} from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { AdminCategoryService } from './admin.category.service';
import { RequestUser } from 'express';

@Controller()
export class AdminCategoryController {
    constructor(private readonly appService: AdminCategoryService) {}

    @Get('get-all')
    async getAllCategories(@Req() req: RequestUser): Promise<string> {
        return this.appService.getAllCategories(req);
    }

    @Post('create')
    async createCategory(@Body() categoryBody: CategoryDto, @Req() req: RequestUser): Promise<string> {
        return this.appService.createCategory(categoryBody, req);
    }

    @Delete('delete-by-id')
    async deleteCategoryById(@Query('id') id: string, @Req() req: RequestUser): Promise<string> {
        return this.appService.deleteCategoryById(id, req);
    }
}
