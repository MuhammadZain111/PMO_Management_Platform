import { Fragment, useState } from 'react';
import StatusBadge from '../StatusBadge';
import ProgressBar from '../ProgressBar';
import { fmtDate } from '../../utils/format';

function HistoryList({ history }) {
  if (!history || history.length === 0) {
    return <p className="text-sm text-on-surface-variant">No updates recorded yet.</p>;
  }
  return (
    <div className="flex flex-col gap-2">
      {history.map((h, i) => (
        <div key={i} className="border border-surface-variant rounded-lg p-2 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
            <span className="font-semibold">{h.service}</span>
            <span className="text-xs text-on-surface-variant">{h.updatedBy} &middot; {fmtDate(h.updatedDate)}</span>
          </div>
          <p className="text-on-surface-variant">
            Status: <span className="font-medium text-on-surface">{h.previousStatus}</span> &rarr;{' '}
            <span className="font-medium text-on-surface">{h.newStatus}</span>
            {'  \u00b7  '}
            Completion: <span className="font-medium text-on-surface">{h.previousCompletion}%</span> &rarr;{' '}
            <span className="font-medium text-on-surface">{h.newCompletion}%</span>
          </p>
          {h.remarks && <p className="text-xs text-on-surface-variant mt-1">{h.remarks}</p>}
        </div>
      ))}
    </div>
  );
}

export default function StatusTab({ project, onUpdateStatus }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold">{project.name}</h3>
            <p className="text-sm text-on-surface-variant">{project.client} &middot; {project.id}</p>
          </div>
          <button
            onClick={onUpdateStatus}
            className="bg-primary-container text-on-primary px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">update</span>
            Update Project Status
          </button>
        </div>
        <div className="flex flex-col gap-1 mb-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Overall Completion</span>
          <ProgressBar value={project.overallCompletion} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-surface-variant">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Project Status</p>
            <div className="mt-1"><StatusBadge flag={project.overallStatus} /></div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Actual Start Date</p>
            <p className="text-sm font-medium">{fmtDate(project.startDate)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Planned End Date</p>
            <p className="text-sm font-medium">{fmtDate(project.endDate)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Estimated End Date</p>
            <p className="text-sm font-medium">{fmtDate(project.estimatedEndDate)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Delivery Head</p>
            <p className="text-sm font-medium">{project.deliveryHead}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Sales Account Manager</p>
            <p className="text-sm font-medium">{project.salesAccountManager}</p>
          </div>
        </div>
        <div className="pt-4 mt-4 border-t border-surface-variant">
          <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Status Description</span>
          <p className="text-sm text-on-surface leading-relaxed mt-1">{project.statusDescription}</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
        <div className="p-4 border-b border-surface-variant bg-surface-bright">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Service-Level Status</h4>
          <p className="text-xs text-on-surface-variant mt-0.5">Click a service to view its detailed status.</p>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-primary-container text-on-primary text-xs font-semibold uppercase tracking-wide">
                <th className="p-2">Service</th>
                <th className="p-2">Description</th>
                <th className="p-2">Delivery Head</th>
                <th className="p-2">Sales Account Manager</th>
                <th className="p-2">Completion</th>
                <th className="p-2">Status</th>
                <th className="p-2">Status Description</th>
                <th className="p-2">Project Details</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-surface-variant">
              {project.services.map((svc, idx) => (
                <Fragment key={idx}>
                  <tr onClick={() => setExpanded(expanded === idx ? null : idx)} className="hover:bg-[#F1F6F7] cursor-pointer transition-colors">
                    <td className="p-2 whitespace-nowrap font-semibold">{svc.name}</td>
                    <td className="p-2 max-w-[200px] truncate" title={svc.description}>{svc.description}</td>
                    <td className="p-2 whitespace-nowrap">{svc.deliveryHead}</td>
                    <td className="p-2 whitespace-nowrap">{svc.sam}</td>
                    <td className="p-2 min-w-[160px]"><ProgressBar value={svc.completion} /></td>
                    <td className="p-2 whitespace-nowrap"><StatusBadge flag={svc.statusFlag} /></td>
                    <td className="p-2 max-w-[200px] truncate text-on-surface-variant" title={svc.statusDescription}>{svc.statusDescription}</td>
                    <td className="p-2 whitespace-nowrap"><span className="text-primary text-xs font-medium hover:underline">View &rarr;</span></td>
                  </tr>
                  {expanded === idx && (
                    <tr className="bg-surface-bright">
                      <td colSpan={8} className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1">Project Details</p>
                        <p className="text-sm">{svc.projectDetails || svc.statusDescription}</p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Status Update History</h4>
          <span className="text-xs text-on-surface-variant">
            {(project.updateHistory || []).length} update{(project.updateHistory || []).length === 1 ? '' : 's'}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant mb-4">
          Every status change for this project and its services, newest first &mdash; who made it, when, and what changed.
        </p>
        <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
          <HistoryList history={project.updateHistory} />
        </div>
      </div>
    </div>
  );
}
