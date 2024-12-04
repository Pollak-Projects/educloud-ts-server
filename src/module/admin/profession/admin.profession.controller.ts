import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Query,
    Body,
    Req,
    UseGuards
} from '@nestjs/common';
import { ProfessionDto } from './dto/profession.dto';
import { AdminProfessionService } from './admin.profession.service';
import { RequestUser } from 'express';
import { AuthGuard } from 'src/module/auth/auth.guard';
import { RoleEnum } from 'src/module/role/role.enum';
import { Roles } from 'src/module/role/role.decorator';

@UseGuards(AuthGuard)
@Roles(RoleEnum.Admin)
@Controller()
export class AdminProfessionController {
    constructor(private readonly appService: AdminProfessionService) {}

    @Get('get-all')
    async getAllProfessions(@Req() req: RequestUser): Promise<string> {
        return this.appService.getAllProfessions(req);
    }

    @Post('create')
    async createProfession(@Body() professionBody: ProfessionDto, @Req() req: RequestUser): Promise<string> {
        return this.appService.createProfession(professionBody, req);
    }

    @Delete('delete-by-id')
    async deleteProfessionById(@Query('id') id: string, @Req() req: RequestUser): Promise<string> {
        return this.appService.deleteProfessionById(id, req);
    }
}
