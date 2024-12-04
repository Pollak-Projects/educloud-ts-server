import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Query,
    Body,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { AdminUserService } from './admin.user.service';

@Controller('user')
export class AdminUserController {
    constructor(private readonly appService: AdminUserService) {}

    @Get('get-all')
    getAllUsers(): string {
        return this.appService.getAllUsers();
    }

    @Get('get-by-id')
    GetUserById(@Query('id') id: number): string {
        return this.appService.GetUserById(id);
    }

    @Post('create')
    createUser(@Body() userBody: UserDto): string {
        return this.appService.createUser(userBody);
    }

    @Put('update-by-id')
    updateUserById(@Query('id') id: number, @Body() userBody: UserDto): string {
        return this.appService.updateUserById(id, userBody);
    }

    @Delete('delete-by-id')
    deleteUserById(@Query('id') id: number): string {
        return this.appService.deleteUserById(id);
    }
}
