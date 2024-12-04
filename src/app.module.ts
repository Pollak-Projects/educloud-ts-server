import { Module } from '@nestjs/common';
import { AppController } from './module/app/app.controller';
import { AppService } from './module/app/app.service';
import { ConfigLocalModule } from './config/config.local.module';
import { AdminModule } from './module/admin/admin.module';
import { AuthModule } from './module/auth/auth.module';
import { ModuleModule } from './module/module/module.module';
import { RouterModule } from '@nestjs/core';
import { AdminAssignmentModule } from './module/admin/assignment/admin.assignment.module';
import { AdminUserModule } from './module/admin/user/admin.user.module';
import { AdminModuleModule } from './module/admin/module/admin.module.module';
import { AdminGradeModule } from './module/admin/grade/admin.grade.module';
import { AdminCategoryModule } from './module/admin/category/admin.category.module';
import { AdminProfessionModule } from './module/admin/profession/admin.profession.module';
import { AssignmentModule } from './module/assignment/assignment.module';

@Module({
    imports: [
        ConfigLocalModule,
        AdminModule,
        AuthModule,
        ModuleModule,
        AssignmentModule,
        RouterModule.register([
            {
                path: 'admin',
                module: AdminModule,
                children: [
                    {
                        path: 'assignment',
                        module: AdminAssignmentModule,
                    },
                    {
                        path: 'user',
                        module: AdminUserModule,
                    },
                    {
                        path: 'module',
                        module: AdminModuleModule,
                    },
                    {
                        path: 'grade',
                        module: AdminGradeModule,
                    },
                    {
                        path: 'category',
                        module: AdminCategoryModule,
                    },
                    {
                        path: 'profession',
                        module: AdminProfessionModule,
                    },
                ],
            },
            {
                path: 'module',
                module: ModuleModule,
            },
            {
                path: 'assignment',
                module: AssignmentModule,
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
