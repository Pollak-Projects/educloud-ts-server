import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from 'src/module/teacher/teacher.entity';
import { UserData } from 'src/module/user/user.data.entity';
import { User } from 'src/module/user/user.entity';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { RequestUser } from 'express';
import { Roles } from '../../role/role.decorator';
import { RoleEnum } from '../../role/role.enum';

@Roles(RoleEnum.Admin)
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

    async getAllUsers(req: RequestUser): Promise<string> {
        this.logger.log('Fetching all users');
        this.logger.verbose(`Fetching all users by token ${JSON.stringify(req.token)}`);
        const users = await this.userRepository
            .find({
                relations: ['userData', 'teachers'],
            })
            .catch((error) => {
                this.logger.error(`Error fetching users by token ${JSON.stringify(req.token)}`, error);
                throw new HttpException({ message: 'Error fetching users!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
            });

        if (users.length === 0) {
            this.logger.error(`No users: ${users} found by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'No users found!' }, HttpStatus.NO_CONTENT);
        }

        this.logger.verbose(`Users found by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(users);
    }

    async getUserById(id: string, req: RequestUser): Promise<string> {
        this.logger.log(`Fetching user by id ${id}`);
        this.logger.verbose(`Fetching user by id ${id} by token ${JSON.stringify(req.token)}`);
        if (!id) {
            this.logger.error(`Missing required fields id: ${id} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const user = await this.userRepository
            .findOne({
                where: { id },
                relations: ['userData', 'teachers'],
            })
            .catch((error) => {
                this.logger.error(`Error fetching user by id ${id} by token ${JSON.stringify(req.token)}`, error);
                throw new HttpException({ message: 'Error fetching user!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
            });

        if (!user) {
            this.logger.error(`User not found by id ${id} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'User not found!' }, HttpStatus.NOT_FOUND);
        }

        this.logger.verbose(`User found by id ${id} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(user);
    }

    async createUser(userBody: UserDto, req: RequestUser): Promise<string> {
        this.logger.log(`Creating user ${JSON.stringify(userBody)}`);
        this.logger.verbose(`Creating user ${JSON.stringify(userBody)} by token ${JSON.stringify(req.token)}`);

        const teacher = await this.teacherRepository
            .save({
                name: userBody.username,
            })
            .catch((error) => {
                this.logger.error(`Error creating teacher by token ${JSON.stringify(req.token)}`, error);
                throw new HttpException({ message: 'Error creating teacher!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
            });

        const hashedPassword = await bcrypt.hash(userBody.password, 10);

        const userData = this.userDataRepository.create({
            email: userBody.email,
            birthDate: userBody.birthDate,
        });

        const savedUserData = await this.userDataRepository.save(userData).catch((error) => {
            this.logger.error(`Error creating userData: ${userData} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error creating user data!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        const newUser = this.userRepository.create({
            username: userBody.username,
            hashedPwd: hashedPassword,
            displayName: userBody.displayName,
            roles: userBody.roles,
        });

        newUser.teachers = [teacher];
        newUser.userData = [savedUserData];

        const savedUser = await this.userRepository.save(newUser).catch((error) => {
            this.logger.error(`Error creating user: ${newUser} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error creating user!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        this.logger.verbose(`User created: ${JSON.stringify(savedUser)} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(savedUser);
    }

    async updateUserById(id: string, userBody: UserDto, req: RequestUser): Promise<string> {
        this.logger.log(`Updating user by id: ${id}`);
        this.logger.verbose(`Updating user by id: ${id}, userDto: ${userBody} by token ${JSON.stringify(req.token)}`);
        if (!id) {
            this.logger.error(`Missing required fields id: ${id}, ${userBody} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const user = await this.userRepository
            .findOne({
                where: { id },
                relations: ['userData', 'teachers'],
            })
            .catch((error) => {
                this.logger.error(`Error fetching user by id: ${id}, userDto: ${userBody} by token ${JSON.stringify(req.token)}`, error);
                throw new HttpException({ message: 'Error fetching user!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
            });

        if (!user) {
            this.logger.error(`User not found by id: ${id}, userDto: ${userBody} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'User not found!' }, HttpStatus.NOT_FOUND);
        }

        if (userBody.username) {
            const teacher = await this.teacherRepository
                .save({
                    name: userBody.username,
                })
                .catch((error) => {
                    this.logger.error(`Error updating teacher id: ${id}, userDto: ${userBody} by token ${JSON.stringify(req.token)}`, error);
                    throw new HttpException({ message: 'Error updating teacher!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
                });
            user.teachers = [teacher];
        }

        if (userBody.email || userBody.birthDate) {
            if (user.userData && user.userData.length > 0) {
                const userData = user.userData[0];
                userData.email = userBody.email || userData.email;
                userData.birthDate = userBody.birthDate || userData.birthDate;

                await this.userDataRepository.save(userData).catch((error) => {
                    this.logger.error(`Error updating user data by id: ${id}, userDto: ${userBody} by token ${JSON.stringify(req.token)}`, error);
                    throw new HttpException({ message: 'Error updating user data!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
                });
            } else {
                const userData = this.userDataRepository.create({
                    email: userBody.email,
                    birthDate: userBody.birthDate,
                });

                const savedUserData = await this.userDataRepository.save(userData).catch((error) => {
                    this.logger.error(`Error creating user data by id: ${id}, userDto: ${userBody} by token ${JSON.stringify(req.token)}`, error);
                    throw new HttpException({ message: 'Error creating user data!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
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
            this.logger.error(`Error updating user by id: ${id}, userDto: ${userBody} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error updating user!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        this.logger.verbose(`User updated: ${JSON.stringify(updatedUser)} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(updatedUser);
    }

    async deleteUserById(id: string, req: RequestUser): Promise<string> {
        this.logger.log(`Deleting user by id: ${id}`);
        this.logger.verbose(`Deleting user by id: ${id} by token ${JSON.stringify(req.token)}`);
        if (!id) {
            this.logger.error(`Missing required fields id: ${id} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const user = await this.userRepository.findOne({ where: { id } }).catch((error) => {
            this.logger.error(`Error fetching user by id: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error fetching user!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!user) {
            this.logger.error(`User not found by id: ${id} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'User not found!' }, HttpStatus.NOT_FOUND);
        }

        await this.userRepository.remove(user).catch((error) => {
            this.logger.error(`Error deleting user by id: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error deleting user!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        this.logger.verbose(`User deleted by id: ${id} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify({ message: 'User deleted successfully' });
    }
}
