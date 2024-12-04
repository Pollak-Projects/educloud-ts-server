import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from '../../assignment/assignment.entity';
import { AssignmentDto } from './dto/assignment.dto';
import { RequestUser } from 'express';
import { Grade } from '../../grade/grade.entity';
import { Profession } from '../../profession/profession.entity';
import { Category } from '../../category/category.entity';
import { Teacher } from '../../teacher/teacher.entity';

@Injectable()
export class AdminAssignmentService {
    private readonly logger = new Logger(AdminAssignmentService.name);

    constructor(
        @InjectRepository(Assignment)
        private assignmentRepository: Repository<Assignment>,
        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,
        @InjectRepository(Grade)
        private gradeRepository: Repository<Grade>,
        @InjectRepository(Profession)
        private professionRepository: Repository<Profession>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    async getAllAssignments(req: RequestUser): Promise<string> {
        this.logger.log('Fetching all assignments');
        const where = await this.getTeacherAssignments(req);
        const assignments = await this.assignmentRepository
            .find({
                where: {
                    teachers: where,
                },
                relations: {
                    categories: true,
                    professions: true,
                    grades: true,
                },
            })
            .catch((error) => {
                this.logger.error('Error fetching assignments', error);
                throw new HttpException(
                    {
                        message: 'Error fetching Assignments!',
                        error: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
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

        const teacherAssignments = await this.getTeacherAssignments(req);

        const assignment = await this.assignmentRepository
            .findOne({
                where: {
                    teachers: teacherAssignments,
                    id,
                },
                relations: {
                    categories: true,
                    professions: true,
                    grades: true,
                },
            })
            .catch((error) => {
                throw new HttpException(
                    {
                        message: `Error fetching assignment with ID: ${id}!`,
                        error: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
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

        const teacherAssignments = await this.getTeacherAssignments(req);

        const assignment = await this.assignmentRepository
            .findOne({
                where: {
                    teachers: teacherAssignments,
                    name,
                },
                relations: {
                    categories: true,
                    professions: true,
                    grades: true,
                },
            })
            .catch((error) => {
                throw new HttpException(
                    {
                        message: `Error fetching assignment with name: ${name}!`,
                        error: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
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

        const parameters: any = {
            categories: { id: category !== 'none' ? category : undefined },
            grades: { id: grade !== 'none' ? grade : undefined },
            professions: { id: profession !== 'none' ? profession : undefined },
        };

        const teacherAssignments = await this.getTeacherAssignments(req);

        const assignments = await this.assignmentRepository
            .find({
                where: { teachers: teacherAssignments, ...parameters },
                relations: {
                    categories: true,
                    professions: true,
                    grades: true,
                },
            })
            .catch((error) => {
                throw new HttpException(
                    {
                        message: 'Error fetching assignments with filters!',
                        error: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            });

        if (assignments.length === 0) {
            throw new HttpException({ message: 'No assignments found matching the filters!' }, HttpStatus.NO_CONTENT);
        }

        return JSON.stringify(assignments);
    }

    async createAssignment(assignmentBody: AssignmentDto, req: RequestUser): Promise<string> {
        const teacherId = req.token.teacherId;

        if (!teacherId) {
            throw new HttpException({ message: 'Teacher ID is missing in the token!' }, HttpStatus.BAD_REQUEST);
        }

        const teacher = await this.teacherRepository.findOneOrFail({ where: { id: teacherId } }).catch((error) => {
            throw new HttpException(
                {
                    message: 'Error finding teacher!',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        const grade = await this.gradeRepository.findOneByOrFail({ id: assignmentBody.gradeId }).catch((e) => {
            this.logger.error(`Error finding grade ${assignmentBody.gradeId}`, e);
            throw new HttpException(`Error finding grade ${assignmentBody.gradeId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });
        const profession = await this.professionRepository.findOneByOrFail({ id: assignmentBody.professionId }).catch((e) => {
            this.logger.error(`Error finding profession ${assignmentBody.professionId}`, e);
            throw new HttpException(`Error finding profession ${assignmentBody.professionId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });
        const category = await this.categoryRepository.findOneByOrFail({ id: assignmentBody.categoryId }).catch((e) => {
            this.logger.error(`Error finding category ${assignmentBody.categoryId}`, e);
            throw new HttpException(`Error finding category ${assignmentBody.categoryId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        const newAssignment = this.assignmentRepository.create({
            content: assignmentBody.content,
            description: assignmentBody.description,
            name: assignmentBody.name,
        });

        newAssignment.teachers = [teacher];
        newAssignment.categories = [category];
        newAssignment.professions = [profession];
        newAssignment.grades = [grade];

        const savedAssignment = await this.assignmentRepository.save(newAssignment).catch((error) => {
            throw new HttpException(
                {
                    message: 'Error creating assignment!',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify(savedAssignment);
    }

    async updateAssignmentById(id: string, assignmentBody: AssignmentDto, req: RequestUser): Promise<string> {
        if (!id) {
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const assignment = await this.assignmentRepository.findOneByOrFail({ id }).catch((error) => {
            this.logger.error(`Error finding assignment ${id}`, error);
            throw new HttpException(`Error finding assignment ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        const grade = await this.gradeRepository.findOneByOrFail({ id: assignmentBody.gradeId }).catch((e) => {
            this.logger.error(`Error finding grade ${assignmentBody.gradeId}`, e);
            throw new HttpException(`Error finding grade ${assignmentBody.gradeId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        const profession = await this.professionRepository.findOneByOrFail({ id: assignmentBody.professionId }).catch((e) => {
            this.logger.error(`Error finding profession ${assignmentBody.professionId}`, e);
            throw new HttpException(`Error finding profession ${assignmentBody.professionId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        const category = await this.categoryRepository.findOneByOrFail({ id: assignmentBody.categoryId }).catch((e) => {
            this.logger.error(`Error finding category ${assignmentBody.categoryId}`, e);
            throw new HttpException(`Error finding category ${assignmentBody.categoryId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        const newEntity = this.assignmentRepository.create({
            content: assignmentBody.content,
            description: assignmentBody.description,
            name: assignmentBody.name,
        });

        newEntity.categories = [category];
        newEntity.professions = [profession];
        newEntity.grades = [grade];

        const saveEntity = this.assignmentRepository.merge(assignment, newEntity);

        const updatedAssignment = await this.assignmentRepository.save(saveEntity).catch((error) => {
            this.logger.error(`Error updating assignment ${id}`, error);
            throw new HttpException(`Error updating assignment ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        return JSON.stringify(updatedAssignment);
    }

    async deleteAssignmentById(id: string, req: RequestUser): Promise<string> {
        if (!id) {
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const assignment = await this.assignmentRepository.findOne({ where: { id } }).catch((error) => {
            throw new HttpException(
                {
                    message: `Error finding assignment!`,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!assignment) {
            throw new HttpException({ message: `Assignment with ID: ${id} not found!` }, HttpStatus.NOT_FOUND);
        }

        await this.assignmentRepository.remove(assignment).catch((error) => {
            throw new HttpException(
                {
                    message: `Error deleting assignment!`,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify({ message: `Assignment with ID: ${id} deleted successfully!` });
    }

    private async getTeacherAssignments(req: RequestUser) {
        const teacherId = req.token.teacherId;

        if (!teacherId) {
            this.logger.error(`Teacher ID is missing in the token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Teacher ID is missing in the token!' }, HttpStatus.BAD_REQUEST);
        }

        const teachers = await this.teacherRepository
            .createQueryBuilder('teacher')
            .leftJoinAndSelect('teacher.assignments', 'assignment')
            .where('teacher.id = :teacherId', { teacherId })
            .select('assignment.id')
            .getMany()
            .catch((e) => {
                this.logger.error(`Error finding teacher ${teacherId} with token ${JSON.stringify(req.token)}`, e);
                throw new HttpException(
                    {
                        message: `Error finding teacher ${teacherId}`,
                        error: e.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            });

        return teachers;
    }
}
