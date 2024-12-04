import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly appService: AuthService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async login(@Body() userBody: LoginDto): Promise<string> {
        return this.appService.login(userBody);
    }
}
