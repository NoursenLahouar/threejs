
"use client";

import { useEffect } from "react";
import { SceneProvider } from "@/components/SceneProvider";
import { OrbitControlsWrapper } from "./Three/OrbitControls";
import { useEditor } from "@/context/EditorContext";
import { ObjectManager } from "./Three/ObjectManager";
import { SelectionManager } from "./Three/SelectionManager";
import { SelectionHighlight } from "./Three/SelectionHighlight";
import { TransformControlsWrapper } from "./Three/TransformControlsWrapper";
import { TransformToolbar } from "./UI/TransformToolbar";
import { AddMeshDropdown } from "./UI/AddMeshDropdown";

export default function ViewPort() {
    const {
        selectedIds,
        deleteObject,
        duplicateObject,
        undo,
        redo,
        setTransformMode
    } = useEditor();

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if input is active (to avoid capturing typing)
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

            // Undo/Redo
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                undo();
                return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                redo();
                return;
            }

            // Transform Modes
            if (e.key.toLowerCase() === 'm') setTransformMode('translate');
            if (e.key.toLowerCase() === 'r') setTransformMode('rotate');
            if (e.key.toLowerCase() === 's') setTransformMode('scale');

            if (selectedIds.length === 0) return;

            // Delete all selected objects
            if (e.key === 'Delete' || e.key === 'Backspace') {
                selectedIds.forEach(id => deleteObject(id));
            }

            // Duplicate all selected objects
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                selectedIds.forEach(id => duplicateObject(id));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIds, deleteObject, duplicateObject, undo, redo, setTransformMode]);

    return (
        <div className="h-full w-full relative">
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
            <div className="absolute top-4 left-4 z-10">
                <AddMeshDropdown />
            </div>

            {/* Transform Toolbar - Only show when object(s) selected */}
            {selectedIds.length > 0 && <TransformToolbar />}
        </div>
    );
}
