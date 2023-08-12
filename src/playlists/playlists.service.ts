import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { Repository, Like as TypeORMLike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './domain/video';
import { Playlist } from './domain/playlist';
import { Like } from './domain/like';
import { Recent } from './domain/recent';

@Injectable()
export class PlaylistsService {
  constructor(
    private http: HttpService,
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    @InjectRepository(Recent) private recentRepository: Repository<Recent>,
  ) {
    (this.videoRepository = videoRepository),
      (this.playlistRepository = playlistRepository),
      (this.likeRepository = likeRepository),
      (this.recentRepository = recentRepository);
  }

  async viewPlaylist(playlistId: string, forModify: boolean, userId: string) {
    if (forModify === false && userId) {
      //최근본 플레이리스트 등록, 봤던 플레이리스트 시간 최신화, 5개 이상시
      const viewedPlaylist = await this.recentRepository.findOne({ where: { userId, playlistId } })
      if(!viewedPlaylist) await this.recentRepository.save({ userId, playlistId });
      else await this.recentRepository.update({ userId, playlistId }, {});

      const userRecentCount = await this.recentRepository.count({
        where: { userId: userId },
      });
      const maxRecentCount = 8;

      if (userRecentCount > maxRecentCount) {
        const oldestItem = await this.recentRepository.find({
          where: { userId: userId },
          order: {
            updatedAt: 'ASC',
          },
          take: userRecentCount - maxRecentCount,
        });

        await this.recentRepository.remove(oldestItem);
      }

      //viewCount 1 증가
      await this.playlistRepository.update(
        { playlistId },
        { viewCount: () => 'viewCount + 1' },
      );
    } else if (forModify === false && !userId) {
      await this.playlistRepository.update(
        { playlistId },
        { viewCount: () => 'viewCount + 1' },
      );
    }

    //해당 플레이리스트 정보 반환
    const playlist = await this.playlistRepository.findOne({
      where: { playlistId: playlistId },
    });
    const likeCount = await this.likeRepository.count({
      where: { playlistId: playlist.playlistId },
    });

    let isLiked
    if (userId) {
      isLiked = await this.likeRepository.findOne({
        where: { userId, playlistId: playlist.playlistId },
      });
    } else {
      isLiked = false;
    }

    const songs = [];

    console.log(JSON.parse(playlist.videoId));

    for (const videoId of JSON.parse(playlist.videoId)) {
      console.log(videoId);
      const videoInfo = await this.videoRepository.findOne({
        where: { videoId: videoId },
      });
      console.log(videoInfo);
      songs.push({
        videoId: videoId,
        title: videoInfo.title,
        length: videoInfo.time,
      });
    }

    return {
      ...playlist,
      likeCount,
      videoId: JSON.parse(playlist.videoId),
      hashtag: JSON.parse(playlist.hashtag),
      isLiked: isLiked ? true : false,
      songs: songs,
    };
  }

  async patchLike(playlistId: string, like: boolean, userId: string) {
    const ifLike = await this.likeRepository.findOne({
      where: { userId: userId, playlistId: playlistId },
    });
    // console.log(ifLike)

    if (!ifLike && like === true) {
      await this.likeRepository.save({ userId, playlistId });
    } else if (ifLike && like === false) {
      await this.likeRepository.delete({ userId, playlistId });
    }
  }

  async searchPlaylist(q: string, page: number, size: number, userId: string) {
    const allPlaylists = await this.playlistRepository.find({
      where: [
        { title: TypeORMLike(`%${q}%`) },
        { hashtag: TypeORMLike(`%${q}%`) },
      ],
    });

    const totalCount = allPlaylists.length;
    let totalPage: number;

    if (totalCount % size === 0) {
      totalPage = totalCount / size;
    } else {
      totalPage = Math.floor(totalCount / size) + 1;
    }

    const playlists = allPlaylists.slice((page - 1) * size, page * size);

    const parsedPlaylists = await Promise.all(
      playlists.map(async (playlist) => {
        const likeCount = await this.likeRepository.count({
          where: { playlistId: playlist.playlistId },
        });
        const isLiked = await this.likeRepository.findOne({
          where: { userId, playlistId: playlist.playlistId },
        });

        return {
          ...playlist,
          likeCount,
          videoId: JSON.parse(playlist.videoId),
          hashtag: JSON.parse(playlist.hashtag),
          isLiked: isLiked ? true : false,
        };
      }),
    );

    return {
      playlists: parsedPlaylists,
      size: Number(size),
      totalCount,
      totalPage,
      currentPage: Number(page),
    };
  }

  async getAllPlaylist(page: number, size: number, userId: string) {
    const allPlaylists = await this.playlistRepository.find({
      order: {
        playlistId: 'DESC',
      },
    });

    const totalCount = allPlaylists.length;
    let totalPage: number;

    if (totalCount % size === 0) {
      totalPage = totalCount / size;
    } else {
      totalPage = Math.floor(totalCount / size) + 1;
    }

    const playlists = allPlaylists.slice((page - 1) * size, page * size);

    const parsedPlaylists = await Promise.all(
      playlists.map(async (playlist) => {
        const likeCount = await this.likeRepository.count({
          where: { playlistId: playlist.playlistId },
        });
        const isLiked = await this.likeRepository.findOne({
          where: { userId, playlistId: playlist.playlistId },
        });

        return {
          ...playlist,
          likeCount,
          videoId: JSON.parse(playlist.videoId),
          hashtag: JSON.parse(playlist.hashtag),
          isLiked: isLiked ? true : false,
        };
      }),
    );

    return {
      playlists: parsedPlaylists,
      size: Number(size),
      totalCount,
      totalPage,
      currentPage: Number(page),
    };
  }

  async getBestPlaylist(userId: string) {
    const playlists = await this.playlistRepository.find({
      order: {
        viewCount: 'DESC',
      },
      take: 3,
    });

    const parsedPlaylists = await Promise.all(
      playlists.map(async (playlist) => {
        const likeCount = await this.likeRepository.count({
          where: { playlistId: playlist.playlistId },
        });
        const isLiked = await this.likeRepository.findOne({
          where: { userId, playlistId: playlist.playlistId },
        });

        return {
          ...playlist,
          likeCount,
          videoId: JSON.parse(playlist.videoId),
          hashtag: JSON.parse(playlist.hashtag),
          isLiked: isLiked ? true : false,
        };
      }),
    );

    return parsedPlaylists;
  }

  async savePlaylist(
    body: Playlist,
    file: Express.MulterS3.File,
    userId: string,
  ) {
    console.log(body.title);
    console.log(body);
    const thisPlaylist = {
      userId: userId,
      thumbnailUrl: file.location,
      viewCount: 0,
      title: body.title,
      videoId: body.videoId,
      hashtag: body.hashtag,
    };

    await this.playlistRepository.save(thisPlaylist);
  }

  async searchYoutube(q: string) {
    const key = process.env.YOUTUBE_KEY;
    return this.http
      .get(
        `https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet&q=${q}`,
      )
      .pipe(
        map((res) => {
          const searchResults = res.data.items.map((item) => ({
            videoId: item.id.videoId,
            title: item.snippet.title
              .replace(/&#39;/g, "'")
              .replace(/&amp;/g, '&'),
            thumbnailUrl: item.snippet.thumbnails.default.url,
          }));
          return searchResults;
        }),
      );
  }

  async saveSong(videoId: string, title: string) {
    const existVideo = await this.videoRepository.findOne({
      where: { videoId: videoId },
    });
    // console.log(existVideo)

    if (existVideo) {
      // case 1 video정보가 DB에 있으면 바로 리턴
      return;
    } else {
      // case 2 video정보가 DB에 없으면 youtube api 통신 후 정보 DB 저장
      const key = process.env.YOUTUBE_KEY;
      const contentDetails = await lastValueFrom(
        this.http.get(
          `https://www.googleapis.com/youtube/v3/videos?key=${key}&id=${videoId}&part=contentDetails`,
        ),
      );
      // console.log(contentDetails.data.items)
      const timeString = contentDetails.data.items[0].contentDetails.duration;

      // console.log(timeString)
      const pattern = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
      const matches = timeString.match(pattern);
      // console.log(matches)
      if (matches && matches.length >= 4) {
        const hours = matches[1] ? parseInt(matches[1], 10) : 0;
        const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
        const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

        // 분과 시간 값이 한 자리 수인 경우 앞에 0을 추가
        const formattedTime = hours
          ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`
          : `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
        // console.log(formattedTime)
        // db에 videoId, title, formattedTime 저장
        const thisVideo = {
          videoId: videoId,
          title: title,
          time: formattedTime,
        };
        await this.videoRepository.save(thisVideo);

        return thisVideo;
      }
    }
  }

  async searchLikedPlaylist(
    q: string,
    page: number,
    size: number,
    userId: string,
  ) {
    const allLikedPlaylists = await this.likeRepository.find({
      where: {
        userId: userId,
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    const filteredPlaylists = await Promise.all(
      allLikedPlaylists.map(async (playlist) => {
        const thisPlaylist = await this.playlistRepository.findOne({
          where: { playlistId: playlist.playlistId },
        });
        const likeCount = await this.likeRepository.count({
          where: { playlistId: playlist.playlistId },
        });
        const isLiked = await this.likeRepository.findOne({
          where: { userId, playlistId: playlist.playlistId },
        });

        if (
          q &&
          (thisPlaylist.title.includes(q) || thisPlaylist.hashtag.includes(q))
        ) {
          return {
            ...thisPlaylist,
            likeCount,
            videoId: JSON.parse(thisPlaylist.videoId),
            hashtag: JSON.parse(thisPlaylist.hashtag),
            isLiked: !!isLiked,
          };
        } else {
          return null;
        }
      }),
    );

    const parsedPlaylists = filteredPlaylists.filter(Boolean);
    const totalCount = parsedPlaylists.length;

    let totalPage: number;

    if (totalCount % size === 0) {
      totalPage = totalCount / size;
    } else {
      totalPage = Math.floor(totalCount / size) + 1;
    }

    return {
      playlists: parsedPlaylists,
      size: Number(size),
      totalCount,
      totalPage,
      currentPage: Number(page),
    };
  }

  async getLikedPlaylist(page: number, size: number, userId: string) {
    const allLikedPlaylists = await this.likeRepository.find({
      where: {
        userId: userId,
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    const totalCount = allLikedPlaylists.length;
    let totalPage: number;

    if (totalCount % size === 0) {
      totalPage = totalCount / size;
    } else {
      totalPage = Math.floor(totalCount / size) + 1;
    }

    const playlists = allLikedPlaylists.slice((page - 1) * size, page * size);

    const parsedPlaylists = await Promise.all(
      playlists.map(async (playlist) => {
        const thisPlaylist = await this.playlistRepository.findOne({
          where: { playlistId: playlist.playlistId },
        });
        const likeCount = await this.likeRepository.count({
          where: { playlistId: playlist.playlistId },
        });
        const isLiked = await this.likeRepository.findOne({
          where: { userId, playlistId: playlist.playlistId },
        });

        return {
          ...thisPlaylist,
          likeCount,
          videoId: JSON.parse(thisPlaylist.videoId),
          hashtag: JSON.parse(thisPlaylist.hashtag),
          isLiked: isLiked ? true : false,
        };
      }),
    );

    return {
      playlists: parsedPlaylists,
      size: Number(size),
      totalCount,
      totalPage,
      currentPage: Number(page),
    };
  }

  async getRegisteredPlaylist(page: number, size: number, userId: string) {
    const allRegisteredPlaylists = await this.playlistRepository.find({
      where: {
        userId: userId,
      },
      order: {
        playlistId: 'DESC',
      },
    });

    const totalCount = allRegisteredPlaylists.length;
    let totalPage: number;

    if (totalCount % size === 0) {
      totalPage = totalCount / size;
    } else {
      totalPage = Math.floor(totalCount / size) + 1;
    }

    const playlists = allRegisteredPlaylists.slice(
      (page - 1) * size,
      page * size,
    );

    const parsedPlaylists = await Promise.all(
      playlists.map(async (playlist) => {
        const likeCount = await this.likeRepository.count({
          where: { playlistId: playlist.playlistId },
        });
        const isLiked = await this.likeRepository.findOne({
          where: { userId, playlistId: playlist.playlistId },
        });

        return {
          ...playlist,
          likeCount,
          videoId: JSON.parse(playlist.videoId),
          hashtag: JSON.parse(playlist.hashtag),
          isLiked: isLiked ? true : false,
        };
      }),
    );

    return {
      playlists: parsedPlaylists,
      size: Number(size),
      totalCount,
      totalPage,
      currentPage: Number(page),
    };
  }

  async modifyPlaylist(
    body: Playlist,
    playlistId: string,
    file: Express.MulterS3.File,
  ) {
    if (file) {
      const thisPlaylist = {
        thumbnailUrl: file.location,
        title: body.title,
        videoId: JSON.stringify(body.videoId),
        hashtag: JSON.stringify(body.hashtag),
      };

      await this.playlistRepository.update(playlistId, thisPlaylist);
    } else {
      const thisPlaylist = {
        thumbnailUrl: body.thumbnailUrl,
        title: body.title,
        videoId: JSON.stringify(body.videoId),
        hashtag: JSON.stringify(body.hashtag),
      };

      await this.playlistRepository.update(playlistId, thisPlaylist);
    }
  }

  async getRecentPlaylist(userId: string) {
    const allRecentPlaylists = await this.recentRepository.find({
      where: {
        userId: userId,
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    const parsedPlaylists = await Promise.all(
      allRecentPlaylists.map(async (playlist) => {
        const thisPlaylist = await this.playlistRepository.findOne({
          where: { playlistId: playlist.playlistId },
        });
        const likeCount = await this.likeRepository.count({
          where: { playlistId: playlist.playlistId },
        });
        const isLiked = await this.likeRepository.findOne({
          where: { userId, playlistId: playlist.playlistId },
        });

        return {
          ...thisPlaylist,
          likeCount,
          videoId: JSON.parse(thisPlaylist.videoId),
          hashtag: JSON.parse(thisPlaylist.hashtag),
          isLiked: isLiked ? true : false,
        };
      }),
    );

    return {
      playlists: parsedPlaylists,
    };
  }
}
