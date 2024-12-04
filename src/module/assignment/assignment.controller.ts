import { Controller, Get, Query } from '@nestjs/common';
import { AssignmentService } from './assignment.service';

@Controller('api/assignment')
export class AssignmentController {
  constructor(private readonly appService: AssignmentService) {}

  @Get('get-all')
  getAllAssignments(): string {
    return this.appService.getAllAssignments();
  }

  @Get('get-by-id')
  getAssignmentById(@Query('id') id: number): string {
    return this.appService.getAssignmentById(id);
  }

  @Get('get-by-name')
  getAssignmentByName(@Query('name') name: string): string {
    return this.appService.getAssignmentByName(name);
  }

  @Get('get-by-filter')
  getAssignmentByFilter(@Query('category') category: string, @Query('grade') grade: string, @Query('profession') profession: string): string {
    return this.appService.getAssignmentByFilter(category, grade, profession);
  }
}
