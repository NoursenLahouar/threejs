"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@/context/ThreeContext";
import { useEditor } from "@/context/EditorContext";

export function SelectionHighlight() {
    const { scene, registerCallback, unregisterCallback } = useThree();
    const { selectedIds } = useEditor();

    const helpersRef = useRef<THREE.BoxHelper[]>([]);

    useEffect(() => {
        if (!scene) return;

        // Clear existing helpers
        helpersRef.current.forEach(helper => {
            scene.remove(helper);
            helper.dispose();
        });
        helpersRef.current = [];

        // Create helpers for all selected objects
        if (selectedIds.length > 0) {
            selectedIds.forEach(selectedId => {
                // Find object
                let selectedObject: THREE.Object3D | undefined;
                scene.traverse((child) => {
                    if (child.userData.id === selectedId) {
                        selectedObject = child;
                    }
                });

                if (selectedObject) {
                    // Create helper
                    const helper = new THREE.BoxHelper(selectedObject, 0xffff00); // Yellow
                    // Disable raycasting for the highlight box so it doesn't block selection or gizmo
                    helper.raycast = () => null;
                    scene.add(helper);
                    helpersRef.current.push(helper);
                }
            });
        }

        return () => {
            helpersRef.current.forEach(helper => {
                scene.remove(helper);
                helper.dispose();
            });
            helpersRef.current = [];
        };
    }, [scene, selectedIds]);

    // Update all helpers
    useEffect(() => {
        const updateId = "selection-helper-update";

        if (selectedIds.length > 0) {
            registerCallback(updateId, () => {
                helpersRef.current.forEach(helper => helper.update());
            });
        }

        return () => {
            unregisterCallback(updateId);
        };
    }, [selectedIds, registerCallback, unregisterCallback]);

    return null;
}
