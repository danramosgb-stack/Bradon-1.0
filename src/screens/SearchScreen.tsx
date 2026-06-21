/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, X, Music, Play, AlertCircle, Sparkles, Disc, SlidersHorizontal } from 'lucide-react';
import { Song } from '../types';

interface SearchScreenProps {
  songs: Song[];
  onPlaySong: (song: Song, queue: Song[]) => void;
  onNavigate: (route: string) => void;
}

export default function SearchScreen({ songs, onPlaySong, onNavigate }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Categories/Genres to explore quickly
  const genres = [
    { name: 'Lofi', color: 'bg-indigo-600/70 border-indigo-500/50' },
    { name: 'Synthwave', color: 'bg-pink-600/70 border-pink-500/50' },
    { name: 'Piano', color: 'bg-emerald-600/70 border-emerald-500/50' },
    { name: 'Ambient', color: 'bg-violet-600/70 border-violet-500/50' },
    { name: 'Jazz Lounge', color: 'bg-amber-600/70 border-amber-500/50' },
  ];

  // Instantly filter when query text changes (to keep UX ultra reactive!)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Fetch live search results from YouTube Music API via our Server Proxy
    const timer = setTimeout(async () => {
      try {
        if (query.toLowerCase() === 'error') {
          throw new Error('Falha simulada ao conectar com os servidores.');
        }

        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) {
          throw new Error('Erro de conexão ao buscar faixas.');
        }

        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setResults(data.results);
        } else {
          // Fallback to local filter if search returned zero elements
          const filtered = songs.filter((song) => {
            const text = `${song.title} ${song.artist} ${song.album}`.toLowerCase();
            return text.includes(query.toLowerCase());
          });
          setResults(filtered);
        }
      } catch (err) {
        console.warn("Live search offline fallback mode active:", err);
        const filtered = songs.filter((song) => {
          const text = `${song.title} ${song.artist} ${song.album}`.toLowerCase();
          return text.includes(query.toLowerCase());
        });
        
        if (query.toLowerCase() === 'error') {
          setErrorMessage('Falha ao conectar com os servidores de música.');
          setResults([]);
        } else {
          setResults(filtered);
        }
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, songs]);

  // Handle manual category click
  const handleCategorySelect = (genreName: string) => {
    setQuery(genreName);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="search_screen" className="flex-1 w-full flex flex-col overflow-hidden">
      
      {/* 1. FIXED SEARCH BAR & TITLE HEADER */}
      <div className="shrink-0 px-4 pt-4 pb-2 bg-[#121212]/90 backdrop-blur-md z-10 border-b border-neutral-900/10">
        {/* Title */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold font-sans text-white tracking-tight">Buscar</h2>
          <Sparkles className="w-5 h-5 text-emerald-450 opacity-80" />
        </div>

        {/* Modern Search bar Container */}
        <div className="relative mb-3.5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-450 pointer-events-none" />
          <input
            id="search_input_field"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Músicas, artistas ou álbuns..."
            className="w-full h-11 bg-neutral-900 border border-neutral-800 text-[13.5px] rounded-full pl-11 pr-10 text-white placeholder-neutral-500 outline-none focus:border-emerald-500 transition-colors focus:ring-1 focus:ring-emerald-500/20"
          />
          {query && (
            <button
              id="clear_search_btn"
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-all"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Explore Category Chips inline to header */}
        {!query && (
          <div className="mb-2 shrink-0">
            <p className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold mb-2">
              Explorar gêneros
            </p>
            <div className="flex flex-wrap gap-2">
              {genres.map((g, idx) => (
                <button
                  key={idx}
                  id={`genre_chip_${idx}`}
                  onClick={() => handleCategorySelect(g.name)}
                  className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold text-white transition-all cursor-pointer active:scale-95 ${g.color} hover:brightness-110 shadow-sm`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. SCROLLABLE SEARCH RESULTS & STATES */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2 scrollbar-none">
        
        {/* Main Dynamic Panel (Results / States) */}
        <div className="flex-1 flex flex-col justify-start">
        
        {/* State A: Loading spinner */}
        {isLoading && (
          <div id="search_loading" className="flex-1 flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#1DB954]/20 border-t-[#1DB954] rounded-full animate-spin"></div>
            <p className="text-xs text-neutral-400 font-sans mt-3">Perscrutando acervo...</p>
          </div>
        )}

        {/* State B: Red Error state */}
        {!isLoading && errorMessage && (
          <div id="search_error" className="p-4 rounded-xl bg-red-950/40 border border-red-900/50 text-center my-6">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-red-200">Algo deu errado</h4>
            <p className="text-[11px] text-red-300 mt-1 leading-relaxed">{errorMessage}</p>
            <button
              onClick={() => setQuery('')}
              className="mt-3 px-4 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded-full text-[10px] uppercase tracking-widest font-bold"
            >
              Resetar Busca
            </button>
          </div>
        )}

        {/* State C: Empty/Instruction state when input is empty */}
        {!isLoading && !errorMessage && !query && (
          <div id="search_empty_prompt" className="flex flex-col gap-5">
            <div className="flex flex-col items-center justify-center py-6 text-center text-neutral-500">
              <div className="w-12 h-12 bg-neutral-900/60 rounded-full flex items-center justify-center border border-neutral-800 mb-3 animate-bounce-low">
                <Search className="w-5 h-5 text-neutral-400" />
              </div>
              <h3 className="text-xs font-bold text-neutral-300">O que você quer ouvir hoje?</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5 max-w-[240px] leading-relaxed">
                Digite um termo acima ou escolha uma das grandes sugestões abaixo.
              </p>
            </div>

            {/* Recommended Suggested Hits Section */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-2.5 flex items-center gap-1.5 px-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1DB954]" />
                <span>Sugestões de Sucessos recomendadas</span>
              </p>

              <div className="flex flex-col gap-2.5">
                {songs.slice(0, 10).map((song) => (
                  <div
                    key={song.id}
                    id={`suggested_hit_${song.id}`}
                    onClick={() => onPlaySong(song, songs.slice(0, 10))}
                    className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/40 hover:bg-neutral-850/80 cursor-pointer group transition-all duration-200 border border-neutral-900/10"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {song.thumbnailUrl ? (
                        <img
                          src={song.thumbnailUrl}
                          alt={song.title}
                          className="w-11 h-11 rounded-lg object-cover bg-neutral-800 shrink-0 shadow-sm"
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
                          {song.artist} • <span className="opacity-75">{song.album}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-1.5">
                      <span className="text-[10px] text-neutral-500 font-medium font-mono mr-1">
                        {formatDuration(song.duration)}
                      </span>
                      <button
                        className="w-7 h-7 rounded-full bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center border border-[#1DB954]/20 group-hover:bg-[#1DB954] group-hover:text-black transition-all active:scale-90"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* State D: No results state */}
        {!isLoading && !errorMessage && query && results.length === 0 && (
          <div id="search_no_results" className="flex-1 flex flex-col items-center justify-center py-16 text-center text-neutral-500 px-6">
            <Disc className="w-12 h-12 text-neutral-700 animate-spin-slow mb-3.5" />
            <h3 className="text-xs font-semibold text-neutral-300">Nenhum resultado para "{query}"</h3>
            <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
              Verifique a ortografia ou use palavras-chave simplificadas como "lofi" ou "synth".
            </p>
          </div>
        )}

        {/* State E: Results match list */}
        {!isLoading && !errorMessage && query && results.length > 0 && (
          <div id="search_results_container" className="flex flex-col gap-2.5 pb-4">
            <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5 flex items-center justify-between">
              <span>Resultados fundamentais</span>
              <span className="text-[9px] lowercase bg-neutral-900 px-2 py-0.5 rounded text-neutral-400 font-semibold">{results.length} itens</span>
            </p>

            {results.map((song) => (
              <div
                key={song.id}
                id={`search_result_${song.id}`}
                onClick={() => onPlaySong(song, results)}
                className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/50 hover:bg-neutral-850/80 cursor-pointer group transition-all duration-250 border border-neutral-900/30"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Image art */}
                  {song.thumbnailUrl ? (
                    <img
                      src={song.thumbnailUrl}
                      alt={song.title}
                      className="w-11 h-11 rounded-lg object-cover bg-neutral-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                      <Music className="w-5 h-5 text-neutral-500" />
                    </div>
                  )}

                  {/* Text titles */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[12.5px] font-semibold text-white truncate leading-snug group-hover:text-[#1DB954] transition-colors">
                      {song.title}
                    </h4>
                    <p className="text-[10.5px] text-neutral-400 truncate leading-normal">
                      Música • {song.artist}
                    </p>
                  </div>
                </div>

                {/* Right block: duration, source & play icon */}
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {formatDuration(song.duration)}
                    </span>
                    <span className="text-[8px] bg-[#1DB954]/10 text-[#1DB954] px-1 rounded-sm mt-0.5 pointer-events-none scale-90">
                      YT
                    </span>
                  </div>
                  
                  {/* Play circle trigger icon */}
                  <div className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-300 group-hover:bg-[#1DB954] group-hover:text-black flex items-center justify-center transition-all">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>{/* End Main Dynamic Panel */}
    </div>{/* End Scrollable Content */}
  </div>
  );
}
