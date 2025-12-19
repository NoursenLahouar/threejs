"use client";

import { useEditor } from "@/context/EditorContext";
import { useEffect, useState } from "react";

export function TransformToolbar() {
    const { selectedIds, transformMode, setTransformMode } = useEditor();

    // Only show if object is selected
    if (selectedIds.length === 0) return null;

    const modes = [
        { id: 'translate', label: 'Move', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' }, // Simplified
        { id: 'rotate', label: 'Rotate', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
        { id: 'scale', label: 'Scale', icon: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' }
    ] as const;

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/10 shadow-xl">
            {modes.map((mode) => (
                <button
                    key={mode.id}
                    onClick={() => setTransformMode(mode.id)}
                    className={`
                        relative px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all
                        ${transformMode === mode.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }
                    `}
                >
                    {/* Icon (SVG) */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mode.icon} />
                    </svg>
                    <span>{mode.label}</span>
                </button>
            ))}
        </div>
    );
}
