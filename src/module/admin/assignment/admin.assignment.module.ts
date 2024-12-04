import { Module } from '@nestjs/common';
import { AdminAssignmentController } from './admin.assignment.controller';
import { AdminAssignmentService } from './admin.assignment.service';

@Module({
    imports: [],
    controllers: [AdminAssignmentController],
    providers: [AdminAssignmentService],
})
export class AdminAssignmentModule {}
