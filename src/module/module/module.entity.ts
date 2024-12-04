import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { Profession } from '../profession/profession.entity';
import { Teacher } from '../teacher/teacher.entity';
import { Grade } from '../grade/grade.entity';

@Entity()
export class Module {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    content?: string;

    @Column({ nullable: true })
    grade?: string;

    @Column({ nullable: true })
    description?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => Category, (category) => category.modules, {
        onDelete: 'CASCADE',
    })
    categories: Category[];

    @ManyToMany(() => Profession, (profession) => profession.modules, {
        onDelete: 'CASCADE',
    })
    professions: Profession[];

    @ManyToMany(() => Teacher, (teacher) => teacher.modules)
    teachers: Teacher[];

    @ManyToMany(() => Grade, (grade) => grade.modules, {
        onDelete: 'CASCADE',
    })
    grades: Grade[];
}
