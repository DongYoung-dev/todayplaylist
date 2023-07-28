import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory_thumbnail } from 'src/common/utils/multer.options';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './domain/video';
import { Playlist } from './domain/playlist';
import { Like } from './domain/like';
import { Recent } from './domain/recent';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Video]),
    TypeOrmModule.forFeature([Playlist]),
    TypeOrmModule.forFeature([Like]),
    TypeOrmModule.forFeature([Recent]),
    MulterModule.registerAsync({
      useFactory: multerOptionsFactory_thumbnail,
    })
  ],
  controllers: [PlaylistsController],
  providers: [PlaylistsService]
})
export class PlaylistsModule {}
