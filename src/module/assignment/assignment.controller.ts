import { Controller, Get, Query } from '@nestjs/common';
import { AssignmentService } from './assignment.service';

@Controller('assignment')
export class AssignmentController {
    constructor(private readonly appService: AssignmentService) {}

    @Get('get-all')
    async getAllAssignments(): Promise<string> {
        return this.appService.getAllAssignments();
    }

    @Get('get-by-id')
    async getAssignmentById(@Query('id') id: string): Promise<string> {
        return this.appService.getAssignmentById(id);
    }

    @Get('get-by-name')
    async getAssignmentByName(@Query('name') name: string): Promise<string> {
        return this.appService.getAssignmentByName(name);
    }

    @Get('get-by-filter')
    async getAssignmentByFilter(
        @Query('category') category: string,
        @Query('grade') grade: string,
        @Query('profession') profession: string,
    ): Promise<string> {
        return this.appService.getAssignmentByFilter(
            category,
            grade,
            profession,
        );
    }
}
