import { Module } from '@nestjs/common';
import { AdminAssignmentController } from './admin.assignment.controller';
import { AdminAssignmentService } from './admin.assignment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from '../../assignment/assignment.entity';
import { Teacher } from '../../teacher/teacher.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Assignment, Teacher])],
    controllers: [AdminAssignmentController],
    providers: [AdminAssignmentService],
})
export class AdminAssignmentModule {}
