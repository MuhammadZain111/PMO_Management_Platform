import { useMemo } from 'react';
import { PMO_SERVICE_CATEGORIES, PMO_RAG_META } from '../data/constants';

function ragBucket(statusFlag) {
  if (statusFlag === 'completed' || statusFlag === 'handover') return 'green';
  if (statusFlag === 'in-progress') return 'yellow';
  if (statusFlag === 'at-risk' || statusFlag === 'delayed') return 'red';
  return null;
}

function monthLabel(iso) {
  if (!iso) return null;
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}
function monthSortKey(iso) {
  const d = new Date(iso + 'T00:00:00');
  return isNaN(d.getTime()) ? '9999-99' : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function computeSummary(projects) {
  const byCategory = {};
  const monthKeys = {};

  projects.forEach((p) => {
    p.services.forEach((svc) => {
      const cat = svc.category || 'Other';
      if (!byCategory[cat]) byCategory[cat] = { total: 0, green: 0, yellow: 0, red: 0, hold: 0, neu: 0, closed: 0, months: {} };
      const row = byCategory[cat];
      row.total += 1;

      const isClosed = svc.statusFlag === 'completed' && p.overallStatus === 'completed';
      if (isClosed) row.closed += 1;
      else if (svc.statusFlag === 'on-hold') row.hold += 1;
      else if (svc.statusFlag === 'not-started') row.neu += 1;
      else {
        const bucket = ragBucket(svc.statusFlag);
        if (bucket) row[bucket] += 1;
      }

      if (!isClosed) {
        const key = monthSortKey(p.estimatedEndDate);
        const label = monthLabel(p.estimatedEndDate);
        if (label) {
          monthKeys[key] = label;
          row.months[key] = (row.months[key] || 0) + 1;
        }
      }
    });
  });

  const months = Object.keys(monthKeys).sort().map((k) => ({ key: k, label: monthKeys[k] }));
  const categories = PMO_SERVICE_CATEGORIES.filter((c) => byCategory[c] && byCategory[c].total > 0).map((c) => ({
    name: c,
    data: byCategory[c]
  }));
  Object.keys(byCategory).forEach((c) => {
    if (!PMO_SERVICE_CATEGORIES.includes(c)) categories.push({ name: c, data: byCategory[c] });
  });

  return { categories, months };
}

function RagCell({ count, bucket }) {
  if (!count) return <td className="p-2 text-center text-on-surface-variant/60">{count}</td>;
  const meta = PMO_RAG_META[bucket];
  return (
    <td className="p-2 text-center">
      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${meta.classes}`}>{count}</span>
    </td>
  );
}

export default function Reports({ projects }) {
  const summary = useMemo(() => computeSummary(projects), [projects]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface mb-1">Delivery Reports</h2>
        <p className="text-base text-on-surface-variant">Portfolio-wide service status rollup across every active project</p>
      </div>

      {summary.categories.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-surface-variant p-6 text-sm text-on-surface-variant">
          No service data available yet.
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
          <div className="p-4 border-b border-surface-variant bg-surface-bright flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Service Status Summary</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">Every service across every project, rolled up by category.</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" />On track</span>
              <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />In progress</span>
              <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />At risk / delayed</span>
            </div>
          </div>
          {summary.months.length > 0 && (
            <div className="px-4 py-2 bg-surface-bright border-b border-surface-variant text-xs text-on-surface-variant">
              "Target Closing" columns count active (non-closed) services whose project is forecast to wrap that month.
            </div>
          )}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse" style={{ minWidth: 900 + summary.months.length * 90 }}>
              <thead>
                <tr className="bg-primary-container text-on-primary text-xs font-semibold uppercase tracking-wide">
                  <th className="p-2">Services</th>
                  <th className="p-2 text-center">Total</th>
                  <th className="p-2 text-center">Green</th>
                  <th className="p-2 text-center">Yellow</th>
                  <th className="p-2 text-center">Red</th>
                  <th className="p-2 text-center">Hold</th>
                  <th className="p-2 text-center">New</th>
                  {summary.months.length ? (
                    summary.months.map((m) => <th key={m.key} className="p-2 text-center">Target Closing: {m.label}</th>)
                  ) : (
                    <th className="p-2 text-center">Target Closing</th>
                  )}
                  <th className="p-2 text-center">Closed</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-surface-variant">
                {summary.categories.map((cat) => {
                  const d = cat.data;
                  return (
                    <tr key={cat.name} className="hover:bg-[#F1F6F7] transition-colors">
                      <td className="p-2 whitespace-nowrap font-semibold">{cat.name}</td>
                      <td className="p-2 text-center font-semibold">{d.total}</td>
                      <RagCell count={d.green} bucket="green" />
                      <RagCell count={d.yellow} bucket="yellow" />
                      <RagCell count={d.red} bucket="red" />
                      <td className={`p-2 text-center ${d.hold ? 'font-semibold text-purple-700' : 'text-on-surface-variant/60'}`}>{d.hold}</td>
                      <td className={`p-2 text-center ${d.neu ? 'font-semibold' : 'text-on-surface-variant/60'}`}>{d.neu}</td>
                      {summary.months.length ? (
                        summary.months.map((m) => {
                          const v = d.months[m.key] || 0;
                          return (
                            <td key={m.key} className={`p-2 text-center ${v ? '' : 'text-on-surface-variant/60'}`}>{v}</td>
                          );
                        })
                      ) : (
                        <td className="p-2 text-center text-on-surface-variant/60">&mdash;</td>
                      )}
                      <td className={`p-2 text-center ${d.closed ? 'font-semibold text-primary-container' : 'text-on-surface-variant/60'}`}>{d.closed}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
