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
    getAssignmentByFilter(
        @Query('category') category: string,
        @Query('grade') grade: string,
        @Query('profession') profession: string,
    ): string {
        return this.appService.getAssignmentByFilter(
            category,
            grade,
            profession,
        );
    }

    @Post('create')
    createAssignment(@Body() AssignmentBody: AssignmentDto): string {
        return this.appService.createAssignment(AssignmentBody);
    }

    @Put('update-by-id')
    updateAssignmentById(
        @Query('id') id: number,
        @Body() AssignmentBody: AssignmentDto,
    ): string {
        return this.appService.updateAssignmentById(id, AssignmentBody);
    }

    @Delete('delete-by-id')
    deleteAssignmentById(@Query('id') id: number): string {
        return this.appService.deleteAssignmentById(id);
    }
}
