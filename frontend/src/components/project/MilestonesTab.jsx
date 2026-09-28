import { Fragment, useState } from 'react';
import { PAYMENT_STATUS_META, PMO_PAYMENT_PLAN_META, PMO_MILESTONE_TYPE_META } from '../../data/constants';
import { fmtCurrency, fmtDate } from '../../utils/format';

function TypeBadge({ type }) {
  const meta = PMO_MILESTONE_TYPE_META[type] || PMO_MILESTONE_TYPE_META['Milestone'];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${meta.classes}`}>
      <span className="material-symbols-outlined text-[13px]">{meta.icon}</span>
      {meta.label}
    </span>
  );
}

export default function MilestonesTab({ project, onAttachInvoice }) {
  const [openIdx, setOpenIdx] = useState(null);
  const [draftNumber, setDraftNumber] = useState('');
  const [draftFile, setDraftFile] = useState('');

  const planType = project.paymentPlanType || 'Milestone-Based';
  const planMeta = PMO_PAYMENT_PLAN_META[planType] || PMO_PAYMENT_PLAN_META['Milestone-Based'];
  const total = project.milestones.length;
  const paidCount = project.milestones.filter((m) => m.status === 'Paid').length;
  const receivedSum = project.milestones.filter((m) => m.status === 'Paid').reduce((s, m) => s + (m.amount || 0), 0);
  const outstandingSum = project.milestones.filter((m) => m.status !== 'Paid').reduce((s, m) => s + (m.amount || 0), 0);
  const invoicedCount = project.milestones.filter((m) => m.invoice).length;

  function startAttach(idx, m) {
    setOpenIdx(idx);
    setDraftNumber(m.invoice ? m.invoice.number : '');
    setDraftFile(m.invoice ? m.invoice.fileName : '');
  }

  function saveInvoice(idx) {
    if (!draftNumber.trim()) return;
    onAttachInvoice(idx, { number: draftNumber.trim(), fileName: draftFile.trim() || `${draftNumber.trim()}.pdf`, uploadedDate: new Date().toISOString().slice(0, 10) });
    setOpenIdx(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-primary-container">{planMeta.icon}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Payment Plan</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${planMeta.classes}`}>
                {planType}
              </span>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant max-w-[360px]">{planMeta.hint}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-surface-variant">
          <div>
            <p className="text-xs uppercase tracking-wide text-on-surface-variant">Payments Made</p>
            <p className="text-2xl font-bold">{paidCount} of {total}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-on-surface-variant">Amount Received</p>
            <p className="text-2xl font-bold">{fmtCurrency(receivedSum)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-on-surface-variant">Amount Outstanding</p>
            <p className="text-2xl font-bold text-primary-container">{fmtCurrency(outstandingSum)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-on-surface-variant">Invoices Attached</p>
            <p className="text-2xl font-bold">{invoicedCount} of {total}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
        <div className="p-4 border-b border-surface-variant bg-surface-bright">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Payment Milestone Listing</h4>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1450px]">
            <thead>
              <tr className="bg-primary-container text-on-primary text-xs font-semibold uppercase tracking-wide">
                <th className="p-2">Milestone / Period</th>
                <th className="p-2">Type</th>
                <th className="p-2">Description</th>
                <th className="p-2">Due Date</th>
                <th className="p-2">Expected Complete Date</th>
                <th className="p-2 text-right">Amount (PKR)</th>
                <th className="p-2">Payment Status</th>
                <th className="p-2">Payment Date</th>
                <th className="p-2">Invoice</th>
                <th className="p-2">Remarks</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-surface-variant">
              {project.milestones.map((m, idx) => (
                <Fragment key={idx}>
                  <tr className="hover:bg-[#F1F6F7] transition-colors">
                    <td className="p-2 whitespace-nowrap font-semibold">{m.name}</td>
                    <td className="p-2 whitespace-nowrap"><TypeBadge type={m.type} /></td>
                    <td className="p-2 max-w-[200px]">{m.description}</td>
                    <td className="p-2 whitespace-nowrap">{fmtDate(m.dueDate)}</td>
                    <td className="p-2 whitespace-nowrap">{fmtDate(m.expectedCompleteDate)}</td>
                    <td className="p-2 whitespace-nowrap text-right">{fmtCurrency(m.amount)}</td>
                    <td className="p-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PAYMENT_STATUS_META[m.status] || ''}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-2 whitespace-nowrap text-on-surface-variant">{m.paymentDate === '-' ? '-' : fmtDate(m.paymentDate)}</td>
                    <td className="p-2 whitespace-nowrap">
                      {m.invoice ? (
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-primary-container">description</span>
                          <span className="text-sm font-medium">{m.invoice.number}</span>
                          <button onClick={() => startAttach(idx, m)} className="text-primary text-xs font-medium hover:underline">Replace</button>
                        </div>
                      ) : (
                        <button onClick={() => startAttach(idx, m)} className="inline-flex items-center gap-1 text-primary text-xs font-medium hover:underline">
                          <span className="material-symbols-outlined text-[16px]">upload_file</span>Attach Invoice
                        </button>
                      )}
                    </td>
                    <td className="p-2 max-w-[180px] text-on-surface-variant">{m.remarks || '\u2014'}</td>
                  </tr>
                  {openIdx === idx && (
                    <tr className="bg-surface-bright">
                      <td colSpan={10} className="p-4">
                        <div className="flex flex-col md:flex-row md:items-end gap-2">
                          <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs text-on-surface-variant">Invoice Number</label>
                            <input value={draftNumber} onChange={(e) => setDraftNumber(e.target.value)} placeholder="e.g. INV-2026-0142" className="border border-surface-variant rounded p-1.5 text-sm outline-none focus:ring-1 focus:ring-primary-container" />
                          </div>
                          <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs text-on-surface-variant">Invoice File Name</label>
                            <input value={draftFile} onChange={(e) => setDraftFile(e.target.value)} placeholder="e.g. Invoice_INV-2026-0142.pdf" className="border border-surface-variant rounded p-1.5 text-sm outline-none focus:ring-1 focus:ring-primary-container" />
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setOpenIdx(null)} className="px-4 py-1.5 border border-surface-variant rounded-lg text-sm font-semibold hover:bg-surface-container-highest">Cancel</button>
                            <button onClick={() => saveInvoice(idx)} className="bg-primary-container text-on-primary px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">check</span>Save Invoice
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
