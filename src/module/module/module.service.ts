import { Injectable } from '@nestjs/common';

@Injectable()
export class ModuleService {
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
}
