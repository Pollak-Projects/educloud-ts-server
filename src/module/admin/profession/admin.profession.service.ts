import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestUser } from 'express';
import { Profession } from 'src/module/profession/profession.entity';
import { ProfessionDto } from './dto/profession.dto';

@Injectable()
export class AdminProfessionService {
    private readonly logger = new Logger(AdminProfessionService.name);

    constructor(
        @InjectRepository(Profession)
        private professionRepository: Repository<Profession>
    ) {}

    async getAllProfessions(req: RequestUser): Promise<string> {
        const professions = await this.professionRepository.find().catch((error) => {
            throw new HttpException(
                { message: 'Error fetching professions!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (professions.length === 0) {
            throw new HttpException(
                { message: 'No professions found!' },
                HttpStatus.NO_CONTENT,
            );
        }

        return JSON.stringify(professions);
    }

    async createProfession(professionBody: ProfessionDto, req: RequestUser): Promise<string> {
        const newProfession = this.professionRepository.create({
            professionName: professionBody.professionName,
        });

        const savedProfession = await this.professionRepository.save(newProfession).catch((error) => {
            throw new HttpException(
                { message: 'Error creating profession!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify(savedProfession);
    }
    
    async deleteProfessionById(id: string, req: RequestUser): Promise<string> {
        if (!id) {
            throw new HttpException(
                { message: 'Missing required fields!' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const profession = await this.professionRepository.findOne({ where: { id } }).catch((error) => {
            throw new HttpException(
                { message: 'Error fetching profession!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        if (!profession) {
            throw new HttpException(
                { message: 'Profession not found!' },
                HttpStatus.NOT_FOUND,
            );
        }

        await this.professionRepository.remove(profession).catch((error) => {
            throw new HttpException(
                { message: 'Error deleting profession!', error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        });

        return JSON.stringify({ message: 'Profession deleted successfully' });
    }
}
