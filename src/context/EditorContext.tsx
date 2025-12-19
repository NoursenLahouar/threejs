"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export type ObjectType = "cube" | "sphere" | "mushroom";

export interface SceneObject {
    id: string;
    type: ObjectType;
    name: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    color: string;
}

interface EditorContextType {
    objects: SceneObject[];
    selectedId: string | null;
    addObject: (type: ObjectType) => void;
    selectObject: (id: string | null) => void;
    updateObject: (id: string, updates: Partial<SceneObject>) => void;
    removeObject: (id: string) => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function useEditor() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("useEditor must be used within an EditorProvider");
    }
    return context;
}

export function EditorProvider({ children }: { children: ReactNode }) {
    const [objects, setObjects] = useState<SceneObject[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const addObject = useCallback((type: ObjectType) => {
        const newObject: SceneObject = {
            id: uuidv4(),
            type,
            name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            color: type === "cube" ? "#6366f1" : type === "sphere" ? "#ec4899" : "#ffffff", // Indigo/Pink/White
        };
        setObjects((prev) => [...prev, newObject]);
        // Auto select
        setSelectedId(newObject.id);
    }, []);

    const selectObject = useCallback((id: string | null) => {
        setSelectedId(id);
    }, []);

    const updateObject = useCallback((id: string, updates: Partial<SceneObject>) => {
        setObjects((prev) =>
            prev.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj))
        );
    }, []);

    const removeObject = useCallback((id: string) => {
        setObjects((prev) => prev.filter((obj) => obj.id !== id));
        if (selectedId === id) setSelectedId(null);
    }, [selectedId]);

    return (
        <EditorContext.Provider
            value={{
                objects,
                selectedId,
                addObject,
                selectObject,
                updateObject,
                removeObject,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
}
