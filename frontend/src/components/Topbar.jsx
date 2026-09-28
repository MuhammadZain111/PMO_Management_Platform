export default function Topbar({ search, onSearchChange }) {
  return (
    <header className="fixed top-0 left-[240px] right-0 h-16 bg-surface-container-lowest border-b border-surface-variant shadow-sm z-30 flex justify-between items-center px-lg">
      <span className="text-lg font-bold text-primary">PMO Portal</span>
      <div className="flex items-center gap-3">
        <div className="relative w-64 hidden md:block">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects, clients..."
            className="w-full pl-9 pr-3 py-1.5 bg-surface-container-high border-none rounded-full text-sm focus:ring-2 focus:ring-primary-container focus:outline-none"
          />
        </div>
        <button className="text-secondary hover:bg-surface-container-low transition-colors p-2 rounded-full w-10 h-10 flex items-center justify-center">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <img
          alt="User avatar"
          className="w-8 h-8 rounded-full object-cover border border-surface-variant ml-1"
          src="https://api.dicebear.com/7.x/initials/svg?seed=PMO"
        />
      </div>
    </header>
  );
}
