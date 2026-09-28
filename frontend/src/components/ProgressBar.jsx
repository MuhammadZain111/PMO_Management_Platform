export default function ProgressBar({ value, colorClass = 'bg-primary-container' }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden min-w-[80px]">
        <div className={`h-2 rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-on-surface-variant w-9 text-right">{pct}%</span>
    </div>
  );
}
