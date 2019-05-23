import { IsEmail } from "class-validator";
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

    @Index()
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Index()
    @Column({unique: true})
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Index()
    @Column({unique: true})
    @IsEmail()
    email: string;

    @Column({ select: false })
    password: string;

    @CreateDateColumn()
    createdAd: string;

    @UpdateDateColumn()
    updatedAt: string;

}
