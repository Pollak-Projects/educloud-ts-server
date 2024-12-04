import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  login(@Body() userBody: LoginDto): string {
    return this.appService.login(userBody);
  }

}
