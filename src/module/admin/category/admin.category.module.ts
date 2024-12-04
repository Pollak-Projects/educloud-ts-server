import { Module } from '@nestjs/common';
import { AdminCategoryController } from './admin.category.controller';
import { AdminCategoryService } from './admin.category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/module/category/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    controllers: [AdminCategoryController],
    providers: [AdminCategoryService],
})
export class AdminCategoryModule {}
