"use client";

export default function StreakChip({
  streakCount,
  checkedInToday,
  onCheckIn,
}: {
  streakCount: number;
  checkedInToday: boolean;
  onCheckIn: () => void;
}) {
  if (checkedInToday) {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-hot/40 bg-hot/10 px-3 py-1.5">
        <span className="text-base leading-none">🔥</span>
        <span className="font-display text-base text-hot leading-none tabular-nums">
          {streakCount}
        </span>
        <span className="hidden sm:inline text-[11px] text-white/45">
          días seguidos
        </span>
      </div>
    );
  }
  return (
    <button
      onClick={onCheckIn}
      className="flex items-center gap-1.5 rounded-full bg-hot text-white font-bold text-sm px-3 py-1.5 hover:brightness-110 transition pulse-ring"
    >
      <span className="text-base leading-none">🔥</span>
      Check-in <span className="hidden sm:inline opacity-80">+25</span>
    </button>
  );
}
