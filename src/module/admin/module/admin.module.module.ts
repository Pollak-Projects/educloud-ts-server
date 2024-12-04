import { Module } from '@nestjs/common';
import { AdminModuleController } from './admin.module.controller';
import { AdminModuleService } from './admin.module.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from '../../module/module.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ModuleEntity])],
    controllers: [AdminModuleController],
    providers: [AdminModuleService],
})
export class AdminModuleModule {}
