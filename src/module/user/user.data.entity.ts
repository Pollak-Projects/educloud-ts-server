import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserData {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @ManyToMany(() => User, (user) => user.userData, { onDelete: 'CASCADE' })
    @JoinTable()
    users: User[];

    @Column({ nullable: true })
    email?: string;

    @Column()
    birthDate: Date;
}
