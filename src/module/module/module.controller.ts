import { Controller, Get, Query } from '@nestjs/common';
import { ModuleService } from './module.service';

@Controller('api/module')
export class ModuleController {
    constructor(private readonly appService: ModuleService) {}

    @Get('get-all')
    getAllModules(): string {
        return this.appService.getAllModules();
    }

    @Get('get-by-id')
    getModuleById(@Query('id') id: number): string {
        return this.appService.getModuleById(id);
    }

    @Get('get-by-name')
    getModuleByName(@Query('name') name: string): string {
        return this.appService.getModuleByName(name);
    }

    @Get('get-by-filter')
    getModuleByFilter(
        @Query('category') category: string,
        @Query('grade') grade: string,
        @Query('profession') profession: string,
    ): string {
        return this.appService.getModuleByFilter(category, grade, profession);
    }
}
