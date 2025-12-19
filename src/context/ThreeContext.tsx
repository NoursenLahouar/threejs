
"use client";

import { createContext, useContext } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type ThreeContextType = {
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;
    containerRef: React.RefObject<HTMLDivElement | null>;
    setControls: (controls: OrbitControls | null) => void;
    registerCallback: (id: string, cb: () => void) => void;
    unregisterCallback: (id: string) => void;
};

export const ThreeContext = createContext<ThreeContextType>({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    containerRef: { current: null },
    setControls: () => { },
    registerCallback: () => { },
    unregisterCallback: () => { },
});

export const useThree = () => useContext(ThreeContext);
