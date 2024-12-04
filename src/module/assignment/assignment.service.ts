import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './assignment.entity';

@Injectable()
export class AssignmentService {
    private readonly logger = new Logger(AssignmentService.name);

    constructor(
        @InjectRepository(Assignment)
        private assignmentRepository: Repository<Assignment>,
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
}
