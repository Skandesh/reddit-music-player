// src/app/(player)/layout.tsx
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { FloatingPlayer } from '@/components/player/FloatingPlayer';
import { TopBar } from '@/components/layout/TopBar';
import { PlayerProvider } from '@/components/player/PlayerProvider';

export default function PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlayerProvider>
      <div className="flex h-screen flex-col bg-background">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-0">{children}</main>
          <RightSidebar />
        </div>
        <FloatingPlayer />
      </div>
    </PlayerProvider>
  );
}
