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
        private gradeRepository: Repository<Grade>
    ) {}

    async getAllGrades(): Promise<string> {
        const grades = await this.gradeRepository.find().catch((error) => {
            throw new HttpException(
                { message: 'Error fetching grades!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (grades.length === 0) {
            throw new HttpException(
                { message: 'No grades found!' },
                HttpStatus.NO_CONTENT,
            );
        }

        return JSON.stringify(grades);
    }

    async createGrade(gradeBody: GradeDto, req: RequestUser): Promise<string> {
        const newGrade = this.gradeRepository.create({
            gradeName: gradeBody.gradeName,
        });

        const savedGrade = await this.gradeRepository.save(newGrade).catch((error) => {
            throw new HttpException(
                { message: 'Error creating grade!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify(savedGrade);
    }
    
    async deleteGradeById(id: string, req: RequestUser): Promise<string> {
        if (!id) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const grade = await this.gradeRepository.findOne({ where: { id } }).catch((error) => {
            throw new HttpException(
                { message: 'Error fetching grade!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!grade) {
            throw new HttpException(
                { message: 'Grade not found!' },
                HttpStatus.NOT_FOUND,
            );
        }

        await this.gradeRepository.remove(grade).catch((error) => {
            throw new HttpException(
                { message: 'Error deleting grade!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify({ message: 'Grade deleted successfully' });
    }
}
