import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ModuleService } from './module.service';

@Controller('module')
export class ModuleController {
    constructor(private readonly appService: ModuleService) {}

    @Get('get-all')
    @HttpCode(HttpStatus.OK)
    async getAllModules(): Promise<string> {
        return this.appService.getAllModules();
    }

    @Get('get-by-id')
    @HttpCode(HttpStatus.OK)
    async getModuleById(@Query('id') id: string): Promise<string> {
        return this.appService.getModuleById(id);
    }

    @Get('get-by-name')
    @HttpCode(HttpStatus.OK)
    async getModuleByName(@Query('name') name: string): Promise<string> {
        return this.appService.getModuleByName(name);
    }

    @Get('get-by-filter')
    @HttpCode(HttpStatus.OK)
    async getModuleByFilter(
        @Query('category') category: string,
        @Query('grade') grade: string,
        @Query('profession') profession: string,
    ): Promise<string> {
        return this.appService.getModuleByFilter(category, grade, profession);
    }
}
