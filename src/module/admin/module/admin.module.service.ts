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

    private async getTeacherModules(req: RequestUser, where: any = {}) {
        const teacherId = req.token.teacherId;

        if (!teacherId) {
            this.logger.error('Teacher ID is missing in the token');
            throw new HttpException({ message: 'Teacher ID is missing in the token!' }, HttpStatus.BAD_REQUEST);
        }

        where['teacherId'] = teacherId;

        return where;
    }

    async getAllModules(req: RequestUser): Promise<string> {
        this.logger.log('Fetching all modules');
        const where = await this.getTeacherModules(req, {});
        const modules = await this.moduleRepository.find({ where }).catch((error) => {
            this.logger.error('Error fetching modules', error);
            throw new HttpException({ message: 'Error fetching Modules!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
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

        const where = await this.getTeacherModules(req, { id });

        const module = await this.moduleRepository.findOne({ where }).catch((error) => {
            throw new HttpException({ message: `Error fetching module with ID: ${id}!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
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

        const where = await this.getTeacherModules(req, { name });

        const module = await this.moduleRepository.findOne({ where }).catch((error) => {
            throw new HttpException({ message: `Error fetching module with name: ${name}!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
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

        const where: any = {
            category: category !== 'none' ? category : undefined,
            grade: grade !== 'none' ? grade : undefined,
            profession: profession !== 'none' ? profession : undefined,
        };

        const filteredWhere = await this.getTeacherModules(req, where);

        const modules = await this.moduleRepository.find({ where: filteredWhere }).catch((error) => {
            throw new HttpException({ message: 'Error fetching modules with filters!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
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

        const teacher = await this.teacherRepository.findOne({ where: { id: teacherId } }).catch((error) => {
            throw new HttpException({ message: 'Error finding teacher!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!teacher) {
            throw new HttpException({ message: `Teacher with ID: ${teacherId} not found!` }, HttpStatus.NOT_FOUND);
        }

        const newModule = this.moduleRepository.create({
            ...moduleBody,
            teachers: [teacher],
        });

        const savedModule = await this.moduleRepository.save(newModule).catch((error) => {
            throw new HttpException({ message: 'Error creating module!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        return JSON.stringify(savedModule);
    }

    async updateModuleById(id: string, moduleBody: ModuleDto, req: RequestUser): Promise<string> {
        if (!id) {
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const module = await this.moduleRepository.findOne({ where: { id } }).catch((error) => {
            throw new HttpException({ message: `Error finding module!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!module) {
            throw new HttpException({ message: `Module with ID: ${id} not found!` }, HttpStatus.NOT_FOUND);
        }

        Object.assign(module, moduleBody);

        const updatedModule = await this.moduleRepository.save(module).catch((error) => {
            throw new HttpException({ message: `Error updating module!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        return JSON.stringify(updatedModule);
    }

    async deleteModuleById(id: string, req: RequestUser): Promise<string> {
        if (!id) {
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const module = await this.moduleRepository.findOne({ where: { id } }).catch((error) => {
            throw new HttpException({ message: `Error finding module!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!module) {
            throw new HttpException({ message: `Module with ID: ${id} not found!` }, HttpStatus.NOT_FOUND);
        }

        await this.moduleRepository.remove(module).catch((error) => {
            throw new HttpException({ message: `Error deleting module!`, error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        return JSON.stringify({ message: `Module with ID: ${id} deleted successfully!` });
    }
}
