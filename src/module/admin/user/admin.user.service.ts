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
        const users = await this.userRepository.find({
            relations: ['userData', 'teachers'], 
        }).catch((error) => {
            throw new HttpException(
                { message: 'Error fetching users!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if(users.length === 0) {
            throw new HttpException(
                { message: 'No users found!' },
                HttpStatus.NO_CONTENT,
            );
        }
    
        return JSON.stringify(users);
    }

    async GetUserById(id: string, req: RequestUser): Promise<string> {
        if(!id) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }
        
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['userData', 'teachers'],
        }).catch((error) => {
            throw new HttpException(
                { message: 'Error fetching user!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!user) {
            throw new HttpException(
                { message: 'User not found!' },
                HttpStatus.NOT_FOUND,
            );
        }

        return JSON.stringify(user);
    }

    async createUser(userBody: UserDto, req: RequestUser): Promise<string> {
        const teacher = await this.teacherRepository.save({
            name: userBody.username, 
        }).catch((error) => {
            throw new HttpException(
                { message: 'Error creating teacher!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        const hashedPassword = await bcrypt.hash(userBody.password, 10);

        const userData = this.userDataRepository.create({
            email: userBody.email,
            birthDate: userBody.birthDate,
        });

        const savedUserData = await this.userDataRepository.save(userData).catch((error) => {
            throw new HttpException(
                { message: 'Error creating user data!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        const newUser = this.userRepository.create({
            username: userBody.username,
            hashedPwd: hashedPassword,
            displayName: userBody.displayName,
        });

        newUser.teachers = [teacher];  
        newUser.userData = [savedUserData]; 

        const savedUser = await this.userRepository.save(newUser).catch((error) => {
            throw new HttpException(
                { message: 'Error creating user!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify(savedUser);
    }
    

    async updateUserById(id: string, userBody: UserDto, req: RequestUser): Promise<string> {
        if(!id) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['userData', 'teachers'], 
        }).catch((error) => {
            throw new HttpException(
                { message: 'Error fetching user!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!user) {
            throw new HttpException(
                { message: 'User not found!' },
                HttpStatus.NOT_FOUND,
            );
        }

        if (userBody.username) {
            const teacher = await this.teacherRepository.save({
                name: userBody.username,
            }).catch((error) => {
                throw new HttpException(
                    { message: 'Error updating teacher!', error: error.message },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            });
            user.teachers = [teacher]; 
        }

        if (userBody.email || userBody.birthDate) {
            if (user.userData && user.userData.length > 0) {
                const userData = user.userData[0];
                userData.email = userBody.email || userData.email;
                userData.birthDate = userBody.birthDate || userData.birthDate;

                await this.userDataRepository.save(userData).catch((error) => {
                    throw new HttpException(
                        { message: 'Error updating user data!', error: error.message },
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                });
            } else {
                const userData = this.userDataRepository.create({
                    email: userBody.email,
                    birthDate: userBody.birthDate,
                });

                const savedUserData = await this.userDataRepository.save(userData).catch((error) => {
                    throw new HttpException(
                        { message: 'Error creating user data!', error: error.message },
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                });

                user.userData = [savedUserData]; 
            }
        }

        if (userBody.password) {
            const hashedPassword = await bcrypt.hash(userBody.password, 10);
            user.hashedPwd = hashedPassword;
        }

        user.username = userBody.username || user.username;
        user.displayName = userBody.displayName || user.displayName;

        const updatedUser = await this.userRepository.save(user).catch((error) => {
            throw new HttpException(
                { message: 'Error updating user!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify(updatedUser);
    }
    
    async deleteUserById(id: string, req: RequestUser): Promise<string> {
        if(!id) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const user = await this.userRepository.findOne({ where: { id } }).catch((error) => {
            throw new HttpException(
                { message: 'Error fetching user!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!user) {
            throw new HttpException(
                { message: 'User not found!' },
                HttpStatus.NOT_FOUND,
            );
        }

        await this.userRepository.remove(user).catch((error) => {
            throw new HttpException(
                { message: 'Error deleting user!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify({ message: 'User deleted successfully' });
    }
}
