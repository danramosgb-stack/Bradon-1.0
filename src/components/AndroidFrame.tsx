/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ChevronLeft, Circle, Square } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  onAndroidBack?: () => void;
  onAndroidHome?: () => void;
}

export default function AndroidFrame({ children }: AndroidFrameProps) {
  return (
    <div className="h-[100dvh] w-full bg-neutral-950 flex flex-col overflow-hidden">
      <div className="flex-1 w-full flex flex-col relative overflow-hidden">
        {children}
      </div>
    </div>
  );
}
