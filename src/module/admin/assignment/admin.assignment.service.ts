import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from '../../assignment/assignment.entity';
import { Teacher } from 'src/module/teacher/teacher.entity';
import { AssignmentDto } from './dto/assignment.dto';
import { RequestUser } from 'express';

@Injectable()
export class AdminAssignmentService {
    private readonly logger = new Logger(AdminAssignmentService.name);

    constructor(
        @InjectRepository(Assignment)
        private assignmentRepository: Repository<Assignment>,
        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,
    ) {}

    async getAllAssignments(req: RequestUser): Promise<string> {
        this.logger.log(`Request to get all assignments`);
        const assignments = await this.assignmentRepository.find().catch((e) => {
            this.logger.error(`No Assignments found request by user ${JSON.stringify(req.token)}`, e);
            throw new HttpException({ message: 'Error fetching Assignments!', error: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });
        if (assignments.length === 0) {
            this.logger.verbose(`No Assignments found request by user ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'No Assignments found!' }, HttpStatus.NO_CONTENT);
        }
        this.logger.log(`Assignments found request`);

        return JSON.stringify(assignments);
    }

    async getAssignmentById(id: string, req: RequestUser): Promise<string> {
        this.logger.log(`Request to get assignment by ID: ${id}`);
        this.logger.verbose(`Request to get assignment by ID: ${id} by user ${JSON.stringify(req.token)}`);
        if (!id) {
            this.logger.log(`No ID provided to get assignment`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const Assignment = await this.assignmentRepository.findOneBy({ id }).catch((error) => {
            this.logger.error(`Error fetching Assignment with ID: ${id} by user`, error);
            throw new HttpException({ message: `Error fetching Assignment with ID: ${id}!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!Assignment) {
            this.logger.log(`No Assignment found with ID: ${id}`);
            throw new HttpException({ message: `Assignment with ID: ${id} not found!` }, HttpStatus.NOT_FOUND);
        }

        this.logger.log(`Assignment found with ID: ${id}`);

        return JSON.stringify(Assignment);
    }

    async getAssignmentByName(name: string, req: RequestUser): Promise<string> {
        this.logger.log(`Request to get assignment by name: ${name}`);
        this.logger.verbose(`Request to get assignment by name: ${name} by user ${JSON.stringify(req.token)}`);

        if (!name) {
            this.logger.verbose(`No name provided to get assignment name: ${name}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const Assignment = await this.assignmentRepository.findOneBy({ name }).catch((error) => {
            this.logger.error(`Error fetching Assignment with name: ${name} by user`, error);
            throw new HttpException({ message: `Error fetching Assignment with name: ${name}!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!Assignment) {
            this.logger.log(`No Assignment found with name: ${name}`);
            throw new HttpException({ message: `Assignment with name: ${name} not found!` }, HttpStatus.NOT_FOUND);
        }

        this.logger.verbose(`Assignment found with name: ${name}`);

        return JSON.stringify(Assignment);
    }

    async getAssignmentByFilter(category: string, grade: string, profession: string, req: RequestUser): Promise<string> {
        this.logger.log(`Request to get assignment by filter: ${category}, ${grade}, ${profession}`);
        this.logger.verbose(`Request to get assignment by filter: ${category}, ${grade}, ${profession} by user ${JSON.stringify(req.token)}`);

        if (!category || !grade || !profession) {
            this.logger.verbose(`Missing required fields to get assignment by filter: ${category}, ${grade}, ${profession}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const where: any = {};

        if (category !== 'none') where.category = category;
        if (grade !== 'none') where.grade = grade;
        if (profession !== 'none') where.profession = profession;

        const assignments = await this.assignmentRepository.find({ where }).catch((error) => {
            this.logger.error(`Error fetching Assignments with filters: ${category}, ${grade}, ${profession}`, error);
            throw new HttpException({ message: 'Error fetching Assignments with filters!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (assignments.length === 0) {
            this.logger.verbose(`No Assignments found with filters: ${category}, ${grade}, ${profession}`);
            throw new HttpException({ message: 'No Assignments found matching the filters!' }, HttpStatus.NO_CONTENT);
        }

        this.logger.verbose(`Assignments found with filters: ${category}, ${grade}, ${profession}, assignments: ${JSON.stringify(assignments)}`);

        return JSON.stringify(assignments);
    }

    async createAssignment(assignmentDto: AssignmentDto, req: RequestUser): Promise<string> {
        this.logger.log(`Request to create assignment`);
        this.logger.verbose(`Request to create assignment ${JSON.stringify(assignmentDto)} by user ${JSON.stringify(req.token)}`);
        const teacherId = req.token.teacherId;

        if (!teacherId) {
            this.logger.verbose(`TeacherId is missing in the token: ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Teacher ID is missing in the token!' }, HttpStatus.BAD_REQUEST);
        }

        const teacher = await this.teacherRepository.findOne({ where: { id: teacherId } });
        if (!teacher) {
            this.logger.verbose(`Teacher with ID: ${teacherId} not found in token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: `Teacher with ID: ${teacherId} not found!` }, HttpStatus.NOT_FOUND);
        }

        const newModule = this.assignmentRepository.create({
            ...assignmentDto,
            teachers: [teacher],
        });

        const savedModule = await this.assignmentRepository.save(newModule).catch((error) => {
            throw new HttpException({ message: 'Error creating module!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        return JSON.stringify(savedModule);
    }

    async updateAssignmentById(id: string, assignmentDto: AssignmentDto, req: RequestUser): Promise<string> {
        this.logger.log(`Request to update assignment by ID: ${id}`);
        this.logger.verbose(`Request to update assignment by ID: ${id} by token ${JSON.stringify(req.token)}`);
        if (!id) {
            this.logger.verbose(`No ID provided to update assignment: id: ${id}, assignment: ${JSON.stringify(assignmentDto)}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const module = await this.assignmentRepository.findOneBy({ id }).catch((error) => {
            this.logger.error(`Error finding module with ID: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: `Error finding module with ID: ${id}!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!module) {
            this.logger.verbose(`No module found with ID: ${id}`);
            throw new HttpException({ message: `Module with ID: ${id} not found!` }, HttpStatus.NOT_FOUND);
        }

        Object.assign(module, assignmentDto);

        const updatedModule = await this.assignmentRepository.save(module).catch((error) => {
            this.logger.error(`Error updating module with ID: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: `Error updating module with ID: ${id}!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        this.logger.verbose(`Module updated with ID: ${id} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(updatedModule);
    }

    async deleteAssignmentById(id: string, req: RequestUser): Promise<string> {
        this.logger.log(`Request to delete assignment by ID: ${id}`);
        this.logger.verbose(`Request to delete assignment by ID: ${id} by token ${JSON.stringify(req.token)}`);

        if (!id) {
            this.logger.verbose(`No ID provided to delete assignment: id: ${id}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const module = await this.assignmentRepository.findOneBy({ id }).catch((error) => {
            this.logger.error(`Error finding module with ID: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: `Error finding module with ID: ${id}!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!module) {
            this.logger.verbose(`No module found with ID: ${id}`);
            throw new HttpException({ message: `Module with ID: ${id} not found!` }, HttpStatus.NOT_FOUND);
        }

        await this.assignmentRepository.remove(module).catch((error) => {
            this.logger.error(`Error deleting module with ID: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: `Error deleting module with ID: ${id}!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        this.logger.verbose(`Module deleted with ID: ${id} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify({ message: `Module with ID: ${id} deleted successfully!` });
    }
}
