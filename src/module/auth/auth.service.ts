import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async login(loginDto: LoginDto): Promise<string> {

        

        this.userRepository.findOneBy({  });


        return JSON.stringify(LoginDto);
    }
}
