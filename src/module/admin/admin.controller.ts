import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('api/admin/module')
export class AdminController {
  constructor(private readonly appService: AdminService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
