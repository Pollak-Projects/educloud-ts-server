import {
    Controller,
    Get,
    Post,
    Delete,
    Put,
    Body,
    Query,
} from '@nestjs/common';
import { ModuleDto } from './dto/module.dto';
import { AdminModuleService } from './admin.module.service';

@Controller('module')
export class AdminModuleController {
    constructor(private readonly appService: AdminModuleService) {}

    @Get('get-all')
    async getAllModules(): Promise<string> {
        return this.appService.getAllModules();
    }

    @Get('get-by-id')
    async getModuleById(@Query('id') id: string): Promise<string> {
        return this.appService.getModuleById(id);
    }

    @Get('get-by-name')
    async getModuleByName(@Query('name') name: string): Promise<string> {
        return this.appService.getModuleByName(name);
    }

    @Get('get-by-filter')
    async getModuleByFilter(
        @Query('category') category: string,
        @Query('grade') grade: string,
        @Query('profession') profession: string,
    ): Promise<string> {
        return this.appService.getModuleByFilter(category, grade, profession);
    }

    @Post('create')
    async createModule(@Body() moduleBody: ModuleDto): Promise<string> {
        return this.appService.createModule(moduleBody);
    }

    @Put('update-by-id')
    async updateModuleById(
        @Query('id') id: string,
        @Body() moduleBody: ModuleDto,
    ): Promise<string> {
        return this.appService.updateModuleById(id, moduleBody);
    }

    @Delete('delete-by-id')
    async deleteModuleById(@Query('id') id: string): Promise<string> {
        return this.appService.deleteModuleById(id);
    }
}
