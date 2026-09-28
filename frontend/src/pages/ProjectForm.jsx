import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  STATUS_FLAG_META,
  PMO_PROJECT_MANAGERS,
  PMO_SAMS,
  PMO_DELIVERY_HEADS,
  PMO_REVENUE_CATEGORIES,
  PMO_PAYMENT_PLAN_TYPES,
  PMO_PAYMENT_STATUS_OPTIONS,
  PMO_TASK_STATUS_OPTIONS,
  PMO_ATTACHMENT_TYPES,
  PMO_MILESTONE_TYPES,
  PMO_SERVICE_CATEGORIES
} from '../data/constants';
import { fmtCurrency, receivable } from '../utils/format';

const TABS = [
  { key: 'details', label: '1. Project Details' },
  { key: 'milestones', label: '2. Project Milestones' },
  { key: 'plan', label: '3. Project Plan' },
  { key: 'status', label: '4. Project Status' }
];

function blankDraft() {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: '',
    name: '',
    client: '',
    startDate: today,
    endDate: '',
    estimatedEndDate: '',
    description: '',
    projectManager: PMO_PROJECT_MANAGERS[0],
    salesAccountManager: PMO_SAMS[0],
    deliveryHead: PMO_DELIVERY_HEADS[0],
    overallCompletion: 0,
    overallStatus: 'not-started',
    revenueCategory: PMO_REVENUE_CATEGORIES[0],
    value: 0,
    paymentPlanType: 'Milestone-Based',
    totalReceived: 0,
    bidGuaranteeSubmitted: 'No',
    guaranteeAmount: 0,
    attachments: [],
    statusDescription: 'New project \u2014 status not yet reported.',
    milestones: [],
    plan: [],
    services: [],
    updateHistory: []
  };
}

// ---- small field building blocks -----------------------------------------

function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) || 0 : e.target.value)}
        className="border border-surface-variant rounded p-2 text-sm outline-none focus:ring-1 focus:ring-primary-container"
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-surface-variant rounded p-2 text-sm outline-none focus:ring-1 focus:ring-primary-container"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatusSelect({ value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold">Project Status</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-surface-variant rounded p-2 text-sm outline-none focus:ring-1 focus:ring-primary-container"
      >
        {Object.keys(STATUS_FLAG_META).map((k) => (
          <option key={k} value={k}>
            {STATUS_FLAG_META[k].label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SectionCard({ title, action, children, note }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{title}</h4>
        {action}
      </div>
      {children}
      {note && <p className="text-xs text-on-surface-variant mt-3">{note}</p>}
    </div>
  );
}

function RowCard({ title, onRemove, children }) {
  return (
    <div className="border border-surface-variant rounded-lg p-4 flex flex-col gap-3 mb-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{title}</p>
        <button type="button" onClick={onRemove} className="material-symbols-outlined text-[18px] text-on-surface-variant hover:text-error">
          delete
        </button>
      </div>
      {children}
    </div>
  );
}

function AddLink({ onClick, label }) {
  return (
    <button type="button" onClick={onClick} className="text-primary text-xs font-medium hover:underline flex items-center gap-1">
      <span className="material-symbols-outlined text-[16px]">add</span>
      {label}
    </button>
  );
}

function MiniField({ label, value, type = 'text', onChange, area }) {
  const cls = 'border border-surface-variant rounded p-1.5 text-sm outline-none focus:ring-1 focus:ring-primary-container';
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-on-surface-variant">{label}</label>
      {area ? (
        <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) || 0 : e.target.value)}
          className={cls}
        />
      )}
    </div>
  );
}

function MiniSelect({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-on-surface-variant">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="border border-surface-variant rounded p-1.5 text-sm outline-none focus:ring-1 focus:ring-primary-container">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// ---- main component --------------------------------------------------------

export default function ProjectForm({ mode, projects, onCreate, onSave, onCancel }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const existing = mode === 'edit' ? projects.find((p) => p.id === projectId) : null;

  const [draft, setDraft] = useState(() => (existing ? structuredCloneSafe(existing) : blankDraft()));
  const [tab, setTab] = useState('details');
  const [error, setError] = useState('');

  const recv = useMemo(() => receivable(draft), [draft.value, draft.totalReceived]);

  if (mode === 'edit' && !existing) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-surface-variant p-8 text-center text-on-surface-variant">
        Project not found.
      </div>
    );
  }

  function update(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  function updateArrayItem(key, idx, field, value) {
    setDraft((d) => ({ ...d, [key]: d[key].map((item, i) => (i === idx ? { ...item, [field]: value } : item)) }));
  }
  function removeArrayItem(key, idx) {
    setDraft((d) => ({ ...d, [key]: d[key].filter((_, i) => i !== idx) }));
  }
  function addArrayItem(key, item) {
    setDraft((d) => ({ ...d, [key]: [...d[key], item] }));
  }

  function handleSubmit() {
    if (!draft.name.trim() || !draft.client.trim()) {
      setError('Project Name and Client Name are required.');
      setTab('details');
      return;
    }
    setError('');
    if (mode === 'create') {
      onCreate(draft);
    } else {
      onSave(projectId, draft);
    }
  }

  function handleCancel() {
    if (mode === 'create') onCancel();
    else navigate(`/projects/${projectId}`);
  }

  return (
    <div>
      <button onClick={handleCancel} className="flex items-center gap-1 text-primary text-sm font-medium hover:underline mb-4">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        {mode === 'create' ? 'Back to Project Dashboard' : 'Back to Project Details'}
      </button>

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-on-surface mb-1">{mode === 'create' ? 'Add New Project' : 'Update Project Information'}</h2>
        <p className="text-base text-on-surface-variant">
          {mode === 'create' ? 'Fill in the details below, then create the project.' : `Editing ${draft.name || existing.name} (${draft.id})`}
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-surface-variant mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 -mb-px transition-colors ${
              tab === t.key ? 'border-primary-container text-primary-container' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-700 text-sm border border-rose-200">{error}</div>}

      {/* ---- 1. Project Details ---- */}
      {tab === 'details' && (
        <div>
          <SectionCard title="Project Information">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Project Name" value={draft.name} onChange={(v) => update('name', v)} />
              <Field label="Project Code" value={draft.id} onChange={(v) => update('id', v)} placeholder="Auto-generated if left blank" />
              <Field label="Client Name" value={draft.client} onChange={(v) => update('client', v)} />
              <SelectField label="Project Manager" value={draft.projectManager} options={PMO_PROJECT_MANAGERS} onChange={(v) => update('projectManager', v)} />
              <SelectField label="Sales Account Manager" value={draft.salesAccountManager} options={PMO_SAMS} onChange={(v) => update('salesAccountManager', v)} />
              <SelectField label="Delivery Head" value={draft.deliveryHead} options={PMO_DELIVERY_HEADS} onChange={(v) => update('deliveryHead', v)} />
              <Field label="Start Date" type="date" value={draft.startDate} onChange={(v) => update('startDate', v)} />
              <Field label="End Date" type="date" value={draft.endDate} onChange={(v) => update('endDate', v)} />
              <Field label="Estimated End Date" type="date" value={draft.estimatedEndDate} onChange={(v) => update('estimatedEndDate', v)} />
              <StatusSelect value={draft.overallStatus} onChange={(v) => update('overallStatus', v)} />
              <Field label="Overall Completion (%)" type="number" value={draft.overallCompletion} onChange={(v) => update('overallCompletion', Math.max(0, Math.min(100, v)))} />
              <SelectField label="Revenue Category" value={draft.revenueCategory} options={PMO_REVENUE_CATEGORIES} onChange={(v) => update('revenueCategory', v)} />
            </div>
            <div className="flex flex-col gap-1 mt-4">
              <label className="text-sm font-semibold">Project Description</label>
              <textarea
                rows={3}
                value={draft.description}
                onChange={(e) => update('description', e.target.value)}
                className="border border-surface-variant rounded p-2 text-sm outline-none focus:ring-1 focus:ring-primary-container"
              />
            </div>
          </SectionCard>

          <SectionCard title="Financials">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Total Project Value (PKR)" type="number" value={draft.value} onChange={(v) => update('value', v)} />
              <Field label="Total Received Amount (PKR)" type="number" value={draft.totalReceived} onChange={(v) => update('totalReceived', v)} />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Receivable Amount (PKR)</label>
                <div className="border border-surface-variant rounded p-2 text-sm bg-surface-container-low text-on-surface-variant">{fmtCurrency(recv)}</div>
                <span className="text-xs text-on-surface-variant">Calculated automatically as Total Value minus Total Received.</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <SelectField label="Bid Guarantee Submitted" value={draft.bidGuaranteeSubmitted} options={['Yes', 'No']} onChange={(v) => update('bidGuaranteeSubmitted', v)} />
              {draft.bidGuaranteeSubmitted === 'Yes' && (
                <Field label="Guarantee Amount (PKR)" type="number" value={draft.guaranteeAmount} onChange={(v) => update('guaranteeAmount', v)} />
              )}
            </div>
          </SectionCard>

          <SectionCard title="Attachments" action={<AddLink label="Add Attachment" onClick={() => addArrayItem('attachments', { name: 'New Attachment.pdf', type: 'Other' })} />}>
            {draft.attachments.length === 0 && <p className="text-sm text-on-surface-variant">No attachments yet. Use &ldquo;Add Attachment&rdquo; to record one.</p>}
            {draft.attachments.map((a, idx) => (
              <RowCard key={idx} title={`Attachment ${idx + 1}`} onRemove={() => removeArrayItem('attachments', idx)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <MiniField label="File Name" value={a.name} onChange={(v) => updateArrayItem('attachments', idx, 'name', v)} />
                  <MiniSelect label="Attachment Type" value={a.type} options={PMO_ATTACHMENT_TYPES} onChange={(v) => updateArrayItem('attachments', idx, 'type', v)} />
                </div>
              </RowCard>
            ))}
          </SectionCard>
        </div>
      )}

      {/* ---- 2. Project Milestones ---- */}
      {tab === 'milestones' && (
        <SectionCard title="Payment Milestones" action={<AddLink label="Add Milestone" onClick={() => addArrayItem('milestones', { name: 'New Milestone', type: 'Milestone', description: '', dueDate: '', expectedCompleteDate: '', percentage: 0, amount: 0, status: 'Pending', paymentDate: '-', invoice: null, remarks: '' })} />}>
          <div className="flex flex-col gap-1 max-w-xs mb-4">
            <label className="text-sm font-semibold">Payment Plan Type</label>
            <select value={draft.paymentPlanType} onChange={(e) => update('paymentPlanType', e.target.value)} className="border border-surface-variant rounded p-2 text-sm outline-none focus:ring-1 focus:ring-primary-container">
              {PMO_PAYMENT_PLAN_TYPES.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <span className="text-xs text-on-surface-variant">Choose whether this project bills per deliverable, monthly, quarterly, or advance/completion.</span>
          </div>
          {draft.milestones.length === 0 && <p className="text-sm text-on-surface-variant">No milestones yet. Use &ldquo;Add Milestone&rdquo; to record the payment plan.</p>}
          {draft.milestones.map((m, idx) => (
            <RowCard key={idx} title={`Milestone ${idx + 1}`} onRemove={() => removeArrayItem('milestones', idx)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <MiniSelect label="Milestone Type" value={m.type} options={PMO_MILESTONE_TYPES} onChange={(v) => updateArrayItem('milestones', idx, 'type', v)} />
                <MiniField label="Milestone Name" value={m.name} onChange={(v) => updateArrayItem('milestones', idx, 'name', v)} />
                <MiniField label="Due Date" type="date" value={m.dueDate} onChange={(v) => updateArrayItem('milestones', idx, 'dueDate', v)} />
              </div>
              <MiniField label="Description" area value={m.description} onChange={(v) => updateArrayItem('milestones', idx, 'description', v)} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MiniField label="Percentage" type="number" value={m.percentage} onChange={(v) => updateArrayItem('milestones', idx, 'percentage', v)} />
                <MiniField label="Amount (PKR)" type="number" value={m.amount} onChange={(v) => updateArrayItem('milestones', idx, 'amount', v)} />
                <MiniSelect label="Payment Status" value={m.status} options={PMO_PAYMENT_STATUS_OPTIONS} onChange={(v) => updateArrayItem('milestones', idx, 'status', v)} />
                <MiniField label="Payment Date" type="date" value={m.paymentDate === '-' ? '' : m.paymentDate} onChange={(v) => updateArrayItem('milestones', idx, 'paymentDate', v || '-')} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <MiniField label="Expected Complete Date" type="date" value={m.expectedCompleteDate} onChange={(v) => updateArrayItem('milestones', idx, 'expectedCompleteDate', v)} />
                <MiniField
                  label="Invoice Number"
                  value={m.invoice ? m.invoice.number : ''}
                  onChange={(v) => updateArrayItem('milestones', idx, 'invoice', v ? { ...(m.invoice || {}), number: v } : null)}
                />
                <MiniField
                  label="Invoice File Name"
                  value={m.invoice ? m.invoice.fileName : ''}
                  onChange={(v) => updateArrayItem('milestones', idx, 'invoice', m.invoice ? { ...m.invoice, fileName: v } : v ? { number: '', fileName: v } : null)}
                />
              </div>
              <MiniField label="Remarks" area value={m.remarks} onChange={(v) => updateArrayItem('milestones', idx, 'remarks', v)} />
            </RowCard>
          ))}
        </SectionCard>
      )}

      {/* ---- 3. Project Plan ---- */}
      {tab === 'plan' && (
        <SectionCard title="Project Plan" action={<AddLink label="Add Activity" onClick={() => addArrayItem('plan', { task: 'New Activity', description: '', start: '', end: '', owner: '', dependency: '\u2014', progress: 0, status: 'Not Started' })} />}>
          {draft.plan.length === 0 && <p className="text-sm text-on-surface-variant">No plan activities yet. Use &ldquo;Add Activity&rdquo; to build the schedule.</p>}
          {draft.plan.map((t, idx) => (
            <RowCard key={idx} title={`Activity ${idx + 1}`} onRemove={() => removeArrayItem('plan', idx)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <MiniField label="Activity / Task" value={t.task} onChange={(v) => updateArrayItem('plan', idx, 'task', v)} />
                <MiniField label="Assigned Person" value={t.owner} onChange={(v) => updateArrayItem('plan', idx, 'owner', v)} />
              </div>
              <MiniField label="Description" area value={t.description} onChange={(v) => updateArrayItem('plan', idx, 'description', v)} />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <MiniField label="Start Date" type="date" value={t.start} onChange={(v) => updateArrayItem('plan', idx, 'start', v)} />
                <MiniField label="End Date" type="date" value={t.end} onChange={(v) => updateArrayItem('plan', idx, 'end', v)} />
                <MiniField label="Dependency" value={t.dependency} onChange={(v) => updateArrayItem('plan', idx, 'dependency', v)} />
                <MiniField label="Progress %" type="number" value={t.progress} onChange={(v) => updateArrayItem('plan', idx, 'progress', v)} />
                <MiniSelect label="Status" value={t.status} options={PMO_TASK_STATUS_OPTIONS} onChange={(v) => updateArrayItem('plan', idx, 'status', v)} />
              </div>
            </RowCard>
          ))}
        </SectionCard>
      )}

      {/* ---- 4. Project Status ---- */}
      {tab === 'status' && (
        <div>
          <SectionCard title="Overall Status Description">
            <textarea
              rows={3}
              value={draft.statusDescription}
              onChange={(e) => update('statusDescription', e.target.value)}
              className="w-full border border-surface-variant rounded p-2 text-sm outline-none focus:ring-1 focus:ring-primary-container"
            />
          </SectionCard>
          <SectionCard title="Project Services" action={<AddLink label="Add Service" onClick={() => addArrayItem('services', { name: 'New Service', category: PMO_SERVICE_CATEGORIES[0], description: '', deliveryHead: PMO_DELIVERY_HEADS[0], sam: PMO_SAMS[0], assignedTeam: '', manpower: 1, days: 0, pricing: 0, completion: 0, statusFlag: 'not-started', statusDescription: '', projectDetails: '' })} />}>
            {draft.services.length === 0 && <p className="text-sm text-on-surface-variant">No services yet. Use &ldquo;Add Service&rdquo; to break down delivery.</p>}
            {draft.services.map((svc, idx) => (
              <RowCard key={idx} title={`Service ${idx + 1}`} onRemove={() => removeArrayItem('services', idx)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <MiniField label="Service Name" value={svc.name} onChange={(v) => updateArrayItem('services', idx, 'name', v)} />
                  <MiniSelect label="Service Category" value={svc.category} options={PMO_SERVICE_CATEGORIES} onChange={(v) => updateArrayItem('services', idx, 'category', v)} />
                </div>
                <MiniField label="Service Description" area value={svc.description} onChange={(v) => updateArrayItem('services', idx, 'description', v)} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MiniField label="Assigned Team" value={svc.assignedTeam} onChange={(v) => updateArrayItem('services', idx, 'assignedTeam', v)} />
                  <MiniField label="Manpower" type="number" value={svc.manpower} onChange={(v) => updateArrayItem('services', idx, 'manpower', v)} />
                  <MiniField label="Days" type="number" value={svc.days} onChange={(v) => updateArrayItem('services', idx, 'days', v)} />
                  <MiniField label="Pricing (PKR)" type="number" value={svc.pricing} onChange={(v) => updateArrayItem('services', idx, 'pricing', v)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <MiniSelect label="Delivery Head" value={svc.deliveryHead} options={PMO_DELIVERY_HEADS} onChange={(v) => updateArrayItem('services', idx, 'deliveryHead', v)} />
                  <MiniSelect label="Sales Account Manager" value={svc.sam} options={PMO_SAMS} onChange={(v) => updateArrayItem('services', idx, 'sam', v)} />
                  <MiniSelect label="Service Status" value={svc.statusFlag} options={Object.keys(STATUS_FLAG_META)} onChange={(v) => updateArrayItem('services', idx, 'statusFlag', v)} />
                </div>
                <MiniField label="Completion (%)" type="number" value={svc.completion} onChange={(v) => updateArrayItem('services', idx, 'completion', Math.max(0, Math.min(100, v)))} />
                <MiniField label="Status Description" area value={svc.statusDescription} onChange={(v) => updateArrayItem('services', idx, 'statusDescription', v)} />
                <MiniField label="Project Details" area value={svc.projectDetails} onChange={(v) => updateArrayItem('services', idx, 'projectDetails', v)} />
              </RowCard>
            ))}
          </SectionCard>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 mt-2 pb-10">
        <button onClick={handleCancel} className="px-4 py-2 border border-surface-variant rounded-lg text-sm font-semibold hover:bg-surface-container-highest transition-colors">
          Cancel
        </button>
        <button onClick={handleSubmit} className="bg-primary-container text-on-primary px-6 py-2 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">check</span>
          {mode === 'create' ? 'Create Project' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function structuredCloneSafe(obj) {
  return typeof structuredClone === 'function' ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
}
