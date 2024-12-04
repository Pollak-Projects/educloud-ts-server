import { Controller, Get } from '@nestjs/common';
import { AssignmentService } from './assignment.service';

@Controller('api/admin/assignment')
export class AssignmentController {
  constructor(private readonly appService: AssignmentService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
