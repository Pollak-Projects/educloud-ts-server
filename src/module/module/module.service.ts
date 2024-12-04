import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from './module.entity';
import { RequestUser } from 'express';

@Injectable()
export class ModuleService {
    private readonly logger = new Logger(ModuleService.name);

    constructor(
        @InjectRepository(Module)
        private moduleRepository: Repository<Module>,
    ) {}

    async getAllModules(req: RequestUser): Promise<string> {
        this.logger.log('Fetching all modules');
        this.logger.verbose(`Fetching all modules by token ${JSON.stringify(req.token)}`);
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
            this.logger.error(`No modules: ${JSON.stringify(Modules)} found by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'No modules found!' }, HttpStatus.NO_CONTENT);
        }

        this.logger.verbose(`Fetched all modules by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(Modules);
    }

    async getModuleById(id: string, req: RequestUser): Promise<string> {
        this.logger.log(`Fetching module with ID: ${id}`);
        this.logger.verbose(`Fetching module with ID: ${id} by token ${JSON.stringify(req.token)}`);
        if (!id) {
            this.logger.error(`Missing required fields id: ${id} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const module = await this.moduleRepository.findOneBy({ id }).catch((error) => {
            this.logger.error(`Error fetching module with ID: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException(
                {
                    message: `Error fetching module with ID: ${id}!`,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!module) {
            this.logger.error(`Module: ${module} with ID: ${id} not found by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: `Module with ID: ${id} not found!` }, HttpStatus.NOT_FOUND);
        }

        this.logger.verbose(`Fetched module with ID: ${id} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(module);
    }

    async getModuleByName(name: string, req: RequestUser): Promise<string> {
        this.logger.log(`Fetching module with name: ${name}`);
        this.logger.verbose(`Fetching module with name: ${name} by token ${JSON.stringify(req.token)}`);

        if (!name) {
            this.logger.error(`Missing required fields name: ${name} by token ${JSON.stringify(req.token)}`);
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
            this.logger.error(`Module: ${module} with name: ${name} not found by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: `Module with name: ${name} not found!` }, HttpStatus.NOT_FOUND);
        }

        this.logger.verbose(`Fetched module with name: ${name} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(module);
    }

    async getModuleByFilter(category: string, grade: string, profession: string, req: RequestUser): Promise<string> {
        this.logger.log(`Fetching modules with filters category: ${category}, grade: ${grade}, profession: ${profession}`);
        this.logger.verbose(
            `Fetching modules with filters category: ${category}, grade: ${grade}, profession: ${profession} by token ${JSON.stringify(req.token)}`,
        );

        if (!category || !grade || !profession) {
            this.logger.error(
                `Missing required fields category: ${category}, grade: ${grade}, profession: ${profession} by token ${JSON.stringify(req.token)}`,
            );
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const where: any = {};

        if (category !== 'none') where.category = category;
        if (grade !== 'none') where.grade = grade;
        if (profession !== 'none') where.profession = profession;

        const modules = await this.moduleRepository.find({ where }).catch((error) => {
            this.logger.error(
                `Error fetching modules with filters category: ${category}, grade: ${grade}, profession: ${profession} by token ${JSON.stringify(req.token)}`,
                error,
            );
            throw new HttpException(
                {
                    message: 'Error fetching modules with filters!',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (modules.length === 0) {
            this.logger.error(`No modules found matching the filters: ${JSON.stringify(where)} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'No modules found matching the filters!' }, HttpStatus.NO_CONTENT);
        }

        this.logger.verbose(
            `Fetched modules with filters category: ${category}, grade: ${grade}, profession: ${profession} by token ${JSON.stringify(req.token)}`,
        );

        return JSON.stringify(modules);
    }
}
