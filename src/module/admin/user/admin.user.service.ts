import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from 'src/module/teacher/teacher.entity';
import { UserData } from 'src/module/user/user.data.entity';
import { User } from 'src/module/user/user.entity';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { RequestUser } from 'express';

@Injectable()
export class AdminUserService {
    private readonly logger = new Logger(AdminUserService.name);

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserData)
        private userDataRepository: Repository<UserData>,
        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,
    ) {}

    async getAllUsers(): Promise<string> {
        return 'Hello World!';
    }

    async GetUserById(id: number, req: RequestUser): Promise<string> {
        return 'Hello World!';
    }

    async createUser(userBody: UserDto, req: RequestUser): Promise<string> {
        const hashedPwd = await bcrypt.hash(userBody.password, 10);

        const newUser = this.userRepository.create({
            username: userBody.username,
            hashedPwd,
            displayName: userBody.displayName,
        });

        const newUserData = this.userDataRepository.create({
            email: userBody.email,
            birthDate: userBody.birthDate,
        });

        newUser.userData = [newUserData];

        const teacher = await this.teacherRepository.findOne({
            where: { id: 'random-teacher-id' }, 
        });
        if (teacher) {
            newUser.teachers = [teacher];
        }

        try {
            const savedUser = await this.userRepository.save(newUser);
            return JSON.stringify(savedUser);
        } catch (error) {
            throw new HttpException(
                'Error creating user!',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateUserById(id: number, userBody: UserDto, req: RequestUser): Promise<string> {
        return 'Hello World!';
    }

    async deleteUserById(id: number, req: RequestUser): Promise<string> {
        return 'Hello World!';
    }
}
