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

@Controller('user')
export class AdminUserController {
    constructor(private readonly appService: AdminUserService) {}

    @Get('get-all')
    async getAllUsers(): Promise<string> {
        return this.appService.getAllUsers();
    }

    @Get('get-by-id')
    async GetUserById(@Query('id') id: number, @Req() req: RequestUser): Promise<string> {
        return this.appService.GetUserById(id, req);
    }

    @Post('create')
    async createUser(@Body() userBody: UserDto, @Req() req: RequestUser): Promise<string> {
        return this.appService.createUser(userBody, req);
    }

    @Put('update-by-id')
    async updateUserById(@Query('id') id: number, @Body() userBody: UserDto, @Req() req: RequestUser): Promise<string> {
        return this.appService.updateUserById(id, userBody, req);
    }

    @Delete('delete-by-id')
    async deleteUserById(@Query('id') id: number, @Req() req: RequestUser): Promise<string> {
        return this.appService.deleteUserById(id, req);
    }
}
