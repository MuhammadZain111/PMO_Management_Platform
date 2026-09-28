import { useMemo } from 'react';
import { PMO_PROJECT_MANAGERS, PMO_DELIVERY_HEADS, PMO_SAMS } from '../data/constants';

function email(name) {
  return name.toLowerCase().replace(/[^a-z\s]/g, '').trim().replace(/\s+/g, '.') + '@ourcompany.com';
}

function buildRoster(projects) {
  const rows = [];
  function addRole(names, role, field) {
    names.forEach((name) => {
      const active = projects.filter((p) => p[field] === name && p.overallStatus !== 'completed' && p.overallStatus !== 'cancelled').length;
      const total = projects.filter((p) => p[field] === name).length;
      rows.push({ name, role, active, total, email: email(name) });
    });
  }
  addRole(PMO_PROJECT_MANAGERS, 'Project Manager', 'projectManager');
  addRole(PMO_DELIVERY_HEADS, 'Delivery Head', 'deliveryHead');
  addRole(PMO_SAMS, 'Sales Account Manager', 'salesAccountManager');
  return rows;
}

export default function Team({ projects }) {
  const roster = useMemo(() => buildRoster(projects), [projects]);
  const activeProjects = projects.filter((p) => p.overallStatus !== 'completed' && p.overallStatus !== 'cancelled').length;

  const cards = [
    { label: 'Project Managers', value: PMO_PROJECT_MANAGERS.length, icon: 'assignment_ind' },
    { label: 'Delivery Heads', value: PMO_DELIVERY_HEADS.length, icon: 'engineering' },
    { label: 'Sales Account Managers', value: PMO_SAMS.length, icon: 'handshake' },
    { label: 'Active Projects', value: activeProjects, icon: 'work' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface mb-1">Delivery Team</h2>
        <p className="text-base text-on-surface-variant">Workload across project managers, delivery heads, and sales account managers</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-variant flex flex-col justify-between">
            <p className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">{c.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{c.value}</span>
              <span className="material-symbols-outlined text-secondary text-[20px]">{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
        <div className="p-4 border-b border-surface-variant bg-surface-bright">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Team Roster</h4>
          <p className="text-xs text-on-surface-variant mt-0.5">Active project counts are computed live from assignments.</p>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-primary-container text-on-primary text-xs font-semibold uppercase tracking-wide">
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
                <th className="p-2 text-center">Active Projects</th>
                <th className="p-2 text-center">Total Assigned</th>
                <th className="p-2">Email</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-surface-variant">
              {roster.map((r) => (
                <tr key={r.name + r.role} className="hover:bg-[#F1F6F7] transition-colors">
                  <td className="p-2 whitespace-nowrap font-semibold">{r.name}</td>
                  <td className="p-2 whitespace-nowrap">{r.role}</td>
                  <td className={`p-2 text-center ${r.active ? 'font-semibold text-primary-container' : 'text-on-surface-variant/60'}`}>{r.active}</td>
                  <td className="p-2 text-center text-on-surface-variant">{r.total}</td>
                  <td className="p-2 whitespace-nowrap text-on-surface-variant">{r.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
