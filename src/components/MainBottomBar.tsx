/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Search, Library, Settings } from 'lucide-react';

interface MainBottomBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function MainBottomBar({ currentTab, onTabChange }: MainBottomBarProps) {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'search', label: 'Buscar', icon: Search },
    { id: 'library', label: 'Biblioteca', icon: Library },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <div id="main_bottom_bar" className="w-full bg-[#121212]/98 border-t border-neutral-900 px-2 py-1.5 flex items-center justify-around z-40 shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        
        return (
          <button
            key={tab.id}
            id={`tab_${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative group flex-1"
          >
            <div className={`p-1 rounded-lg transition-transform duration-200 group-active:scale-90 ${isActive ? 'text-[#1DB954]' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
              <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
            </div>
            
            <span 
              className={`text-[10px] font-medium tracking-tight mt-0.5 select-none transition-colors duration-200 ${
                isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </span>

            {/* Micro active layout marker */}
            {isActive && (
              <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
