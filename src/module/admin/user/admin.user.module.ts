import { Module } from '@nestjs/common';
import { AdminUserController } from './admin.user.controller';
import { AdminUserService } from './admin.user.service';
import { User } from 'src/module/user/user.entity';
import { UserData } from 'src/module/user/user.data.entity';
import { Teacher } from 'src/module/teacher/teacher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserData, Teacher])],
    controllers: [AdminUserController],
    providers: [AdminUserService],
})
export class AdminUserModule {}
