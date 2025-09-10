/// <reference types="gapi.youtube" />

export interface YouTubeVideo extends GoogleApiYouTubeVideoResource {
  kind: 'youtube#video'
}

export interface YouTubePlaylist extends GoogleApiYouTubePlaylistResource {
  kind: 'youtube#playlist'
}

export interface YouTubeChannel extends GoogleApiYouTubeChannelResource {
  kind: 'youtube#channel'
}

export interface YouTubeActivity extends GoogleApiYouTubeActivityResource {
  kind: 'youtube#activity'
}

export type YouTubeVideoResponse = GoogleApiYouTubePaginationInfo<YouTubeVideo>

export type YouTubePlaylistResponse =
  GoogleApiYouTubePaginationInfo<YouTubePlaylist>

export type YouTubeChannelResponse =
  GoogleApiYouTubePaginationInfo<YouTubeChannel>

export type YouTubeActivityResponse =
  GoogleApiYouTubePaginationInfo<YouTubeActivity>

/* type Opaque<T, K extends string> = string extends K
  ? never
  : T & { readonly __kind__: K }

type YouTubeVideoUrl = Opaque<string, 'youtube#video'>

type YouTubeChannelUrl = Opaque<string, 'youtube#channel'>

type YouTubePlaylistUrl = Opaque<string, 'youtube#playlist'>

const isYouTubeVideoUrl = (url: string): url is YouTubeVideoUrl => {
  const videoUrl = /^https?:\/\/www\.youtube\.com\/watch\?v=(\S+)$/

  const match = videoUrl.exec(url)

  if (!match) return false

  return true
} */

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
