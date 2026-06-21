/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Play, Flame, Clock, Music, Disc, User, Heart } from 'lucide-react';
import { Song, Album, Artist, Playlist } from '../types';

interface HomeScreenProps {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
  onPlaySong: (song: Song, queue: Song[]) => void;
  onNavigate: (route: string) => void;
}

export default function HomeScreen({
  songs,
  albums,
  artists,
  playlists,
  onPlaySong,
  onNavigate,
}: HomeScreenProps) {
  // Determine dynamic greeting based on Brazilian/Portuguese standards
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 6 && hours < 12) return 'Bom dia';
    if (hours >= 12 && hours < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Curate "Em alta" trending songs
  const trendingSongs = songs.slice(0, 4);

  // Curate "Tocadas recentemente" vertical list songs
  const recentSongs = [...songs].reverse();

  // Quick shortcuts list matching Spotify's grid top selection
  const shortcuts = [
    { name: 'Foco Diário', img: playlists[0]?.thumbnailUrl, route: 'playlist/101' },
    { name: 'Viagem Noturna', img: playlists[1]?.thumbnailUrl, route: 'playlist/102' },
    { name: 'Minhas Favoritas', img: playlists[2]?.thumbnailUrl, route: 'playlist/103' },
    { name: 'Late Night Lounge', img: albums[2]?.thumbnailUrl, route: 'album/late_night_lounge' },
  ];

  return (
    <div id="home_screen" className="flex-1 w-full flex flex-col overflow-hidden antialiased">
      
      {/* Dynamic Spotify Greeting - FIXED HEADER */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3 bg-[#121212]/90 backdrop-blur-md shrink-0 z-10 border-b border-neutral-900/10">
        <h2 className="text-2xl font-bold font-sans tracking-tight text-white">
          {getGreeting()}
        </h2>
        
        {/* Humble, clean sound visualizer node as accent */}
        <div className="flex items-center gap-1">
          <div className="w-1 h-3.5 bg-[#1DB954] rounded-sm animate-pulse"></div>
          <div className="w-1 h-5 bg-[#1DB954] rounded-sm animate-pulse-delay-1"></div>
          <div className="w-1 h-2 bg-[#1DB954] rounded-sm animate-pulse-delay-2"></div>
        </div>
      </div>

      {/* Main content - SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2 scrollbar-none">
        {/* Quick Shortcuts Grid (Spotify Vibe columns) */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {shortcuts.map((sc, i) => (
          <div
            key={i}
            id={`shortcut_${i}`}
            onClick={() => sc.route && onNavigate(sc.route)}
            className="flex items-center bg-neutral-900/60 rounded-lg overflow-hidden hover:bg-neutral-800/80 transition-all cursor-pointer border border-neutral-900/40 relative group"
          >
            {sc.img ? (
              <img
                src={sc.img}
                alt={sc.name}
                className="w-14 h-14 object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-14 h-14 bg-neutral-850 flex items-center justify-center shrink-0">
                <Music className="w-5 h-5 text-neutral-500" />
              </div>
            )}
            <span className="text-[11.5px] font-semibold text-white px-2.5 line-clamp-2 leading-snug flex-1">
              {sc.name}
            </span>
            <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1DB954] p-1.5 rounded-full shadow-md text-black">
              <Play className="w-3.5 h-3.5 fill-black" />
            </div>
          </div>
        ))}
      </div>

      {/* Section 1: "Em alta" - Horizontal LazyRow Carousel */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-3.5">
          <Flame className="w-4.5 h-4.5 text-orange-500 fill-orange-550" />
          <h3 className="text-[17px] font-bold text-white tracking-tight">Em alta</h3>
        </div>

        {/* Horizontal Scroll Containers */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 snap-x">
          {trendingSongs.map((song) => (
            <div
              key={song.id}
              id={`trending_${song.id}`}
              onClick={() => onPlaySong(song, songs)}
              className="w-[140px] shrink-0 snap-start cursor-pointer group"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2 shadow-lg bg-neutral-900">
                {song.thumbnailUrl ? (
                  <img
                    src={song.thumbnailUrl}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-950 flex items-center justify-center">
                    <Music className="w-10 h-10 text-neutral-700" />
                  </div>
                )}
                
                {/* Visual hovering play button overlay */}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-[#1DB954] p-3 rounded-full text-black transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 shadow-md">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </div>
              </div>
              
              <h4 className="text-xs font-bold text-zinc-100 truncate mt-1 leading-snug">
                {song.title}
              </h4>
              <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                {song.artist}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Sections: Albums & Artists Carousel */}
      <div className="mb-6">
        <h3 className="text-[17px] font-bold text-white tracking-tight mb-3">Artistas sugeridos</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              id={`artist_row_${artist.id}`}
              onClick={() => onNavigate(`artist/${artist.id}`)}
              className="w-[95px] shrink-0 cursor-pointer text-center group"
            >
              <div className="relative w-[85px] h-[85px] rounded-full overflow-hidden mx-auto mb-2 bg-neutral-950 shadow-md">
                {artist.thumbnailUrl ? (
                  <img
                    src={artist.thumbnailUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-neutral-600" />
                  </div>
                )}
              </div>
              <h4 className="text-[11px] font-semibold text-neutral-100 truncate">{artist.name}</h4>
              <span className="text-[9px] text-neutral-400">Ver Perfil</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: "Tocadas recentemente" - Vertical list */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-3.5">
          <Clock className="w-4.5 h-4.5 text-emerald-400" />
          <h3 className="text-[17px] font-bold text-white tracking-tight">Tocadas recentemente</h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {recentSongs.map((song, idx) => (
            <div
              key={`${song.id}_recent_${idx}`}
              id={`recent_${song.id}_${idx}`}
              onClick={() => onPlaySong(song, songs)}
              className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/40 hover:bg-neutral-850/70 cursor-pointer group border border-neutral-900/20"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Thumbnail */}
                <div className="relative w-11 h-11 rounded-md overflow-hidden shrink-0 bg-neutral-800">
                  {song.thumbnailUrl ? (
                    <img
                      src={song.thumbnailUrl}
                      alt={song.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-5 h-5 text-neutral-600" />
                    </div>
                  )}
                  {/* Floating index tag */}
                  <span className="absolute top-0.5 left-0.5 bg-black/60 text-[7px] px-1 rounded text-neutral-400">
                    {idx + 1}
                  </span>
                </div>

                {/* Info titles */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-[12.5px] font-semibold text-stone-100 truncate leading-snug group-hover:text-[#1DB954] transition-colors">
                    {song.title}
                  </h4>
                  <p className="text-[10.5px] text-neutral-400 truncate leading-normal">
                    {song.artist} • <span className="text-zinc-500 font-sans">{song.album}</span>
                  </p>
                </div>
              </div>

              {/* Status and Action markers */}
              <div className="flex items-center gap-1 ml-2 shrink-0">
                {song.liked && (
                  <Heart className="w-3.5 h-3.5 text-[#1DB954] fill-[#1DB954] mr-1.5" />
                )}
                {/* Quick play arrow on hover */}
                <div className="bg-neutral-800 group-hover:bg-[#1DB954] group-hover:text-black p-2 rounded-full transition-colors text-neutral-400 text-xs">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>{/* End Scrollable Content */}

    </div>
  );
}
