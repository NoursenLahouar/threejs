"use client";

import { useEditor } from "@/context/EditorContext";

export function SceneOutliner() {
    const { objects, selectedIds, selectObject, toggleSelection } = useEditor();

    const handleClick = (id: string, event: React.MouseEvent) => {
        if (event.ctrlKey || event.metaKey) {
            toggleSelection(id);
        } else {
            selectObject([id]);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <h3 className="px-4 py-3 text-xs font-bold text-white/50 uppercase tracking-wider border-b border-white/10 shrink-0">
                Scene Objects
            </h3>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {objects.length === 0 && (
                    <div className="text-white/30 text-xs p-2 text-center">Empty Scene</div>
                )}

                {objects.map((obj) => (
                    <button
                        key={obj.id}
                        onClick={(e) => handleClick(obj.id, e)}
                        className={`
                            w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2
                            ${selectedIds.includes(obj.id)
                                ? 'bg-blue-600/20 text-blue-200 border border-blue-500/30'
                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }
                        `}
                    >
                        {/* Icon based on type */}
                        <span className="opacity-50 text-xs">
                            {obj.type === 'cube' ? '📦' : obj.type === 'sphere' ? '🔮' : '🍄'}
                        </span>
                        <span className="truncate">{obj.name || obj.type}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
