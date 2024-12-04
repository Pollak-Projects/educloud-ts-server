import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany, JoinTable,
} from 'typeorm';
import { UserData } from './user.data.entity';
import { Teacher } from '../teacher/teacher.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    hashedPwd: string;

    @Column()
    displayName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => UserData, userData => userData.user)
    userData: UserData[];

    @ManyToMany(() => Teacher, teacher => teacher.users)
    @JoinTable()
    teachers: Teacher[];
}