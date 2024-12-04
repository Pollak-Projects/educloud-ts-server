import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import { Teacher } from '../teacher/teacher.entity';
import { JwtPayload } from 'eduJwt';
import { Role } from '../role/role.entity';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) {}

    async login(loginDto: LoginDto, response: Response): Promise<string> {
        this.logger.verbose(`Login attempt by ${JSON.stringify(loginDto)}`);

        const user = await this.userRepository.findOneBy({ username: loginDto.username }).catch((e) => {
            this.logger.error(`User ${JSON.stringify(loginDto)} does not exist`, e);
            throw new HttpException(`Invalid authnetication data`, HttpStatus.UNAUTHORIZED);
        });

        if (!user) {
            this.logger.error(`User ${JSON.stringify(loginDto)} does not exist`);
            throw new HttpException(`Invalid authentication data`, HttpStatus.UNAUTHORIZED);
        }

        if (!(await bcrypt.compare(loginDto.password, user.hashedPwd))) {
            this.logger.error(`Password for ${JSON.stringify(loginDto)} is incorrect`);
            throw new HttpException(`Invalid authentication data`, HttpStatus.UNAUTHORIZED);
        }

        const teacher = await this.teacherRepository.findOneBy({ users: { id: user.id } }).catch((e) => {
            this.logger.error(`Failed to get teacher for user ${JSON.stringify(user)}`, e);
            throw new HttpException(`Failed to get teacher for user ${user.id}`, HttpStatus.NOT_FOUND);
        });

        const roles = await this.roleRepository.findOneBy({ user: { id: user.id } }).catch((e) => {
            this.logger.error(`Failed to get roles for user ${JSON.stringify(user)}`, e);
            throw new HttpException(`Failed to get roles for user ${user.id}`, HttpStatus.NOT_FOUND);
        });

        const payload: JwtPayload = {
            sub: user.id,
            username: user.username,
            hashedPassword: user.hashedPwd,
            userId: user.id,
            teacherId: teacher?.id || null,
            roles: roles?.roles || null,
        };

        const jwt = await this.jwtService.signAsync(payload);

        response.cookie('access_token', jwt, { httpOnly: true });

        this.logger.verbose(`User ${JSON.stringify(loginDto)} logged in and got JWT ${JSON.stringify(payload)}`);
        this.logger.log(`User ${loginDto.username} logged in`);

        return JSON.stringify(LoginDto);
    }

    async register(registerDto: RegisterDto, response: Response): Promise<string> {
        this.logger.verbose(`Register attempt by ${JSON.stringify(registerDto)}`);

        const user = await this.userRepository.findOneBy({
            username: registerDto.username,
        });

        if (user) {
            this.logger.error(`User ${JSON.stringify(registerDto)} already exists`);
            throw new HttpException(`User ${registerDto.username} already exists`, HttpStatus.BAD_REQUEST);
        }

        const hashedPwd = await bcrypt.hash(registerDto.password, 10);

        const newUser = await this.userRepository
            .save({
                username: registerDto.username,
                hashedPwd,
                displayName: registerDto.username,
            })
            .catch((e) => {
                this.logger.error(`Failed to register user ${JSON.stringify(registerDto)}`, e);
                throw new HttpException(`Failed to register user ${registerDto.username}`, HttpStatus.INTERNAL_SERVER_ERROR);
            });

        const payload: JwtPayload = {
            sub: newUser.id,
            username: newUser.username,
            hashedPassword: newUser.hashedPwd,
            userId: newUser.id,
            teacherId: null,
            roles: null,
        };

        const jwt = await this.jwtService.signAsync(payload);

        response.cookie('access_token', jwt, { httpOnly: false });

        this.logger.verbose(`User ${JSON.stringify(registerDto)} registered and got JWT ${JSON.stringify(payload)}`);
        this.logger.verbose(`User ${JSON.stringify(registerDto)} registered`);

        return JSON.stringify(registerDto);
    }
}
