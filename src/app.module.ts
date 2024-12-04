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

@Module({
    imports: [
        ConfigLocalModule,
        AdminModule,
        AuthModule,
        ModuleModule,
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
                ],
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
