import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Module } from '../module/module.entity';
import { Assignment } from '../assignment/assignment.entity';

@Entity()
export class Profession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    professionName: string;

    @ManyToMany(() => Module, (module) => module.professions)
    @JoinTable()
    modules: Module[];

    @ManyToMany(() => Assignment, (assignment) => assignment.professions)
    @JoinTable()
    assignments: Assignment[];
}
