import { Controller, Get } from '@nestjs/common';
import { ModuleService } from './module.service';

@Controller('api/module')
export class ModuleController {
  constructor(private readonly appService: ModuleService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
