'use client'

export function HomeHeroCard() {
  return (
    <div className="mt-4 rounded-2xl bg-groov-blue2/20 p-4">
      <div className="text-[14px] font-semibold text-white">Ваша вечірня добірка</div>
      <div className="mt-1 text-[12px] text-groov-blue2">
        Ретельно підібрані треки для релаксу та натхнення
      </div>

      <button className="mt-3 inline-flex items-center gap-2 rounded-lg bg-groov-primary px-3 py-2 text-[12px] font-semibold text-white">
        <span className="grid h-6 w-6 place-items-center rounded bg-groov-accent/10 text-groov-accent">▶</span>
        Відтворити
      </button>
    </div>
  )
}