/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { Plus, ListMusic, Music, Heart, ArrowRight, FolderPlus, X, Disc, Search, Play, Users, Disc3 } from 'lucide-react';
import { Playlist, Song, Album, Artist } from '../types';

interface LibraryScreenProps {
  playlists: Playlist[];
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  onPlaySong: (song: Song, queue: Song[]) => void;
  onCreatePlaylist: (name: string) => void;
  onNavigate: (route: string) => void;
}

export default function LibraryScreen({ playlists, songs, albums, artists, onPlaySong, onCreatePlaylist, onNavigate }: LibraryScreenProps) {
  const [activeTab, setActiveTab] = useState<'playlists' | 'songs' | 'albums' | 'artists'>('playlists');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [errorText, setErrorText] = useState('');
  const [musicSearchQuery, setMusicSearchQuery] = useState('');

  const handleOpenDialog = () => {
    setNewPlaylistName('');
    setErrorText('');
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    const trimmed = newPlaylistName.trim();
    if (!trimmed) {
      setErrorText('Por favor, informe um nome.');
      return;
    }
    
    // Check for duplicates
    if (playlists.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorText('Já existe uma playlist com este nome.');
      return;
    }

    onCreatePlaylist(trimmed);
    setNewPlaylistName('');
    setIsDialogOpen(false);
  };

  // Filter songs statically based on current tab input query
  const filteredSongs = songs.filter(song => {
    const term = musicSearchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      song.title.toLowerCase().includes(term) ||
      song.artist.toLowerCase().includes(term) ||
      song.album.toLowerCase().includes(term)
    );
  });

  // Filter albums statically based on query
  const filteredAlbums = albums.filter(album => {
    const term = musicSearchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      album.title.toLowerCase().includes(term) ||
      album.artist.toLowerCase().includes(term)
    );
  });

  // Filter artists statically based on query
  const filteredArtists = artists.filter(artist => {
    const term = musicSearchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      artist.name.toLowerCase().includes(term)
    );
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="library_screen" className="flex-1 w-full flex flex-col overflow-hidden">
      
      {/* 1. FIXED HEADER CONTROLS (Title, Category tab selectors, Search option filters) */}
      <div className="shrink-0 px-4 pt-4 pb-2 bg-[#121212]/90 backdrop-blur-md z-10 border-b border-neutral-900/10">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-2 mt-1">
          <h2 className="text-2xl font-bold font-sans text-white tracking-tight">Sua Biblioteca</h2>
          {activeTab === 'playlists' && (
            <button
              id="add_playlist_btn"
              onClick={handleOpenDialog}
              className="p-1.5 bg-neutral-900 border border-neutral-800 hover:border-emerald-500 rounded-full text-white active:scale-90 transition-all hover:text-[#1DB954]"
              title="Criar nova playlist"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Styled Tabs Selector - Comprehensive with 4 categories */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-900 mb-2 shrink-0">
          <button
            onClick={() => { setActiveTab('playlists'); setMusicSearchQuery(''); }}
            className={`py-2 text-[10.5px] font-bold rounded-lg transition-all ${
              activeTab === 'playlists'
                ? 'bg-[#1DB954] text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
            }`}
          >
            Playlists
          </button>
          <button
            onClick={() => { setActiveTab('songs'); setMusicSearchQuery(''); }}
            className={`py-2 text-[10.5px] font-bold rounded-lg transition-all ${
              activeTab === 'songs'
                ? 'bg-[#1DB954] text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
            }`}
          >
            Músicas
          </button>
          <button
            onClick={() => { setActiveTab('albums'); setMusicSearchQuery(''); }}
            className={`py-2 text-[10.5px] font-bold rounded-lg transition-all ${
              activeTab === 'albums'
                ? 'bg-[#1DB954] text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
            }`}
          >
            Álbuns
          </button>
          <button
            onClick={() => { setActiveTab('artists'); setMusicSearchQuery(''); }}
            className={`py-2 text-[10.5px] font-bold rounded-lg transition-all ${
              activeTab === 'artists'
                ? 'bg-[#1DB954] text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
            }`}
          >
            Artistas
          </button>
        </div>

        {/* Shared Filter Search input bar (except for playlist tab unless desired) */}
        {activeTab !== 'playlists' && (
          <div className="relative mb-2 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={musicSearchQuery}
              onChange={(e) => setMusicSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'songs'
                  ? "Filtrar músicas do acervo..."
                  : activeTab === 'albums'
                  ? "Filtrar álbuns do acervo..."
                  : "Filtrar artistas do acervo..."
              }
              className="w-full h-10 bg-neutral-950 border border-neutral-855 rounded-xl pl-10 pr-9 text-xs text-white placeholder-neutral-550 outline-none focus:border-[#1DB954] transition-colors"
            />
            {musicSearchQuery && (
              <button
                onClick={() => setMusicSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. SCROLLABLE MAIN LIST INNER CONTENTS */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2 scrollbar-none">

      {activeTab === 'playlists' && (
        <>
          {/* Primary Liked Songs Quick Action card */}
          <div 
            onClick={() => onNavigate('playlist/103')}
            className="mb-4.5 p-4 rounded-xl bg-gradient-to-br from-indigo-900/60 to-purple-950/40 border border-indigo-500/10 cursor-pointer group active:scale-98 transition-all flex items-center justify-between shadow-lg animate-fade-in"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow shadow-purple-950">
                <Heart className="w-6 h-6 fill-white text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-[13.5px] font-bold text-white">Músicas Curtidas</h3>
                <p className="text-[10.5px] text-indigo-200 mt-0.5 font-medium">Playlist automática • Favoritas</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Section Title */}
          <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-3 shrink-0">
            Nossas Playlists ({playlists.length})
          </p>

          {/* Playlist List rendering */}
          <div className="flex flex-col gap-2.5 animate-fade-in text-left">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                id={`library_playlist_item_${playlist.id}`}
                onClick={() => onNavigate(`playlist/${playlist.id}`)}
                className="flex items-center gap-3.5 p-2 rounded-xl bg-neutral-900/40 hover:bg-neutral-850/80 cursor-pointer group border border-neutral-900/10 transition-all"
              >
                {/* Playlist Thumbnail cover view */}
                {playlist.thumbnailUrl ? (
                  <img
                    src={playlist.thumbnailUrl}
                    alt={playlist.name}
                    className="w-12 h-12 rounded-lg object-cover bg-neutral-800 shrink-0 shadow-md group-hover:rotate-1 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center text-[#1DB954] shrink-0 shadow-inner group-hover:rotate-2 transition-transform">
                    <ListMusic className="w-6 h-6" />
                  </div>
                )}

                {/* Playlist description text */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-[13px] font-bold text-white truncate leading-snug group-hover:text-[#1DB954] transition-colors">
                    {playlist.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate leading-normal mt-0.5">
                    {playlist.songs.length} {playlist.songs.length === 1 ? 'música' : 'músicas'}
                  </p>
                </div>

                {/* Visual forward Chevron */}
                <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-colors mr-1.5 shrink-0" />
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'songs' && (
        <div className="flex flex-col gap-2 animate-fade-in">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => onPlaySong(song, filteredSongs)}
                className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/30 hover:bg-neutral-850/60 cursor-pointer group transition-all duration-200 border border-neutral-900/10"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {song.thumbnailUrl ? (
                    <img
                      src={song.thumbnailUrl}
                      alt={song.title}
                      className="w-11 h-11 rounded-lg object-cover bg-neutral-800 shrink-0 shadow"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                      <Music className="w-5 h-5 text-neutral-500" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[12.5px] font-bold text-white truncate leading-snug group-hover:text-[#1DB954] transition-colors">
                      {song.title}
                    </h4>
                    <p className="text-[10.5px] text-neutral-400 truncate leading-normal">
                      {song.artist} • <span className="opacity-70">{song.album}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 ml-1">
                  <span className="text-[10px] text-neutral-500 font-medium font-mono">
                    {formatDuration(song.duration)}
                  </span>
                  <button
                    className="w-7 h-7 rounded-full bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center border border-[#1DB954]/20 group-hover:bg-[#1DB954] group-hover:text-black transition-all active:scale-90"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
              <Disc className="w-10 h-10 text-neutral-700 animate-spin-slow mb-2" />
              <p className="text-xs text-neutral-350">Nenhuma música corresponde ao filtro "{musicSearchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'albums' && (
        <div className="grid grid-cols-2 gap-3.5 animate-fade-in">
          {filteredAlbums.length > 0 ? (
            filteredAlbums.map((album) => (
              <div
                key={album.id}
                onClick={() => onNavigate(`album/${album.id}`)}
                className="bg-neutral-900/60 hover:bg-neutral-850 border border-neutral-850 rounded-xl p-3 cursor-pointer group active:scale-97 transition-all flex flex-col h-full"
              >
                <div className="relative aspect-square w-full mb-2.5 overflow-hidden rounded-lg bg-neutral-800 shadow">
                  {album.thumbnailUrl ? (
                    <img
                      src={album.thumbnailUrl}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                      <Disc3 className="w-8 h-8 text-neutral-500" />
                    </div>
                  )}
                </div>
                <h4 className="text-[12px] font-bold text-white truncate group-hover:text-[#1DB954] transition-colors leading-tight">
                  {album.title}
                </h4>
                <p className="text-[10px] text-neutral-400 mt-0.5 truncate">
                  {album.artist} • {album.year}
                </p>
                <span className="text-[8.5px] font-semibold text-neutral-500 mt-2 block lowercase">
                  {album.songs.length} {album.songs.length === 1 ? 'faixa' : 'faixas'}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center py-12 text-neutral-500">
              <Disc className="w-10 h-10 text-neutral-700 mb-2 animate-pulse" />
              <p className="text-xs text-neutral-350">Nenhum álbum corresponde ao filtro "{musicSearchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'artists' && (
        <div className="flex flex-col gap-2.5 animate-fade-in">
          {filteredArtists.length > 0 ? (
            filteredArtists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => onNavigate(`artist/${artist.id}`)}
                className="flex items-center gap-3.5 p-2 rounded-xl bg-neutral-900/40 hover:bg-neutral-850/85 cursor-pointer group border border-neutral-900/10 transition-all"
              >
                {artist.thumbnailUrl ? (
                  <img
                    src={artist.thumbnailUrl}
                    alt={artist.name}
                    className="w-11 h-11 rounded-full object-cover bg-neutral-800 shrink-0 shadow-md group-hover:scale-102 transition-transform duration-250"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700">
                    <Users className="w-5 h-5 text-neutral-500" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h4 className="text-[12.5px] font-bold text-white truncate leading-snug group-hover:text-[#1DB954] transition-colors">
                    {artist.name}
                  </h4>
                  <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                    Artista • {artist.songs.length} {artist.songs.length === 1 ? 'música cadastrada' : 'músicas cadastradas'}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors mr-1 shrink-0" />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
              <Users className="w-10 h-10 text-neutral-700 mb-2 animate-pulse" />
              <p className="text-xs text-neutral-300">Nenhum artista corresponde ao filtro "{musicSearchQuery}"</p>
            </div>
          )}
        </div>
      )}
      </div>{/* End Scrollable Content */}

      {/* Custom AlertDialog Dialog Box Overlay */}
      {isDialogOpen && (
        <div id="create_playlist_dialog_overlay" className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center px-5 z-55 animate-fade-in">
          <div 
            id="create_playlist_dialog"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl relative"
          >
            {/* Close touch trigger */}
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-all"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Banner */}
            <div className="w-12 h-12 rounded-full bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center mb-4 border border-[#1DB954]/20 shadow-inner">
              <FolderPlus className="w-6 h-6" />
            </div>

            {/* Title & Prompt */}
            <h3 className="text-base font-bold text-white tracking-tight">Nova Playlist</h3>
            <p className="text-xs text-neutral-400 mt-1 mb-4 leading-normal">
              Insira um título para organizar suas canções de estudo ou treino.
            </p>

            {/* Input fields */}
            <input
              id="playlist_name_input_field"
              type="text"
              value={newPlaylistName}
              onChange={(e) => {
                setNewPlaylistName(e.target.value);
                if (errorText) setErrorText('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
              }}
              autoFocus
              placeholder="Minhas Favoritas de Domingo"
              className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 text-xs text-white placeholder-neutral-600 outline-none focus:border-[#1DB954] transition-colors"
            />
            
            {/* Error alerts */}
            {errorText && (
              <p className="text-[10px] font-semibold text-red-500 mt-1.5 px-1 animate-pulse">
                {errorText}
              </p>
            )}

            {/* Buttons Row */}
            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                id="playlist_dialog_cancel"
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white active:scale-95 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="playlist_dialog_create"
                onClick={handleCreate}
                disabled={!newPlaylistName.trim()}
                className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all shadow active:scale-95 cursor-pointer ${
                  newPlaylistName.trim()
                    ? 'bg-[#1DB954] text-black hover:brightness-105 shadow-[#1DB954]/20'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-850'
                }`}
              >
                Criar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
