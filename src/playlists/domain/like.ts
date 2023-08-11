import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm/index';
@Entity()
export class Like {
  @PrimaryColumn()
  userId: string;
  @PrimaryColumn()
  playlistId: string;
  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
