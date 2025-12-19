"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { useThree } from "@/context/ThreeContext";
import { useEditor } from "@/context/EditorContext";

export function TransformControlsWrapper() {
    const { camera, renderer, scene, controls: orbitControls } = useThree();
    const { selectedId, updateObject } = useEditor();

    const controlsRef = useRef<TransformControls | null>(null);

    useEffect(() => {
        if (!camera || !renderer || !scene) return;

        const controls = new TransformControls(camera, renderer.domElement);
        controls.setSize(1.2); // Make gizmo easier to grab

        // We can't easily access orbit controls start/end here without context,
        // but TransformControls handles its own interaction state usually.
        // We'll trust the default behavior for now or add 'dragging-changed' later if needed for OrbitControls conflict.

        controls.addEventListener('dragging-changed', (event: any) => {
            // If we have orbit controls, disable them while dragging
            if (orbitControls) {
                orbitControls.enabled = !event.value;
            }

            // If dragging stopped (event.value === false), sync state
            if (!event.value) {
                if (controls.object && selectedId) {
                    const obj = controls.object;
                    updateObject(selectedId, {
                        position: [obj.position.x, obj.position.y, obj.position.z],
                        rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
                        scale: [obj.scale.x, obj.scale.y, obj.scale.z],
                    });
                }
            }
        });

        // Helper visual
        scene.add(controls.getHelper());
        controlsRef.current = controls;

        return () => {
            controls.dispose();
            scene.remove(controls.getHelper());
            controlsRef.current = null;
        };
    }, [camera, renderer, scene, selectedId, updateObject, orbitControls]);

    // Attach to selected object
    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls || !scene) return;

        if (selectedId) {
            const selectedMesh = scene.children.find(child => child.userData.id === selectedId) as THREE.Object3D;
            if (selectedMesh) {
                controls.attach(selectedMesh);
            } else {
                controls.detach();
            }
        } else {
            controls.detach();
        }

    }, [selectedId, scene]);

    return null;
}
