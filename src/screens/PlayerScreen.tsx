/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ChevronDown, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Shuffle, 
  Repeat, 
  Heart, 
  Volume2, 
  Radio, 
  Music, 
  MonitorPlay,
  Languages,
  Sliders,
  Sparkles
} from 'lucide-react';
import { Song } from '../types';

interface PlayerScreenProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number; // in seconds
  duration: number; // in seconds
  isShuffle: boolean;
  isRepeat: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  onToggleLike: (songId: string) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onBack: () => void;
}

export default function PlayerScreen({
  currentSong,
  isPlaying,
  progress,
  duration,
  isShuffle,
  isRepeat,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onToggleLike,
  onToggleShuffle,
  onToggleRepeat,
  onBack,
}: PlayerScreenProps) {
  const [showLyrics, setShowLyrics] = useState(false);
  const [volume, setVolume] = useState(80);

  if (!currentSong) {
    return (
      <div id="player_none_container" className="flex-1 w-full bg-[#121212] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-4">
          <Music className="w-8 h-8 text-neutral-600" />
        </div>
        <h3 className="text-sm font-bold text-neutral-300">Nenhuma música em execução</h3>
        <p className="text-xs text-neutral-500 max-w-[200px] mt-1.5 leading-relaxed">
          Navegue pelas paradas em Início ou busque no acervo e sintonize agora.
        </p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-350 hover:text-white rounded-full text-xs font-semibold"
        >
          Voltar para Início
        </button>
      </div>
    );
  }

  // Format digital timers
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Drag seek target calculation
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onSeek(value);
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  // Active lyrics highlighting logic based on duration ratio
  const getActiveLyricIndex = () => {
    if (!currentSong.lyrics || currentSong.lyrics.length === 0) return -1;
    const chunkFraction = duration / currentSong.lyrics.length;
    const index = Math.floor(progress / chunkFraction);
    return Math.min(index, currentSong.lyrics.length - 1);
  };

  const activeLyricIdx = getActiveLyricIndex();

  return (
    <div 
      id="player_fullscreen_container" 
      className="flex-1 w-full bg-[#121212] flex flex-col justify-between pb-6 relative overflow-y-auto overflow-x-hidden scrollbar-none"
    >
      {/* Dynamic Background visual glass glow for ambient depth */}
      <div 
        className="absolute top-0 inset-x-0 h-96 bg-cover bg-center opacity-[0.14] blur-3xl pointer-events-none scale-125"
        style={{ backgroundImage: currentSong.thumbnailUrl ? `url(${currentSong.thumbnailUrl})` : 'none' }}
      />

      {/* 1. TOP HEADER BAR */}
      <div className="w-full h-14 flex items-center justify-between px-4 z-20 shrink-0 select-none">
        <button
          id="player_back_arrow"
          onClick={onBack}
          className="p-2 -ml-1 text-neutral-400 hover:text-white active:scale-90 transition-all rounded-full hover:bg-neutral-900/40"
          title="Minimizar tocador"
        >
          <ChevronDown className="w-6 h-6 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Tocando Agora</p>
          <p className="text-[11px] text-[#1DB954] font-medium tracking-tight truncate max-w-[180px]">{currentSong.album}</p>
        </div>

        <div className="w-10"></div>
      </div>

      {/* 2. CENTER PANEL (Cover Art) */}
      <div className="flex-1 flex flex-col justify-center px-6 my-2 min-h-0 select-none">
        <div id="player_cover_view" className="flex flex-col items-center justify-center py-4">
          <div className="relative aspect-square w-full max-w-[270px] rounded-2xl overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.85)] group border border-neutral-900 bg-neutral-950">
            {currentSong.thumbnailUrl ? (
              <img
                src={currentSong.thumbnailUrl}
                alt={currentSong.title}
                className={`w-full h-full object-cover transition-transform duration-1000 ${
                  isPlaying ? 'scale-101 animate-spin-extremely-slow' : 'scale-98'
                }`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-700">
                <Music className="w-20 h-20" />
              </div>
            )}

            {/* Rotating mechanical vinyl aesthetic record line inside the cover art underplay */}
            {isPlaying && (
              <div className="absolute inset-0 border-[6px] border-black/10 rounded-full pointer-events-none animate-spin-slow"></div>
            )}
          </div>
        </div>
      </div>

      {/* 3. METADATA TITLES & HEART LIKE */}
      <div className="px-6 shrink-0 mt-2 select-none">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white tracking-tight truncate">
              {currentSong.title}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 truncate mr-2">
              {currentSong.artist} • <span className="text-neutral-400 font-sans">{currentSong.album}</span>
            </p>
          </div>

          <button
            id="player_heart_btn"
            onClick={() => onToggleLike(currentSong.id)}
            className="p-2.5 rounded-full bg-neutral-900/60 border border-neutral-800 active:scale-90 transition-all text-neutral-400 hover:text-red-500 shrink-0"
            title={currentSong.liked ? 'Remover das Curtidas' : 'Curtir música'}
          >
            <Heart
              className={`w-[19px] h-[19px] transition-all duration-200 ${
                currentSong.liked ? 'fill-[#1DB954] text-[#1DB954] scale-105' : 'text-neutral-400 hover:text-white'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 4. PROGRESS BAR SLIDER CONTROL */}
      <div className="px-6 shrink-0 mt-4 select-none">
        
        {/* Slider input element */}
        <div className="relative w-full flex items-center">
          <input
            id="player_audio_timeline"
            type="range"
            min="0"
            max={duration || 100}
            value={progress}
            onChange={handleSliderChange}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer outline-none accent-[#1DB954]"
          />
        </div>

        {/* Timers Row */}
        <div className="flex items-center justify-between text-[10.5px] text-neutral-400 mt-1.5 font-mono">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 5. PLAYER CONTROLS PANEL */}
      <div className="px-6 shrink-0 mt-3 select-none flex flex-col gap-4">
        
        {/* Core Buttons Layout: Shuffle, Previous, PlayCircle, Next, Repeat */}
        <div className="flex items-center justify-between px-2">
          {/* Shuffle Button */}
          <button
            id="player_shuffle"
            onClick={onToggleShuffle}
            className={`p-2 rounded-full transition-all active:scale-90 ${
              isShuffle ? 'text-[#1DB954] bg-[#1DB954]/5 font-bold' : 'text-neutral-500 hover:text-white'
            }`}
            title="Modo aleatório (Shuffle)"
          >
            <Shuffle className="w-4.5 h-4.5" strokeWidth={isShuffle ? 2.5 : 2} />
          </button>

          {/* Previous Button */}
          <button
            id="player_previous"
            onClick={onPrevious}
            className="p-2 text-neutral-300 hover:text-white active:scale-90 transition-all"
            title="Canção anterior"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          {/* Core play/pause central node */}
          <button
            id="player_play_pause_center"
            onClick={onPlayPause}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center active:scale-95 transition-all shadow-[0_4px_16px_rgba(255,255,255,0.25)] relative group cursor-pointer hover:scale-102"
            title={isPlaying ? 'Pausar' : 'Tocar'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-black text-black" strokeWidth={1.5} />
            ) : (
              <Play className="w-7 h-7 fill-black text-black ml-1" strokeWidth={1.5} />
            )}
          </button>

          {/* Next Button */}
          <button
            id="player_next_button"
            onClick={onNext}
            className="p-2 text-neutral-300 hover:text-white active:scale-90 transition-all"
            title="Próxima canção"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>

          {/* Repeat Button */}
          <button
            id="player_repeat"
            onClick={onToggleRepeat}
            className={`p-2 rounded-full transition-all active:scale-90 ${
              isRepeat ? 'text-[#1DB954] bg-[#1DB954]/5 font-bold' : 'text-neutral-500 hover:text-white'
            }`}
            title="Repetir faixa"
          >
            <Repeat className="w-4.5 h-4.5" strokeWidth={isRepeat ? 2.5 : 2} />
          </button>
        </div>

        {/* 6. VOLUME BAR HUD */}
        <div className="flex items-center gap-2.5 px-3 py-1 text-neutral-500 rounded-xl bg-neutral-900/20 border border-neutral-900/20">
          <Volume2 className="w-4 h-4 text-neutral-400" />
          <input
            id="player_volume_slider"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="flex-1 h-0.5 bg-neutral-850 appearance-none rounded cursor-pointer accent-[#1DB954]"
          />
          <span className="text-[9.5px] font-mono font-bold text-neutral-400 w-5 text-right">{volume}%</span>
        </div>
      </div>

    </div>
  );
}
