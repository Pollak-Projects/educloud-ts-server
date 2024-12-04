import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Query,
    Body,
    Req
} from '@nestjs/common';
import { AssignmentDto } from './dto/assignment.dto';
import { AdminAssignmentService } from './admin.assignment.service';
import { RequestUser } from 'express';

@Controller('assignment')
export class AdminAssignmentController {
    constructor(private readonly appService: AdminAssignmentService) {}

    @Get('get-all')
    async getAllAssignments(@Req() req: RequestUser): Promise<string> {
        return this.appService.getAllAssignments(req);
    }

    @Get('get-by-id')
    async getAssignmentById(@Query('id') id: string, @Req() req: RequestUser): Promise<string> {
        return this.appService.getAssignmentById(id, req);
    }

    @Get('get-by-name')
    async getAssignmentByName(@Query('name') name: string, @Req() req: RequestUser): Promise<string> {
        return this.appService.getAssignmentByName(name, req);
    }

    @Get('get-by-filter')
    async getAssignmentByFilter(
        @Query('category') category: string,
        @Query('grade') grade: string,
        @Query('profession') profession: string,
        @Req() req: RequestUser
    ): Promise<string> {
        return this.appService.getAssignmentByFilter(
            category,
            grade,
            profession,
            req
        );
    }

    @Post('create')
    async createAssignment(@Body() AssignmentBody: AssignmentDto, @Req() req: RequestUser): Promise<string> {
        return this.appService.createAssignment(AssignmentBody, req);
    }

    @Put('update-by-id')
    async updateAssignmentById(
        @Query('id') id: string,
        @Body() AssignmentBody: AssignmentDto,
        @Req() req: RequestUser
    ): Promise<string> {
        return this.appService.updateAssignmentById(id, AssignmentBody, req);
    }

    @Delete('delete-by-id')
    async deleteAssignmentById(@Query('id') id: string, @Req() req: RequestUser): Promise<string> {
        return this.appService.deleteAssignmentById(id, req);
    }
}
