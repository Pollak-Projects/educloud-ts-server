import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserData } from './user.data.entity';
import { Teacher } from '../teacher/teacher.entity';
import { Role } from '../role/role.entity';

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

    @ManyToMany(() => UserData, (userData) => userData.users, {
        onDelete: 'CASCADE',
    })
    @JoinTable()
    userData: UserData[];

    @ManyToMany(() => Teacher, (teacher) => teacher.users, {
        onDelete: 'CASCADE',
    })
    @JoinTable()
    teachers: Teacher[];

    @OneToOne(() => Role, (role) => role.user)
    role: Role;
}
