import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { RoleEnum } from './role.enum';

@Entity()
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.role)
    @JoinColumn()
    user: User;

    @Column({ array: true, type: 'enum', enum: RoleEnum })
    roles: RoleEnum[];
}
