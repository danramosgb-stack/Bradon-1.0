/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Song, Playlist, Artist, Album } from '../types';

export const SONGS: Song[] = [
  {
    id: "song_1",
    title: "Cosmic Whispers",
    artist: "Lofi Dreams",
    album: "Stardust Journey",
    duration: 372, // 6:12
    thumbnailUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    liked: true,
    source: "YouTube Music",
    lyrics: [
      "Starlight is fading slowly",
      "Wandering through deep orbit space",
      "We hear the cosmic whispers",
      "Of a long-forgotten, beautiful place.",
      "In the neon-colored nebulae",
      "Your hand holding mine so tight",
      "Chasing shadows on the comet lines",
      "Dancing through the stellar night."
    ]
  },
  {
    id: "song_2",
    title: "Neon Horizon",
    artist: "Synth Runner",
    album: "Arcade Cyberpunk",
    duration: 425, // 7:05
    thumbnailUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    liked: false,
    source: "YouTube Music",
    lyrics: [
      "Running through grid lines",
      "Synthetic blood pumping fast",
      "Laser sights on the future",
      "Let's escape from the heavy past.",
      "We are the cyber rebels",
      "Living in the electric glow",
      "Riding on keytar frequencies",
      "Watch our revolution grow."
    ]
  },
  {
    id: "song_3",
    title: "Midnight Groove",
    artist: "Jazz Odyssey",
    album: "Late Night Lounge",
    duration: 302, // 5:02
    thumbnailUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&auto=format&fit=crop&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    liked: true,
    source: "YouTube Music",
    lyrics: [
      "[Smooth Saxophone Instrumental Intro]",
      "Underneath the streetlights",
      "The bass starts to play its tune",
      "A cocktail of melodies",
      "Reaching for the full silver moon.",
      "Sip the jazz and feel the flow",
      "Time is standing perfectly still",
      "Slow down your racing racing mind",
      "Just enjoy the midnight chill."
    ]
  },
  {
    id: "song_4",
    title: "Velvet Sky",
    artist: "Soma Keys",
    album: "Acoustic Wonders",
    duration: 338, // 5:38
    thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    liked: false,
    source: "YouTube Music",
    lyrics: [
      "Birds heading south as day departs",
      "Leaving soft pink tracks in the sky",
      "With acoustic strings vibrating",
      "Waving our softest, warm goodbye.",
      "Velvet atmosphere, safe and sound",
      "No more noise, no more heavy rain",
      "Listening to your peaceful breathing",
      "Washes away all remaining pain."
    ]
  },
  {
    id: "song_5",
    title: "Echoes of Silence",
    artist: "Aurora Ambient",
    album: "Northern Lights",
    duration: 518, // 8:38
    thumbnailUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    liked: true,
    source: "YouTube Music",
    lyrics: [
      "[Deep modular synthesizer pulses]",
      "In the frozen north wind",
      "Coloured lights dance high above",
      "Quiet echoes of pure silence",
      "Sending down waves of pure love.",
      "Drifting on glacial sheets of audio",
      "Infinite space, infinite peace",
      "Let the weight of the city fall away",
      "As the cold frequencies increase."
    ]
  },
  {
    id: "song_6",
    title: "Retro Pulse",
    artist: "Vapor Echo",
    album: "Grid Speed",
    duration: 330, // 5:30
    thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    liked: false,
    source: "YouTube Music",
    lyrics: [
      "CRT static on the screens",
      "Palms waving in magenta breeze",
      "Drive down to the coastal bay",
      "Set your high-speed mind at ease.",
      "Outrun fuel and golden times",
      "Vapor waves that wash the coast",
      "We are the digital ghosts",
      "The ones who loved each other most."
    ]
  }
];

export const ARTISTS: Artist[] = [
  {
    id: "lofi_dreams",
    name: "Lofi Dreams",
    thumbnailUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    bio: "Lofi Dreams blends vintage jazz keyboard harmonies, lo-fidelity analog tape saturation, and crisp organic rhythms to create a beautiful, nostalgic escape for studying and resting.",
    songs: [SONGS[0]]
  },
  {
    id: "synth_runner",
    name: "Synth Runner",
    thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    bio: "Inspired by neon-lit alleys, retro gaming kiosks, and 8s sci-fi cinema, Synth Runner crafts fast-paced electro adventures complete with rich vintage analog synths.",
    songs: [SONGS[1]]
  },
  {
    id: "jazz_odyssey",
    name: "Jazz Odyssey",
    thumbnailUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    bio: "An improvisational band formed in London, Jazz Odyssey fuses organic keys, electronic sub-bass, and brilliant saxophone solos to redefine contemporary chill jazz.",
    songs: [SONGS[2]]
  },
  {
    id: "ambient_aurora",
    name: "Aurora Ambient",
    thumbnailUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    bio: "Making soundscapes on the remote coasts of Norway, Aurora Ambient pieces together field recordings, guitar swells, and modular synths into meditative drones.",
    songs: [SONGS[4]]
  }
];

export const ALBUMS: Album[] = [
  {
    id: "stardust_journey",
    title: "Stardust Journey",
    artist: "Lofi Dreams",
    thumbnailUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80",
    year: "2024",
    songs: [SONGS[0]]
  },
  {
    id: "arcade_cyberpunk",
    title: "Arcade Cyberpunk",
    artist: "Synth Runner",
    thumbnailUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80",
    year: "2023",
    songs: [SONGS[1]]
  },
  {
    id: "late_night_lounge",
    title: "Late Night Lounge",
    artist: "Jazz Odyssey",
    thumbnailUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&auto=format&fit=crop&q=80",
    year: "2025",
    songs: [SONGS[2]]
  },
  {
    id: "northern_lights",
    title: "Northern Lights",
    artist: "Aurora Ambient",
    thumbnailUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80",
    year: "2024",
    songs: [SONGS[4]]
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 101,
    name: "Foco Diário (Estudos)",
    thumbnailUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&auto=format&fit=crop&q=80",
    songs: [SONGS[0], SONGS[3], SONGS[4]]
  },
  {
    id: 102,
    name: "Viagem Noturna",
    thumbnailUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&auto=format&fit=crop&q=80",
    songs: [SONGS[1], SONGS[2], SONGS[5]]
  },
  {
    id: 103,
    name: "Minhas Favoritas",
    thumbnailUrl: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&auto=format&fit=crop&q=80",
    songs: SONGS.filter(s => s.liked)
  }
];
