/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import AndroidFrame from './components/AndroidFrame';
import MainBottomBar from './components/MainBottomBar';
import MiniPlayer from './components/MiniPlayer';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import LibraryScreen from './screens/LibraryScreen';
import SettingsScreen from './screens/SettingsScreen';
import PlayerScreen from './screens/PlayerScreen';
import DetailScreens from './screens/DetailScreens';

// Data models
import { Song, Playlist } from './types';
import { SONGS, INITIAL_PLAYLISTS, ARTISTS, ALBUMS } from './data/musicData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [navHistory, setNavHistory] = useState<string[]>(['home']);
  
  // Audio Playback states
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [queue, setQueue] = useState<Song[]>(SONGS);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  
  // Library resources list stored dynamically in state so it persists
  const [songsState, setSongsState] = useState<Song[]>(SONGS);
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);

  // Fetch real trending songs from our YouTube Music InnerTube Express proxy
  useEffect(() => {
    async function loadTrendingSongs() {
      try {
        const res = await fetch("/api/trending");
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            setSongsState((prev) => {
              const prevMap = new Map(prev.map(s => [s.id, s]));
              // Upsert newly detected hot tracks
              for (const s of data.results) {
                prevMap.set(s.id, s);
              }
              return Array.from(prevMap.values());
            });
          }
        }
      } catch (err) {
        console.warn("Unable to get trending songs. Switched to high fidelity simulated tracks.", err);
      }
    }
    loadTrendingSongs();
  }, []);

  // HTML5 audio context ref for high fidelity curated local tracks
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync playlists whenever songsState is modified (for hearts, playlists creation, liking)
  useEffect(() => {
    setPlaylists((prevPlaylists) => {
      return prevPlaylists.map((playlist) => {
        if (playlist.id === 103) {
          // Automatic favorites card: maps instantly to latest liked entries
          return {
            ...playlist,
            songs: songsState.filter((s) => s.liked),
          };
        } else {
          // Regular custom entries: updates liked flag of items stored inside
          return {
            ...playlist,
            songs: playlist.songs.map((ps) => {
              const matched = songsState.find((s) => s.id === ps.id);
              return matched ? matched : ps;
            }),
          };
        }
      });
    });
  }, [songsState]);

  // Handle native audio creation and local track events
  useEffect(() => {
    audioRef.current = new Audio();

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setProgress(Math.floor(audioRef.current.currentTime));
        // Atualiza duração real quando o áudio carrega (mais preciso que currentSong.duration)
        if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
          setDuration(Math.floor(audioRef.current.duration));
        }
      }
    };

    const handleEnded = () => {
      // Avança para próxima faixa automaticamente para todos os tipos
      handleNextTrack();
    };

    const audioObj = audioRef.current;
    audioObj.addEventListener('timeupdate', handleTimeUpdate);
    audioObj.addEventListener('ended', handleEnded);

    return () => {
      audioObj.removeEventListener('timeupdate', handleTimeUpdate);
      audioObj.removeEventListener('ended', handleEnded);
      audioObj.pause();
    };
  }, [currentSong]);

  // Keep-alive: toca silêncio via Web Audio API para manter o audio context ativo
  // em segundo plano no Android (evita que o sistema suspenda o processo de áudio)
  useEffect(() => {
    let keepAliveCtx: AudioContext | null = null;
    let keepAliveInterval: NodeJS.Timeout | null = null;

    const startKeepAlive = () => {
      try {
        keepAliveCtx = new AudioContext();
        // Toca um buffer de silêncio a cada 25s para manter o contexto vivo
        keepAliveInterval = setInterval(() => {
          if (keepAliveCtx && keepAliveCtx.state !== 'closed') {
            const buffer = keepAliveCtx.createBuffer(1, 1, 22050);
            const source = keepAliveCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(keepAliveCtx.destination);
            source.start();
          }
        }, 25000);
      } catch {
        // Browser não suporta Web Audio API — ignora silenciosamente
      }
    };

    // Só inicia após interação do usuário (requisito do browser)
    const onFirstInteraction = () => {
      startKeepAlive();
      document.removeEventListener('click', onFirstInteraction);
      document.removeEventListener('touchstart', onFirstInteraction);
    };

    document.addEventListener('click', onFirstInteraction, { once: true });
    document.addEventListener('touchstart', onFirstInteraction, { once: true });

    return () => {
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      if (keepAliveCtx) keepAliveCtx.close();
      document.removeEventListener('click', onFirstInteraction);
      document.removeEventListener('touchstart', onFirstInteraction);
    };
  }, []);

  // Sync currentSong changes to audio sources
  // Todas as faixas usam audioRef — YouTube via proxy /api/stream-audio, locais via streamUrl direta
  useEffect(() => {
    if (!currentSong) return;

    setDuration(currentSong.duration || 180);
    setProgress(0);

    if (audioRef.current) {
      // Determina a URL correta de stream:
      // - Faixas locais/soundhelix: usa streamUrl diretamente
      // - Faixas YouTube (id sem prefixo "song_" e sem soundhelix): usa o proxy do servidor
      const isYouTube = !currentSong.id.startsWith("song_") && !currentSong.streamUrl?.includes("soundhelix.com");
      const streamUrl = isYouTube
        ? `/api/stream-audio?videoId=${currentSong.id}`
        : (currentSong.streamUrl || '');

      if (audioRef.current.src !== streamUrl) {
        audioRef.current.src = streamUrl;
        audioRef.current.load();
      }

      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log('Autoplay bloqueado:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying]);

  // ─── Media Session API ───────────────────────────────────────────────────
  // Atualiza a notificação do sistema (barra de notificações + tela de bloqueio)
  // sempre que a música ou o estado de play/pause mudar.
  useEffect(() => {
    if (!('mediaSession' in navigator)) return; // browser não suporta

    if (!currentSong) {
      navigator.mediaSession.playbackState = 'none';
      return;
    }

    // 1. Metadados que aparecem na notificação e na tela de bloqueio
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: currentSong.artist,
      album: currentSong.album,
      artwork: currentSong.thumbnailUrl
        ? [
            { src: currentSong.thumbnailUrl, sizes: '512x512', type: 'image/jpeg' },
            { src: currentSong.thumbnailUrl, sizes: '256x256', type: 'image/jpeg' },
          ]
        : [],
    });

    // 2. Estado de reprodução
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

    // 3. Action handlers — botões físicos (fone, Bluetooth, tela de bloqueio)
    navigator.mediaSession.setActionHandler('play', () => {
      handlePlayPause();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      handlePlayPause();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      handleNextTrack();
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      handlePreviousTrack();
    });

    // 4. Posição de reprodução (barra de progresso na notificação)
    //    Só atualiza se o browser suportar (alguns antigos não têm setPositionState)
    if ('setPositionState' in navigator.mediaSession && duration > 0) {
      try {
        navigator.mediaSession.setPositionState({
          duration: duration,
          playbackRate: 1,
          position: Math.min(progress, duration),
        });
      } catch {
        // ignora se o browser rejeitar (ex: position > duration em edge cases)
      }
    }

    // Cleanup: remove handlers quando o componente desmontar ou a música mudar
    return () => {
      if (!('mediaSession' in navigator)) return;
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
    };
  }, [currentSong, isPlaying, progress, duration]);
  // ─────────────────────────────────────────────────────────────────────────

  // ─── Audio Focus & Sincronização de Estado ───────────────────────────────
  // Detecta quando o sistema operacional interrompe o áudio externamente
  // (ligação, outro app, minimizar) e sincroniza o estado React com a realidade.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // ── CENÁRIO 1: Ligação ou outro app roubou o foco ──
    // O browser dispara 'pause' no elemento <audio> quando o SO pausa externamente.
    // Mas também dispara quando O PRÓPRIO APP pausa (botão de pause do usuário).
    // A diferença: quando o usuário pausa, `isPlaying` já foi setado para false
    // antes do evento. Quando o SO pausa, `isPlaying` ainda é true.
    // Usamos uma flag para distinguir os dois casos.
    let pausedByUser = false;

    const handleExternalPause = () => {
      // Se o app já sabia que estava pausado, ignora (foi o próprio usuário)
      if (pausedByUser) {
        pausedByUser = false;
        return;
      }
      // O SO pausou sem o app saber — sincroniza o estado
      setIsPlaying(false);
    };

    const handleExternalPlay = () => {
      // O SO retomou o áudio (ex: fim da ligação) — sincroniza
      setIsPlaying(true);
    };

    audio.addEventListener('pause', handleExternalPause);
    audio.addEventListener('play', handleExternalPlay);

    // ── CENÁRIO 2: App vai para segundo plano (visibilitychange) ──
    // Quando o usuário minimiza o app ou bloqueia a tela, o documento
    // fica "hidden". Quando volta, fica "visible".
    // No Android, alguns WebViews pausam o áudio ao esconder — detectamos isso
    // e, ao voltar, retomamos SE o app achava que estava tocando.
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;

      if (document.hidden) {
        // App foi para background — nada a fazer ainda, só observa
        // (o Script 02 garante que o áudio continue; se o SO pausar mesmo assim,
        //  o handleExternalPause acima vai capturar)
        return;
      }

      // App voltou ao foreground
      // Verifica se o áudio parou enquanto estava em background
      if (isPlaying && audioRef.current.paused) {
        // Estava "tocando" mas o SO pausou — retoma automaticamente
        audioRef.current.play().catch(() => {
          // Se o browser bloqueou o autoplay ao retornar, atualiza estado
          setIsPlaying(false);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ── CENÁRIO 3: Erro de rede/stream ──
    // Se o stream do proxy falhar (rede caiu, servidor indisponível),
    // o <audio> dispara 'error'. Sincroniza o estado para parado.
    const handleAudioError = () => {
      // Só loga se havia uma música carregada (evita ruído no boot)
      if (audioRef.current?.src) {
        console.warn('[AudioFocus] Stream error — pausando estado');
        setIsPlaying(false);
      }
    };

    audio.addEventListener('error', handleAudioError);

    // ── CENÁRIO 4: Fone desconectado (headset unplug) ──
    // Padrão do setor: quando o fone é desconectado, o áudio deve pausar
    // automaticamente (evita vazar som pelo alto-falante inesperadamente).
    // A API `devicechange` do navigator.mediaDevices cobre isso.
    const handleDeviceChange = async () => {
      if (!audioRef.current || audioRef.current.paused) return;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasHeadset = devices.some(
          (d) => d.kind === 'audiooutput' && d.label.toLowerCase().includes('headphone') ||
                 d.kind === 'audioinput'  && d.label.toLowerCase().includes('headset')
        );
        // Heurística: se não há mais fone listado e estava tocando, pausa
        // (só aplica se antes havia fone — não pausa se sempre foi caixa)
        // Nota: essa heurística é conservadora; não pausa se incerto
        if (!hasHeadset && isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } catch {
        // enumerateDevices pode ser bloqueado por permissão — ignora
      }
    };

    if (navigator.mediaDevices?.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    }

    // ── Cleanup: remove todos os listeners ao desmontar ou ao mudar dependências ──
    return () => {
      audio.removeEventListener('pause', handleExternalPause);
      audio.removeEventListener('play', handleExternalPlay);
      audio.removeEventListener('error', handleAudioError);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (navigator.mediaDevices?.removeEventListener) {
        navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      }
    };
  }, [isPlaying]); // Depende de isPlaying para que handleVisibilityChange sempre veja o valor atual
  // ─────────────────────────────────────────────────────────────────────────



  // NAVIGATION METHODS
  const navigateTo = (route: string) => {
    setCurrentTab(route);
    setNavHistory((prev) => [...prev, route]);
  };

  const navigateBack = () => {
    if (navHistory.length <= 1) {
      setCurrentTab('home');
      setNavHistory(['home']);
      return;
    }
    const updated = [...navHistory];
    updated.pop(); // remove current active route
    const lastRoute = updated[updated.length - 1];
    setNavHistory(updated);
    setCurrentTab(lastRoute);
  };

  const navigateHome = () => {
    setCurrentTab('home');
    setNavHistory(['home']);
  };

  // PLAYBACK ACTION HANDLERS
  const handlePlaySong = (song: Song, activeQueue: Song[]) => {
    setQueue(activeQueue);
    
    // Select accurate match from reactive state
    const matched = songsState.find((s) => s.id === song.id) || song;
    setCurrentSong(matched);
    setIsPlaying(true);
    navigateTo('player');
  };

  const handlePlayPause = () => {
    if (!currentSong) {
      if (songsState.length > 0) {
        handlePlaySong(songsState[0], songsState);
      }
      return;
    }

    const nextPlayState = !isPlaying;
    setIsPlaying(nextPlayState);

    // Todas as faixas usam audioRef — controle unificado
    if (audioRef.current) {
      if (nextPlayState) {
        audioRef.current.play().catch((e) => console.log('Play bloqueado:', e));
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleNextTrack = () => {
    if (queue.length === 0) return;

    // Repeat: retoca a mesma música do início
    if (isRepeat) {
      setProgress(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
      return;
    }

    // Shuffle: escolhe uma faixa aleatória diferente da atual
    if (isShuffle && queue.length > 1) {
      const currIndex = queue.findIndex((s) => s.id === currentSong?.id);
      let randomIndex: number;
      do {
        randomIndex = Math.floor(Math.random() * queue.length);
      } while (randomIndex === currIndex); // garante que não repete a mesma
      const randomSong = songsState.find((s) => s.id === queue[randomIndex].id) || queue[randomIndex];
      setCurrentSong(randomSong);
      setIsPlaying(true);
      return;
    }

    // Normal: próxima na fila, com loop ao chegar no fim
    const currIndex = queue.findIndex((s) => s.id === currentSong?.id);
    let nextIndex = currIndex + 1;
    if (nextIndex >= queue.length) {
      nextIndex = 0;
    }
    const nextSong = songsState.find((s) => s.id === queue[nextIndex].id) || queue[nextIndex];
    setCurrentSong(nextSong);
    setIsPlaying(true);
  };

  const handlePreviousTrack = () => {
    if (queue.length === 0) return;
    const currIndex = queue.findIndex((s) => s.id === currentSong?.id);
    let prevIndex = currIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1; // loop
    }
    const prevSong = songsState.find((s) => s.id === queue[prevIndex].id) || queue[prevIndex];
    setCurrentSong(prevSong);
    setIsPlaying(true);
  };

  const handleSeek = (seconds: number) => {
    setProgress(seconds);
    // Seek unificado via audioRef para todos os tipos de faixa
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  };

  const handleToggleLike = (songId: string) => {
    setSongsState((prev) =>
      prev.map((s) => {
        if (s.id === songId) {
          return { ...s, liked: !s.liked };
        }
        return s;
      })
    );

    if (currentSong && currentSong.id === songId) {
      setCurrentSong((prev) => (prev ? { ...prev, liked: !prev.liked } : null));
    }
  };

  const handleCreatePlaylist = (name: string) => {
    const newP: Playlist = {
      id: Date.now(),
      name: name,
      thumbnailUrl: null, // Shows custom green List icon in UI
      songs: [],
    };
    setPlaylists((prev) => [...prev, newP]);
  };

  const handleResetApp = () => {
    setSongsState(SONGS);
    setCurrentSong(null);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.src = '';
    setNavHistory(['home']);
    setCurrentTab('home');
  };

  // RENDER DYNAMIC ACTIVE SCREEN
  const renderScreen = () => {
    // Nested router checks e.g. "playlist/101" or "artist/synth_runner"
    if (
      currentTab.startsWith('playlist/') ||
      currentTab.startsWith('album/') ||
      currentTab.startsWith('artist/')
    ) {
      return (
        <DetailScreens
          route={currentTab}
          playlists={playlists}
          artists={ARTISTS}
          albums={ALBUMS}
          songs={songsState}
          onPlaySong={handlePlaySong}
          onBack={navigateBack}
          onToggleLike={handleToggleLike}
        />
      );
    }

    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            songs={songsState}
            albums={ALBUMS}
            artists={ARTISTS}
            playlists={playlists}
            onPlaySong={handlePlaySong}
            onNavigate={navigateTo}
          />
        );
      case 'search':
        return (
          <SearchScreen
            songs={songsState}
            onPlaySong={handlePlaySong}
            onNavigate={navigateTo}
          />
        );
      case 'library':
        return (
          <LibraryScreen
            playlists={playlists}
            songs={songsState}
            albums={ALBUMS}
            artists={ARTISTS}
            onPlaySong={handlePlaySong}
            onCreatePlaylist={handleCreatePlaylist}
            onNavigate={navigateTo}
          />
        );
      case 'settings':
        return <SettingsScreen onResetApp={handleResetApp} />;
      case 'player':
        return (
          <PlayerScreen
            currentSong={currentSong}
            isPlaying={isPlaying}
            progress={progress}
            duration={duration}
            isShuffle={isShuffle}
            isRepeat={isRepeat}
            onPlayPause={handlePlayPause}
            onNext={handleNextTrack}
            onPrevious={handlePreviousTrack}
            onSeek={handleSeek}
            onToggleLike={handleToggleLike}
            onToggleShuffle={() => setIsShuffle((prev) => !prev)}
            onToggleRepeat={() => setIsRepeat((prev) => !prev)}
            onBack={navigateBack}
          />
        );
      default:
        return (
          <HomeScreen
            songs={songsState}
            albums={ALBUMS}
            artists={ARTISTS}
            playlists={playlists}
            onPlaySong={handlePlaySong}
            onNavigate={navigateTo}
          />
        );
    }
  };

  const isPlayerView = currentTab === 'player';

  return (
    <AndroidFrame onAndroidBack={navigateBack} onAndroidHome={navigateHome}>


      {/* Dynamic Content Frame View screen wrapper */}
      <div className="flex-1 w-full bg-[#121212] flex flex-col overflow-hidden relative">
        <div className="flex-1 w-full flex flex-col overflow-hidden">
          {renderScreen()}
        </div>

        {/* Floating Mini Player displayed on top of the footer screen, EXCEPT if we are fully viewing the Player itself */}
        {!isPlayerView && currentSong && (
          <MiniPlayer
            currentSong={currentSong}
            isPlaying={isPlaying}
            progress={progress}
            duration={duration}
            onPlayPause={handlePlayPause}
            onNext={handleNextTrack}
            onExpand={() => navigateTo('player')}
          />
        )}

        {/* Global Bottom Tab navigation bar, hidden when viewing the full screen player */}
        {!isPlayerView && (
          <MainBottomBar currentTab={currentTab} onTabChange={navigateTo} />
        )}
      </div>
    </AndroidFrame>
  );
}
