/// <reference types="gapi.youtube" />

export interface YouTubeVideo extends GoogleApiYouTubeVideoResource {
  kind: 'youtube#video'
}

export interface YouTubePlaylist extends GoogleApiYouTubePlaylistResource {
  kind: 'youtube#playlist'
}

export type YoutubeResourceResponse = GoogleApiYouTubePaginationInfo<
  YouTubeVideo | YouTubePlaylist
>
