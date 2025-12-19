import ViewPort from "@/components/ViewPort";
import { PropertiesPanel } from "@/components/UI/PropertiesPanel";
import { EditorProvider } from "@/context/EditorContext";

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <h1 className="text-2xl font-semibold">Three.js Editor (Next + TS)</h1>
        <p className="text-sm text-white/70">
          This is my first next.js App (Ai helped me a lot)
        </p>
      <div className="mx-auto max-w-7xl h-[80vh] flex gap-4">
        <div className="flex-1 min-w-0">
             <ViewPort />
        </div>
        <div className="shrink-0">
             <PropertiesPanelWrapper />
        </div>
      </div>
    </main>
  );
}
