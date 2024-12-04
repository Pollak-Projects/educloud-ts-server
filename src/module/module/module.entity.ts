import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Profession } from './profession.entity';
import { TeacherSubject } from './teacher-subject.entity';

@Entity()
export class Subject {
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

    @ManyToOne(() => Category, category => category.subjects, { onDelete: 'CASCADE' })
    category: Category;

    @ManyToOne(() => Profession, profession => profession.subjects, { onDelete: 'CASCADE' })
    profession: Profession;

    @OneToMany(() => TeacherSubject, teacherSubject => teacherSubject.subject)
    teacherSubject: TeacherSubject[];
}