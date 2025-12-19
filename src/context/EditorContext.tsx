"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';

export type ObjectType = "cube" | "sphere" | "mushroom";

export interface SceneObject {
    id: string;
    type: ObjectType;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    color: string;
    name?: string;
}

interface EditorContextType {
    objects: SceneObject[];
    selectedIds: string[];
    addObject: (type: ObjectType) => void;
    selectObject: (ids: string[] | null) => void;
    toggleSelection: (id: string) => void;
    updateObject: (id: string, updates: Partial<SceneObject>, transient?: boolean) => void;
    deleteObject: (id: string) => void;
    duplicateObject: (id: string) => void;
    transformMode: "translate" | "rotate" | "scale";
    setTransformMode: (mode: "translate" | "rotate" | "scale") => void;
    undo: () => void;
    redo: () => void;
    saveSnapshot: () => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
    // Initialize with a default mushroom object
    const [objects, setObjects] = useState<SceneObject[]>([
        {
            id: uuidv4(),
            type: "mushroom",
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            color: "#ffffff",
            name: "Mushroom 1"
        }
    ]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">("translate");

    // History Stacks
    const [past, setPast] = useState<SceneObject[][]>([]);
    const [future, setFuture] = useState<SceneObject[][]>([]);

    const saveSnapshot = useCallback(() => {
        setPast((prev) => [...prev, objects]);
        setFuture([]); // Clear redo stack on new action
    }, [objects]);

    const undo = useCallback(() => {
        if (past.length === 0) return;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        setFuture((prev) => [objects, ...prev]);
        setPast(newPast);
        setObjects(previous);

        // Clear selection of objects that no longer exist
        setSelectedIds((prev) => prev.filter(id => previous.find(o => o.id === id)));
    }, [past, objects]);

    const redo = useCallback(() => {
        if (future.length === 0) return;

        const next = future[0];
        const newFuture = future.slice(1);

        setPast((prev) => [...prev, objects]);
        setFuture(newFuture);
        setObjects(next);
    }, [future, objects]);

    const addObject = useCallback((type: ObjectType) => {
        // Save history state before adding
        setPast((prev) => [...prev, objects]);
        setFuture([]);

        const id = uuidv4();
        const newObj: SceneObject = {
            id,
            type,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            color: type === "cube" ? "#6366f1" : type === "sphere" ? "#ec4899" : "#ffffff", // Indigo/Pink/White
            name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${objects.length + 1}`
        };

        setObjects((prev) => [...prev, newObj]);
        setSelectedIds([id]);
    }, [objects]);

    const selectObject = useCallback((ids: string[] | null) => {
        setSelectedIds(ids || []);
    }, []);

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) {
                // Deselect if already selected
                return prev.filter(selectedId => selectedId !== id);
            } else {
                // Add to selection
                return [...prev, id];
            }
        });
    }, []);

    const updateObject = useCallback((id: string, updates: Partial<SceneObject>, transient = false) => {
        if (!transient) {
            // If not transient (e.g. final commit), save snapshot of CURRENT state before update
            // However, we rely on 'objects' being fresh. 
            // If updateObject is called, 'objects' closure might be stale if dep array is empty.
            // But we need to save the *state before this update*.
            // We can't access 'objects' inside setState updater for history saving purposes easily.
            // So we must depend on 'objects'.
            setPast((prev) => [...prev, objects]);
            setFuture([]);
        }

        setObjects((prev) =>
            prev.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj))
        );
    }, [objects]);

    const deleteObject = useCallback((id: string) => {
        setPast((prev) => [...prev, objects]);
        setFuture([]);

        setObjects((prev) => prev.filter((obj) => obj.id !== id));
        setSelectedIds((prev) => prev.filter(selectedId => selectedId !== id));
    }, [objects]);

    const duplicateObject = useCallback((id: string) => {
        const original = objects.find((o) => o.id === id);
        if (!original) return;

        setPast((prev) => [...prev, objects]);
        setFuture([]);

        const newId = uuidv4();
        const newObject: SceneObject = {
            ...original,
            id: newId,
            position: [original.position[0] + 2, original.position[1], original.position[2]],
            name: original.name ? `${original.name} (Copy)` : "Object (Copy)"
        };

        setObjects((prev) => [...prev, newObject]);
        setSelectedIds([newId]);
    }, [objects]);

    return (
        <EditorContext.Provider
            value={{
                objects,
                selectedIds,
                addObject,
                selectObject,
                toggleSelection,
                updateObject,
                deleteObject,
                duplicateObject,
                transformMode,
                setTransformMode,
                undo,
                redo,
                saveSnapshot
            }}
        >
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("useEditor must be used within an EditorProvider");
    }
    return context;
}
