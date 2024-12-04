import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getAllUsers(): string {
    return 'Hello World!';
  }

  GetUserById(): string {
    return 'Hello World!';
  }

  createUser(): string {
    return 'Hello World!';
  }

  updateUserById(): string {
    return 'Hello World!';
  }

  deleteUserById(): string {
    return 'Hello World!';
  }
}
