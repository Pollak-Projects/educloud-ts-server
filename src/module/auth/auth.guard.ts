import {
    CanActivate,
    ExecutionContext,
    HttpException,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestUser } from 'express';
import * as process from 'node:process';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: RequestUser = context.switchToHttp().getRequest();
        const token = request.cookies['jwt'];
        this.logger.verbose(`Checking token ${this.jwtService.decode(token)}`);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload: object = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            request.user = payload;
        } catch {
            throw new HttpException('Invalid token', 401);
        }
        return true;
    }
}
