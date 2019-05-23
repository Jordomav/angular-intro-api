
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne, JoinColumn
} from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ unique: true })
    body: string;

    @ManyToOne(type => User, { eager: true })
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAd: string;

    @UpdateDateColumn()
    updatedAt: string;
}
