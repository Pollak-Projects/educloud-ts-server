import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() userBody: RegisterDto, @Res({ passthrough: true }) response: Response): Promise<string> {
        return this.authService.register(userBody, response);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    async login(@Body() userBody: LoginDto, @Res({ passthrough: true }) response: Response): Promise<string> {
        return this.authService.login(userBody, response);
    }
}
