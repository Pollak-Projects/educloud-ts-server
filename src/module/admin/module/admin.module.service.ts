import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from '../../module/module.entity';
import { Teacher } from 'src/module/teacher/teacher.entity';
import { ModuleDto } from './dto/module.dto';

@Injectable()
export class AdminModuleService {
    private readonly logger = new Logger(AdminModuleService.name);

    constructor(
        @InjectRepository(Module)
        private moduleRepository: Repository<Module>,
        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,
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

    async getAllModulesByTeacherId(id: string): Promise<string> {
        if (!id) {
            throw new HttpException(
                { message: 'Missing teacher ID!' },
                HttpStatus.BAD_REQUEST,
            );
        }
    
        const modules = await this.moduleRepository
            .createQueryBuilder('module')
            .innerJoin('module.teachers', 'teacher') 
            .where('teacher.id = :id', { id }) 
            .getMany()
            .catch((error) => {
                throw new HttpException(
                    { message: 'Error fetching modules for teacher!', error: error.message },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            });
    
        if (modules.length === 0) {
            throw new HttpException(
                { message: `No modules found for teacher with ID: ${id}` },
                HttpStatus.NO_CONTENT,
            );
        }
    
        return JSON.stringify(modules);
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

    async createModule(moduleBody: ModuleDto): Promise<string> {
        const teacherId = "asd"

        if (!teacherId) {
            throw new HttpException(
                { message: 'Teacher ID is missing in the token!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const teacher = await this.teacherRepository.findOne({ where: { id: teacherId } });
        if (!teacher) {
            throw new HttpException(
                { message: `Teacher with ID: ${teacherId} not found!` },
                HttpStatus.NOT_FOUND,
            );
        }

        const newModule = this.moduleRepository.create({
            ...moduleBody,
            teachers: [teacher],
        });

        const savedModule = await this.moduleRepository.save(newModule).catch((error) => {
            throw new HttpException(
                { message: 'Error creating module!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify(savedModule);
    }

    async updateModuleById(id: string, moduleBody: ModuleDto): Promise<string> {
        if(!id) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const module = await this.moduleRepository.findOneBy({ id }).catch((error) => {
            throw new HttpException(
                { message: `Error finding module with ID: ${id}!`, error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!module) {
            throw new HttpException(
                { message: `Module with ID: ${id} not found!` },
                HttpStatus.NOT_FOUND,
            );
        }

        Object.assign(module, moduleBody);

        const updatedModule = await this.moduleRepository.save(module).catch((error) => {
            throw new HttpException(
                { message: `Error updating module with ID: ${id}!`, error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify(updatedModule);
    }

    async deleteModuleById(id: string): Promise<string> {
        if(!id) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const module = await this.moduleRepository.findOneBy({ id }).catch((error) => {
            throw new HttpException(
                { message: `Error finding module with ID: ${id}!`, error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!module) {
            throw new HttpException(
                { message: `Module with ID: ${id} not found!` },
                HttpStatus.NOT_FOUND,
            );
        }

        await this.moduleRepository.remove(module).catch((error) => {
            throw new HttpException(
                { message: `Error deleting module with ID: ${id}!`, error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify({ message: `Module with ID: ${id} deleted successfully!` });
    }
}
