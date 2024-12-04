import { Module } from '@nestjs/common';
import { AdminGradeController } from './admin.grade.controller';
import { AdminGradeService } from './admin.grade.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from 'src/module/grade/grade.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Grade])],
    controllers: [AdminGradeController],
    providers: [AdminGradeService],
})
export class AdminGradeModule {}
