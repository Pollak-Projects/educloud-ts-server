import { Module } from '@nestjs/common';
import { AdminUserController } from './admin.category.controller';
import { AdminUserService } from './admin.category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/module/category/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    controllers: [AdminUserController],
    providers: [AdminUserService],
})
export class AdminUserModule {}
