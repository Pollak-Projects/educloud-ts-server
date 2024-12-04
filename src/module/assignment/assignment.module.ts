import { Module } from '@nestjs/common';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';

@Module({
    imports: [],
    controllers: [AssignmentController],
    providers: [AssignmentService],
})
export class AssignmentModule {}
