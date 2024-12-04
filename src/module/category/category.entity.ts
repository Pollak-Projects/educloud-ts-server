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
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    categoryName: string;

    @ManyToMany(() => Module, (module) => module.categories)
    @JoinTable()
    modules: Module[];

    @ManyToMany(() => Assignment, (assignment) => assignment.categories)
    @JoinTable()
    assignments: Assignment[];
}
