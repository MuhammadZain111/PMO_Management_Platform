import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { STATUS_FLAG_META, PMO_DELIVERY_HEADS, PMO_SAMS, PMO_SERVICE_CATEGORIES } from '../data/constants';
import { fmtDate } from '../utils/format';

function cloneServices(services) {
  return typeof structuredClone === 'function' ? structuredClone(services) : JSON.parse(JSON.stringify(services));
}

function MiniField({ label, value, type = 'text', onChange, area }) {
  const cls = 'border border-surface-variant rounded p-1.5 text-sm outline-none focus:ring-1 focus:ring-primary-container';
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-on-surface-variant">{label}</label>
      {area ? (
        <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(type === 'number' ? Number(e.target.value) || 0 : e.target.value)} className={cls} />
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
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export default function UpdateStatusForm({ projects, onSave }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === projectId);

  const [meta, setMeta] = useState(() =>
    project ? { overallStatus: project.overallStatus, startDate: project.startDate, endDate: project.endDate, estimatedEndDate: project.estimatedEndDate, comment: '' } : null
  );
  const [services, setServices] = useState(() => (project ? cloneServices(project.services) : []));

  if (!project) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-surface-variant p-8 text-center text-on-surface-variant">
        Project not found.
      </div>
    );
  }

  function updateService(idx, field, value) {
    setServices((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  }
  function removeService(idx) {
    setServices((prev) => prev.filter((_, i) => i !== idx));
  }
  function addService() {
    setServices((prev) => [
      ...prev,
      { name: 'New Service', category: PMO_SERVICE_CATEGORIES[0], description: '', deliveryHead: PMO_DELIVERY_HEADS[0], sam: PMO_SAMS[0], assignedTeam: '', manpower: 1, days: 0, pricing: 0, completion: 0, statusFlag: 'not-started', statusDescription: '', projectDetails: '' }
    ]);
  }

  function handleSave() {
    onSave(projectId, meta, services);
  }

  return (
    <div>
      <button onClick={() => navigate(`/projects/${projectId}`)} className="flex items-center gap-1 text-primary text-sm font-medium hover:underline mb-4">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Project Status
      </button>

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-on-surface mb-1">Update Project Status</h2>
        <p className="text-base text-on-surface-variant">Update service-level status for {project.name} ({project.id})</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-6 mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-4">Project Status &amp; Timeline</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Project Status</label>
            <select value={meta.overallStatus} onChange={(e) => setMeta((m) => ({ ...m, overallStatus: e.target.value }))} className="border border-surface-variant rounded p-2 text-sm outline-none focus:ring-1 focus:ring-primary-container">
              {Object.keys(STATUS_FLAG_META).map((k) => (
                <option key={k} value={k}>{STATUS_FLAG_META[k].label}</option>
              ))}
            </select>
          </div>
          <MiniField label="Actual Start Date" type="date" value={meta.startDate} onChange={(v) => setMeta((m) => ({ ...m, startDate: v }))} />
          <MiniField label="Planned End Date" type="date" value={meta.endDate} onChange={(v) => setMeta((m) => ({ ...m, endDate: v }))} />
          <MiniField label="Estimated End Date" type="date" value={meta.estimatedEndDate} onChange={(v) => setMeta((m) => ({ ...m, estimatedEndDate: v }))} />
        </div>
        <div className="flex flex-col gap-1 mt-4">
          <label className="text-sm font-semibold">Update Comment</label>
          <textarea
            rows={2}
            value={meta.comment}
            onChange={(e) => setMeta((m) => ({ ...m, comment: e.target.value }))}
            placeholder="What changed and why? This becomes the latest status comment and the note on this history entry."
            className="border border-surface-variant rounded p-2 text-sm outline-none focus:ring-1 focus:ring-primary-container"
          />
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Service Status</h4>
          <button onClick={addService} className="text-primary text-xs font-medium hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Service
          </button>
        </div>
        {services.map((svc, idx) => (
          <div key={idx} className="border border-surface-variant rounded-lg p-4 flex flex-col gap-3 mb-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Service {idx + 1}</p>
              <button onClick={() => removeService(idx)} className="material-symbols-outlined text-[18px] text-on-surface-variant hover:text-error">delete</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <MiniField label="Service Name" value={svc.name} onChange={(v) => updateService(idx, 'name', v)} />
              <MiniSelect label="Delivery Head" value={svc.deliveryHead} options={PMO_DELIVERY_HEADS} onChange={(v) => updateService(idx, 'deliveryHead', v)} />
            </div>
            <MiniField label="Service Description" area value={svc.description} onChange={(v) => updateService(idx, 'description', v)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <MiniSelect label="Sales Account Manager" value={svc.sam} options={PMO_SAMS} onChange={(v) => updateService(idx, 'sam', v)} />
              <MiniSelect label="Status" value={svc.statusFlag} options={Object.keys(STATUS_FLAG_META)} onChange={(v) => updateService(idx, 'statusFlag', v)} />
            </div>
            <MiniField label="Percentage Completion" type="number" value={svc.completion} onChange={(v) => updateService(idx, 'completion', Math.max(0, Math.min(100, v)))} />
            <MiniField label="Status Description" area value={svc.statusDescription} onChange={(v) => updateService(idx, 'statusDescription', v)} />
            <MiniField label="Project Details" area value={svc.projectDetails} onChange={(v) => updateService(idx, 'projectDetails', v)} />
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant p-6 mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-4">Update History</h4>
        <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
          {(project.updateHistory || []).length === 0 && <p className="text-sm text-on-surface-variant">No updates recorded yet.</p>}
          {(project.updateHistory || []).map((h, i) => (
            <div key={i} className="border border-surface-variant rounded-lg p-2 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                <span className="font-semibold">{h.service}</span>
                <span className="text-xs text-on-surface-variant">{h.updatedBy} &middot; {fmtDate(h.updatedDate)}</span>
              </div>
              <p className="text-on-surface-variant">
                Status: <span className="font-medium text-on-surface">{h.previousStatus}</span> &rarr; <span className="font-medium text-on-surface">{h.newStatus}</span>
              </p>
              {h.remarks && <p className="text-xs text-on-surface-variant mt-1">{h.remarks}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pb-10">
        <button onClick={() => navigate(`/projects/${projectId}`)} className="px-4 py-2 border border-surface-variant rounded-lg text-sm font-semibold hover:bg-surface-container-highest transition-colors">
          Cancel
        </button>
        <button onClick={handleSave} className="bg-primary-container text-on-primary px-6 py-2 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">check</span>
          Save Status
        </button>
      </div>
    </div>
  );
}
