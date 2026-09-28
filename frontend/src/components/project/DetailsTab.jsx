import StatusBadge from '../StatusBadge';
import ProgressBar from '../ProgressBar';
import { fmtCurrency, fmtDate, receivable } from '../../utils/format';

function Cell({ children, nowrap = true, className = '' }) {
  return <td className={`p-2 ${nowrap ? 'whitespace-nowrap' : ''} ${className}`}>{children}</td>;
}

export default function DetailsTab({ project, onEdit }) {
  const recv = receivable(project);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={onEdit}
          className="bg-primary-container text-on-primary px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Edit Project
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden mb-6">
        <div className="p-4 border-b border-surface-variant bg-surface-bright">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Project Record</h4>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[2100px]">
            <thead>
              <tr className="bg-primary-container text-on-primary text-xs font-semibold uppercase tracking-wide">
                <th className="p-2">Project Name</th>
                <th className="p-2">Project ID</th>
                <th className="p-2">Client</th>
                <th className="p-2">Project Manager</th>
                <th className="p-2">Sales Account Manager</th>
                <th className="p-2">Delivery Head</th>
                <th className="p-2">Revenue Category</th>
                <th className="p-2">Actual Start Date</th>
                <th className="p-2">Planned End Date</th>
                <th className="p-2">Estimated End Date</th>
                <th className="p-2">Project Status</th>
                <th className="p-2">Completion</th>
                <th className="p-2 text-right">Total Project Value</th>
                <th className="p-2 text-right">Total Received</th>
                <th className="p-2 text-right">Receivable Amount</th>
                <th className="p-2">Bid Guarantee Submitted</th>
                <th className="p-2 text-right">Guarantee Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <Cell><span className="font-semibold">{project.name}</span></Cell>
                <Cell><span className="text-on-surface-variant">{project.id}</span></Cell>
                <Cell>{project.client}</Cell>
                <Cell>{project.projectManager}</Cell>
                <Cell>{project.salesAccountManager}</Cell>
                <Cell>{project.deliveryHead}</Cell>
                <Cell>{project.revenueCategory}</Cell>
                <Cell>{fmtDate(project.startDate)}</Cell>
                <Cell>{fmtDate(project.endDate)}</Cell>
                <Cell>{fmtDate(project.estimatedEndDate)}</Cell>
                <Cell><StatusBadge flag={project.overallStatus} /></Cell>
                <Cell nowrap={false} className="min-w-[160px]"><ProgressBar value={project.overallCompletion} /></Cell>
                <Cell className="text-right">{fmtCurrency(project.value)}</Cell>
                <Cell className="text-right">{fmtCurrency(project.totalReceived)}</Cell>
                <Cell className="text-right">
                  <span className={`font-semibold ${recv > 0 ? 'text-primary-container' : 'text-on-surface'}`}>
                    {fmtCurrency(recv)}
                  </span>
                </Cell>
                <Cell>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      project.bidGuaranteeSubmitted === 'Yes'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {project.bidGuaranteeSubmitted}
                  </span>
                </Cell>
                <Cell className="text-right">
                  {project.bidGuaranteeSubmitted === 'Yes' ? (
                    fmtCurrency(project.guaranteeAmount)
                  ) : (
                    <span className="text-on-surface-variant">Not applicable</span>
                  )}
                </Cell>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Project Description</span>
          <p className="text-sm text-on-surface leading-relaxed mt-1">{project.description}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Attachments</span>
          <div className="mt-2 flex flex-col gap-1">
            {(project.attachments || []).length === 0 && (
              <p className="text-sm text-on-surface-variant">No attachments uploaded yet.</p>
            )}
            {(project.attachments || []).map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary-container">description</span>
                <span className="text-sm font-medium truncate">{a.name}</span>
                <span className="text-xs text-on-surface-variant px-2 py-0.5 rounded bg-surface-container-highest">
                  {a.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
