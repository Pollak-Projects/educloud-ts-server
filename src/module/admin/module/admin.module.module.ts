import { Module } from '@nestjs/common';
import { AdminModuleController } from './admin.module.controller';
import { AdminModuleService } from './admin.module.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from '../../module/module.entity';
import { Teacher } from '../../teacher/teacher.entity';
import { AuthModule } from '../../auth/auth.module';
import { Grade } from '../../grade/grade.entity';
import { Profession } from '../../profession/profession.entity';
import { Category } from '../../category/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ModuleEntity, Teacher, Grade, Profession, Category]), AuthModule],
    controllers: [AdminModuleController],
    providers: [AdminModuleService],
})
export class AdminModuleModule {}
