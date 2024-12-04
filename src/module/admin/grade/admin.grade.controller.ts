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
import { GradeDto } from './dto/grade.dto';
import { AdminGradeService } from './admin.grade.service';
import { RequestUser } from 'express';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/module/auth/auth.guard';
import { RoleEnum } from 'src/module/role/role.enum';
import { Roles } from 'src/module/role/role.decorator';

@UseGuards(AuthGuard)
@Roles(RoleEnum.Admin)
@Controller()
export class AdminGradeController {
    constructor(private readonly appService: AdminGradeService) {}

    @Get('get-all')
    async getAllGrades(@Req() req: RequestUser): Promise<string> {
        return this.appService.getAllGrades(req);
    }

    @Post('create')
    async createGrade(@Body() gradeBody: GradeDto, @Req() req: RequestUser): Promise<string> {
        return this.appService.createGrade(gradeBody, req);
    }

    @Delete('delete-by-id')
    async deleteGradeById(@Query('id') id: string, @Req() req: RequestUser): Promise<string> {
        return this.appService.deleteGradeById(id, req);
    }
}
