import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from '../../module/module.entity';
import { Teacher } from 'src/module/teacher/teacher.entity';
import { ModuleDto } from './dto/module.dto';
import { RequestUser } from 'express';
import { Grade } from '../../grade/grade.entity';
import { Profession } from '../../profession/profession.entity';
import { Category } from '../../category/category.entity';

@Injectable()
export class AdminModuleService {
    private readonly logger = new Logger(AdminModuleService.name);

    constructor(
        @InjectRepository(Module)
        private moduleRepository: Repository<Module>,
        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,
        @InjectRepository(Grade)
        private gradeRepository: Repository<Grade>,
        @InjectRepository(Profession)
        private professionRepository: Repository<Profession>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    async getAllModules(req: RequestUser): Promise<string> {
        this.logger.log('Fetching all modules');
        const where = await this.getTeacherModules(req);
        const modules = await this.moduleRepository
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
                this.logger.error('Error fetching modules', error);
                throw new HttpException(
                    {
                        message: 'Error fetching Modules!',
                        error: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            });

        if (modules.length === 0) {
            throw new HttpException({ message: 'No modules found!' }, HttpStatus.NO_CONTENT);
        }

        return JSON.stringify(modules);
    }

    async getModuleById(id: string, req: RequestUser): Promise<string> {
        if (!id) {
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const teacherModules = await this.getTeacherModules(req);

        const module = await this.moduleRepository
            .findOne({
                where: {
                    teachers: teacherModules,
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
                        message: `Error fetching module with ID: ${id}!`,
                        error: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            });

        if (!module) {
            throw new HttpException({ message: `Module with ID: ${id} not found!` }, HttpStatus.NOT_FOUND);
        }

        return JSON.stringify(module);
    }

    async getModuleByName(name: string, req: RequestUser): Promise<string> {
        if (!name) {
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const teacherModules = await this.getTeacherModules(req);

        const module = await this.moduleRepository
            .findOne({
                where: {
                    teachers: teacherModules,
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
                        message: `Error fetching module with name: ${name}!`,
                        error: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            });

        if (!module) {
            throw new HttpException({ message: `Module with name: ${name} not found!` }, HttpStatus.NOT_FOUND);
        }

        return JSON.stringify(module);
    }

    async getModuleByFilter(category: string, grade: string, profession: string, req: RequestUser): Promise<string> {
        if (!category || !grade || !profession) {
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const parameters: any = {
            categories: { id: category !== 'none' ? category : undefined },
            grades: { id: grade !== 'none' ? grade : undefined },
            professions: { id: profession !== 'none' ? profession : undefined },
        };

        const teacherModules = await this.getTeacherModules(req);

        const modules = await this.moduleRepository
            .find({
                where: { teachers: teacherModules, ...parameters },
                relations: {
                    categories: true,
                    professions: true,
                    grades: true,
                },
            })
            .catch((error) => {
                throw new HttpException(
                    {
                        message: 'Error fetching modules with filters!',
                        error: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            });

        if (modules.length === 0) {
            throw new HttpException({ message: 'No modules found matching the filters!' }, HttpStatus.NO_CONTENT);
        }

        return JSON.stringify(modules);
    }

    async createModule(moduleBody: ModuleDto, req: RequestUser): Promise<string> {
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

        const grade = await this.gradeRepository.findOneByOrFail({ id: moduleBody.gradeId }).catch((e) => {
            this.logger.error(`Error finding grade ${moduleBody.gradeId}`, e);
            throw new HttpException(`Error finding grade ${moduleBody.gradeId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });
        const profession = await this.professionRepository.findOneByOrFail({ id: moduleBody.professionId }).catch((e) => {
            this.logger.error(`Error finding profession ${moduleBody.professionId}`, e);
            throw new HttpException(`Error finding profession ${moduleBody.professionId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });
        const category = await this.categoryRepository.findOneByOrFail({ id: moduleBody.categoryId }).catch((e) => {
            this.logger.error(`Error finding category ${moduleBody.categoryId}`, e);
            throw new HttpException(`Error finding category ${moduleBody.categoryId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        const newModule = this.moduleRepository.create({
            content: moduleBody.content,
            description: moduleBody.description,
            name: moduleBody.name,
        });

        newModule.teachers = [teacher];
        newModule.categories = [category];
        newModule.professions = [profession];
        newModule.grades = [grade];

        const savedModule = await this.moduleRepository.save(newModule).catch((error) => {
            throw new HttpException(
                {
                    message: 'Error creating module!',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify(savedModule);
    }

    async updateModuleById(id: string, moduleBody: ModuleDto, req: RequestUser): Promise<string> {
        if (!id) {
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const module = await this.moduleRepository.findOneByOrFail({ id }).catch((error) => {
            this.logger.error(`Error finding module ${id}`, error);
            throw new HttpException(`Error finding module ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        const grade = await this.gradeRepository.findOneByOrFail({ id: moduleBody.gradeId }).catch((e) => {
            this.logger.error(`Error finding grade ${moduleBody.gradeId}`, e);
            throw new HttpException(`Error finding grade ${moduleBody.gradeId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        const profession = await this.professionRepository.findOneByOrFail({ id: moduleBody.professionId }).catch((e) => {
            this.logger.error(`Error finding profession ${moduleBody.professionId}`, e);
            throw new HttpException(`Error finding profession ${moduleBody.professionId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        const category = await this.categoryRepository.findOneByOrFail({ id: moduleBody.categoryId }).catch((e) => {
            this.logger.error(`Error finding category ${moduleBody.categoryId}`, e);
            throw new HttpException(`Error finding category ${moduleBody.categoryId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        const newEntity = this.moduleRepository.create({
            content: moduleBody.content,
            description: moduleBody.description,
            name: moduleBody.name,
        });

        newEntity.categories = [category];
        newEntity.professions = [profession];
        newEntity.grades = [grade];

        const saveEntity = this.moduleRepository.merge(module, newEntity);

        const updatedModule = await this.moduleRepository.save(saveEntity).catch((error) => {
            this.logger.error(`Error updating module ${id}`, error);
            throw new HttpException(`Error updating module ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        return JSON.stringify(updatedModule);
    }

    async deleteModuleById(id: string, req: RequestUser): Promise<string> {
        if (!id) {
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const module = await this.moduleRepository.findOne({ where: { id } }).catch((error) => {
            throw new HttpException(
                {
                    message: `Error finding module!`,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!module) {
            throw new HttpException({ message: `Module with ID: ${id} not found!` }, HttpStatus.NOT_FOUND);
        }

        await this.moduleRepository.remove(module).catch((error) => {
            throw new HttpException(
                {
                    message: `Error deleting module!`,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify({ message: `Module with ID: ${id} deleted successfully!` });
    }

    private async getTeacherModules(req: RequestUser) {
        const teacherId = req.token.teacherId;

        if (!teacherId) {
            this.logger.error(`Teacher ID is missing in the token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Teacher ID is missing in the token!' }, HttpStatus.BAD_REQUEST);
        }

        const teachers = await this.teacherRepository
            .createQueryBuilder('teacher')
            .leftJoinAndSelect('teacher.modules', 'module')
            .where('teacher.id = :teacherId', { teacherId })
            .select('module.id')
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
