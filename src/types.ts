/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  thumbnailUrl: string | null;
  streamUrl: string | null;
  liked: boolean;
  source: string;
  lyrics?: string[];
}

export interface Playlist {
  id: number;
  name: string;
  thumbnailUrl: string | null;
  songs: Song[];
}

export interface Artist {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  bio: string;
  songs: Song[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string | null;
  year: string;
  songs: Song[];
}
