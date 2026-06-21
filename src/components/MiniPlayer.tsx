/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Play, Pause, SkipForward, Music } from 'lucide-react';
import { Song } from '../types';

interface MiniPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number; // in seconds
  duration: number; // in seconds
  onPlayPause: () => void;
  onNext: () => void;
  onExpand: () => void;
}

export default function MiniPlayer({
  currentSong,
  isPlaying,
  progress,
  duration,
  onPlayPause,
  onNext,
  onExpand,
}: MiniPlayerProps) {
  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div
      id="mini_player_container"
      onClick={onExpand}
      className="mx-3 mb-2 rounded-xl bg-neutral-900/95 backdrop-blur-md border border-neutral-800/80 shadow-[0_8px_24px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden z-40 select-none relative group hover:bg-neutral-850 transition-colors"
    >
      {/* 1. Thin progress bar on the upper border */}
      <div className="w-full h-[2.5px] bg-neutral-800">
        <div
          className="h-full bg-[#1DB954] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 2. Main content container */}
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Thumbnail */}
          {currentSong.thumbnailUrl ? (
            <img
              src={currentSong.thumbnailUrl}
              alt={currentSong.title}
              className="w-10 h-10 rounded-lg object-cover shadow bg-neutral-800 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
              <Music className="w-5 h-5 text-neutral-500" />
            </div>
          )}

          {/* Song Metadata */}
          <div className="min-w-0 flex-1">
            <h4 className="text-[13px] font-semibold text-white truncate leading-tight">
              {currentSong.title}
            </h4>
            <p className="text-[11px] text-neutral-400 truncate leading-normal">
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Play/Pause & Next Button Controls */}
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {/* Play/Pause Button */}
          <button
            id="mini_player_play_pause"
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening the full player
              onPlayPause();
            }}
            className="p-2 rounded-full text-white active:scale-90 hover:bg-neutral-800/60 transition-all"
            title={isPlaying ? 'Pausar' : 'Tocar'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white text-white" />
            ) : (
              <Play className="w-5 h-5 fill-white text-white ml-0.5" />
            )}
          </button>

          {/* Next Button */}
          <button
            id="mini_player_next"
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening the full player
              onNext();
            }}
            className="p-2 rounded-full text-neutral-450 active:scale-90 hover:bg-neutral-850 transition-all hover:text-white"
            title="Próxima"
          >
            <SkipForward className="w-4.5 h-4.5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
