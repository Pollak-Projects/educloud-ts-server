import { Module } from '@nestjs/common';
import { AdminAssignmentController } from './admin.assignment.controller';
import { AdminAssignmentService } from './admin.assignment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment as AssignmentEntity } from '../../assignment/assignment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AssignmentEntity])],
    controllers: [AdminAssignmentController],
    providers: [AdminAssignmentService],
})
export class AdminAssignmentModule {}
