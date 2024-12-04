import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Profession } from './profession.entity';
import { TeacherAssignment } from './teacher-assignment.entity';

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

    @ManyToOne(() => Category, category => category.assignments, { onDelete: 'CASCADE' })
    category: Category;

    @ManyToOne(() => Profession, profession => profession.assignments, { onDelete: 'CASCADE' })
    profession: Profession;

    @OneToMany(() => TeacherAssignment, teacherAssignment => teacherAssignment.assignment)
    teacherAssignment: TeacherAssignment[];
}