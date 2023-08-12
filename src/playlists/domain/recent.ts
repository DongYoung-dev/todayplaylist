import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm/index';
@Entity()
export class Recent {
  @PrimaryGeneratedColumn()
  recentId: string;
  @Column()
  userId: string;
  @Column()
  playlistId: string;
  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
