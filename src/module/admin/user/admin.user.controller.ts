import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Query,
    Body,
    Req, UseGuards,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { AdminUserService } from './admin.user.service';
import { RequestUser } from 'express';
import { AuthGuard } from '../../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class AdminUserController {
    constructor(private readonly appService: AdminUserService) {}

    @Get('get-all')
    async getAllUsers(@Req() req: RequestUser): Promise<string> {
        return this.appService.getAllUsers(req);
    }

    @Get('get-by-id')
    async GetUserById(@Query('id') id: string, @Req() req: RequestUser): Promise<string> {
        return this.appService.getUserById(id, req);
    }

    @Post('create')
    async createUser(@Body() userBody: UserDto, @Req() req: RequestUser): Promise<string> {
        return this.appService.createUser(userBody, req);
    }

    @Put('update-by-id')
    async updateUserById(@Query('id') id: string, @Body() userBody: UserDto, @Req() req: RequestUser): Promise<string> {
        return this.appService.updateUserById(id, userBody, req);
    }

    @Delete('delete-by-id')
    async deleteUserById(@Query('id') id: string, @Req() req: RequestUser): Promise<string> {
        return this.appService.deleteUserById(id, req);
    }
}
