import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm/index';
@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  likeId: string;
  @Column()
  userId: string;
  @Column()
  playlistId: string;
  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
