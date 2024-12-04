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

    private async getTeacherAssignments(req: RequestUser, where: any = {}) {
        const teacherId = req.token.teacherId;

        if (!teacherId) {
            this.logger.error('Teacher ID is missing in the token');
            throw new HttpException({ message: 'Teacher ID is missing in the token!' }, HttpStatus.BAD_REQUEST);
        }

        where['teacherId'] = teacherId;
        return where;
    }

    async getAllAssignments(req: RequestUser): Promise<string> {
        this.logger.log('Fetching all assignments');
        const where = await this.getTeacherAssignments(req, {});
        const assignments = await this.assignmentRepository.find({ where }).catch((error) => {
            this.logger.error('Error fetching assignments', error);
            throw new HttpException({ message: 'Error fetching Assignments!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (assignments.length === 0) {
            throw new HttpException({ message: 'No assignments found!' }, HttpStatus.NO_CONTENT);
        }

        return JSON.stringify(assignments);
    }

    async getAssignmentById(id: string, req: RequestUser): Promise<string> {
        if (!id) {
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const where = await this.getTeacherAssignments(req, { id });

        const assignment = await this.assignmentRepository.findOne({ where }).catch((error) => {
            throw new HttpException({ message: `Error fetching assignment with ID: ${id}!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!assignment) {
            throw new HttpException({ message: `Assignment with ID: ${id} not found!` }, HttpStatus.NOT_FOUND);
        }

        return JSON.stringify(assignment);
    }

    async getAssignmentByName(name: string, req: RequestUser): Promise<string> {
        if (!name) {
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const where = await this.getTeacherAssignments(req, { name });

        const assignment = await this.assignmentRepository.findOne({ where }).catch((error) => {
            throw new HttpException({ message: `Error fetching assignment with name: ${name}!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!assignment) {
            throw new HttpException({ message: `Assignment with name: ${name} not found!` }, HttpStatus.NOT_FOUND);
        }

        return JSON.stringify(assignment);
    }

    async getAssignmentByFilter(category: string, grade: string, profession: string, req: RequestUser): Promise<string> {
        if (!category || !grade || !profession) {
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const where: any = {
            category: category !== 'none' ? category : undefined,
            grade: grade !== 'none' ? grade : undefined,
            profession: profession !== 'none' ? profession : undefined,
        };

        const filteredWhere = await this.getTeacherAssignments(req, where);

        const assignments = await this.assignmentRepository.find({ where: filteredWhere }).catch((error) => {
            throw new HttpException({ message: 'Error fetching assignments with filters!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (assignments.length === 0) {
            throw new HttpException({ message: 'No assignments found matching the filters!' }, HttpStatus.NO_CONTENT);
        }

        return JSON.stringify(assignments);
    }

    async createAssignment(assignmentDto: AssignmentDto, req: RequestUser): Promise<string> {
        const teacherId = req.token.teacherId;

        if (!teacherId) {
            throw new HttpException({ message: 'Teacher ID is missing in the token!' }, HttpStatus.BAD_REQUEST);
        }

        const teacher = await this.teacherRepository.findOne({ where: { id: teacherId } }).catch((error) => {
            throw new HttpException({ message: 'Error finding teacher!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!teacher) {
            throw new HttpException({ message: `Teacher with ID: ${teacherId} not found!` }, HttpStatus.NOT_FOUND);
        }

        const newAssignment = this.assignmentRepository.create({
            ...assignmentDto,
            teachers: [teacher],
        });

        const savedAssignment = await this.assignmentRepository.save(newAssignment).catch((error) => {
            throw new HttpException({ message: 'Error creating assignment!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        return JSON.stringify(savedAssignment);
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
