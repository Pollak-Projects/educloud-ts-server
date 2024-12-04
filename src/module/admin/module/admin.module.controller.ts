import {
    Controller,
    Get,
    Post,
    Delete,
    Put,
    Body,
    Query,
    Req
} from '@nestjs/common';
import { ModuleDto } from './dto/module.dto';
import { AdminModuleService } from './admin.module.service';
import { RequestUser } from 'express';

@Controller('module')
export class AdminModuleController {
    constructor(private readonly appService: AdminModuleService) {}

    @Get('get-all')
    async getAllModules(@Req() req: RequestUser): Promise<string> {
        return this.appService.getAllModules(req);
    }

    @Get('get-by-id')
    async getModuleById(@Query('id') id: string, @Req() req: RequestUser): Promise<string> {
        return this.appService.getModuleById(id, req);
    }

    @Get('get-by-name')
    async getModuleByName(@Query('name') name: string, @Req() req: RequestUser): Promise<string> {
        return this.appService.getModuleByName(name, req);
    }

    @Get('get-by-filter')
    async getModuleByFilter(
        @Query('category') category: string,
        @Query('grade') grade: string,
        @Query('profession') profession: string,
        @Req() req: RequestUser
    ): Promise<string> {
        return this.appService.getModuleByFilter(category, grade, profession, req);
    }

    @Post('create')
    async createModule(@Body() moduleBody: ModuleDto, @Req() req: RequestUser): Promise<string> {
        return this.appService.createModule(moduleBody, req);
    }

    @Put('update-by-id')
    async updateModuleById(
        @Query('id') id: string,
        @Body() moduleBody: ModuleDto,
        @Req() req: RequestUser
    ): Promise<string> {
        return this.appService.updateModuleById(id, moduleBody, req);
    }

    @Delete('delete-by-id')
    async deleteModuleById(@Query('id') id: string, @Req() req: RequestUser): Promise<string> {
        return this.appService.deleteModuleById(id, req);
    }
}
