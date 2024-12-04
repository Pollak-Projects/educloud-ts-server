import { Module } from '@nestjs/common';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment as AssignmentEntity } from './assignment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AssignmentEntity])],
    controllers: [AssignmentController],
    providers: [AssignmentService],
})
export class AssignmentModule {}
