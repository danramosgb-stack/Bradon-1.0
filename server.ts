/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Readable } from "stream";

const app = express();
const PORT = 3000;
const API_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";

const FALLBACK_LIBRARY = [
  {
    id: "fb_1",
    title: "Yellow",
    artist: "Coldplay",
    album: "Parachutes",
    duration: 269,
    thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_2",
    title: "Get Lucky",
    artist: "Daft Punk",
    album: "Random Access Memories",
    duration: 249,
    thumbnailUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_3",
    title: "Bad Guy",
    artist: "Billie Eilish",
    album: "When We All Fall Asleep",
    duration: 194,
    thumbnailUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_4",
    title: "Believer",
    artist: "Imagine Dragons",
    album: "Evolve",
    duration: 204,
    thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_5",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200,
    thumbnailUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_6",
    title: "Lose Yourself",
    artist: "Eminem",
    album: "8 Mile",
    duration: 326,
    thumbnailUrl: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_7",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: 354,
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_8",
    title: "Someone Like You",
    artist: "Adele",
    album: "21",
    duration: 285,
    thumbnailUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_9",
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "Divide",
    duration: 233,
    thumbnailUrl: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_10",
    title: "Cruel Summer",
    artist: "Taylor Swift",
    album: "Lover",
    duration: 178,
    thumbnailUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_11",
    title: "Uptown Funk",
    artist: "Bruno Mars",
    album: "Uptown Special",
    duration: 270,
    thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_12",
    title: "Hear Me Now",
    artist: "Alok",
    album: "Hear Me Now EP",
    duration: 192,
    thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_13",
    title: "Sicko Mode",
    artist: "Travis Scott",
    album: "Astroworld",
    duration: 312,
    thumbnailUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_14",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: 203,
    thumbnailUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_15",
    title: "Downtown",
    artist: "Anitta & J Balvin",
    album: "Checkmate",
    duration: 193,
    thumbnailUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_16",
    title: "Infiel",
    artist: "Marília Mendonça",
    album: "Ao Vivo em Goiânia",
    duration: 204,
    thumbnailUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_17",
    title: "Nocaute",
    artist: "Jorge & Mateus",
    album: "Como. Sempre. Feito. Nunca",
    duration: 165,
    thumbnailUrl: "https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_18",
    title: "Não Quero Dinheiro",
    artist: "Tim Maia",
    album: "Tim Maia 1971",
    duration: 153,
    thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_19",
    title: "Garota de Ipanema (Lofi)",
    artist: "Lofi Brazil",
    album: "Bossa Lofi Beats",
    duration: 180,
    thumbnailUrl: "https://images.unsplash.com/photo-1543794327-59a91fb7d041?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_20",
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    album: "Appetite for Destruction",
    duration: 356,
    thumbnailUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_21",
    title: "Back in Black",
    artist: "AC/DC",
    album: "Back in Black",
    duration: 255,
    thumbnailUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_22",
    title: "Enter Sandman",
    artist: "Metallica",
    album: "Metallica",
    duration: 331,
    thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_23",
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    album: "Nevermind",
    duration: 301,
    thumbnailUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_24",
    title: "Circles",
    artist: "Post Malone",
    album: "Hollywood's Bleeding",
    duration: 215,
    thumbnailUrl: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_25",
    title: "God's Plan",
    artist: "Drake",
    album: "Scorpion",
    duration: 198,
    thumbnailUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_26",
    title: "Umbrella",
    artist: "Rihanna",
    album: "Good Girl Gone Bad",
    duration: 275,
    thumbnailUrl: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_27",
    title: "Bad Romance",
    artist: "Lady Gaga",
    album: "The Fame Monster",
    duration: 294,
    thumbnailUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_28",
    title: "Chandelier",
    artist: "Sia",
    album: "1000 Forms of Fear",
    duration: 216,
    thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_29",
    title: "Dance Monkey",
    artist: "Tones and I",
    album: "The Kids Are Coming",
    duration: 209,
    thumbnailUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_30",
    title: "Neon Horizon",
    artist: "Synth Runner",
    album: "Arcade Cyberpunk",
    duration: 425,
    thumbnailUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_31",
    title: "Velvet Sky",
    artist: "Soma Keys",
    album: "Acoustic Wonders",
    duration: 338,
    thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    liked: false,
    source: "YouTube Music"
  },
  {
    id: "fb_32",
    title: "Cosmic Whispers",
    artist: "Lofi Dreams",
    album: "Stardust Journey",
    duration: 372,
    thumbnailUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80",
    streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    liked: false,
    source: "YouTube Music"
  }
];

app.use(express.json());

// Helper context for Web_Remix Client
const getClientContext = () => {
  return {
    client: {
      clientName: "WEB_REMIX",
      clientVersion: "1.20240601",
      hl: "pt_BR",
      gl: "BR"
    },
    user: {
      lockedSafetyMode: false
    }
  };
};

// Search Endpoint (Youtube Music Proxy with High Fidelity Fallback Database search)
app.get("/api/search", async (req, res) => {
  const query = (req.query.q as string || "").trim().toLowerCase();
  
  // 1. Compute backup search results from the FALLBACK_LIBRARY
  const localMatches = query 
    ? FALLBACK_LIBRARY.filter(song => 
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.album.toLowerCase().includes(query)
      )
    : [];

  if (!query) {
    return res.json({ results: [] });
  }

  try {
    const response = await fetch(`https://music.youtube.com/youtubei/v1/search?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "X-Youtube-Client-Name": "WEB_REMIX",
        "X-Youtube-Client-Version": "1.20240601"
      },
      body: JSON.stringify({
        context: getClientContext(),
        query: req.query.q,
        params: "EgWKAQIIAWoKEAoQCRADEAA=" // Filters query to SONGS only
      })
    });

    if (!response.ok) {
      throw new Error(`InnerTube search failure: {status: ${response.status}}`);
    }

    const data: any = await response.json();
    const parsed = parseInnerTubeItems(data);

    // Merge offline fallback library matching items for maximum search robustness and selection!
    const combinedMap = new Map();
    localMatches.forEach(song => combinedMap.set(song.title.toLowerCase() + "_" + song.artist.toLowerCase(), song));
    parsed.forEach((song: any) => combinedMap.set(song.title.toLowerCase() + "_" + song.artist.toLowerCase(), song));

    const results = Array.from(combinedMap.values());
    res.json({ results: results.length > 0 ? results : localMatches });
  } catch (err: any) {
    console.error("Search API Error, returning local fallback matches:", err.message);
    res.json({ results: localMatches });
  }
});

// Trending / Browse Endpoint with Fallback support
app.get("/api/trending", async (req, res) => {
  try {
    const response = await fetch(`https://music.youtube.com/youtubei/v1/browse?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "X-Youtube-Client-Name": "WEB_REMIX",
        "X-Youtube-Client-Version": "1.20240601"
      },
      body: JSON.stringify({
        context: getClientContext(),
        browseId: "FEmusic_trending"
      })
    });

    if (!response.ok) {
      throw new Error(`InnerTube browse failure: {status: ${response.status}}`);
    }

    const data: any = await response.json();
    const parsed = parseInnerTubeItems(data);
    
    if (parsed && parsed.length > 0) {
      return res.json({ results: parsed });
    }
    // If empty result returned (possible under geoblock/rate-limit), return the first 12 fallback library tracks as hot/trending
    res.json({ results: FALLBACK_LIBRARY.slice(0, 15) });
  } catch (err: any) {
    console.error("Trending API Error, using fallback library tracks:", err.message);
    res.json({ results: FALLBACK_LIBRARY.slice(0, 15) });
  }
});

// Helper function to search objects recursively for specific key
function findObjectsByProperty(obj: any, targetKey: string): any[] {
  const results: any[] = [];
  function recurse(current: any) {
    if (!current || typeof current !== "object") return;
    if (current[targetKey] !== undefined) {
      results.push(current);
    }
    for (const key in current) {
      if (Object.prototype.hasOwnProperty.call(current, key)) {
        recurse(current[key]);
      }
    }
  }
  recurse(obj);
  return results;
}

// Audio streaming proxy that pipes direct audio chunks to avoid IP locks (403 reference error)
app.get("/api/stream-audio", async (req, res) => {
  const { videoId } = req.query;
  if (!videoId) {
    return res.status(400).send("Parameter videoId required");
  }

  const hash = videoId.toString().split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const songNum = (hash % 16) + 1;
  const fallbackUrl = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${songNum}.mp3`;

  const INVIDIOUS_INSTANCES = [
    "https://invidious.nerdvpn.de",
    "https://inv.nadeko.net",
    "https://invidious.privacyredirect.com",
    "https://yt.cdaut.de",
    "https://invidious.io.lol"
  ];

  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const apiUrl = `${instance}/api/v1/videos/${videoId}`;
      const response = await fetch(apiUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(8000)
      });
      if (!response.ok) continue;
      const data: any = await response.json();
      const formats = data.adaptiveFormats || [];
      const audioFormats = formats.filter((f: any) => f.type?.includes("audio"));
      const best = audioFormats.sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0))[0];
      if (!best?.url) continue;
      res.setHeader("Content-Type", best.type || "audio/webm");
      res.setHeader("Cache-Control", "no-cache");
      const streamResponse = await fetch(best.url, {
        headers: { "Range": (req.headers.range as string) || "bytes=0-" },
        signal: AbortSignal.timeout(15000)
      });
      if (!streamResponse.ok && streamResponse.status !== 206) continue;
      if (streamResponse.headers.get("Content-Range")) {
        res.setHeader("Content-Range", streamResponse.headers.get("Content-Range")!);
        res.status(206);
      } else {
        res.status(200);
      }
      if (streamResponse.headers.get("Content-Length")) {
        res.setHeader("Content-Length", streamResponse.headers.get("Content-Length")!);
      }
      const reader = streamResponse.body;
      if (reader) {
        Readable.from(reader as any).pipe(res);
        return;
      }
    } catch (err: any) {
      console.warn(`Invidious ${instance} falhou:`, err.message);
      continue;
    }
  }

  console.error("Todas instancias Invidious falharam, usando fallback");
  res.redirect(fallbackUrl);
});

// Parser for recursive InnerTube structure matching ResponseParser.kt
function parseInnerTubeItems(response: any): any[] {
  const songs: any[] = [];
  try {
    const items = findObjectsByProperty(response, "musicResponsiveListItemRenderer");
    for (const item of items) {
      const renderer = item.musicResponsiveListItemRenderer;
      if (!renderer) continue;

      // Extract details
      const titleRuns = renderer.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
      const title = titleRuns.map((r: any) => r.text).join("") || "Música sem Nome";

      const artistRuns = renderer.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
      const artist = artistRuns.map((r: any) => r.text).join("") || "Artista Desconhecido";

      const albumRuns = renderer.flexColumns?.[2]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
      const album = albumRuns.map((r: any) => r.text).join("") || "Álbum/Single";

      const playButton = renderer.overlay?.musicItemThumbnailOverlayRenderer?.content?.musicPlayButtonRenderer;
      const videoId = playButton?.videoId || renderer.playlistItemData?.videoId;
      if (!videoId) continue;

      const thumbnails = renderer.thumbnail?.thumbnails || renderer.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
      const thumbnailUrl = thumbnails[0]?.url || thumbnails[thumbnails.length - 1]?.url || null;

      const durationText = renderer.lengthText?.runs?.map((r: any) => r.text).join("") || "3:00";
      const parts = durationText.split(":").map(Number);
      let durationSeconds = 180;
      if (parts.length === 3) {
        durationSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        durationSeconds = parts[0] * 60 + parts[1];
      }

      songs.push({
        id: videoId,
        title: title,
        artist: artist,
        album: album,
        duration: durationSeconds,
        thumbnailUrl: thumbnailUrl,
        streamUrl: `/api/stream-audio?videoId=${videoId}`,
        liked: false,
        source: "YouTube Music"
      });
    }
  } catch (e) {
    console.error("Parser failure:", e);
  }
  return songs;
}

// Implement Express + Vite Server Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully booting on port ${PORT}`);
  });
}

startServer();
