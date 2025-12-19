"use client";

import { useEditor, SceneObject } from "@/context/EditorContext";
import { useEffect, useState } from "react";

export function PropertiesPanel() {
    const { objects, selectedIds, updateObject, deleteObject, duplicateObject, saveSnapshot } = useEditor();

    // Find the selected object(s)
    const selectedObjects = objects.filter(obj => selectedIds.includes(obj.id));

    if (selectedIds.length === 0) return null;

    // Multi-selection: show count and limited controls
    if (selectedIds.length > 1) {
        return (
            <div className="flex flex-col gap-6 p-4 overflow-y-auto h-full">
                <h2 className="text-white font-semibold text-lg">Multiple Objects Selected ({selectedIds.length})</h2>

                <div className="text-white/50 text-sm">
                    Multi-object editing coming soon. For now, you can:
                </div>

                <div className="mt-auto pt-4 border-t border-white/10 space-y-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => selectedIds.forEach(id => duplicateObject(id))}
                            className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 text-xs py-2 rounded transition-colors border border-blue-500/20"
                        >
                            Duplicate All
                        </button>
                        <button
                            onClick={() => selectedIds.forEach(id => deleteObject(id))}
                            className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-200 text-xs py-2 rounded transition-colors border border-red-500/20"
                        >
                            Delete All
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Single selection: show full properties
    const selectedObject = selectedObjects[0];

    return (
        <div className="flex flex-col gap-6 p-4 overflow-y-auto h-full">
            <h2 className="text-white font-semibold text-lg">{selectedObject.name || "Object"}</h2>

            {/* Position */}
            <Vector3Input
                label="Position"
                values={selectedObject.position}
                onCommit={() => saveSnapshot()}
                onChange={(newVal) => updateObject(selectedObject.id, { position: newVal }, true)}
            />

            {/* Rotation (Convert Radians to Degrees for UI) */}
            <Vector3Input
                label="Rotation"
                values={[
                    selectedObject.rotation[0] * (180 / Math.PI),
                    selectedObject.rotation[1] * (180 / Math.PI),
                    selectedObject.rotation[2] * (180 / Math.PI),
                ]}
                step={1}
                onCommit={() => saveSnapshot()}
                onChange={(degrees) => updateObject(selectedObject.id, {
                    rotation: [
                        degrees[0] * (Math.PI / 180),
                        degrees[1] * (Math.PI / 180),
                        degrees[2] * (Math.PI / 180),
                    ]
                }, true)}
            />

            {/* Scale */}
            <Vector3Input
                label="Scale"
                values={selectedObject.scale}
                step={0.1}
                onCommit={() => saveSnapshot()}
                onChange={(newVal) => updateObject(selectedObject.id, { scale: newVal }, true)}
            />

            {/* Color */}
            {/* Only show color for primitives? Or force it for everything? */}
            <div className="space-y-2">
                <label className="text-white/70 text-xs uppercase font-bold tracking-wider">Color</label>
                <div className="flex gap-2 items-center">
                    <input
                        type="color"
                        value={selectedObject.color}
                        onChange={(e) => updateObject(selectedObject.id, { color: e.target.value })}
                        className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                    <span className="text-white/50 text-xs">{selectedObject.color}</span>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/10 space-y-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => duplicateObject(selectedObject.id)}
                        className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 text-xs py-2 rounded transition-colors border border-blue-500/20"
                    >
                        Duplicate
                    </button>
                    <button
                        onClick={() => deleteObject(selectedObject.id)}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-200 text-xs py-2 rounded transition-colors border border-red-500/20"
                    >
                        Delete
                    </button>
                </div>
                <p className="text-xs text-white/30 text-center font-mono">{selectedObject.id.slice(0, 8)}...</p>
            </div>
        </div>
    );
}

import { ScrubbableInput } from "./ScrubbableInput";

// Low-level helper for X, Y, Z inputs
function Vector3Input({
    label,
    values,
    onChange,
    onCommit,
    step = 0.1
}: {
    label: string,
    values: [number, number, number],
    onChange: (val: [number, number, number]) => void,
    onCommit?: () => void,
    step?: number
}) {
    // We don't need local state as much if we trust the parent, but keeping it for immediate feedback is okay.
    // Actually, ScrubbableInput is controlled.

    const handleChange = (index: 0 | 1 | 2, newVal: number) => {
        const newArr = [...values] as [number, number, number];
        newArr[index] = newVal;
        onChange(newArr);
    };

    return (
        <div className="space-y-2">
            <label className="text-white/70 text-xs uppercase font-bold tracking-wider">{label}</label>
            <div className="grid grid-cols-3 gap-2">
                <ScrubbableInput
                    label="X"
                    value={values[0]}
                    onChange={(v) => handleChange(0, v)}
                    step={step}
                />
                <ScrubbableInput
                    label="Y"
                    value={values[1]}
                    onChange={(v) => handleChange(1, v)}
                    step={step}
                />
                <ScrubbableInput
                    label="Z"
                    value={values[2]}
                    onChange={(v) => handleChange(2, v)}
                    step={step}
                />
            </div>
        </div>
    );
}
