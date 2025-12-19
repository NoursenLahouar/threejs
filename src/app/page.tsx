import ViewPort from "@/components/ViewPort";
import { RightSidebar } from "@/components/UI/RightSidebar";
import { EditorProvider } from "@/context/EditorContext";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0b0f19] to-[#020617] text-white">
      <EditorProvider>
        <div className="flex h-[80vh] w-[90vw] max-w-[1400px] overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl backdrop-blur-xl">
          {/* Left: 3D Viewport (Flex Grow) */}
          <div className="flex-1 relative">
            <ViewPort />
          </div>

          {/* Right: Sidebar (Outliner + Properties) */}
          <RightSidebar />
        </div>
      </EditorProvider>
    </main>
  );
}
