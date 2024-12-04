import { Module } from '@nestjs/common';
import { AdminModuleController } from './admin.module.controller';
import { AdminModuleService } from './admin.module.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from '../../module/module.entity';
import { Teacher } from '../../teacher/teacher.entity';
import { AuthModule } from '../../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([ModuleEntity, Teacher]), AuthModule],
    controllers: [AdminModuleController],
    providers: [AdminModuleService],
})
export class AdminModuleModule {}
