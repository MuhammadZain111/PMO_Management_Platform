import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STATUS_FLAG_META } from '../data/constants';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import KpiCards from '../components/KpiCards';
import { fmtCurrency, fmtDate } from '../utils/format';

export default function Dashboard({ projects, search, onAddProject }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [pm, setPm] = useState('');

  const projectManagers = useMemo(
    () => Array.from(new Set(projects.map((p) => p.projectManager))).sort(),
    [projects]
  );

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (status && p.overallStatus !== status) return false;
      if (pm && p.projectManager !== pm) return false;
      if (s && !(p.name + ' ' + p.client + ' ' + p.id).toLowerCase().includes(s)) return false;
      return true;
    });
  }, [projects, search, status, pm]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface mb-1">Project Dashboard</h2>
          <p className="text-base text-on-surface-variant">
            Monitor delivery health, milestones, and status across all live projects
          </p>
        </div>
        <button
          onClick={onAddProject}
          className="bg-primary-container text-on-primary px-6 py-2 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Project
        </button>
      </div>

      <KpiCards projects={projects} />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
        <div className="p-4 border-b border-surface-variant bg-surface-bright flex flex-wrap gap-2 items-center">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-surface-container-lowest border border-surface-variant rounded px-2 py-1 text-sm"
          >
            <option value="">All Statuses</option>
            {Object.keys(STATUS_FLAG_META).map((k) => (
              <option key={k} value={k}>
                {STATUS_FLAG_META[k].label}
              </option>
            ))}
          </select>
          <select
            value={pm}
            onChange={(e) => setPm(e.target.value)}
            className="bg-surface-container-lowest border border-surface-variant rounded px-2 py-1 text-sm"
          >
            <option value="">All Project Managers</option>
            {projectManagers.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="ml-auto text-xs text-on-surface-variant">
            {filtered.length} of {projects.length} projects
          </span>
        </div>

        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-primary-container text-on-primary text-xs font-semibold uppercase tracking-wide">
                <th className="p-2">Project ID</th>
                <th className="p-2">Project Name</th>
                <th className="p-2">Client</th>
                <th className="p-2">Project Manager</th>
                <th className="p-2">Delivery Head</th>
                <th className="p-2">Start Date</th>
                <th className="p-2">Expected End</th>
                <th className="p-2 min-w-[160px]">Completion</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-right">Value (PKR)</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-surface-variant">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-on-surface-variant">
                    No projects match the current filters.
                  </td>
                </tr>
              )}
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className={`cursor-pointer hover:bg-[#F1F6F7] transition-colors ${i % 2 === 1 ? 'bg-surface-bright' : ''}`}
                >
                  <td className="p-2 whitespace-nowrap font-semibold text-on-surface-variant">{p.id}</td>
                  <td className="p-2 whitespace-nowrap font-semibold">{p.name}</td>
                  <td className="p-2 whitespace-nowrap">{p.client}</td>
                  <td className="p-2 whitespace-nowrap">{p.projectManager}</td>
                  <td className="p-2 whitespace-nowrap">{p.deliveryHead}</td>
                  <td className="p-2 whitespace-nowrap text-on-surface-variant">{fmtDate(p.startDate)}</td>
                  <td className="p-2 whitespace-nowrap text-on-surface-variant">{fmtDate(p.endDate)}</td>
                  <td className="p-2 min-w-[160px]">
                    <ProgressBar value={p.overallCompletion} />
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <StatusBadge flag={p.overallStatus} />
                  </td>
                  <td className="p-2 whitespace-nowrap text-right">{fmtCurrency(p.value)}</td>
                  <td className="p-2 whitespace-nowrap text-center">
                    <span className="text-primary text-xs font-semibold hover:underline">View &rarr;</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
