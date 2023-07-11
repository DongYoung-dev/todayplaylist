import { Column, Entity, PrimaryColumn } from 'typeorm/index';
@Entity()
export class Video {
    @PrimaryColumn()
    videoId: string;
    @Column()
    title: string;
    @Column()
    time: string;
}