"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@/context/ThreeContext";
import { useEditor } from "@/context/EditorContext";

export function SelectionManager() {
    const { camera, scene, renderer, registerCallback, unregisterCallback } = useThree();
    const { selectObject } = useEditor();

    useEffect(() => {
        if (!renderer || !camera || !scene) return;

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        const handlePointerDown = (event: PointerEvent) => {
            // Calculate pointer position in normalized device coordinates (-1 to +1)
            const rect = renderer.domElement.getBoundingClientRect();

            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);

            // Intersect objects (RECURSIVE to hit children in Groups like Mushroom)
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                // 1. Try to find a User Object (has userData.id)
                const hit = intersects.find((i) => {
                    let obj: THREE.Object3D | null = i.object;
                    while (obj && obj !== scene) {
                        if (obj.userData.id) return true;
                        obj = obj.parent;
                    }
                    return false;
                });

                if (hit) {
                    // Found a user object -> Select it
                    let obj: THREE.Object3D | null = hit.object;
                    while (obj && obj !== scene) {
                        if (obj.userData.id) {
                            selectObject(obj.userData.id);
                            return;
                        }
                        obj = obj.parent;
                    }
                } else {
                    // 2. We hit something, but it's NOT a user object.
                    // Could be Grid, Gizmo, or Helper.
                    // If it's the Grid, we want to deselect.
                    // If it's the Gizmo (assumed if not grid), we want to KEEP selection (do nothing).

                    const firstHit = intersects[0].object;
                    // Check if it is the grid (we tagged it in SceneProvider)
                    // Or if it's explicitly part of the background/helpers we WANT to deselect on.
                    // For now, checking check isGrid or type match if needed. 
                    // We added userData.isGrid to SceneProvider.

                    if (firstHit.userData.isGrid) {
                        selectObject(null);
                    }

                    // Else: It's likely a Gizmo or other helper -> Do nothing.
                    return;
                }
            } else {
                // Hit nothing (Empty Sky) -> Deselect
                selectObject(null);
            }
        };

        // Attach to DOM element
        renderer.domElement.addEventListener("pointerdown", handlePointerDown);

        return () => {
            renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
        };

    }, [renderer, camera, scene, selectObject]);

    return null;
}
