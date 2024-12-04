import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserData {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @ManyToOne(() => User, user => user.userData, { onDelete: 'CASCADE' })
    user: User;

    @Column({ nullable: true })
    email?: string;

    @Column()
    birthDate: Date;
}