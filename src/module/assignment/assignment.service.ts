import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './assignment.entity';
import { RequestUser } from 'express';

@Injectable()
export class AssignmentService {
    private readonly logger = new Logger(AssignmentService.name);

    constructor(
        @InjectRepository(Assignment)
        private assignmentRepository: Repository<Assignment>,
    ) {}

    async getAllAssignments(req: RequestUser): Promise<string> {
        this.logger.log('Fetching all Assignments');
        this.logger.verbose(`Fetching all assignments by token: ${JSON.stringify(req.token)}`);

        const assignments = await this.assignmentRepository.find().catch((error) => {
            this.logger.error(`Error fetching Assignments by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error fetching Assignments!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });
        if (assignments.length === 0) {
            this.logger.verbose(`No Assignments found by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'No Assignments found!' }, HttpStatus.NO_CONTENT);
        }

        this.logger.verbose(`Fetched all Assignments by token`);

        return JSON.stringify(assignments);
    }

    async getAssignmentById(id: string, req: RequestUser): Promise<string> {
        this.logger.log(`Fetching Assignment with ID: ${id}`);
        this.logger.verbose(`Fetching Assignment with ID: ${id} by token ${JSON.stringify(req.token)}`);
        if (!id) {
            this.logger.verbose(`Missing required fields ${id} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const assignment = await this.assignmentRepository.findOneBy({ id }).catch((error) => {
            this.logger.error(`Error fetching Assignment with ID: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: `Error fetching Assignment with ID: ${id}!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!assignment) {
            this.logger.verbose(`Assignment with ID: ${id} not found by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: `Assignment with ID: ${id} not found!` }, HttpStatus.NOT_FOUND);
        }

        this.logger.verbose(`Fetched Assignment with ID: ${id} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(assignment);
    }

    async getAssignmentByName(name: string, req: RequestUser): Promise<string> {
        this.logger.log(`Fetching Assignment with name: ${name}`);
        this.logger.verbose(`Fetching Assignment with name: ${name} by token ${JSON.stringify(req.token)}`);
        if (!name) {
            this.logger.verbose(`Missing required fields ${name} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const assignment = await this.assignmentRepository.findOneBy({ name }).catch((error) => {
            this.logger.error(`Error fetching Assignment with name: ${name} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: `Error fetching Assignment with name: ${name}!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!assignment) {
            this.logger.verbose(`Assignment: ${assignment} with name: ${name} not found by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: `Assignment with name: ${name} not found!` }, HttpStatus.NOT_FOUND);
        }

        return JSON.stringify(assignment);
    }

    async getAssignmentByFilter(category: string, grade: string, profession: string, req: RequestUser): Promise<string> {
        this.logger.log(`Fetching Assignments with filters: ${category}, ${grade}, ${profession}`);
        this.logger.verbose(`Fetching Assignments with filters: ${category}, ${grade}, ${profession} by token ${JSON.stringify(req.token)}`);

        if (!category || !grade || !profession) {
            this.logger.verbose(`Missing required fields ${category}, ${grade}, ${profession} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const where: any = {};

        if (category !== 'none') where.category = category;
        if (grade !== 'none') where.grade = grade;
        if (profession !== 'none') where.profession = profession;

        const Assignments = await this.assignmentRepository.find({ where }).catch((error) => {
            this.logger.error(`Error fetching Assignments with filters: ${category}, ${grade}, ${profession} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error fetching Assignments with filters!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (Assignments.length === 0) {
            this.logger.verbose(`No Assignments found matching the filters ${category}, ${grade}, ${profession} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'No Assignments found matching the filters!' }, HttpStatus.NO_CONTENT);
        }

        this.logger.verbose(`Fetched Assignments with filters: ${category}, ${grade}, ${profession} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(Assignments);
    }
}
