# PMO Portal — React

A React port of the PMO prototype (Vite + React Router + Tailwind CSS). Same data model, same design tokens, same screens as the HTML prototype, rebuilt as a proper component architecture.

## Run it

```bash
npm install
npm run dev       # local dev server, http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## Structure

```
src/
  data/
    projects.js      Mock project data (6 sample projects, every payment plan type)
    constants.js      Status taxonomy, dropdown option lists, category/plan metadata
  utils/
    format.js          fmtCurrency, fmtDate, receivable() helpers
  components/
    Sidebar.jsx, Topbar.jsx      App shell
    StatusBadge.jsx, ProgressBar.jsx, KpiCards.jsx   Shared display primitives
    project/
      DetailsTab.jsx, MilestonesTab.jsx, PlanTab.jsx, StatusTab.jsx
        The four Project Detail tabs (view-only; editing happens on the form pages)
  pages/
    Dashboard.jsx        Project list, KPIs, filters, "Add Project"
    ProjectDetail.jsx    Tab shell for a single project (renders the four tabs above)
    ProjectForm.jsx      Add/Edit project — 4 sections matching the view tabs exactly
    UpdateStatusForm.jsx Dedicated "Update Project Status" screen (status, dates, comment,
                          per-service status, and update history)
    Reports.jsx           Portfolio-wide Service Status Summary (Green/Yellow/Red/Hold/New
                          /Target Closing/Closed, grouped by service category)
    Team.jsx              Delivery team roster with live project-assignment counts
    Settings.jsx          Status taxonomy, payment plan types, service categories reference
  App.jsx     Routes + all state/CRUD logic (createProject, saveProject, attachInvoice,
              updateStatus) — the single source of truth, passed down as props
  main.jsx    Entry point (BrowserRouter + App)
```

## State management

Everything lives in one `useState` in `App.jsx` (`projects`), updated immutably and passed
down as props — no external state library. This mirrors a real app's shape closely enough
to swap in a backend later: every mutation (`createProject`, `saveProject`, `attachInvoice`,
`updateStatus`) is already isolated in one place, so replacing local state with API calls
means touching only those four functions.

## What's here vs. what's next

Fully working: dashboard with search/filters, Add Project (4-tab form), Edit Project,
Update Project Status (with comment + auto-logged history), invoice attachment,
Delivery Reports, Delivery Team, Settings.

Kept out of scope for this pass, same as the HTML prototype: no persistence (state resets
on refresh), Settings toggles are visual only, Team contact details are placeholder data.
