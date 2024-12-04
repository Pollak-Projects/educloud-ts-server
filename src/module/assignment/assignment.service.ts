import { Injectable } from '@nestjs/common';
@Injectable()
export class AssignmentService {
  getAllAssignments(): string {
    return 'Hello World!';
  }

  getAssignmentById(id: number): string {
    return 'Hello World!';
  }

  getAssignmentByName(name: string): string {
    return 'Hello World!';
  }

  getAssignmentByFilter(category: string, grade: string, profession: string): string {
    return 'Hello World!';
  }
}
