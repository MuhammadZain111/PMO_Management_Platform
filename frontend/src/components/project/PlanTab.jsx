import { TASK_STATUS_META } from '../../data/constants';
import ProgressBar from '../ProgressBar';
import { fmtDate } from '../../utils/format';

export default function PlanTab({ project }) {
  const rangeStart = new Date(project.startDate + 'T00:00:00').getTime();
  const rangeEnd = new Date(project.endDate + 'T00:00:00').getTime();
  const rangeSpan = Math.max(1, rangeEnd - rangeStart);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-primary-container text-on-primary text-xs font-semibold uppercase tracking-wide">
              <th className="p-2">Task / Activity</th>
              <th className="p-2">Description</th>
              <th className="p-2">Start Date</th>
              <th className="p-2">End Date</th>
              <th className="p-2">Assigned Team / Owner</th>
              <th className="p-2">Dependency</th>
              <th className="p-2">Timeline / Progress</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-surface-variant">
            {project.plan.map((t, i) => {
              const tStart = new Date(t.start + 'T00:00:00').getTime();
              const tEnd = new Date(t.end + 'T00:00:00').getTime();
              const leftPct = Math.max(0, Math.min(100, ((tStart - rangeStart) / rangeSpan) * 100));
              const widthPct = Math.max(2, Math.min(100 - leftPct, ((tEnd - tStart) / rangeSpan) * 100));
              return (
                <tr key={i} className="hover:bg-[#F1F6F7] transition-colors">
                  <td className="p-2 whitespace-nowrap font-semibold">{t.task}</td>
                  <td className="p-2 max-w-[200px]">{t.description}</td>
                  <td className="p-2 whitespace-nowrap">{fmtDate(t.start)}</td>
                  <td className="p-2 whitespace-nowrap">{fmtDate(t.end)}</td>
                  <td className="p-2 whitespace-nowrap">{t.owner}</td>
                  <td className="p-2 whitespace-nowrap text-on-surface-variant">{t.dependency}</td>
                  <td className="p-2 min-w-[220px]">
                    <div className="relative h-2 bg-surface-container-highest rounded-full w-full mb-1">
                      <div className="absolute top-0 h-2 rounded-full bg-primary-container" style={{ left: `${leftPct}%`, width: `${widthPct}%` }} />
                    </div>
                    <ProgressBar value={t.progress} />
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${TASK_STATUS_META[t.status] || ''}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
