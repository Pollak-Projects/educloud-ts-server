import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinTable,
    ManyToMany,
} from 'typeorm';
import { Module } from '../module/module.entity';
import { Assignment } from '../assignment/assignment.entity';

@Entity()
export class Grade {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    gradeName: string;

    @ManyToMany(() => Module, (module) => module.grades)
    @JoinTable()
    modules: Module[];

    @ManyToMany(() => Assignment, (assignment) => assignment.grades)
    @JoinTable()
    assignments: Assignment[];
}
