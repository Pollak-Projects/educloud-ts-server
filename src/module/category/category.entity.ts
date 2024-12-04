import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subject } from './subject.entity';
import { Assignment } from './assignment.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    categoryName: string;

    @OneToMany(() => Subject, subject => subject.category)
    subjects: Subject[];

    @OneToMany(() => Assignment, assignment => assignment.category)
    assignments: Assignment[];
}