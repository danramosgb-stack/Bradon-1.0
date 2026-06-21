/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sliders, Headphones, Disc, Flame, RefreshCcw, ShieldCheck, Heart, Radio, Check } from 'lucide-react';

interface SettingsScreenProps {
  onResetApp: () => void;
}

export default function SettingsScreen({ onResetApp }: SettingsScreenProps) {
  const [audioQuality, setAudioQuality] = useState('alto'); // baixo, normal, alto, premium
  const [equalizerBass, setEqualizerBass] = useState(70);
  const [equalizerMid, setEqualizerMid] = useState(50);
  const [equalizerTreble, setEqualizerTreble] = useState(65);
  const [isDataSaver, setIsDataSaver] = useState(false);
  const [showDoneReset, setShowDoneReset] = useState(false);

  const handleReset = () => {
    onResetApp();
    setShowDoneReset(true);
    setTimeout(() => {
      setShowDoneReset(false);
    }, 2500);
  };

  return (
    <div id="settings_screen" className="flex-1 w-full flex flex-col overflow-hidden">
      
      {/* 1. FIXED ADJUSTMENTS HEADER */}
      <div className="shrink-0 px-4 pt-4 pb-2 bg-[#121212]/90 backdrop-blur-md z-10 border-b border-neutral-900/10">
        <h2 className="text-2xl font-bold font-sans text-white tracking-tight">Ajustes</h2>
        <p className="text-[11px] text-[#1DB954] font-mono mt-0.5 uppercase tracking-wider">Bradon • Configuração e Desempenho</p>
      </div>

      {/* 2. SCROLLABLE CONTENTS VIEWER */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2 scrollbar-none">
        
        {/* 1. SECTION: Qualidade do Áudio */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-3">
          <Headphones className="w-4 h-4 text-[#1DB954]" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1DB954]">Qualidade de Reprodução</h3>
        </div>
        
        <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-805/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-semibold text-neutral-100">Transmissão em alta fidelidade</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">Usa codecs de áudio 320 kbps (simulado)</p>
            </div>
            <input
              id="data_saver_toggle"
              type="checkbox"
              checked={!isDataSaver}
              onChange={() => setIsDataSaver(!isDataSaver)}
              className="w-4.5 h-4.5 rounded bg-neutral-800 text-[#1DB954] accent-[#1DB954] cursor-pointer"
            />
          </div>

          <div className="border-t border-neutral-800/40 my-1"></div>

          {/* Selector options */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'baixo', label: 'Econômico (96k)' },
              { id: 'normal', label: 'Padrão (160k)' },
              { id: 'alto', label: 'Estúdio (322k)' }
            ].map((opt) => (
              <button
                key={opt.id}
                id={`quality_opt_${opt.id}`}
                onClick={() => setAudioQuality(opt.id)}
                className={`py-1.5 px-2 rounded-lg text-[9.5px] font-bold text-center border transition-all cursor-pointer ${
                  audioQuality === opt.id
                    ? 'bg-[#1DB954]/10 border-[#1DB954] text-[#1DB954]'
                    : 'bg-neutral-950/40 border-neutral-800/60 text-neutral-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SECTION: Equalizador de Frequência */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-3">
          <Sliders className="w-4 h-4 text-[#1DB954]" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1DB954]">Equalizador de Frequência</h3>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-805/40 flex flex-col gap-3.5">
          {/* Bass */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-neutral-300">Grave (Bass Boost)</span>
              <span className="text-[#1DB954] font-bold">+{equalizerBass}%</span>
            </div>
            <input
              id="eq_bass_slider"
              type="range"
              min="0"
              max="100"
              value={equalizerBass}
              onChange={(e) => setEqualizerBass(parseInt(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
            />
          </div>

          {/* Mid */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-neutral-300">Médio (Vocals)</span>
              <span className="text-neutral-400 font-bold">{equalizerMid}%</span>
            </div>
            <input
              id="eq_mid_slider"
              type="range"
              min="0"
              max="100"
              value={equalizerMid}
              onChange={(e) => setEqualizerMid(parseInt(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
            />
          </div>

          {/* Treble */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-neutral-300">Agudo (Treble Boost)</span>
              <span className="text-[#1DB954] font-bold">+{equalizerTreble}%</span>
            </div>
            <input
              id="eq_treble_slider"
              type="range"
              min="0"
              max="100"
              value={equalizerTreble}
              onChange={(e) => setEqualizerTreble(parseInt(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
            />
          </div>
        </div>
      </div>

      {/* 3. SECTION: Reset / Cache controls */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-3">
          <RefreshCcw className="w-4 h-4 text-neutral-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Dados do Aplicativo</h3>
        </div>

        <button
          id="btn_reset_cache"
          onClick={handleReset}
          className="w-full p-3.5 rounded-2xl bg-neutral-900/40 hover:bg-red-950/20 border border-neutral-800 hover:border-red-900/30 text-center transition-all cursor-pointer group"
        >
          {showDoneReset ? (
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-bold">
              <Check className="w-4 h-4" />
              <span>Memória e Playlists Resetadas!</span>
            </div>
          ) : (
            <div>
              <p className="text-[12px] font-bold text-red-400 group-hover:text-red-300">Limpar Cache e Redefinir Banco</p>
              <p className="text-[9.5px] text-neutral-550 mt-0.5">Apaga playlists customizadas e zera estatísticas</p>
            </div>
          )}
        </button>
      </div>

      {/* Section 4: Specifications Info (App Details) */}
      <div className="mt-auto pt-6 text-center text-[10px] text-neutral-500 font-mono border-t border-neutral-900/60 pb-4">
        <div className="flex items-center justify-center gap-1 mb-1 text-neutral-400 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1DB954]" />
          <span>Bradon Core v1.0.8</span>
        </div>
        <p>Bradon Player Engine • React 19 • Tailwind v4</p>
      </div>

      </div>{/* End Scrollable Content */}
    </div>
  );
}
