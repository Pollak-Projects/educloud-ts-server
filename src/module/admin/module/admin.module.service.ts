import { Injectable } from '@nestjs/common';
import { ModuleDto } from './dto/module.dto';

@Injectable()
export class AdminModuleService {
    getAllModules(): string {
        return 'Hello World!';
    }

    getModuleById(id: number): string {
        return 'Hello World!';
    }

    getModuleByName(name: string): string {
        return 'Hello World!';
    }

    getModuleByFilter(
        category: string,
        grade: string,
        profession: string,
    ): string {
        return 'Hello World!';
    }

    createModule(moduleBody: ModuleDto): string {
        return 'Hello World!';
    }

    updateModuleById(id: number, moduleBody: ModuleDto): string {
        return 'Hello World!';
    }

    deleteModuleById(id: number): string {
        return 'Hello World!';
    }
}
