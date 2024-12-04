import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subject } from './subject.entity';
import { Assignment } from './assignment.entity';

@Entity()
export class Profession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    professionName: string;

    @OneToMany(() => Subject, subject => subject.profession)
    subjects: Subject[];

    @OneToMany(() => Assignment, assignment => assignment.profession)
    assignments: Assignment[];
}