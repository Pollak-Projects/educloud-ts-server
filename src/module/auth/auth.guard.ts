import { CanActivate, ExecutionContext, HttpException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestUser } from 'express';
import * as process from 'node:process';
import { JwtPayload } from 'eduJwt';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: RequestUser = context.switchToHttp().getRequest();
        const token = request.cookies['access_token'];
        this.logger.verbose(`Checking token ${JSON.stringify(this.jwtService.decode(token))}}`);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            request.token = payload;
        } catch {
            throw new HttpException('Invalid token', 401);
        }
        return true;
    }
}
