import React from "react";
import { Sidebar } from "@/widgets/sidebar/sidebar";
import { Topbar } from "@/widgets/topbar/topbar";
import { PlayerBar } from "@/widgets/player-bar/player-bar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 pb-20">
          <Topbar />
          <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
        </main>
      </div>

      <PlayerBar />
    </div>
  );
}
