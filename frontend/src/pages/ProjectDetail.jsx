import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DetailsTab from '../components/project/DetailsTab';
import MilestonesTab from '../components/project/MilestonesTab';
import PlanTab from '../components/project/PlanTab';
import StatusTab from '../components/project/StatusTab';

const TABS = [
  { key: 'details', label: 'Project Details' },
  { key: 'milestones', label: 'Payment Milestones' },
  { key: 'plan', label: 'Project Plan' },
  { key: 'status', label: 'Project Status' }
];

export default function ProjectDetail({ projects, onAttachInvoice, onEditProject, onUpdateStatus }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('details');

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-surface-variant p-8 text-center text-on-surface-variant">
        Project not found.{' '}
        <button onClick={() => navigate('/')} className="text-primary hover:underline">
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-primary text-sm font-medium hover:underline mb-4"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Project Dashboard
      </button>

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-on-surface mb-1">{project.name}</h2>
        <p className="text-base text-on-surface-variant">
          {project.client} &middot; {project.id} &middot; Track delivery, milestones, plan, and status
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-surface-variant mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 -mb-px transition-colors ${
              tab === t.key
                ? 'border-primary-container text-primary-container'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'details' && <DetailsTab project={project} onEdit={() => onEditProject(project.id)} />}
      {tab === 'milestones' && (
        <MilestonesTab project={project} onAttachInvoice={(idx, invoice) => onAttachInvoice(project.id, idx, invoice)} />
      )}
      {tab === 'plan' && <PlanTab project={project} />}
      {tab === 'status' && <StatusTab project={project} onUpdateStatus={() => onUpdateStatus(project.id)} />}
    </div>
  );
}
