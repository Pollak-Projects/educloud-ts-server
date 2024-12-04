import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminAssignmentModule } from './assignment/admin.assignment.module';
import { AdminUserModule } from './user/admin.user.module';
import { AdminModuleModule } from './module/admin.module.module';
import { AdminCategoryModule } from './category/admin.category.module';
import { AdminGradeModule } from './grade/admin.grade.module';
import { AdminProfessionModule } from './profession/admin.profession.module';

@Module({
    imports: [AdminAssignmentModule, AdminUserModule, AdminModuleModule, AdminCategoryModule, AdminProfessionModule, AdminGradeModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule {}