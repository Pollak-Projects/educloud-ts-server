import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { RequestUser } from 'express';

@Injectable()
export class AdminUserService {
    getAllUsers(): string {
        return 'Hello World!';
    }

    GetUserById(id: number, req: RequestUser): string {
        return 'Hello World!';
    }

    createUser(userBody: UserDto, req: RequestUser): string {
        return 'Hello World!';
    }

    updateUserById(id: number, userBody: UserDto, req: RequestUser): string {
        return 'Hello World!';
    }

    deleteUserById(id: number, req: RequestUser): string {
        return 'Hello World!';
    }
}
