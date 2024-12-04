import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subject } from './subject.entity';
import { Assignment } from './assignment.entity';

@Entity()
export class Grade {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    gradeName: string;

    @OneToMany(() => Subject, subject => subject.grade)
    subjects: Subject[];

    @OneToMany(() => Assignment, assignment => assignment.grade)
    assignments: Assignment[];
}