import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { TeacherSubject } from './teacher-subject.entity';
import { TeacherAssignment } from './teacher-assignment.entity';
import { TeacherUser } from './teacher-user.entity';
import { User } from '../user/user.entity';

@Entity()
export class Teacher {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => TeacherSubject, teacherSubject => teacherSubject.teacher)
    teacherSubject: TeacherSubject[];

    @OneToMany(() => TeacherAssignment, teacherAssignment => teacherAssignment.teacher)
    teacherAssignment: TeacherAssignment[];

    @ManyToMany(() => User, user => user.teachers)
    users: User[];
}