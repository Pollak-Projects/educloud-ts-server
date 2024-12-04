import { Module } from '@nestjs/common';
import { AdminAssignmentController } from './admin.assignment.controller';
import { AdminAssignmentService } from './admin.assignment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from '../../assignment/assignment.entity';
import { Teacher } from '../../teacher/teacher.entity';
import { AuthModule } from '../../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Assignment, Teacher]), AuthModule],
    controllers: [AdminAssignmentController],
    providers: [AdminAssignmentService],
})
export class AdminAssignmentModule {}
