import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private jwtService: JwtService,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async login(loginDto: LoginDto): Promise<string> {
        this.logger.verbose(`Login attempt by ${JSON.stringify(loginDto)}`);

        const user = await this.userRepository.findOneBy({ username: loginDto.username })
            .catch(e => {
            this.logger.error(`User ${JSON.stringify(loginDto)} does not exist`);
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


        return JSON.stringify(LoginDto);
    }
}
