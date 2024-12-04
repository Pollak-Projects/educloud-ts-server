import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { Profession } from '../profession/profession.entity';
import { Teacher } from '../teacher/teacher.entity';
import { Grade } from '../grade/grade.entity';

@Entity()
export class Assignment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    content?: string;

    @Column({ nullable: true })
    description?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => Category, (category) => category.assignments, {
        onDelete: 'CASCADE',
    })
    categories: Category[];

    @ManyToMany(() => Profession, (profession) => profession.assignments, {
        onDelete: 'CASCADE',
    })
    professions: Profession[];

    @ManyToMany(() => Teacher, (teacher) => teacher.assignments)
    teachers: Teacher[];

    @ManyToMany(() => Grade, (grade) => grade.assignments, {
        onDelete: 'CASCADE',
    })
    grades: Grade[];
}
