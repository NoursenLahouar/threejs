"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@/context/ThreeContext";
import { useEditor } from "@/context/EditorContext";

export function SelectionHighlight() {
    const { scene, registerCallback, unregisterCallback } = useThree();
    const { selectedId } = useEditor();

    const helperRef = useRef<THREE.BoxHelper | null>(null);

    useEffect(() => {
        if (!scene) return;

        if (selectedId) {
            // Find object
            const selectedObject = scene.children.find(c => c.userData.id === selectedId);

            if (selectedObject) {
                // Create helper
                const helper = new THREE.BoxHelper(selectedObject, 0xffff00); // Yellow
                scene.add(helper);
                helperRef.current = helper;

                // Register update loop because BoxHelper needs to update if object moves
                const updateId = "selection-helper-update";
                registerCallback(updateId, () => {
                    if (helperRef.current) {
                        helperRef.current.update();
                    }
                });
            }
        } else {
            // Cleanup if deselected (handled in cleanup function below mostly, but strict logic here)
        }

        return () => {
            if (helperRef.current) {
                scene.remove(helperRef.current);
                helperRef.current.dispose();
                helperRef.current = null;
                // Unregister callback
                // Assuming unregister is safe even if not registered? Yes usually.
                // But we should use the same ID logic.
                // Scope issue: 'updateId' is inside the block. 
                // We should move logic.
            }
            // We can't easily unregister the callback created inside the if(selectedId) block from here 
            // because the ID string is local. 
        };
    }, [scene, selectedId]);

    // Proper callback cleanup effect
    useEffect(() => {
        const updateId = "selection-helper-update";
        // We only want to REGISTER if we have a helper.
        // Actually, simpler: Always register, check ref inside?
        // No, simpler: 

        if (selectedId) {
            registerCallback(updateId, () => {
                if (helperRef.current) helperRef.current.update();
            });
        }

        return () => {
            unregisterCallback(updateId);
        };
    }, [selectedId, registerCallback, unregisterCallback]);

    return null;
}
