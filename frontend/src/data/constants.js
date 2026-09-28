// Design/status taxonomy ported from the PMO prototype (single source of truth for labels, colors, icons)

export const STATUS_FLAG_META = {
  "not-started": {
    "label": "Not Started",
    "dotColor": "#9AA5A6",
    "classes": "bg-surface-container text-on-surface-variant border border-surface-variant"
  },
  "in-progress": {
    "label": "In Progress",
    "dotColor": "#16A34A",
    "classes": "bg-green-50 text-green-800 border border-green-200"
  },
  "on-hold": {
    "label": "On Hold",
    "dotColor": "#9333EA",
    "classes": "bg-purple-50 text-purple-800 border border-purple-200"
  },
  "handover": {
    "label": "Handover",
    "dotColor": "#0891B2",
    "classes": "bg-cyan-50 text-cyan-800 border border-cyan-200"
  },
  "completed": {
    "label": "Completed",
    "dotColor": "#2563EB",
    "classes": "bg-blue-50 text-blue-800 border border-blue-200"
  },
  "delayed": {
    "label": "Delayed",
    "dotColor": "#E11D48",
    "classes": "bg-rose-50 text-rose-800 border border-rose-200"
  },
  "at-risk": {
    "label": "At Risk",
    "dotColor": "#D97706",
    "classes": "bg-amber-50 text-amber-800 border border-amber-200"
  },
  "cancelled": {
    "label": "Cancelled",
    "dotColor": "#57534E",
    "classes": "bg-stone-100 text-stone-700 border border-stone-300"
  }
};

export const PAYMENT_STATUS_META = {
  "Paid": "bg-green-100 text-green-800",
  "Upcoming": "bg-blue-100 text-blue-800",
  "Pending": "bg-amber-100 text-amber-800",
  "Overdue": "bg-rose-100 text-rose-800"
};

export const TASK_STATUS_META = {
  "Completed": "bg-blue-100 text-blue-800",
  "In Progress": "bg-amber-100 text-amber-800",
  "Not Started": "bg-surface-container text-on-surface-variant",
  "Delayed": "bg-rose-100 text-rose-800"
};

export const PMO_DELIVERY_HEADS = [
  "Omar Siddiqui",
  "Zara Malik",
  "Hamza Iqbal",
  "Bilal Ahmed"
];

export const PMO_SAMS = [
  "Sarah Jenkins",
  "Michael Chen",
  "David Kim"
];

export const PMO_PROJECT_MANAGERS = [
  "Ayesha Farooq",
  "Sana Tariq",
  "Usman Sheikh",
  "Nadia Baig"
];

export const PMO_REVENUE_CATEGORIES = [
  "Secaas",
  "Other"
];

export const PMO_PAYMENT_STATUS_OPTIONS = [
  "Paid",
  "Upcoming",
  "Pending",
  "Overdue"
];

export const PMO_TASK_STATUS_OPTIONS = [
  "Not Started",
  "In Progress",
  "Completed",
  "Delayed"
];

export const PMO_ATTACHMENT_TYPES = [
  "Contract",
  "Proposal",
  "PO",
  "NDA",
  "Bid Guarantee",
  "Compliance",
  "Deliverable",
  "Other"
];

export const PMO_PAYMENT_PLAN_TYPES = [
  "Milestone-Based",
  "Monthly",
  "Quarterly",
  "Advance & Completion"
];

export const PMO_PAYMENT_PLAN_META = {
  "Milestone-Based": {
    "icon": "flag",
    "classes": "bg-primary-container/10 text-primary-container border border-primary-container/30",
    "hint": "Billed against agreed project deliverables."
  },
  "Monthly": {
    "icon": "event_repeat",
    "classes": "bg-blue-50 text-blue-700 border border-blue-200",
    "hint": "Recurring monthly invoice for the service period."
  },
  "Quarterly": {
    "icon": "calendar_view_month",
    "classes": "bg-purple-50 text-purple-700 border border-purple-200",
    "hint": "Recurring quarterly invoice for the service period."
  },
  "Advance & Completion": {
    "icon": "percent",
    "classes": "bg-amber-50 text-amber-700 border border-amber-200",
    "hint": "50% advance on kickoff, 50% on completion."
  }
};

export const PMO_MILESTONE_TYPES = [
  "Milestone",
  "Advance",
  "Monthly",
  "Quarterly",
  "Completion"
];

export const PMO_MILESTONE_TYPE_META = {
  "Milestone": {
    "label": "Milestone",
    "icon": "flag",
    "classes": "bg-surface-container-highest text-on-surface-variant border border-surface-variant"
  },
  "Advance": {
    "label": "Advance",
    "icon": "trending_up",
    "classes": "bg-amber-50 text-amber-800 border border-amber-200"
  },
  "Monthly": {
    "label": "Monthly",
    "icon": "event_repeat",
    "classes": "bg-blue-50 text-blue-800 border border-blue-200"
  },
  "Quarterly": {
    "label": "Quarterly",
    "icon": "calendar_view_month",
    "classes": "bg-purple-50 text-purple-800 border border-purple-200"
  },
  "Completion": {
    "label": "Completion",
    "icon": "flag_circle",
    "classes": "bg-teal-50 text-teal-800 border border-teal-200"
  }
};

export const PMO_SERVICE_CATEGORIES = [
  "SECaaS",
  "GRC Services",
  "SOC",
  "VAPT, DFIR & RT",
  "Cloud & Infrastructure",
  "Network & Data Center",
  "Development",
  "Invisily Projects",
  "Invisily POCs",
  "Reseller",
  "Other"
];

export const PMO_RAG_META = {
  "green": {
    "label": "Green",
    "classes": "bg-green-500 text-white"
  },
  "yellow": {
    "label": "Yellow",
    "classes": "bg-amber-400 text-white"
  },
  "red": {
    "label": "Red",
    "classes": "bg-rose-500 text-white"
  }
};
