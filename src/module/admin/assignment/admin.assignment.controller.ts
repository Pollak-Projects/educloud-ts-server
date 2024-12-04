import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Query,
    Body,
} from '@nestjs/common';
import { AssignmentDto } from './dto/assignment.dto';
import { AdminAssignmentService } from './admin.assignment.service';

@Controller('assignment')
export class AdminAssignmentController {
    constructor(private readonly appService: AdminAssignmentService) {}

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

    @Post('create')
    async createAssignment(@Body() AssignmentBody: AssignmentDto): Promise<string> {
        return this.appService.createAssignment(AssignmentBody);
    }

    @Put('update-by-id')
    async updateAssignmentById(
        @Query('id') id: string,
        @Body() AssignmentBody: AssignmentDto,
    ): Promise<string> {
        return this.appService.updateAssignmentById(id, AssignmentBody);
    }

    @Delete('delete-by-id')
    async deleteAssignmentById(@Query('id') id: string): Promise<string> {
        return this.appService.deleteAssignmentById(id);
    }
}
