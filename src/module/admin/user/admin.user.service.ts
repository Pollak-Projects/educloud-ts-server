import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AdminUserService {
  getAllUsers(): string {
    return 'Hello World!';
  }

  GetUserById(id: number): string {
    return 'Hello World!';
  }

  createUser(userBody: UserDto): string {
    return 'Hello World!';
  }

  updateUserById(id: number, userBody: UserDto): string {
    return 'Hello World!';
  }

  deleteUserById(id: number): string {
    return 'Hello World!';
  }
}
