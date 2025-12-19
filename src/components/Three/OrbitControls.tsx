
"use client";

import { useEffect } from "react";
import { useThree } from "@/context/ThreeContext";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function OrbitControlsWrapper() {
    const { camera, renderer, setControls, registerCallback, unregisterCallback } = useThree();

    useEffect(() => {
        if (!camera || !renderer) return;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // We can expose controls to a parent/context if needed here.
        // controlsRef.current = controls;

        // We need to update controls in the animation loop if damping is on.
        // The SceneProvider loop needs to call controls.update().
        // Quick fix: Add a tick callback system? 
        // OR: Just run a local loop for controls update? No, that's wasteful.
        // OR: Monkeypatch the render loop?

        // Better approach for Phase 1: 
        // Let's just create a simple loop inside SceneProvider that emits an event, or 
        // for now, since SceneProvider owns the loop, we might need to move Controls INTO SceneProvider 
        // OR provide a way to register an 'onBeforeRender'.

        // Simplest "clean" way: 
        // Use `renderer.setAnimationLoop` in SceneProvider. 
        // But honestly, for this specific request "OrbitControls (typed + cleanup)", 
        // putting it here is fine, but the *update* loop is the tricky part.

        // Let's hack the update loop in SceneProvider for now:
        // We'll attach the control instance to the renderer user data or context?
        // Actually, OrbitControls works fine without .update() if enableDamping is false. 
        // If enableDamping is true, we MUST call .update().

        // Let's try to add a cheap way to update: 
        // Wait, SceneProvider ALREADY has a loop. Multiple loops = bad.

        // Correction: I should probably move OrbitControls instantiation INTO SceneProvider 
        // OR add a "callbacks" array to Context.

        // Let's add 'registerCallback' to context? 
        // Too complex for "Minimum editor reimplementation".

        // Alternative: Just Put OrbitControls in SceneProvider for now.
        // The plan said "OrbitControls.tsx wrapper".
        // Keep it as a wrapper, but maybe turn off damping to avoid needing the loop update? 
        // No, damping feels "Premium".

        // Let's add a "beforeRender" set to the context.

        // Register update loop for damping
        const callbackId = "orbit-controls";
        registerCallback(callbackId, () => controls.update());

        // Share control instance
        setControls(controls);

        return () => {
            unregisterCallback(callbackId);
            setControls(null);
            controls.dispose();
        };
    }, [camera, renderer, registerCallback, unregisterCallback]);

    return null;
}
