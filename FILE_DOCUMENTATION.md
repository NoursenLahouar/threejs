# Three.js Editor - File Documentation

This document explains the purpose and functionality of each file in the project.

---

## 📁 Root Configuration Files

### `package.json`
- Defines project dependencies (Three.js, React, Next.js, etc.)
- Contains build scripts (`npm run dev`, `npm run build`)

### `tsconfig.json`
- TypeScript configuration for the project
- Defines path aliases like `@/` for cleaner imports

### `next.config.ts`
- Next.js framework configuration
- Sets up build and runtime options

### `tailwind.config.ts`
- Tailwind CSS configuration
- Defines custom colors, themes, and utility classes

---

## 📁 `/src/app` - Next.js Application Entry

### `page.tsx`
- **Main application page**
- Renders the editor layout with `ViewPort` and `RightSidebar`
- Wraps everything in `EditorProvider` for state management

### `layout.tsx`
- Root layout component for Next.js
- Sets up HTML structure and global styles

### `globals.css`
- Global CSS styles and Tailwind imports

---

## 📁 `/src/context` - State Management

### `EditorContext.tsx`
- **Core editor state management**
- Manages:
  - Scene objects (cubes, spheres, mushrooms)
  - Selected object ID
  - Transform mode (move/rotate/scale)
  - Undo/Redo history stacks
- Provides functions: `addObject`, `updateObject`, `deleteObject`, `duplicateObject`, `undo`, `redo`

### `ThreeContext.tsx`
- **Three.js scene state**
- Manages:
  - Scene, Camera, Renderer references
  - OrbitControls reference
  - Animation loop callbacks
- Shared across all Three.js components

---

## 📁 `/src/components` - React Components

### `ViewPort.tsx`
- **Main 3D viewport component**
- Renders the Three.js canvas
- Contains all 3D scene components
- Handles keyboard shortcuts (Ctrl+Z, Ctrl+D, M/R/S, Delete)
- Displays UI overlays (Add Mesh dropdown, Transform toolbar)

### `SceneProvider.tsx`
- **Three.js scene initialization**
- Sets up camera, renderer, lights, and grid
- Manages the animation loop
- Provides context to child components

---

## 📁 `/src/components/Three` - 3D Scene Components

### `ObjectManager.tsx`
- **Syncs React state with Three.js scene**
- Creates/updates/removes 3D objects (meshes and GLB models)
- Handles geometry creation for cubes and spheres
- Loads the mushroom GLB model using `GLTFLoader`

### `OrbitControls.tsx`
- **Camera controls component**
- Allows user to rotate, pan, and zoom the camera
- Registers with ThreeContext for updates

### `TransformControlsWrapper.tsx`
- **3D gizmo for moving/rotating/scaling objects**
- Attaches to the selected object
- Syncs transformations back to React state
- Handles mode switching (translate/rotate/scale)

### `SelectionManager.tsx`
- **Handles mouse click selection**
- Uses raycasting to detect clicked objects
- Ignores gizmos and helpers
- Deselects when clicking empty space or grid

### `SelectionHighlight.tsx`
- **Visual selection indicator**
- Draws a yellow box around the selected object
- Updates in real-time as object moves

---

## 📁 `/src/components/UI` - User Interface Components

### `PropertiesPanel.tsx`
- **Right sidebar properties editor**
- Displays selected object properties:
  - Position (X, Y, Z)
  - Rotation (X, Y, Z in degrees)
  - Scale (X, Y, Z)
  - Color picker
- Includes Delete and Duplicate buttons
- Uses scrubbable inputs for easy value adjustment

### `SceneOutliner.tsx`
- **Object list view**
- Shows all objects in the scene
- Click to select an object
- Highlights the currently selected object

### `RightSidebar.tsx`
- **Container for right panel**
- Splits view between:
  - SceneOutliner (top, resizable)
  - PropertiesPanel (bottom)
- Includes drag handle for resizing

### `TransformToolbar.tsx`
- **Transform mode selector**
- Floating toolbar at bottom-center of viewport
- Buttons for Move, Rotate, and Scale modes
- Only visible when an object is selected

### `AddMeshDropdown.tsx`
- **Object creation menu**
- Dropdown with options:
  - Add Mushroom
  - Add Box
  - Add Sphere
- Replaces individual "Add" buttons for cleaner UI

### `ScrubbableInput.tsx`
- **Interactive number input**
- Drag the label (X/Y/Z) to adjust values
- Color-coded labels (Red=X, Green=Y, Blue=Z)
- Supports manual typing as well
- Integrates with undo/redo system

---

## 📁 `/src/hooks` - Custom React Hooks

### `useThreeViewport.ts`
- Custom hook for Three.js viewport setup
- Manages canvas, renderer, and resize handling
- Returns refs and utilities for 3D rendering

---

## 📁 `/public` - Static Assets

### `mushroom.glb`
- 3D mushroom model file
- Loaded by `ObjectManager.tsx` using GLTFLoader

---

## 🔑 Key Concepts

### State Flow
1. **EditorContext** holds all scene object data
2. **ObjectManager** reads this data and creates Three.js meshes
3. **TransformControls** allows user to manipulate objects
4. Changes sync back to **EditorContext** via `updateObject()`

### Selection System
1. User clicks on canvas
2. **SelectionManager** raycasts to find object
3. Updates `selectedId` in **EditorContext**
4. **SelectionHighlight** draws yellow box
5. **TransformControls** attaches gizmo
6. **PropertiesPanel** shows object properties

### Undo/Redo
- **EditorContext** maintains `past` and `future` stacks
- Snapshots saved before each action
- Transient updates (during scrubbing) don't create history entries
- Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y (redo)

---

## 🎯 Common Tasks

**Adding a new object type:**
1. Update `ObjectType` in `EditorContext.tsx`
2. Add geometry creation in `ObjectManager.tsx`
3. Add option to `AddMeshDropdown.tsx`

**Adding a new property:**
1. Update `SceneObject` interface in `EditorContext.tsx`
2. Add input field in `PropertiesPanel.tsx`
3. Update `updateObject` calls as needed

**Adding a new keyboard shortcut:**
1. Add handler in `ViewPort.tsx` keyboard effect
2. Update dependency array if needed
