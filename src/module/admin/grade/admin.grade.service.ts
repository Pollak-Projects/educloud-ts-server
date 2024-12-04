import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestUser } from 'express';
import { Grade } from 'src/module/grade/grade.entity';
import { GradeDto } from './dto/grade.dto';

@Injectable()
export class AdminGradeService {
    private readonly logger = new Logger(AdminGradeService.name);

    constructor(
        @InjectRepository(Grade)
        private gradeRepository: Repository<Grade>,
    ) {}

    async getAllGrades(req: RequestUser): Promise<string> {
        this.logger.log('Fetching all Grades');
        this.logger.verbose(`Fetching all Grades by token: ${JSON.stringify(req.token)}`);

        const grades = await this.gradeRepository.find().catch((error) => {
            this.logger.error(`Error fetching Grades by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error fetching grades!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (grades.length === 0) {
            this.logger.verbose(`No Grades found by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'No grades found!' }, HttpStatus.NO_CONTENT);
        }

        this.logger.verbose(`Fetched all Grades by token`);

        return JSON.stringify(grades);
    }

    async createGrade(gradeBody: GradeDto, req: RequestUser): Promise<string> {
        this.logger.log(`Creating grade ${JSON.stringify(gradeBody)}`);
        this.logger.verbose(`Creating grade ${JSON.stringify(gradeBody)} by token ${JSON.stringify(req.token)}`);

        const newGrade = this.gradeRepository.create({
            gradeName: gradeBody.gradeName,
        });

        const savedGrade = await this.gradeRepository.save(newGrade).catch((error) => {
            this.logger.error(`Error creating grade by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error creating grade!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        this.logger.verbose(`Grade created: ${JSON.stringify(gradeBody)} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(savedGrade);
    }

    async deleteGradeById(id: string, req: RequestUser): Promise<string> {
        this.logger.log(`Deleting grade by id: ${id}`);
        this.logger.verbose(`Deleting grade by id: ${id} by token ${JSON.stringify(req.token)}`);

        if (!id) {
            this.logger.error(`Missing required fields id: ${id} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const grade = await this.gradeRepository.findOne({ where: { id } }).catch((error) => {
            this.logger.error(`Error fetching grades by id: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error fetching grade!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!grade) {
            this.logger.error(`Grades not found by id: ${id} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Grade not found!' }, HttpStatus.NOT_FOUND);
        }

        await this.gradeRepository.remove(grade).catch((error) => {
            this.logger.error(`Error deleting grades by id: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error deleting grade!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        this.logger.verbose(`Profession deleted by id: ${id} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify({ message: 'Grade deleted successfully' });
    }
}
