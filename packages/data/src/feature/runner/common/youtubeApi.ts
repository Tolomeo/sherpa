/// <reference types="gapi.youtube" />

export interface YouTubeVideo extends GoogleApiYouTubeVideoResource {
  kind: 'youtube#video'
}

export interface YouTubePlaylist extends GoogleApiYouTubePlaylistResource {
  kind: 'youtube#playlist'
}

export interface YoutubeChannel extends GoogleApiYouTubeChannelResource {
  kind: 'youtube#channel'
}

export type YouTubeResource = YouTubeVideo | YouTubePlaylist | YoutubeChannel

export type YoutubeResourceResponse =
  GoogleApiYouTubePaginationInfo<YouTubeResource>

export const getVideoId = (url: string) => {
  const videoUrl = /^https?:\/\/www\.youtube\.com\/watch\?v=(\S+)$/

  const match = videoUrl.exec(url)

  if (!match) return null

  const [, videoId] = match
  return videoId
}

export const getPlaylistId = (url: string) => {
  const playlistUrl = /^https?:\/\/www\.youtube\.com\/playlist\?list=(\S+)$/

  const match = playlistUrl.exec(url)

  if (!match) return null

  const [, playlistId] = match
  return playlistId
}

export const getChannelHandle = (url: string) => {
  const channelUrl = /^https?:\/\/www.youtube.com\/(@\S+)$/

  const match = channelUrl.exec(url)

  if (!match) return null

  const [, channelHandle] = match
  return channelHandle
}
