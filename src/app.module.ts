import { Module } from '@nestjs/common';
import { AppController } from './module/app/app.controller';
import { AppService } from './module/app/app.service';
import { ConfigLocalModule } from './config/config.local.module';
import { RouterModule } from '@nestjs/core';
import { AdminModule } from './module/admin/admin.module';
import { AuthModule } from './module/auth/auth.module';
import { ModuleModule } from './module/module/module.module';

@Module({
    imports: [
        ConfigLocalModule,
        RouterModule.register([
            {
                path: 'api',
                children: [
                    {
                        path: 'admin',
                        module: AdminModule,
                    },
                    {
                        path: '',
                        module: AuthModule,
                    },
                    {
                        path: '',
                        module: ModuleModule,
                    },
                ],
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
