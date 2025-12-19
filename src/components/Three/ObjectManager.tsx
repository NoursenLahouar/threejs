"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useThree } from "@/context/ThreeContext";
import { useEditor } from "@/context/EditorContext";

export function ObjectManager() {
    const { scene } = useThree();
    const { objects } = useEditor();

    // We keep a map of object ID -> Object3D to avoid full rebuilds
    const meshesRef = useRef<Map<string, THREE.Object3D>>(new Map());

    useEffect(() => {
        if (!scene) return;

        // 1. ADD / UPDATE
        objects.forEach((obj) => {
            let mesh = meshesRef.current.get(obj.id);

            // If new, create it
            if (!mesh) {
                if (obj.type === 'cube') {
                    const geometry = new THREE.BoxGeometry(1, 1, 1);
                    const material = new THREE.MeshStandardMaterial({
                        color: obj.color,
                        roughness: 0.3,
                        metalness: 0.1,
                    });
                    mesh = new THREE.Mesh(geometry, material);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                } else if (obj.type === 'sphere') {
                    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
                    const material = new THREE.MeshStandardMaterial({
                        color: obj.color,
                        roughness: 0.3,
                        metalness: 0.1,
                    });
                    mesh = new THREE.Mesh(geometry, material);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                } else if (obj.type === 'mushroom') {
                    const group = new THREE.Group();
                    mesh = group;

                    // Load GLB
                    const loader = new GLTFLoader();
                    loader.load('/mashroom.glb', (gltf) => {
                        // Center and scale if reasonable
                        gltf.scene.scale.set(1, 1, 1);
                        group.add(gltf.scene);

                        // Traverse to enable shadows
                        gltf.scene.traverse((child) => {
                            if ((child as THREE.Mesh).isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        });
                    }, undefined, (error) => {
                        console.error('An error happened loading the mushroom:', error);
                    });
                } else {
                    // Fallback
                    const geometry = new THREE.BoxGeometry(1, 1, 1);
                    const material = new THREE.MeshStandardMaterial({ color: 'red' });
                    mesh = new THREE.Mesh(geometry, material);
                }

                if (mesh) {
                    mesh.userData.id = obj.id; // Link back to Editor Object ID
                    scene.add(mesh);
                    meshesRef.current.set(obj.id, mesh);
                }
            }

            // Sync Properties
            if (mesh) {
                mesh.position.set(...obj.position);
                mesh.rotation.set(...obj.rotation);
                mesh.scale.set(...obj.scale);

                // Material color update if needed (only for primitive meshes)
                if ((mesh as THREE.Mesh).isMesh) {
                    const m = (mesh as THREE.Mesh).material;
                    if (m instanceof THREE.MeshStandardMaterial) {
                        m.color.set(obj.color);
                    }
                }
            }
        });

        // 2. REMOVE
        // Check for meshes that no longer exist in state
        const objectIds = new Set(objects.map(o => o.id));
        meshesRef.current.forEach((mesh, id) => {
            if (!objectIds.has(id)) {
                scene.remove(mesh);

                // cleanup
                if ((mesh as THREE.Mesh).isMesh) {
                    const m = mesh as THREE.Mesh;
                    m.geometry.dispose();
                    if (m.material instanceof THREE.Material) {
                        m.material.dispose();
                    }
                }

                meshesRef.current.delete(id);
            }
        });

    }, [scene, objects]);

    return null;
}
