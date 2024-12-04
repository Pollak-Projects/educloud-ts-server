import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminUserModule } from './user/admin.user.module';
import { AdminModuleModule } from './module/admin.module.module';
import { AdminAssignmentModule } from './assignment/admin.assignment.module';

@Module({
    imports: [AdminAssignmentModule, AdminUserModule, AdminModuleModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule {}
