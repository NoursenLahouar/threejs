"use client";

import { useEditor, ObjectType } from "@/context/EditorContext";
import { useState, useRef, useEffect } from "react";

export function AddMeshDropdown() {
    const { addObject } = useEditor();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAdd = (type: ObjectType) => {
        addObject(type);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg backdrop-blur-md transition-colors border border-white/10 flex items-center gap-2"
            >
                <span>Add Mesh</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col">
                    <button
                        onClick={() => handleAdd("mushroom")}
                        className="px-4 py-3 text-left text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                        {/* Optional Icon/Emoji */}
                        <span>Add Mushroom</span>
                    </button>
                    <div className="h-px bg-white/10 mx-2" />
                    <button
                        onClick={() => handleAdd("cube")}
                        className="px-4 py-3 text-left text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                        <span>Add Box</span>
                    </button>
                    <button
                        onClick={() => handleAdd("sphere")}
                        className="px-4 py-3 text-left text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                        <span>Add Sphere</span>
                    </button>
                </div>
            )}
        </div>
    );
}
