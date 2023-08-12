import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm/index';
@Entity()
export class Recent {
  @PrimaryColumn()
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
