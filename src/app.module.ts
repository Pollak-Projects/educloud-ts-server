import { Module } from '@nestjs/common';
import { AppController } from './module/app/app.controller';
import { AppService } from './module/app/app.service';
import { ConfigLocalModule } from './config/config.local.module';
import { RouterModule } from '@nestjs/core';
import { AdminModule } from './module/admin/admin.module';

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
                ],
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
