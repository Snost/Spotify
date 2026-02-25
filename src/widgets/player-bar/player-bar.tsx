export function PlayerBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <div className="text-sm">
          <div className="font-medium">Not playing</div>
          <div className="text-[rgb(var(--muted))] text-xs">Select a track</div>
        </div>
        <div className="text-xs text-[rgb(var(--muted))]">Player controls (later)</div>
      </div>
    </div>
  );
}
