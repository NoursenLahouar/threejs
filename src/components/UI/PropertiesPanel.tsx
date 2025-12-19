"use client";

import { useEditor, SceneObject } from "@/context/EditorContext";

export function PropertiesPanel() {
    const { selectedId, objects, updateObject } = useEditor();

    if (!selectedId) {
        return (
            <div className="w-[300px] h-full border-l border-white/10 bg-black/20 backdrop-blur-md p-4 flex items-center justify-center text-white/50 text-sm">
                No object selected
            </div>
        );
    }

    const selectedObject = objects.find((o) => o.id === selectedId);

    if (!selectedObject) return null;

    const handleChange = (prop: keyof SceneObject, axis: number, value: number) => {
        const currentArr = selectedObject[prop] as [number, number, number];
        const newArr = [...currentArr] as [number, number, number];
        newArr[axis] = value;
        updateObject(selectedId, { [prop]: newArr });
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateObject(selectedId, { color: e.target.value });
    };

    return (
        <div className="w-[300px] h-full border-l border-white/10 bg-black/20 backdrop-blur-md p-4 space-y-6 overflow-y-auto">
            <h2 className="text-white font-medium text-lg border-b border-white/10 pb-2">Properties</h2>
            
            {/* ID / Name */}
            <div className="space-y-1">
                <label className="text-xs text-white/50 uppercase tracking-wilder">Type</label>
                <div className="text-white text-sm font-mono bg-white/5 p-2 rounded">{selectedObject.type}</div>
            </div>

            {/* Position */}
            <Vector3Input 
                label="Position" 
                values={selectedObject.position} 
                onChange={(axis, val) => handleChange("position", axis, val)}
            />

            {/* Rotation */}
            <Vector3Input 
                label="Rotation" 
                values={selectedObject.rotation} 
                step={0.1}
                onChange={(axis, val) => handleChange("rotation", axis, val)}
            />

            {/* Scale */}
            <Vector3Input 
                label="Scale" 
                values={selectedObject.scale} 
                step={0.1}
                onChange={(axis, val) => handleChange("scale", axis, val)}
            />

             {/* Color */}
             <div className="space-y-2">
                <label className="text-xs text-white/50 uppercase tracking-wilder">Color</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={selectedObject.color} 
                        onChange={handleColorChange}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-xs text-white/70 font-mono">{selectedObject.color}</span>
                </div>
            </div>

        </div>
    );
}

function Vector3Input({ 
    label, 
    values, 
    onChange,
    step = 0.1
}: { 
    label: string, 
    values: [number, number, number], 
    onChange: (axis: 0 | 1 | 2, val: number) => void,
    step?: number
}) {
    return (
        <div className="space-y-2">
            <label className="text-xs text-white/50 uppercase tracking-wilder">{label}</label>
            <div className="grid grid-cols-3 gap-2">
                {["X", "Y", "Z"].map((axisLabel, i) => (
                    <div key={axisLabel} className="relative">
                        <span className="absolute left-2 top-1.5 text-[10px] text-white/30 pointer-events-none">{axisLabel}</span>
                        <input
                            type="number"
                            step={step}
                            value={values[i]}
                            onChange={(e) => onChange(i as 0 | 1 | 2, parseFloat(e.target.value) || 0)}
                            className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 pl-5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
