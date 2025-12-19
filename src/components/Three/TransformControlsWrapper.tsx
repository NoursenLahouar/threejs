"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { useThree } from "@/context/ThreeContext";
import { useEditor } from "@/context/EditorContext";

export function TransformControlsWrapper() {
    const { camera, renderer, scene, controls: orbitControls } = useThree();
    const { selectedIds, updateObject, transformMode, objects } = useEditor();

    const controlsRef = useRef<TransformControls | null>(null);

    // 1. Initialize Controls (Run Once / Only when Core Deps change)
    useEffect(() => {
        if (!camera || !renderer || !scene) return;

        const controls = new TransformControls(camera, renderer.domElement);
        controls.setSize(1.5); // Increased size for better usability
        controls.setSpace("local");

        // Fix Bug 2: Initialize with current mode!
        controls.setMode(transformMode);

        // Disable plane helpers (the colored rectangles) but keep arrows
        const controlsAny = controls as any;
        if (controlsAny.children && controlsAny.children[0]) {
            const gizmo = controlsAny.children[0];
            if (gizmo.picker) {
                gizmo.picker.traverse((child: any) => {
                    if (child.name && (child.name.includes('Plane') || child.name === 'XY' || child.name === 'YZ' || child.name === 'XZ')) {
                        child.visible = false;
                    }
                });
            }
        }

        // Event: Dragging Changed (Disable OrbitControls)
        const onDraggingChanged = (event: any) => {
            if (orbitControls) {
                orbitControls.enabled = !event.value;
            }
        };

        const onDragEnd = (event: any) => {
            if (!event.value && controls.object) {
                const obj = controls.object;
                if (obj.userData.id) {
                    updateObject(obj.userData.id, {
                        position: [obj.position.x, obj.position.y, obj.position.z],
                        rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
                        scale: [obj.scale.x, obj.scale.y, obj.scale.z],
                    });
                }
            }
        }

        controls.addEventListener('dragging-changed', onDraggingChanged);
        controls.addEventListener('dragging-changed', onDragEnd);

        scene.add(controls.getHelper());
        controlsRef.current = controls;

        return () => {
            controls.removeEventListener('dragging-changed', onDraggingChanged);
            controls.removeEventListener('dragging-changed', onDragEnd);
            controls.dispose();
            scene.remove(controls.getHelper());
            controlsRef.current = null;
        };
    }, [camera, renderer, scene, orbitControls, updateObject]); // Don't add transformMode here to avoid re-creation

    // 2. Update Mode (Run when transformMode changes)
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.setMode(transformMode);
        }
    }, [transformMode]);

    // 3. Attach/Detach (Run when selectedIds OR objects changes)
    // Fix Bug 1: Depend on 'objects' to retry attach if target wasn't ready yet.
    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls || !scene) return;

        // Attach to first selected object (for multi-selection, only show gizmo on first)
        const selectedId = selectedIds[0];

        if (selectedId) {
            let target: THREE.Object3D | undefined;
            scene.traverse((child) => {
                if (child.userData.id === selectedId) {
                    target = child;
                }
            });

            if (target) {
                controls.attach(target);
            } else {
                // If not found, maybe it's loading? 
                // We detach for now.
                controls.detach();
            }
        } else {
            controls.detach();
        }
    }, [selectedIds, scene, objects]); // Added 'objects' dependency

    return null;
}
