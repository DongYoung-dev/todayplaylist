import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthController } from './auth/auth.controller';
import { PlaylistsController } from './playlists/playlists.controller';
import { User } from './auth/domain/user';
import { Video } from './playlists/domain/video';
import { Playlist } from './playlists/domain/playlist';
import { Like } from './playlists/domain/like';
import { Recent } from './playlists/domain/recent';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Video, Playlist, Like, Recent],
      synchronize: true
    }),
    PlaylistsModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: process.env.TOKENKEY,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
// implements NestModule
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthMiddleware)
  //     .exclude(
  //       { path: 'auth/google', method: RequestMethod.GET },
  //       { path: 'auth/google/redirect', method: RequestMethod.GET },
  //     )
  //     .forRoutes(AuthController, PlaylistsController);
  // }

}
