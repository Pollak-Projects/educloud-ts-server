import { Injectable } from '@nestjs/common';
import { AssignmentDto } from './dto/assignment.dto';

@Injectable()
export class AdminAssignmentService {
    getAllAssignments(): string {
        return 'Hello World!';
    }

    getAssignmentById(id: number): string {
        return 'Hello World!';
    }

    getAssignmentByName(name: string): string {
        return 'Hello World!';
    }

    getAssignmentByFilter(
        category: string,
        grade: string,
        profession: string,
    ): string {
        return 'Hello World!';
    }

    createAssignment(AssignmentBody: AssignmentDto): string {
        return 'Hello World!';
    }

    updateAssignmentById(id: number, AssignmentBody: AssignmentDto): string {
        return 'Hello World!';
    }

    deleteAssignmentById(id: number): string {
        return 'Hello World!';
    }
}
