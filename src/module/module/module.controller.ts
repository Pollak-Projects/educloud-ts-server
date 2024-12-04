import { Controller, Get, HttpCode, HttpStatus, Query, Req } from '@nestjs/common';
import { ModuleService } from './module.service';
import { RequestUser } from 'express';

@Controller('')
export class ModuleController {
    constructor(private readonly appService: ModuleService) {}

    @Get('get-all')
    @HttpCode(HttpStatus.OK)
    async getAllModules(@Req() request: RequestUser): Promise<string> {
        return this.appService.getAllModules(request);
    }

    @Get('get-by-id')
    @HttpCode(HttpStatus.OK)
    async getModuleById(@Query('id') id: string, @Req() request: RequestUser): Promise<string> {
        return this.appService.getModuleById(id, request);
    }

    @Get('get-by-name')
    @HttpCode(HttpStatus.OK)
    async getModuleByName(@Query('name') name: string, @Req() request: RequestUser): Promise<string> {
        return this.appService.getModuleByName(name, request);
    }

    @Get('get-by-filter')
    @HttpCode(HttpStatus.OK)
    async getModuleByFilter(
        @Query('category') category: string,
        @Query('grade') grade: string,
        @Query('profession') profession: string,
        @Req() request: RequestUser,
    ): Promise<string> {
        return this.appService.getModuleByFilter(category, grade, profession, request);
    }
}
