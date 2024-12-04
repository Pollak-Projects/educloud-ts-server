import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    login(userBody: LoginDto): string {
        return JSON.stringify(LoginDto);
    }
}
