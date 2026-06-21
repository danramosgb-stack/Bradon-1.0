/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Play, Music, Heart, Calendar, Disc, User, ListMusic } from 'lucide-react';
import { Song, Playlist, Artist, Album } from '../types';

interface DetailScreensProps {
  route: string; // e.g. "playlist/101" or "artist/lofi_dreams"
  playlists: Playlist[];
  artists: Artist[];
  albums: Album[];
  songs: Song[];
  onPlaySong: (song: Song, queue: Song[]) => void;
  onBack: () => void;
  onToggleLike: (songId: string) => void;
}

export default function DetailScreens({
  route,
  playlists,
  artists,
  albums,
  songs,
  onPlaySong,
  onBack,
  onToggleLike,
}: DetailScreensProps) {
  // Parse route string: "type/id"
  const [type, id] = route.split('/');

  let title = "Detalhes";
  let subtitle = "";
  let description = "";
  let coverImg: string | null = null;
  let trackList: Song[] = [];
  let headerTypeLabel = "";
  let iconLabelElement: React.ReactNode = <Disc className="w-4 h-4" />;

  if (type === 'playlist') {
    const playlistId = parseInt(id);
    const plist = playlists.find((p) => p.id === playlistId);
    if (plist) {
      title = plist.name;
      subtitle = `Playlist Virtual • ${plist.songs.length} músicas`;
      description = "Playlist personalizada criada por você ou sugerida pelo sistema.";
      coverImg = plist.thumbnailUrl;
      trackList = plist.songs;
      headerTypeLabel = "Playlist";
      iconLabelElement = <ListMusic className="w-4 h-4 text-emerald-400" />;
    }
  } else if (type === 'artist') {
    const artist = artists.find((a) => a.id === id);
    if (artist) {
      title = artist.name;
      subtitle = "Artista Verificado • Recomendado";
      description = artist.bio;
      coverImg = artist.thumbnailUrl;
      trackList = artist.songs;
      headerTypeLabel = "Artista";
      iconLabelElement = <User className="w-4 h-4 text-emerald-400" />;
    }
  } else if (type === 'album') {
    const album = albums.find((a) => a.id === id);
    if (album) {
      title = album.title;
      subtitle = `${album.artist} • Lançamento ${album.year}`;
      description = `Álbum oficial de estúdio de ${album.artist}, disponível em streaming sem compressão.`;
      coverImg = album.thumbnailUrl;
      trackList = album.songs;
      headerTypeLabel = "Álbuns";
      iconLabelElement = <Disc className="w-4 h-4 text-emerald-400" />;
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayAll = () => {
    if (trackList.length > 0) {
      onPlaySong(trackList[0], trackList);
    }
  };

  return (
    <div id="detail_screen" className="flex-1 w-full overflow-y-auto pb-24 relative flex flex-col scrollbar-none animate-fade-in bg-[#121212]">
      
      {/* 1. Header Toolbar Float */}
      <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-3 z-30 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button
          id="detail_back_btn"
          onClick={onBack}
          className="p-2 ml-1 rounded-full bg-black/40 hover:bg-black/80 text-white transition-all pointer-events-auto active:scale-90"
          title="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Visual Top artwork Hero banner */}
      <div className="w-full relative pt-12 pb-6 px-4 bg-gradient-to-b from-emerald-900/35 to-neutral-900 flex flex-col items-center text-center select-none shadow">
        
        {/* Cover Graphic Card */}
        <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-2xl mb-4 bg-neutral-900 mt-4">
          {coverImg ? (
            <img
              src={coverImg}
              alt={title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-neutral-950 flex items-center justify-center text-neutral-600">
              <Music className="w-14 h-14" />
            </div>
          )}
        </div>

        {/* Labels info */}
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-extrabold text-neutral-400 mb-1">
          {iconLabelElement}
          <span>{headerTypeLabel}</span>
        </div>

        <h3 className="text-xl font-extrabold text-white tracking-tight line-clamp-1 max-w-full px-2">
          {title}
        </h3>

        <p className="text-[11.5px] font-semibold text-neutral-300 mt-1">
          {subtitle}
        </p>

        <p className="text-[10px] text-neutral-500 max-w-[280px] mt-2 line-clamp-2 leading-relaxed">
          {description}
        </p>

      </div>

      {/* 3. Action keys Row under banner */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-neutral-900/50 bg-neutral-900/20">
        
        <span className="text-[10.5px] font-mono text-neutral-400 uppercase font-bold">
          Músicas do álbum/lista ({trackList.length})
        </span>

        {/* Play Group trigger Button */}
        {trackList.length > 0 && (
          <button
            id="detail_play_circle"
            onClick={handlePlayAll}
            className="w-11 h-11 rounded-full bg-[#1DB954] text-black shadow-lg shadow-[#1DB954]/20 flex items-center justify-center active:scale-95 transition-all text-xs cursor-pointer hover:brightness-105"
            title="Tocar tudo"
          >
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </button>
        )}
      </div>

      {/* 4. Track rows container */}
      <div className="flex flex-col gap-1 px-3 mt-3">
        {trackList.length === 0 ? (
          <div className="py-12 text-center text-neutral-600 flex flex-col items-center">
            <Music className="w-10 h-10 mb-3" />
            <h4 className="text-xs font-semibold text-neutral-400">Esta playlist está vazia</h4>
            <p className="text-[10px] text-neutral-500 max-w-[200px] mt-1 leading-relaxed">
              Pesquise músicas e adicione-as a esta playlist tocando no botão curtir.
            </p>
          </div>
        ) : (
          trackList.map((song, index) => (
            <div
              key={song.id}
              id={`detail_track_${song.id}_index_${index}`}
              onClick={() => onPlaySong(song, trackList)}
              className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/10 hover:bg-neutral-850/60 cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Index tag or visual speaker */}
                <span className="w-5 text-center text-xs text-neutral-500 font-mono group-hover:text-[#1DB954] font-medium shrink-0">
                  {index + 1}
                </span>

                {/* Cover small thumb (optional fallback) */}
                {song.thumbnailUrl && (
                  <img
                    src={song.thumbnailUrl}
                    alt={song.title}
                    className="w-9 h-9 rounded object-cover shrink-0 bg-neutral-800 shadow"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Info titles */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-[12.5px] font-semibold text-stone-100 truncate group-hover:text-[#1DB954] transition-colors leading-snug">
                    {song.title}
                  </h4>
                  <p className="text-[10.5px] text-neutral-400 truncate leading-snug">
                    {song.artist}
                  </p>
                </div>
              </div>

              {/* End block: actions & length */}
              <div className="flex items-center gap-3 shrink-0 ml-1">
                <button
                  id={`detail_track_heart_${song.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLike(song.id);
                  }}
                  className="p-1 px-1.5 text-neutral-500 hover:text-red-500 hover:scale-105 active:scale-95 transition-all"
                  title="Curtir música"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      song.liked ? 'fill-[#1DB954] text-[#1DB954]' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  />
                </button>
                
                <span className="text-[11px] font-mono text-neutral-400 p-1">
                  {formatDuration(song.duration)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
