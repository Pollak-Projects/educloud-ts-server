import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from '../../assignment/assignment.entity';
import { Teacher } from 'src/module/teacher/teacher.entity';
import { AssignmentDto } from './dto/assignment.dto';

@Injectable()
export class AdminAssignmentService {
    private readonly logger = new Logger(AdminAssignmentService.name);

    constructor(
        @InjectRepository(Assignment)
        private assignmentRepository: Repository<Assignment>,
        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,
    ) {}

    async getAllAssignments(): Promise<string> {
        const Assignments = await this.assignmentRepository.find().catch((error) => {
            throw new HttpException(
                { message: 'Error fetching Assignments!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });;

        if(Assignments.length === 0) {
            throw new HttpException(
                { message: 'No Assignments found!' },
                HttpStatus.NO_CONTENT,
            );
        }

        return JSON.stringify(Assignments);
    }

    async getAssignmentById(id: string): Promise<string> {
        if(!id) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const Assignment = await this.assignmentRepository.findOneBy({ id }).catch((error) => {
            throw new HttpException(
                { message: `Error fetching Assignment with ID: ${id}!`, error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!Assignment) {
            throw new HttpException(
                { message: `Assignment with ID: ${id} not found!` },
                HttpStatus.NOT_FOUND,
            );
        }

        return JSON.stringify(Assignment);
    }

    async getAssignmentByName(name: string): Promise<string> {
        if(!name) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const Assignment = await this.assignmentRepository.findOneBy({ name }).catch((error) => {
            throw new HttpException(
                { message: `Error fetching Assignment with name: ${name}!`, error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!Assignment) {
            throw new HttpException(
                { message: `Assignment with name: ${name} not found!` },
                HttpStatus.NOT_FOUND,
            );
        }

        return JSON.stringify(Assignment);
    }

    async getAssignmentByFilter(
        category: string,
        grade: string,
        profession: string,
    ): Promise<string> {
        if(!category || !grade || !profession) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const where: any = {};

        if (category !== 'none') where.category = category;
        if (grade !== 'none') where.grade = grade;
        if (profession !== 'none') where.profession = profession;
    
        const Assignments = await this.assignmentRepository.find({ where }).catch((error) => {
            throw new HttpException(
                { message: 'Error fetching Assignments with filters!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });
    
        if (Assignments.length === 0) {
            throw new HttpException(
                { message: 'No Assignments found matching the filters!' },
                HttpStatus.NO_CONTENT,
            );
        }
    
        return JSON.stringify(Assignments);
    }

    async createAssignment(AssignmentBody: AssignmentDto): Promise<string> {
        const teacherId = "asd"

        if (!teacherId) {
            throw new HttpException(
                { message: 'Teacher ID is missing in the token!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const teacher = await this.teacherRepository.findOne({ where: { id: teacherId } });
        if (!teacher) {
            throw new HttpException(
                { message: `Teacher with ID: ${teacherId} not found!` },
                HttpStatus.NOT_FOUND,
            );
        }

        const newModule = this.assignmentRepository.create({
            ...AssignmentBody,
            teachers: [teacher],
        });

        const savedModule = await this.assignmentRepository.save(newModule).catch((error) => {
            throw new HttpException(
                { message: 'Error creating module!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify(savedModule);
    }

    async updateAssignmentById(id: string, AssignmentBody: AssignmentDto): Promise<string> {
        if(!id) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const module = await this.assignmentRepository.findOneBy({ id }).catch((error) => {
            throw new HttpException(
                { message: `Error finding module with ID: ${id}!`, error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!module) {
            throw new HttpException(
                { message: `Module with ID: ${id} not found!` },
                HttpStatus.NOT_FOUND,
            );
        }

        Object.assign(module, AssignmentBody);

        const updatedModule = await this.assignmentRepository.save(module).catch((error) => {
            throw new HttpException(
                { message: `Error updating module with ID: ${id}!`, error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify(updatedModule);
    }

    async deleteAssignmentById(id: string): Promise<string> {
        if(!id) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const module = await this.assignmentRepository.findOneBy({ id }).catch((error) => {
            throw new HttpException(
                { message: `Error finding module with ID: ${id}!`, error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!module) {
            throw new HttpException(
                { message: `Module with ID: ${id} not found!` },
                HttpStatus.NOT_FOUND,
            );
        }

        await this.assignmentRepository.remove(module).catch((error) => {
            throw new HttpException(
                { message: `Error deleting module with ID: ${id}!`, error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify({ message: `Module with ID: ${id} deleted successfully!` });
    }
}
