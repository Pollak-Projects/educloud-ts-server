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
        private professionRepository: Repository<Profession>,
    ) {}

    async getAllProfessions(req: RequestUser): Promise<string> {
        this.logger.log('Fetching all Professions');
        this.logger.verbose(`Fetching all Professions by token: ${JSON.stringify(req.token)}`);

        const professions = await this.professionRepository.find().catch((error) => {
            this.logger.error(`Error fetching Professions by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error fetching professions!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (professions.length === 0) {
            this.logger.verbose(`No Professions found by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'No professions found!' }, HttpStatus.NO_CONTENT);
        }

        this.logger.verbose(`Fetched all Professions by token`);

        return JSON.stringify(professions);
    }

    async createProfession(professionBody: ProfessionDto, req: RequestUser): Promise<string> {
        this.logger.log(`Creating profession ${JSON.stringify(professionBody)}`);
        this.logger.verbose(`Creating profession ${JSON.stringify(professionBody)} by token ${JSON.stringify(req.token)}`);

        const newProfession = this.professionRepository.create({
            professionName: professionBody.professionName,
        });

        const savedProfession = await this.professionRepository.save(newProfession).catch((error) => {
            this.logger.error(`Error creating profession by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error creating profession!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        this.logger.verbose(`Profession created: ${JSON.stringify(professionBody)} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify(savedProfession);
    }

    async deleteProfessionById(id: string, req: RequestUser): Promise<string> {
        this.logger.log(`Deleting profession by id: ${id}`);
        this.logger.verbose(`Deleting profession by id: ${id} by token ${JSON.stringify(req.token)}`);

        if (!id) {
            this.logger.error(`Missing required fields id: ${id} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Missing required fields!' }, HttpStatus.BAD_REQUEST);
        }

        const profession = await this.professionRepository.findOne({ where: { id } }).catch((error) => {
            this.logger.error(`Error fetching professions by id: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error fetching profession!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!profession) {
            this.logger.error(`Profession not found by id: ${id} by token ${JSON.stringify(req.token)}`);
            throw new HttpException({ message: 'Profession not found!' }, HttpStatus.NOT_FOUND);
        }

        await this.professionRepository.remove(profession).catch((error) => {
            this.logger.error(`Error deleting profession by id: ${id} by token ${JSON.stringify(req.token)}`, error);
            throw new HttpException({ message: 'Error deleting profession!', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        this.logger.verbose(`Profession deleted by id: ${id} by token ${JSON.stringify(req.token)}`);

        return JSON.stringify({ message: 'Profession deleted successfully' });
    }
}
