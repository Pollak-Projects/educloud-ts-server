import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
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
    grade?: string;

    @Column({ nullable: true })
    description?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    categoryId: string;

    @Column()
    professionId: string;

    @ManyToMany(() => Category, (category) => category.assignments, {
        onDelete: 'CASCADE',
    })
    categories: Category[];

    @ManyToMany(() => Profession, (profession) => profession.assignments, {
        onDelete: 'CASCADE',
    })
    professions: Profession[];

    @ManyToMany(() => Teacher, (teacher) => teacher.assignments)
    @JoinTable()
    teachers: Teacher[];

    @ManyToMany(() => Grade, (grade) => grade.assignments)
    grades: Grade[];
}
