import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm/index';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: string;
    @Column()
    nickname: string;
    @Column()
    profileImgUrl: string;
}