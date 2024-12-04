import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';
import { Teacher } from '../teacher/teacher.entity';
import { Role } from '../role/role.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Teacher, Role]),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            // NOTE: This is a development expiry, it should be changed in production, but it won't be.
            signOptions: { expiresIn: '14d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
