# REPORT.md

## 1. Issues in the Original Example

While reviewing the official Three.js Editor codebase, I identified several limitations and challenges that are acceptable in a standalone JavaScript application but problematic in a React / Next.js context:

1. **Lifecycle Management**
   - The original editor assumes a long-lived page and does not account for component mount/unmount cycles.
   - Animation loops (`requestAnimationFrame`) and event listeners are not designed to be cancelled or cleaned up dynamically.


2. **Limited Editor Capabilities**
   - No support for multi-object selection.
   - No built-in object duplication (Ctrl+D or Ctrl+C / Ctrl+V).
   - No keyframe-based animation system.

---

## 2. Migration Approach

The editor was reimplemented from scratch inside a **Next.js + TypeScript** project using the official Three.js editor only as a **reference**.

Key steps:
- Created a fresh Next.js project with TypeScript and Tailwind CSS.
- Installed Three.js via npm and relied on official typings.
- Rebuilt the viewport logic using **React components and custom hooks**, instead of copying JavaScript files.
- Ensured all Three.js logic runs only on the client side.
- Avoided using `any` or disabling TypeScript checks.

The goal was not to reproduce every editor feature, but to demonstrate understanding of the core concepts and adapt them properly to React.

---

## 3. Architectural Decisions

To keep the codebase maintainable and React-friendly, the following architectural choices were made:

  - UI layout lives in React components.
  - Three.js logic is isolated inside custom hooks.
  - Add duplication logic
  - Object add and selection with actions (move/rotate/scale)
  - 3d viewport and scene
  - Redo and undo logic
  - Multiselection logic
  - Action toolbar
  -Right pannel that conatins objects lists and object properties  


## 4. Trade-offs & Open Questions

Due to time constraints and the scope of the assignment, some aspects were intentionally not implemented:

- No animations and keyframes
- No rendering
- no camera and light objects


## 5. If This Were Production

If this project were to be continued in a production environment, the next steps would include:

- Implementing a proper editor state model (selected objects, tools, history).
- Adding view scene to see pre rendered scene
- Adding all other objects (camera,light,more meshs..)
- Adding animation and keyframes
- Adding textures,normal map and many other features(roughness,metalness...) for objects 
- Introducing object grouping and multi-selection actions.
- Improving performance with instancing and render optimizations.
- Adding automated tests and a more complete CI/CD pipeline.

---

## Conclusion

This project was made quickly and i did not focus on it a lot kn owing that i have no experience with next js and three js my flight is n ne hour this report was written quickly also.
