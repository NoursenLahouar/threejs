import { useEffect, useRef, RefObject } from "react";
import * as THREE from "three";

type UseThreeViewportResult = {
    containerRef: RefObject<HTMLDivElement | null>;
};

export function useThreeViewport(): UseThreeViewportResult {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0b0f19);

        // Camera
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        camera.position.set(3, 2, 5);

        // Basic lighting + helpers
        const hemi = new THREE.HemisphereLight(0xffffff, 0x223344, 1);
        scene.add(hemi);

        const dir = new THREE.DirectionalLight(0xffffff, 1);
        dir.position.set(5, 8, 4);
        scene.add(dir);

        const grid = new THREE.GridHelper(20, 20, 0x334155, 0x1f2937);
        scene.add(grid);

        // Test mesh (to confirm rendering)
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x60a5fa });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 0.5;
        scene.add(cube);

        // Resize handling (container-based)
        const resize = () => {
            const { clientWidth, clientHeight } = container;
            renderer.setSize(clientWidth, clientHeight, false);
            camera.aspect = clientWidth / Math.max(clientHeight, 1);
            camera.updateProjectionMatrix();
        };

        const ro = new ResizeObserver(resize);
        ro.observe(container);
        resize();

        // Animation loop
        let rafId = 0;
        const clock = new THREE.Clock();

        const animate = () => {
            const dt = clock.getDelta();
            cube.rotation.y += dt * 0.8;
            cube.rotation.x += dt * 0.3;

            renderer.render(scene, camera);
            rafId = window.requestAnimationFrame(animate);
        };

        rafId = window.requestAnimationFrame(animate);

        // Cleanup
        return () => {
            window.cancelAnimationFrame(rafId);
            ro.disconnect();

            scene.remove(cube);
            geometry.dispose();
            material.dispose();

            renderer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, []);

    return { containerRef };
}
