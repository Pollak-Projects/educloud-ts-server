import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Query,
    Body,
    Req
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { AdminUserService } from './admin.user.service';
import { RequestUser } from 'express';

@Controller()
export class AdminUserController {
    constructor(private readonly appService: AdminUserService) {}

    @Get('get-all')
    getAllUsers(): string {
        return this.appService.getAllUsers();
    }

    @Get('get-by-id')
    GetUserById(@Query('id') id: number, @Req() req: RequestUser): string {
        return this.appService.GetUserById(id, req);
    }

    @Post('create')
    createUser(@Body() userBody: UserDto, @Req() req: RequestUser): string {
        return this.appService.createUser(userBody, req);
    }

    @Put('update-by-id')
    updateUserById(@Query('id') id: number, @Body() userBody: UserDto, @Req() req: RequestUser): string {
        return this.appService.updateUserById(id, userBody, req);
    }

    @Delete('delete-by-id')
    deleteUserById(@Query('id') id: number, @Req() req: RequestUser): string {
        return this.appService.deleteUserById(id, req);
    }
}
