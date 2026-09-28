export default function KpiCards({ projects }) {
  const counts = { total: projects.length };
  projects.forEach((p) => {
    counts[p.overallStatus] = (counts[p.overallStatus] || 0) + 1;
  });

  const cards = [
    { label: 'Total Projects', value: counts.total, icon: 'folder_managed', accent: false },
    { label: 'In Progress', value: counts['in-progress'] || 0, icon: 'sync', accent: false },
    { label: 'At Risk', value: counts['at-risk'] || 0, icon: 'warning', accent: true },
    { label: 'Delayed', value: counts['delayed'] || 0, icon: 'schedule', accent: true },
    { label: 'On Hold', value: counts['on-hold'] || 0, icon: 'pause_circle', accent: false },
    { label: 'Completed', value: counts['completed'] || 0, icon: 'task_alt', accent: false }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-variant flex flex-col justify-between ${
            c.accent ? 'border-l-4 border-l-primary-container' : ''
          }`}
        >
          <p className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">{c.label}</p>
          <div className="flex items-end justify-between">
            <span className={`text-3xl font-bold ${c.accent ? 'text-primary-container' : 'text-on-surface'}`}>
              {c.value}
            </span>
            <span className={`material-symbols-outlined text-[20px] ${c.accent ? 'text-primary-container' : 'text-secondary'}`}>
              {c.icon}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
