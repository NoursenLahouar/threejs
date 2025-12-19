
"use client";

import { SceneProvider } from "@/components/SceneProvider";
import { OrbitControlsWrapper } from "./Three/OrbitControls";
import { EditorProvider, useEditor } from "@/context/EditorContext";
import { ObjectManager } from "./Three/ObjectManager";
import { SelectionManager } from "./Three/SelectionManager";
import { SelectionHighlight } from "./Three/SelectionHighlight";
import { TransformControlsWrapper } from "./Three/TransformControlsWrapper";

export default function ViewPort() {
    return (
        <div className="h-[70vh] w-full rounded-2xl border border-white/10 bg-black/20 overflow-hidden relative">
            <EditorProvider>
                {/* The SceneProvider creates the div ref and canvas internally */}
                <SceneProvider>
                    {/* Scene Content Managers */}
                    <ObjectManager />
                    <SelectionManager />
                    <SelectionHighlight />
                    <TransformControlsWrapper />

                    {/* Controls */}
                    <OrbitControlsWrapper />
                </SceneProvider>

                {/* UI Overlay */}
                <OverlayUI />
            </EditorProvider>
        </div>
    );
}

function OverlayUI() {
    const { addObject } = useEditor();

    return (
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            <button
                onClick={() => addObject("cube")}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg backdrop-blur-md transition-colors border border-white/10"
            >
                Add Cube
            </button>
            <button
                onClick={() => addObject("sphere")}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg backdrop-blur-md transition-colors border border-white/10"
            >
                Add Sphere
            </button>
            <button
                onClick={() => addObject("mushroom")}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg backdrop-blur-md transition-colors border border-white/10"
            >
                Add Mushroom
            </button>
        </div>
    );
}
