import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Project Dashboard', icon: 'space_dashboard', end: true },
  { to: '/reports', label: 'Delivery Reports', icon: 'monitoring' },
  { to: '/team', label: 'Delivery Team', icon: 'groups' },
  { to: '/settings', label: 'Settings', icon: 'tune' }
];

export default function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 h-full w-[240px] bg-surface-container shadow-md flex flex-col py-lg z-40">
      <div className="px-md mb-8 flex items-center gap-2">
        <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center text-on-primary font-bold">
          PM
        </div>
        <div>
          <h1 className="text-lg font-bold text-primary leading-tight">Delivery Office</h1>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">PMO Portal</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="px-2 mt-auto flex flex-col gap-1">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container-highest transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">help_outline</span>
          Help Center
        </a>
      </div>
    </nav>
  );
}
