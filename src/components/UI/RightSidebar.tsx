"use client";

import { SceneOutliner } from "./SceneOutliner";
import { PropertiesPanel } from "./PropertiesPanel";
import { useEditor } from "@/context/EditorContext";
import { useState, useRef, useEffect } from "react";

export function RightSidebar() {
    const { selectedIds } = useEditor();

    // Height of the top panel (Outliner) in percentage
    const [topHeightPercent, setTopHeightPercent] = useState(40);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            // Calculate relative Y position within the container
            const relativeY = e.clientY - containerRect.top;

            // Convert to percentage
            let newPercent = (relativeY / containerRect.height) * 100;

            // Clamp (min 20%, max 80%)
            if (newPercent < 20) newPercent = 20;
            if (newPercent > 80) newPercent = 80;

            setTopHeightPercent(newPercent);
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            document.body.style.cursor = 'default';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleMouseDown = () => {
        isDragging.current = true;
        document.body.style.cursor = 'row-resize';
    };

    return (
        <div
            ref={containerRef}
            className="w-80 border-l border-white/10 bg-black/20 flex flex-col h-full bg-clip-padding backdrop-filter backdrop-blur-xl shrink-0"
        >
            {/* Top: Outliner */}
            <div style={{ height: `${topHeightPercent}%` }} className="overflow-hidden flex flex-col min-h-[100px]">
                <SceneOutliner />
            </div>

            {/* Drag Handle */}
            <div
                onMouseDown={handleMouseDown}
                className="h-1 bg-white/5 hover:bg-blue-500/50 cursor-row-resize shrink-0 transition-colors flex items-center justify-center group"
            >
                {/* Handle visual indicator */}
                <div className="w-10 h-1 bg-white/10 rounded-full group-hover:bg-white/40" />
            </div>

            {/* Bottom: Properties */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                {selectedIds.length > 0 ? (
                    <PropertiesPanel />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-white/30 text-xs">
                        Select an object to view properties
                    </div>
                )}
            </div>
        </div>
    );
}
