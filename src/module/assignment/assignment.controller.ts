import { Controller, Get, Query, Req } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { RequestUser } from 'express';

@Controller()
export class AssignmentController {
    constructor(private readonly appService: AssignmentService) {}

    @Get('get-all')
    async getAllAssignments(@Req() request: RequestUser): Promise<string> {
        return this.appService.getAllAssignments(request);
    }

    @Get('get-by-id')
    async getAssignmentById(@Query('id') id: string, @Req() request: RequestUser): Promise<string> {
        return this.appService.getAssignmentById(id, request);
    }

    @Get('get-by-name')
    async getAssignmentByName(@Query('name') name: string, @Req() request: RequestUser): Promise<string> {
        return this.appService.getAssignmentByName(name, request);
    }

    @Get('get-by-filter')
    async getAssignmentByFilter(
        @Query('category') category: string,
        @Query('grade') grade: string,
        @Query('profession') profession: string,
        @Req() request: RequestUser,
    ): Promise<string> {
        return this.appService.getAssignmentByFilter(category, grade, profession, request);
    }
}
