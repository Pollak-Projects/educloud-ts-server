import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly appService: AuthService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async login(@Body() userBody: LoginDto, @Res() response: Response): Promise<string> {
        return this.appService.login(userBody, response);
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() userBody: LoginDto, @Res() response: Response): Promise<string> {
        return this.appService.register(userBody, response);
    }
}
