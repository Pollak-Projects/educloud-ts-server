import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from '../../module/module.entity';
import { Teacher } from 'src/module/teacher/teacher.entity';
import { ModuleDto } from './dto/module.dto';
import { RequestUser } from 'express';

@Injectable()
export class AdminModuleService {
    private readonly logger = new Logger(AdminModuleService.name);

    constructor(
        @InjectRepository(Module)
        private moduleRepository: Repository<Module>,
        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,
    ) {}

    async getAllModules(req: RequestUser): Promise<string> {
        this.logger.log('Fetching all modules');
        this.logger.verbose(`Fetching all modules by token: ${JSON.stringify(req)}`);
        const Modules = await this.moduleRepository.find().catch((error) => {
            this.logger.error(`Error fetching modules by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException(
                {
                    message: 'Error fetching Modules!',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });
        if (Modules.length === 0) {
            this.logger.log('No modules found');
            throw new HttpException({ message: 'No modules found!' }, HttpStatus.NO_CONTENT);
        }

        this.logger.verbose('Modules fetched successfully');

        return JSON.stringify(Modules);
    }

    async getAllModulesByTeacherId(id: string, req: RequestUser): Promise<string> {
        this.logger.log(`Fetching all modules by teacher ID: ${id}`);
        this.logger.verbose(`Fetching all modules by teacher ID: ${id} by token: ${JSON.stringify(req.token)}`);
        if (!id) {
            this.logger.error(`Missing teacher ID: ${id}`);
            throw new HttpException({ message: 'Missing teacher ID!' }, HttpStatus.BAD_REQUEST);
        }

        const modules = await this.moduleRepository
            .createQueryBuilder('module')
            .innerJoin('module.teachers', 'teacher')
            .where('teacher.id = :id', { id })
            .getMany()
            .catch((error) => {
                this.logger.error(`Error fetching modules for teacher with ID: ${id} by token ${JSON.stringify(req.token)}`, error);
                throw new HttpException(
                    {
                        message: 'Error fetching modules for teacher!',
                        error: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            });

        if (modules.length === 0) {
            this.logger.log(`No modules found for teacher with ID: ${id}`);
            throw new HttpException({ message: `No modules found for teacher with ID: ${id}` }, HttpStatus.NO_CONTENT);
        }

        this.logger.verbose(`Modules fetched successfully for teacher with ID: ${id}`);

        return JSON.stringify(modules);
    }

    async getModuleById(id: string, req: RequestUser): Promise<string> {
        if (!id) {
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const module = await this.moduleRepository.findOneBy({ id }).catch((error) => {
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
        this.logger.log(`Fetching module by name: ${name}`);
        this.logger.verbose(`Fetching module by name: ${name} by token: ${JSON.stringify(req.token)}`);
        if (!name) {
            this.logger.error(`Missing module name: ${name}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const module = await this.moduleRepository.findOneBy({ name }).catch((error) => {
            this.logger.error(`Error fetching module with name: ${name} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException(
                {
                    message: `Error fetching module with name: ${name}!`,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!module) {
            this.logger.log(`Module with name: ${name} not found`);
            throw new HttpException({ message: `Module with name: ${name} not found!` }, HttpStatus.NOT_FOUND);
        }

        this.logger.verbose(`Module with name: ${name} fetched successfully by token: ${JSON.stringify(req.token)}`);

        return JSON.stringify(module);
    }

    async getModuleByFilter(category: string, grade: string, profession: string, req: RequestUser): Promise<string> {
        this.logger.log(`Fetching module by filter: ${category}, ${grade}, ${profession}`);
        this.logger.verbose(`Fetching module by filter: ${category}, ${grade}, ${profession} by token: ${JSON.stringify(req.token)}`);
        if (!category || !grade || !profession) {
            this.logger.error(`Missing required fields: ${category}, ${grade}, ${profession}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const where: any = {};

        if (category !== 'none') where.category = category;
        if (grade !== 'none') where.grade = grade;
        if (profession !== 'none') where.profession = profession;

        const modules = await this.moduleRepository.find({ where }).catch((error) => {
            this.logger.error(`Error fetching modules with filters: ${category}, ${grade}, ${profession} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException(
                {
                    message: 'Error fetching modules with filters!',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (modules.length === 0) {
            this.logger.log('No modules found matching the filters');
            throw new HttpException({ message: 'No modules found matching the filters!' }, HttpStatus.NO_CONTENT);
        }

        this.logger.verbose(`Modules fetched successfully with filters: ${category}, ${grade}, ${profession} by token: ${JSON.stringify(req.token)}`);

        return JSON.stringify(modules);
    }

    async createModule(moduleBody: ModuleDto, req: RequestUser): Promise<string> {
        this.logger.log('Creating module');
        this.logger.verbose(`Creating module: ${JSON.stringify(moduleBody)} by token: ${JSON.stringify(req.token)}`);
        const teacherId = req.token.teacherId;

        if (!teacherId) {
            this.logger.error(`Teacher ID is missing in the token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Teacher ID is missing in the token!' }, HttpStatus.BAD_REQUEST);
        }

        const teacher = await this.teacherRepository.findOne({ where: { id: teacherId } }).catch((error) => {
            this.logger.error(`Error finding teacher with ID: ${teacherId} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException(
                {
                    message: `Error finding teacher with ID: ${teacherId}!`,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!teacher) {
            this.logger.error(`Teacher with ID: ${teacherId} not found`);
            throw new HttpException({ message: `Teacher with ID: ${teacherId} not found!` }, HttpStatus.NOT_FOUND);
        }

        const newModule = this.moduleRepository.create({
            ...moduleBody,
            teachers: [teacher],
        });

        const savedModule = await this.moduleRepository.save(newModule).catch((error) => {
            this.logger.error(`Error creating module: ${JSON.stringify(moduleBody)} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException(
                {
                    message: 'Error creating module!',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        this.logger.verbose(`Module created successfully: ${JSON.stringify(savedModule)} by token: ${JSON.stringify(req.token)}`);

        return JSON.stringify(savedModule);
    }

    async updateModuleById(id: string, moduleBody: ModuleDto, req: RequestUser): Promise<string> {
        this.logger.log(`Updating module with ID: ${id}`);
        this.logger.verbose(`Updating module with ID: ${id} by token: ${JSON.stringify(req.token)}`);
        if (!id) {
            this.logger.error('Missing required fields');
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const module = await this.moduleRepository.findOneBy({ id }).catch((error) => {
            this.logger.error(`Error finding module with ID: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException(
                {
                    message: `Error finding module with ID: ${id}!`,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!module) {
            this.logger.error(`Module with ID: ${id} not found`);
            throw new HttpException({ message: `Module with ID: ${id} not found!` }, HttpStatus.NOT_FOUND);
        }

        Object.assign(module, moduleBody);

        const updatedModule = await this.moduleRepository.save(module).catch((error) => {
            this.logger.error(`Error updating module with ID: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException(
                {
                    message: `Error updating module with ID: ${id}!`,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        this.logger.verbose(`Module with ID: ${id} updated successfully by token: ${JSON.stringify(req.token)}`);

        return JSON.stringify(updatedModule);
    }

    async deleteModuleById(id: string, req: RequestUser): Promise<string> {
        this.logger.log(`Deleting module with ID: ${id}`);
        this.logger.verbose(`Deleting module with ID: ${id} by token: ${JSON.stringify(req.token)}`);

        if (!id) {
            this.logger.error(`Missing required fields: ${id}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const module = await this.moduleRepository.findOneBy({ id }).catch((error) => {
            this.logger.error(`Error finding module with ID: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException(
                {
                    message: `Error finding module with ID: ${id}!`,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!module) {
            this.logger.error(`Module: ${JSON.stringify(module)} with ID: ${id} not found by token: ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: `Module with ID: ${id} not found!` }, HttpStatus.NOT_FOUND);
        }

        await this.moduleRepository.remove(module).catch((error) => {
            this.logger.error(`Error deleting module with ID: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException(
                {
                    message: `Error deleting module with ID: ${id}!`,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        this.logger.verbose(`Module with ID: ${id} deleted successfully by token: ${JSON.stringify(req.token)}`);

        return JSON.stringify({ message: `Module with ID: ${id} deleted successfully!` });
    }
}
