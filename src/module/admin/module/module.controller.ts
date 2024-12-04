import { Controller, Get, Post, Delete, Put, Body, Query } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleDto } from './dto/module.dto';

@Controller('api/admin/module')
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
  getModuleByFilter(@Query('category') category: string, @Query('grade') grade: string, @Query('profession') profession: string): string {
    return this.appService.getModuleByFilter(category, grade, profession);
  }

  @Post('create')
  createModule(@Body() moduleBody: ModuleDto): string {
    return this.appService.createModule(moduleBody);
  }

  @Put('update-by-id')
  updateModuleById(@Query('id') id: number, @Body() moduleBody: ModuleDto): string {
    return this.appService.updateModuleById(id, moduleBody);
  }

  @Delete('delete-by-id')
  deleteModuleById(@Query('id') id: number): string {
    return this.appService.deleteModuleById(id);
  }
}
