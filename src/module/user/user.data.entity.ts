import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserData {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @ManyToMany(() => User, (user) => user.userData, { onDelete: 'CASCADE' })
    users: User[];

    @Column({ nullable: true })
    email?: string;

    @Column()
    birthDate: Date;
}
