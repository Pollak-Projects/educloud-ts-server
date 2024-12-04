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
        this.logger.log('Fetching all Modules');
        this.logger.verbose(`Fetching all modules by token: ${JSON.stringify(req.token)}`);

        const modules = await this.moduleRepository
            .find({
                relations: {
                    categories: true,
                    professions: true,
                    grades: true,
                },
            })
            .catch((error) => {
                this.logger.error(`Error fetching Modules by token ${JSON.stringify(req.token)}`, error);
                throw new HttpException(
                    {
                        message: 'Error fetching Modules!',
                        error: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            });
        if (modules.length === 0) {
            this.logger.verbose(`No Modules found by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'No Modules found!' }, HttpStatus.NO_CONTENT);
        }

        this.logger.verbose(`Fetched all Modules by token`);

        return JSON.stringify(modules);
    }

    async getModuleById(id: string, req: RequestUser): Promise<string> {
        this.logger.log(`Fetching Module with ID: ${id}`);
        this.logger.verbose(`Fetching Module with ID: ${id} by token ${JSON.stringify(req.token)}`);
        if (!id) {
            this.logger.verbose(`Missing required fields ${id} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const module = await this.moduleRepository
            .findOne({
                where: { id },
                relations: {
                    categories: true,
                    professions: true,
                    grades: true,
                },
            })
            .catch((error) => {
                this.logger.error(`Error fetching Module with ID: ${id} by token ${JSON.stringify(req.token)}`, error);
                throw new HttpException(
                    {
                        message: `Error fetching Module with ID: ${id}!`,
                        error: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            });

        if (!module) {
            this.logger.verbose(`Module with ID: ${id} not found by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: `Module with ID: ${id} not found!` }, HttpStatus.NOT_FOUND);
        }

        this.logger.verbose(`Fetched Module with ID: ${id} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(module);
    }

    async getModuleByName(name: string, req: RequestUser): Promise<string> {
        this.logger.log(`Fetching Module with name: ${name}`);
        this.logger.verbose(`Fetching Module with name: ${name} by token ${JSON.stringify(req.token)}`);
        if (!name) {
            this.logger.verbose(`Missing required fields ${name} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const module = await this.moduleRepository
            .findOne({
                where: { name },
                relations: {
                    categories: true,
                    professions: true,
                    grades: true,
                },
            })
            .catch((error) => {
                this.logger.error(`Error fetching Module with name: ${name} by token ${JSON.stringify(req.token)}`, error);
                throw new HttpException(
                    {
                        message: `Error fetching Module with name: ${name}!`,
                        error: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            });

        if (!module) {
            this.logger.verbose(`Module: ${module} with name: ${name} not found by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: `Module with name: ${name} not found!` }, HttpStatus.NOT_FOUND);
        }

        return JSON.stringify(module);
    }

    async getModuleByFilter(category: string, grade: string, profession: string, req: RequestUser): Promise<string> {
        this.logger.log(`Fetching Modules with filters: ${category}, ${grade}, ${profession}`);
        this.logger.verbose(`Fetching Modules with filters: ${category}, ${grade}, ${profession} by token ${JSON.stringify(req.token)}`);

        if (!category || !grade || !profession) {
            this.logger.verbose(`Missing required fields ${category}, ${grade}, ${profession} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const parameters: any = {
            categories: { id: category !== 'none' ? category : undefined },
            grades: { id: grade !== 'none' ? grade : undefined },
            professions: { id: profession !== 'none' ? profession : undefined },
        };

        const Modules = await this.moduleRepository
            .find({
                where: { ...parameters },
                relations: {
                    categories: true,
                    professions: true,
                    grades: true,
                },
            })
            .catch((error) => {
                this.logger.error(`Error fetching Modules with filters: ${category}, ${grade}, ${profession} by token ${JSON.stringify(req.token)}`, error);
                throw new HttpException(
                    {
                        message: 'Error fetching Modules with filters!',
                        error: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            });

        if (Modules.length === 0) {
            this.logger.verbose(`No Modules found matching the filters ${category}, ${grade}, ${profession} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'No Modules found matching the filters!' }, HttpStatus.NO_CONTENT);
        }

        this.logger.verbose(`Fetched Modules with filters: ${category}, ${grade}, ${profession} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(Modules);
    }
}
