import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from './module.entity';
import { json } from 'stream/consumers';

@Injectable()
export class ModuleService {
    private readonly logger = new Logger(ModuleService.name);

    constructor(
        @InjectRepository(Module)
        private moduleRepository: Repository<Module>,
    ) {}

    async getAllModules(): Promise<string> {
        const Modules = await this.moduleRepository.find().catch((error) => {
            throw new HttpException(
                { message: 'Error fetching Modules!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });;

        if(Modules.length === 0) {
            throw new HttpException(
                { message: 'No modules found!' },
                HttpStatus.NO_CONTENT,
            );
        }

        return JSON.stringify(Modules);
    }

    async getModuleById(id: string): Promise<string> {
        if(!id) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const module = await this.moduleRepository.findOneBy({ id }).catch((error) => {
            throw new HttpException(
                { message: `Error fetching module with ID: ${id}!`, error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!module) {
            throw new HttpException(
                { message: `Module with ID: ${id} not found!` },
                HttpStatus.NOT_FOUND,
            );
        }

        return JSON.stringify(module);
    }

    async getModuleByName(name: string): Promise<string> {
        if(!name) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const module = await this.moduleRepository.findOneBy({ name }).catch((error) => {
            throw new HttpException(
                { message: `Error fetching module with name: ${name}!`, error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!module) {
            throw new HttpException(
                { message: `Module with name: ${name} not found!` },
                HttpStatus.NOT_FOUND,
            );
        }

        return JSON.stringify(module);
    }

    async getModuleByFilter(
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
    
        const modules = await this.moduleRepository.find({ where }).catch((error) => {
            throw new HttpException(
                { message: 'Error fetching modules with filters!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });
    
        if (modules.length === 0) {
            throw new HttpException(
                { message: 'No modules found matching the filters!' },
                HttpStatus.NO_CONTENT,
            );
        }
    
        return JSON.stringify(modules);
    }
}
