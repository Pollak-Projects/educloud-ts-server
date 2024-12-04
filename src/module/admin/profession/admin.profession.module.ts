import { Module } from '@nestjs/common';
import { AdminProfessionController } from './admin.profession.controller';
import { AdminProfessionService } from './admin.profession.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profession } from 'src/module/profession/profession.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Profession])],
    controllers: [AdminProfessionController],
    providers: [AdminProfessionService],
})
export class AdminUserModule {}
