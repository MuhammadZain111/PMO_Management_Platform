import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import ProjectForm from './pages/ProjectForm';
import UpdateStatusForm from './pages/UpdateStatusForm';
import Reports from './pages/Reports';
import Team from './pages/Team';
import Settings from './pages/Settings';
import { PROJECTS as INITIAL_PROJECTS } from './data/projects';
import { STATUS_FLAG_META } from './data/constants';

function nextProjectId(projects) {
  let max = 1000;
  projects.forEach((p) => {
    const m = /PRJ-(\d+)/.exec(p.id);
    if (m) max = Math.max(max, Number(m[1]));
  });
  return 'PRJ-' + (max + 1);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function statusLabel(flag) {
  return (STATUS_FLAG_META[flag] || {}).label || flag;
}

export default function App() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // ---- CRUD -------------------------------------------------------------

  function createProject(draft) {
    const id = (draft.id || '').trim() || nextProjectId(projects);
    const newProject = {
      ...draft,
      id,
      updateHistory: [
        {
          updatedBy: 'PMO User',
          updatedDate: todayISO(),
          service: 'Overall Project',
          previousStatus: '\u2014',
          newStatus: statusLabel(draft.overallStatus),
          previousCompletion: 0,
          newCompletion: draft.overallCompletion,
          remarks: 'Project created.'
        },
        ...(draft.updateHistory || [])
      ]
    };
    setProjects((prev) => [...prev, newProject]);
    navigate(`/projects/${id}`);
  }

  function saveProject(projectId, draft) {
    setProjects((prev) =>
      prev.map((old) => {
        if (old.id !== projectId) return old;

        const newHistory = [];
        if (draft.overallStatus !== old.overallStatus) {
          newHistory.push({
            updatedBy: 'PMO User',
            updatedDate: todayISO(),
            service: 'Overall Project',
            previousStatus: statusLabel(old.overallStatus),
            newStatus: statusLabel(draft.overallStatus),
            previousCompletion: old.overallCompletion,
            newCompletion: draft.overallCompletion,
            remarks: draft.statusDescription || ''
          });
        }
        draft.services.forEach((svc, i) => {
          const orig = old.services[i];
          if (orig && (orig.statusFlag !== svc.statusFlag || Number(orig.completion) !== Number(svc.completion))) {
            newHistory.push({
              updatedBy: 'PMO User',
              updatedDate: todayISO(),
              service: svc.name,
              previousStatus: statusLabel(orig.statusFlag),
              newStatus: statusLabel(svc.statusFlag),
              previousCompletion: orig.completion,
              newCompletion: svc.completion,
              remarks: svc.statusDescription || ''
            });
          }
        });

        return { ...draft, updateHistory: [...newHistory, ...(old.updateHistory || [])] };
      })
    );
    navigate(`/projects/${projectId}`);
  }

  function attachInvoice(projectId, milestoneIdx, invoice) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const milestones = p.milestones.map((m, i) => (i === milestoneIdx ? { ...m, invoice } : m));
        return { ...p, milestones };
      })
    );
  }

  function updateStatus(projectId, meta, services) {
    setProjects((prev) =>
      prev.map((old) => {
        if (old.id !== projectId) return old;

        const newHistory = [];
        const statusChanged = meta.overallStatus !== old.overallStatus;
        if (statusChanged || meta.comment.trim()) {
          newHistory.push({
            updatedBy: 'PMO User',
            updatedDate: todayISO(),
            service: 'Overall Project',
            previousStatus: statusLabel(old.overallStatus),
            newStatus: statusLabel(meta.overallStatus),
            previousCompletion: old.overallCompletion,
            newCompletion: old.overallCompletion,
            remarks: meta.comment.trim() || (statusChanged ? 'Status updated from the Update Project Status screen.' : '')
          });
        }
        services.forEach((svc, i) => {
          const orig = old.services[i];
          if (orig && (orig.statusFlag !== svc.statusFlag || Number(orig.completion) !== Number(svc.completion))) {
            newHistory.push({
              updatedBy: 'PMO User',
              updatedDate: todayISO(),
              service: svc.name,
              previousStatus: statusLabel(orig.statusFlag),
              newStatus: statusLabel(svc.statusFlag),
              previousCompletion: orig.completion,
              newCompletion: svc.completion,
              remarks: svc.statusDescription || ''
            });
          }
        });

        let overallCompletion = old.overallCompletion;
        let overallStatus = meta.overallStatus;
        if (services.length) {
          overallCompletion = Math.round(services.reduce((s, sv) => s + (Number(sv.completion) || 0), 0) / services.length);
          const allDone = services.every((sv) => Number(sv.completion) >= 100);
          if (allDone && overallStatus !== 'handover') overallStatus = 'completed';
        }

        return {
          ...old,
          services,
          overallStatus,
          overallCompletion,
          startDate: meta.startDate,
          endDate: meta.endDate,
          estimatedEndDate: meta.estimatedEndDate,
          statusDescription: meta.comment.trim() || old.statusDescription,
          updateHistory: [...newHistory, ...(old.updateHistory || [])]
        };
      })
    );
    navigate(`/projects/${projectId}`);
  }

  // ---- Layout -------------------------------------------------------------

  return (
    <div className="min-h-screen flex bg-background text-on-surface">
      <Sidebar />
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        <Topbar search={search} onSearchChange={setSearch} />
        <main className="flex-1 mt-16 p-6 max-w-[1440px] mx-auto w-full">
          <Routes>
            <Route
              path="/"
              element={<Dashboard projects={projects} search={search} onAddProject={() => navigate('/projects/new')} />}
            />
            <Route
              path="/projects/new"
              element={<ProjectForm mode="create" onCreate={createProject} onCancel={() => navigate('/')} />}
            />
            <Route
              path="/projects/:projectId/edit"
              element={<ProjectForm mode="edit" projects={projects} onSave={saveProject} />}
            />
            <Route
              path="/projects/:projectId/status/edit"
              element={<UpdateStatusForm projects={projects} onSave={updateStatus} />}
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProjectDetail
                  projects={projects}
                  onAttachInvoice={attachInvoice}
                  onEditProject={(id) => navigate(`/projects/${id}/edit`)}
                  onUpdateStatus={(id) => navigate(`/projects/${id}/status/edit`)}
                />
              }
            />
            <Route path="/reports" element={<Reports projects={projects} />} />
            <Route path="/team" element={<Team projects={projects} />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
