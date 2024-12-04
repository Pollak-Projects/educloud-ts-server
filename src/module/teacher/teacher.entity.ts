import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Module } from '../module/module.entity';
import { User } from '../user/user.entity';
import { Assignment } from '../assignment/assignment.entity';

@Entity()
export class Teacher {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => Module, (module) => module.teachers)
    @JoinTable()
    modules: Module[];

    @ManyToMany(() => Assignment, (assignment) => assignment.teachers)
    @JoinTable()
    assignments: Assignment[];

    @ManyToMany(() => User, (user) => user.teachers)
    @JoinTable()
    users: User[];
}
