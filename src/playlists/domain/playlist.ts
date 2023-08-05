import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm/index';
@Entity()
export class Playlist {
    @PrimaryGeneratedColumn()
    playlistId: string;
    @Column()
    userId: string;
    @Column()
    thumbnailUrl: string;
    @Column()
    title: string;
    @Column()
    viewCount: number;
    @Column("varchar", {length: 8191})
    videoId: string;
    @Column()
    hashtag: string;
}