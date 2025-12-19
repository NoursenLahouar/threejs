
"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import * as THREE from "three";
import { ThreeContext } from "@/context/ThreeContext";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface SceneProviderProps {
    children: ReactNode;
}

export function SceneProvider({ children }: SceneProviderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scene, setScene] = useState<THREE.Scene | null>(null);
    const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
    const [controls, setControls] = useState<OrbitControls | null>(null);
    const callbacksRef = useRef<Map<string, () => void>>(new Map());

    const registerCallback = (id: string, cb: () => void) => {
        callbacksRef.current.set(id, cb);
    };

    const unregisterCallback = (id: string) => {
        callbacksRef.current.delete(id);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 1. Scene
        const _scene = new THREE.Scene();
        _scene.background = new THREE.Color(0x0b0f19);

        // 2. Camera
        const _camera = new THREE.PerspectiveCamera(
            60,
            container.clientWidth / Math.max(container.clientHeight, 1),
            0.1,
            1000
        );
        _camera.position.set(5, 5, 5);

        // 3. Renderer
        const _renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        _renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        _renderer.outputColorSpace = THREE.SRGBColorSpace;
        _renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(_renderer.domElement);

        // 4. Initial content (Grid + Lights for now, can be moved to sub-components later but good for initial mounting check)
        const grid = new THREE.GridHelper(20, 20, 0x334155, 0x1f2937);
        grid.userData.isGrid = true;
        _scene.add(grid);

        const hemi = new THREE.HemisphereLight(0xffffff, 0x223344, 1);
        _scene.add(hemi);

        const dir = new THREE.DirectionalLight(0xffffff, 1);
        dir.position.set(5, 8, 4);
        _scene.add(dir);

        // Initialize state
        setScene(_scene);
        setCamera(_camera);
        setRenderer(_renderer);

        // Resize handling
        const resizeObserver = new ResizeObserver(() => {
            if (!container) return; // Guard
            const { clientWidth, clientHeight } = container;
            _camera.aspect = clientWidth / Math.max(clientHeight, 1);
            _camera.updateProjectionMatrix();
            _renderer.setSize(clientWidth, clientHeight, false);
        });
        resizeObserver.observe(container);

        // Animation Loop
        let rafId = 0;
        // We use a simple loop here. OrbitControls usually needs update in the loop if autoRotate or damping is on. 
        // We haven't created controls in this effect yet, they will likely be a separate component or added here.
        // For simplicity in Phase 1, we CAN init controls here or in a separate effect. 
        // The plan said "OrbitControls.tsx: Handled via useEffect to attach/detach". 
        // Let's stick to the plan: Controls will be separate or added via effect.
        // BUT the Context needs to store 'controls'. 
        // Let's create the loop to render.

        // We need "controls" reference for update() if damping is enabled. 
        // For now, let's just render.

        const animate = () => {
            rafId = requestAnimationFrame(animate);

            // Run registered callbacks (e.g. controls update)
            callbacksRef.current.forEach((cb) => cb());

            _renderer.render(_scene, _camera);
        };
        animate();

        // CLEANUP
        return () => {
            cancelAnimationFrame(rafId);
            resizeObserver.disconnect();
            _renderer.dispose();

            // Basic scene dispose (recursive verify later)
            // Traverse scene to dispose geometries/materials if we want to be super strict, 
            // but for "Scene" itself, just removing the dom element is key step 1.
            if (container.contains(_renderer.domElement)) {
                container.removeChild(_renderer.domElement);
            }
        };
    }, []);

    return (
        <ThreeContext.Provider value={{ scene, camera, renderer, controls, setControls, containerRef, registerCallback, unregisterCallback }}>
            <div ref={containerRef} className="relative h-full w-full overflow-hidden">
                {/* We pass children so they can access the context if needed, 
                 but the Canvas is THE container. 
                 Actually, usually the Provider WRAPS the UI that needs access. 
                 But the Canvas DOM element itself needs to exist.
                 So this component acts as the "ViewPort" container AND the provider.
             */}
                {children}
            </div>
        </ThreeContext.Provider>
    );
}

// Helper to set controls from child component
export function useRegisterControls(controls: OrbitControls) {
    // This is a bit advanced: allowing a child <OrbitControls /> to set the context's controls.
    // For now, simpler: Initialize controls inside SceneProvider OR SceneProvider exposes setControls?
    // Let's keep it simple: OrbitControls component will just instantiate and attach.
    // We might not need to store controls in Context unless we need to access it elsewhere (e.g. "Reset View" button).
    // Let's skip storing controls in Context state setter for this exact moment to avoid complex re-renders,
    // OR just use a Ref for it if we don't need reactive state updates.
    // Re-reading plan: "Holds scene, camera, renderer, controls". 
    // I will export simple SetControls capability if needed, but for now let's just let OrbitControls run itself.
}
