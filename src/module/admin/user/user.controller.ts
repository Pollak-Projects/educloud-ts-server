import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/admin/user')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('get-all')
  getAllUsers(): string {
    return this.appService.getAllUsers();
  }

  @Get('get-by-id')
  GetUserById(): string {
    return this.appService.GetUserById();
  }

  @Post('create')
  createUser(): string {
    return this.appService.createUser();
  }

  @Put('update-by-id')
  updateUserById(): string {
    return this.appService.updateUserById();
  }

  @Delete('delete-by-id')
  deleteUserById(): string {
    return this.appService.deleteUserById();
  }
}
