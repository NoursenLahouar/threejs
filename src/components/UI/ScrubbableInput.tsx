"use client";

import { useEffect, useRef, useState } from "react";

interface ScrubbableInputProps {
    value: number;
    onChange: (value: number) => void;
    onDragStart?: () => void;
    label: string; // "X" | "Y" | "Z"
    step?: number;
}

export function ScrubbableInput({ value, onChange, onDragStart, label, step = 0.1 }: ScrubbableInputProps) {
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const startValue = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            e.preventDefault();

            const deltaX = e.clientX - startX.current;
            // Sensitivity multiplier: Shift key for precision? 
            // Default: 1px = 1 * step
            const sensitivity = step;

            const newValue = startValue.current + (deltaX * sensitivity);
            onChange(newValue);
        };

        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                document.body.style.cursor = 'default';
                document.body.style.userSelect = 'auto'; // Re-enable selection
            }
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, step, onChange]);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only start dragging if clicking the label part, or maybe allow checking drag on input?
        // User requested "changes changes boxes... easy to use with mouse".
        // Often 3D softwares use the LABEL as the dragger.
        if (onDragStart) onDragStart();
        setIsDragging(true);
        startX.current = e.clientX;
        startValue.current = value;

        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none'; // Disable text selection while scrubbing
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) onChange(val);
    };

    return (
        <div className="relative group flex items-center">
            {/* Draggable Label */}
            <div
                onMouseDown={handleMouseDown}
                className={`
                    absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center 
                    cursor-ew-resize z-10 select-none
                    ${label === 'X' ? 'text-red-400 group-hover:bg-red-500/20' : ''}
                    ${label === 'Y' ? 'text-green-400 group-hover:bg-green-500/20' : ''}
                    ${label === 'Z' ? 'text-blue-400 group-hover:bg-blue-500/20' : ''}
                    transition-colors rounded-l
                `}
            >
                <span className="text-xs font-bold drop-shadow-sm">{label}</span>
            </div>

            {/* Input Field */}
            <input
                type="number"
                step={step}
                value={Number(value).toFixed(2)} // Keep it controlled for display
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-white/10 rounded px-2 pl-9 py-1 text-xs text-white focus:outline-none focus:border-white/40 transition-colors text-right font-mono"
            />
        </div>
    );
}
