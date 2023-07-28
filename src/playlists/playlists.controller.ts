import { Controller, Get, Post, Patch, Query, Body, Res, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express"
import { PlaylistsService } from './playlists.service';
import { lastValueFrom } from 'rxjs';
import { Response } from 'express';
import { Playlist } from './domain/playlist';

@Controller('playlists')
export class PlaylistsController {
    constructor(private readonly playlistsService: PlaylistsService) { }

    @Get('view/:playlistId')
    async viewPlaylist(@Param('playlistId') playlistId: string) {
        const data = await this.playlistsService.viewPlaylist(playlistId, false)

        return data
    }

    @Patch('like')
    async likePlaylist(
        @Body('playlistId') playlistId: string,
        @Body('like') like: boolean,
        @Res() res: Response
        ) {
        await this.playlistsService.patchLike(playlistId, like)

        res.status(200).json({
            message: 'Success'
        })
    }


    @Get('')
    async searchPlaylist(
        @Query('searchWord') q: string,
        @Query('isLiked') isLiked: boolean,
        @Query('page') page: number,
        @Query('size') size: number
        ) {
        let data

        if(q && !isLiked)
            data = await this.playlistsService.searchPlaylist(q, page, size)
        else if(!q && !isLiked)
            data = await this.playlistsService.getAllPlaylist(page, size)
        else if(q && isLiked)
            data = await this.playlistsService.searchLikedPlaylist(q, page, size)
        else if(!q && isLiked)
            data = await this.playlistsService.getLikedPlaylist(page, size)

        return data
    }

    @Get('best')
    async getBestPlaylist() {
        const playlists = await this.playlistsService.getBestPlaylist()

        return { playlists }
    }

    @Post('register')
    @UseInterceptors(FileInterceptor('file'))
    async registerPlaylist(
        @Body() body: Playlist,
        @Res() res: Response,
        @UploadedFile() file: Express.MulterS3.File
        ) {
        await this.playlistsService.savePlaylist(body, file)

        res.status(200).json({
            message: 'Success'
        })
    }

    @Get('register/song/search')
    async searchSong(@Query('searchWord') q: string) {
        const searchResults = await this.playlistsService.searchYoutube(q);
        console.log(searchResults)
        
        return { searchResults: await lastValueFrom(searchResults) };
    }

    @Post('register/song')
    async registerSong(
        @Body('videoId') videoId: string,
        @Body('title') title: string,
        @Res() res: Response
        ) {
        await this.playlistsService.saveSong(videoId, title)
        
        res.status(200).json({
            message: 'Success'
        })
    }

    @Get('registered')
    async getRegisteredPlaylist(@Query('page') page: number, @Query('size') size: number) {
        const data = await this.playlistsService.getRegisteredPlaylist(page, size)

        return data
    }

    @Get('modify/:playlistId')
    async getPlaylistForModify(@Param('playlistId') playlistId: string) {
        const data = await this.playlistsService.viewPlaylist(playlistId, true)

        return data
    }

    @Patch('modify/:playlistId')
    @UseInterceptors(FileInterceptor('file'))
    async modifyPlaylist(
        @Body() body: Playlist,
        @Res() res: Response,
        @Param('playlistId') playlistId: string,
        @UploadedFile() file: Express.MulterS3.File
        ) {
        await this.playlistsService.modifyPlaylist(body, playlistId, file)

        res.status(200).json({
            message: 'Success'
        })
    }

    @Get('recentViewed')
    async getRecentPlaylist() {
        const data = await this.playlistsService.getRecentPlaylist()

        return data
    }
}
