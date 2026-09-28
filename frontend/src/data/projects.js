// Mock project data ported from the PMO prototype (6 sample projects across every payment plan type)
export const PROJECTS = [
  {
    "id": "PRJ-1042",
    "name": "Cybersecurity Audit V2",
    "client": "Stark Industries",
    "startDate": "2026-07-01",
    "endDate": "2026-10-15",
    "description": "End-to-end security audit covering external/internal VAPT, SOC log onboarding, GRC advisory, and a standby DFIR retainer across Stark Industries\u2019 core infrastructure.",
    "projectManager": "Ayesha Farooq",
    "salesAccountManager": "Michael Chen",
    "deliveryHead": "Omar Siddiqui",
    "overallCompletion": 62,
    "overallStatus": "in-progress",
    "revenueCategory": "Secaas",
    "value": 8250000,
    "estimatedEndDate": "2026-10-22",
    "totalReceived": 5500000,
    "bidGuaranteeSubmitted": "Yes",
    "guaranteeAmount": 500000,
    "paymentPlanType": "Milestone-Based",
    "attachments": [
      {
        "name": "Signed Contract - Stark Industries.pdf",
        "type": "Contract"
      },
      {
        "name": "VAPT Final Report v2.pdf",
        "type": "Deliverable"
      },
      {
        "name": "Bid Guarantee Instrument.pdf",
        "type": "Bid Guarantee"
      }
    ],
    "statusDescription": "Project tracking to plan overall. VAPT phase is complete; SOC onboarding is in progress and GRC evidence collection is slightly behind.",
    "milestones": [
      {
        "name": "Kickoff & Mobilization",
        "type": "Milestone",
        "description": "Contract signing and kickoff workshop.",
        "dueDate": "2026-07-05",
        "expectedCompleteDate": "2026-07-05",
        "percentage": 30,
        "amount": 2500000,
        "status": "Paid",
        "paymentDate": "2026-07-04",
        "invoice": {
          "number": "INV-1042-01",
          "fileName": "Invoice_INV-1042-01.pdf",
          "uploadedDate": "2026-07-04"
        },
        "remarks": "Paid on time via bank transfer."
      },
      {
        "name": "VAPT Delivery",
        "type": "Milestone",
        "description": "Completion of external & internal VAPT with final report.",
        "dueDate": "2026-08-15",
        "expectedCompleteDate": "2026-08-18",
        "percentage": 36,
        "amount": 3000000,
        "status": "Paid",
        "paymentDate": "2026-08-18",
        "invoice": {
          "number": "INV-1042-02",
          "fileName": "Invoice_INV-1042-02.pdf",
          "uploadedDate": "2026-08-18"
        },
        "remarks": "Paid 3 days after due date."
      },
      {
        "name": "SOC Onboarding",
        "type": "Milestone",
        "description": "Log source onboarding and use case tuning.",
        "dueDate": "2026-09-30",
        "expectedCompleteDate": "2026-10-05",
        "percentage": 24,
        "amount": 2000000,
        "status": "Upcoming",
        "paymentDate": "-",
        "invoice": null,
        "remarks": "Invoice to be raised after UAT sign-off."
      },
      {
        "name": "Final Handover",
        "type": "Milestone",
        "description": "Documentation, handover, and project sign-off.",
        "dueDate": "2026-10-15",
        "expectedCompleteDate": "2026-10-20",
        "percentage": 10,
        "amount": 750000,
        "status": "Pending",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      }
    ],
    "plan": [
      {
        "task": "External Network VAPT",
        "description": "Perimeter penetration test.",
        "start": "2026-07-06",
        "end": "2026-07-20",
        "owner": "VAPT Team",
        "dependency": "\u2014",
        "progress": 100,
        "status": "Completed"
      },
      {
        "task": "Internal Network VAPT",
        "description": "Internal segmentation testing.",
        "start": "2026-07-21",
        "end": "2026-08-05",
        "owner": "VAPT Team",
        "dependency": "External VAPT",
        "progress": 100,
        "status": "Completed"
      },
      {
        "task": "SIEM Log Source Onboarding",
        "description": "Onboard priority log sources into the SOC.",
        "start": "2026-08-10",
        "end": "2026-09-10",
        "owner": "SOC Team",
        "dependency": "Internal VAPT",
        "progress": 55,
        "status": "In Progress"
      },
      {
        "task": "Use Case Development",
        "description": "Build and tune detection use cases.",
        "start": "2026-09-05",
        "end": "2026-09-30",
        "owner": "SOC Team",
        "dependency": "Log Onboarding",
        "progress": 10,
        "status": "In Progress"
      },
      {
        "task": "Final Documentation & Handover",
        "description": "Compile reports and handover pack.",
        "start": "2026-10-01",
        "end": "2026-10-15",
        "owner": "Ayesha Farooq",
        "dependency": "Use Case Dev",
        "progress": 0,
        "status": "Not Started"
      }
    ],
    "services": [
      {
        "name": "VAPT",
        "category": "VAPT, DFIR & RT",
        "description": "External + internal network and web application VAPT.",
        "deliveryHead": "Omar Siddiqui",
        "sam": "Michael Chen",
        "assignedTeam": "VAPT Team",
        "manpower": 4,
        "days": 30,
        "pricing": 3000000,
        "completion": 100,
        "statusFlag": "completed",
        "statusDescription": "All findings delivered and retested; client sign-off received.",
        "projectDetails": "Final report v2 shared; retest confirms all critical/high findings closed."
      },
      {
        "name": "SOC Onboarding",
        "category": "SOC",
        "description": "Managed SOC log source onboarding & use case tuning.",
        "deliveryHead": "Zara Malik",
        "sam": "Michael Chen",
        "assignedTeam": "SOC Team",
        "manpower": 3,
        "days": 25,
        "pricing": 2200000,
        "completion": 55,
        "statusFlag": "in-progress",
        "statusDescription": "On schedule \u2014 6 of 11 log sources onboarded so far.",
        "projectDetails": "Remaining sources: firewall, EDR, cloud logs. Target completion end of Sept."
      },
      {
        "name": "GRC Advisory",
        "category": "GRC Services",
        "description": "ISO 27001 readiness support.",
        "deliveryHead": "Hamza Iqbal",
        "sam": "Michael Chen",
        "assignedTeam": "GRC Team",
        "manpower": 2,
        "days": 12,
        "pricing": 1800000,
        "completion": 20,
        "statusFlag": "at-risk",
        "statusDescription": "Awaiting client evidence submission; timeline slipping by ~1 week.",
        "projectDetails": "Evidence request sent twice; escalated to client sponsor on Aug 28."
      },
      {
        "name": "DFIR Retainer",
        "category": "VAPT, DFIR & RT",
        "description": "Standby incident response retainer.",
        "deliveryHead": "Omar Siddiqui",
        "sam": "Michael Chen",
        "assignedTeam": "DFIR Team",
        "manpower": 2,
        "days": 0,
        "pricing": 1250000,
        "completion": 0,
        "statusFlag": "not-started",
        "statusDescription": "Retainer is active; no incidents triggered to date.",
        "projectDetails": "Retainer active from Jul 1; SLA response time 4 hours."
      }
    ],
    "updateHistory": [
      {
        "updatedBy": "PMO User",
        "updatedDate": "2026-08-20",
        "service": "VAPT",
        "previousStatus": "In Progress",
        "newStatus": "Completed",
        "previousCompletion": 85,
        "newCompletion": 100,
        "remarks": "Final report delivered and retested."
      },
      {
        "updatedBy": "PMO User",
        "updatedDate": "2026-08-05",
        "service": "SOC Onboarding",
        "previousStatus": "Not Started",
        "newStatus": "In Progress",
        "previousCompletion": 0,
        "newCompletion": 30,
        "remarks": "Kicked off log source onboarding."
      }
    ]
  },
  {
    "id": "PRJ-1058",
    "name": "Cloud Migration Assessment",
    "client": "Acme Corp Global",
    "startDate": "2026-08-01",
    "endDate": "2026-11-30",
    "description": "Assessment and phased migration plan for Acme Corp Global\u2019s on-prem workloads to a hybrid cloud environment, including a security configuration review.",
    "projectManager": "Sana Tariq",
    "salesAccountManager": "Sarah Jenkins",
    "deliveryHead": "Zara Malik",
    "overallCompletion": 28,
    "overallStatus": "at-risk",
    "revenueCategory": "Other",
    "value": 10000000,
    "estimatedEndDate": "2026-12-15",
    "totalReceived": 1800000,
    "bidGuaranteeSubmitted": "No",
    "guaranteeAmount": 0,
    "paymentPlanType": "Milestone-Based",
    "attachments": [
      {
        "name": "Signed Contract - Acme Corp Global.pdf",
        "type": "Contract"
      },
      {
        "name": "Discovery Report v1.pdf",
        "type": "Deliverable"
      }
    ],
    "statusDescription": "Discovery phase is complete; migration wave planning is behind schedule pending stakeholder workshops.",
    "milestones": [
      {
        "name": "Discovery & Assessment",
        "type": "Milestone",
        "description": "Workload inventory and dependency mapping.",
        "dueDate": "2026-08-20",
        "expectedCompleteDate": "2026-08-19",
        "percentage": 18,
        "amount": 1800000,
        "status": "Paid",
        "paymentDate": "2026-08-19",
        "invoice": {
          "number": "INV-1058-01",
          "fileName": "Invoice_INV-1058-01.pdf",
          "uploadedDate": "2026-08-19"
        },
        "remarks": "Paid ahead of due date."
      },
      {
        "name": "Migration Roadmap",
        "type": "Milestone",
        "description": "Wave planning and target architecture sign-off.",
        "dueDate": "2026-09-25",
        "expectedCompleteDate": "2026-10-10",
        "percentage": 22,
        "amount": 2200000,
        "status": "Overdue",
        "paymentDate": "-",
        "invoice": null,
        "remarks": "Awaiting client PO approval."
      },
      {
        "name": "Pilot Migration",
        "type": "Milestone",
        "description": "Migrate pilot workload group to cloud.",
        "dueDate": "2026-10-31",
        "expectedCompleteDate": "2026-11-15",
        "percentage": 26,
        "amount": 2600000,
        "status": "Upcoming",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      },
      {
        "name": "Full Rollout & Handover",
        "type": "Milestone",
        "description": "Remaining waves, cutover, and handover.",
        "dueDate": "2026-11-30",
        "expectedCompleteDate": "2026-12-15",
        "percentage": 34,
        "amount": 3400000,
        "status": "Pending",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      }
    ],
    "plan": [
      {
        "task": "Workload Discovery",
        "description": "Inventory servers, apps, and dependencies.",
        "start": "2026-08-01",
        "end": "2026-08-18",
        "owner": "Cloud Team",
        "dependency": "\u2014",
        "progress": 100,
        "status": "Completed"
      },
      {
        "task": "Target Architecture Design",
        "description": "Design hybrid-cloud landing zone.",
        "start": "2026-08-19",
        "end": "2026-09-10",
        "owner": "Sana Tariq",
        "dependency": "Discovery",
        "progress": 70,
        "status": "In Progress"
      },
      {
        "task": "Migration Wave Planning",
        "description": "Sequence workloads into migration waves.",
        "start": "2026-09-11",
        "end": "2026-09-30",
        "owner": "Cloud Team",
        "dependency": "Architecture Design",
        "progress": 15,
        "status": "In Progress"
      },
      {
        "task": "Pilot Wave Migration",
        "description": "Migrate first low-risk workload group.",
        "start": "2026-10-05",
        "end": "2026-10-25",
        "owner": "Cloud Team",
        "dependency": "Wave Planning",
        "progress": 0,
        "status": "Not Started"
      },
      {
        "task": "Cutover & Handover",
        "description": "Final cutover and documentation handover.",
        "start": "2026-11-10",
        "end": "2026-11-30",
        "owner": "Sana Tariq",
        "dependency": "Pilot Wave",
        "progress": 0,
        "status": "Not Started"
      }
    ],
    "services": [
      {
        "name": "Cloud Discovery",
        "category": "Cloud & Infrastructure",
        "description": "Workload inventory and dependency mapping.",
        "deliveryHead": "Zara Malik",
        "sam": "Sarah Jenkins",
        "assignedTeam": "Cloud Team",
        "manpower": 3,
        "days": 18,
        "pricing": 1800000,
        "completion": 100,
        "statusFlag": "completed",
        "statusDescription": "Discovery report delivered and accepted.",
        "projectDetails": "Inventory covers 240 servers and 40 applications."
      },
      {
        "name": "Architecture Design",
        "category": "Cloud & Infrastructure",
        "description": "Target hybrid-cloud landing zone design.",
        "deliveryHead": "Zara Malik",
        "sam": "Sarah Jenkins",
        "assignedTeam": "Cloud Team",
        "manpower": 2,
        "days": 20,
        "pricing": 2200000,
        "completion": 70,
        "statusFlag": "in-progress",
        "statusDescription": "On track for review with client architecture board.",
        "projectDetails": "Landing zone design draft v2 under client architecture review."
      },
      {
        "name": "Migration Wave Planning",
        "category": "Cloud & Infrastructure",
        "description": "Sequencing and risk assessment per wave.",
        "deliveryHead": "Bilal Ahmed",
        "sam": "Sarah Jenkins",
        "assignedTeam": "Cloud Team",
        "manpower": 2,
        "days": 15,
        "pricing": 1600000,
        "completion": 15,
        "statusFlag": "at-risk",
        "statusDescription": "Blocked on stakeholder workshop scheduling.",
        "projectDetails": "Workshop rescheduled twice; targeting week of Sep 15."
      },
      {
        "name": "Security Configuration Review",
        "category": "GRC Services",
        "description": "Cloud landing zone security baseline review.",
        "deliveryHead": "Hamza Iqbal",
        "sam": "Sarah Jenkins",
        "assignedTeam": "GRC Team",
        "manpower": 1,
        "days": 8,
        "pricing": 900000,
        "completion": 0,
        "statusFlag": "not-started",
        "statusDescription": "Scheduled to start once architecture is finalized.",
        "projectDetails": "Baseline checklist prepared; awaiting architecture sign-off."
      }
    ],
    "updateHistory": [
      {
        "updatedBy": "PMO User",
        "updatedDate": "2026-08-22",
        "service": "Cloud Discovery",
        "previousStatus": "In Progress",
        "newStatus": "Completed",
        "previousCompletion": 90,
        "newCompletion": 100,
        "remarks": "Discovery report accepted by client."
      }
    ]
  },
  {
    "id": "PRJ-1077",
    "name": "ERP Implementation",
    "client": "Wayne Enterprises",
    "startDate": "2026-06-15",
    "endDate": "2027-02-28",
    "description": "Full ERP implementation for Wayne Enterprises covering finance, procurement, and inventory modules, with a phased go-live plan.",
    "projectManager": "Usman Sheikh",
    "salesAccountManager": "Sarah Jenkins",
    "deliveryHead": "Omar Siddiqui",
    "overallCompletion": 41,
    "overallStatus": "delayed",
    "revenueCategory": "Other",
    "value": 45000000,
    "estimatedEndDate": "2027-03-20",
    "totalReceived": 15000000,
    "bidGuaranteeSubmitted": "Yes",
    "guaranteeAmount": 2250000,
    "paymentPlanType": "Quarterly",
    "attachments": [
      {
        "name": "Signed Contract - Wayne Enterprises.pdf",
        "type": "Contract"
      },
      {
        "name": "Business Process Design Sign-off.pdf",
        "type": "Deliverable"
      },
      {
        "name": "Bid Guarantee Instrument.pdf",
        "type": "Bid Guarantee"
      },
      {
        "name": "UAT Defect Log.xlsx",
        "type": "Other"
      }
    ],
    "statusDescription": "Finance module UAT is delayed due to outstanding data migration issues; delivery team is re-baselining the go-live date.",
    "milestones": [
      {
        "name": "Q1 Billing Period (Jun\u2013Aug 2026)",
        "type": "Quarterly",
        "description": "Quarterly invoice covering business process design and initial configuration.",
        "dueDate": "2026-08-31",
        "expectedCompleteDate": "2026-08-31",
        "percentage": 33,
        "amount": 15000000,
        "status": "Paid",
        "paymentDate": "2026-09-02",
        "invoice": {
          "number": "INV-1077-Q1",
          "fileName": "Invoice_INV-1077-Q1.pdf",
          "uploadedDate": "2026-09-02"
        },
        "remarks": "Paid 2 days after due date."
      },
      {
        "name": "Q2 Billing Period (Sep\u2013Nov 2026)",
        "type": "Quarterly",
        "description": "Quarterly invoice covering system configuration and data migration.",
        "dueDate": "2026-11-30",
        "expectedCompleteDate": "2026-12-10",
        "percentage": 33,
        "amount": 15000000,
        "status": "Overdue",
        "paymentDate": "-",
        "invoice": null,
        "remarks": "Awaiting client PO renewal after UAT delay."
      },
      {
        "name": "Q3 Billing Period (Dec 2026\u2013Feb 2027)",
        "type": "Quarterly",
        "description": "Quarterly invoice covering UAT, go-live, and hypercare.",
        "dueDate": "2027-02-28",
        "expectedCompleteDate": "2027-03-20",
        "percentage": 34,
        "amount": 15000000,
        "status": "Pending",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      }
    ],
    "plan": [
      {
        "task": "Business Process Design",
        "description": "Workshops and to-be process design.",
        "start": "2026-06-21",
        "end": "2026-08-05",
        "owner": "Usman Sheikh",
        "dependency": "\u2014",
        "progress": 100,
        "status": "Completed"
      },
      {
        "task": "System Configuration",
        "description": "Configure finance & procurement modules.",
        "start": "2026-08-06",
        "end": "2026-09-20",
        "owner": "ERP Team",
        "dependency": "Process Design",
        "progress": 90,
        "status": "In Progress"
      },
      {
        "task": "Data Migration",
        "description": "Legacy data extraction, cleansing, and load.",
        "start": "2026-09-01",
        "end": "2026-10-01",
        "owner": "ERP Team",
        "dependency": "System Configuration",
        "progress": 60,
        "status": "In Progress"
      },
      {
        "task": "Finance Module UAT",
        "description": "User acceptance testing with finance team.",
        "start": "2026-10-02",
        "end": "2026-10-25",
        "owner": "Wayne Finance Team",
        "dependency": "Data Migration",
        "progress": 20,
        "status": "Delayed"
      },
      {
        "task": "Go-Live Preparation",
        "description": "Cutover planning and hypercare readiness.",
        "start": "2026-12-01",
        "end": "2027-02-28",
        "owner": "Omar Siddiqui",
        "dependency": "Finance UAT",
        "progress": 0,
        "status": "Not Started"
      }
    ],
    "services": [
      {
        "name": "Finance Module",
        "category": "Development",
        "description": "Finance & accounting module implementation.",
        "deliveryHead": "Omar Siddiqui",
        "sam": "Sarah Jenkins",
        "assignedTeam": "ERP Team",
        "manpower": 5,
        "days": 60,
        "pricing": 15000000,
        "completion": 55,
        "statusFlag": "delayed",
        "statusDescription": "UAT blocked on data migration defects; 2-week slip flagged to client.",
        "projectDetails": "Defect log has 12 open items; 4 critical blocking UAT sign-off."
      },
      {
        "name": "Procurement Module",
        "category": "Development",
        "description": "Procure-to-pay module implementation.",
        "deliveryHead": "Bilal Ahmed",
        "sam": "Sarah Jenkins",
        "assignedTeam": "ERP Team",
        "manpower": 4,
        "days": 45,
        "pricing": 10000000,
        "completion": 45,
        "statusFlag": "in-progress",
        "statusDescription": "Configuration on schedule for October UAT.",
        "projectDetails": "Vendor master data load complete; approval workflow config in progress."
      },
      {
        "name": "Inventory Module",
        "category": "Development",
        "description": "Inventory & warehouse management module.",
        "deliveryHead": "Zara Malik",
        "sam": "Sarah Jenkins",
        "assignedTeam": "ERP Team",
        "manpower": 3,
        "days": 40,
        "pricing": 8500000,
        "completion": 20,
        "statusFlag": "at-risk",
        "statusDescription": "Dependent on finance module data model finalization.",
        "projectDetails": "Blocked pending chart-of-accounts finalization from Finance Module."
      },
      {
        "name": "Data Migration",
        "category": "Development",
        "description": "Legacy data extraction, cleansing, and load.",
        "deliveryHead": "Hamza Iqbal",
        "sam": "Sarah Jenkins",
        "assignedTeam": "ERP Team",
        "manpower": 3,
        "days": 30,
        "pricing": 6500000,
        "completion": 60,
        "statusFlag": "at-risk",
        "statusDescription": "Cleansing rules under rework after UAT defects.",
        "projectDetails": "Reworking 3 cleansing rules flagged during UAT dry-run."
      }
    ],
    "updateHistory": [
      {
        "updatedBy": "PMO User",
        "updatedDate": "2026-08-25",
        "service": "Finance Module",
        "previousStatus": "In Progress",
        "newStatus": "Delayed",
        "previousCompletion": 60,
        "newCompletion": 55,
        "remarks": "UAT slip flagged after data migration defects surfaced."
      },
      {
        "updatedBy": "PMO User",
        "updatedDate": "2026-08-10",
        "service": "Procurement Module",
        "previousStatus": "Not Started",
        "newStatus": "In Progress",
        "previousCompletion": 0,
        "newCompletion": 25,
        "remarks": "Kicked off procurement configuration."
      }
    ]
  },
  {
    "id": "PRJ-1090",
    "name": "Network Redesign",
    "client": "Globex Corp",
    "startDate": "2026-05-10",
    "endDate": "2026-09-30",
    "description": "Campus and data-center network redesign for Globex Corp, including redundant core switching and a segmented security zone model. Currently paused pending budget re-approval.",
    "projectManager": "Nadia Baig",
    "salesAccountManager": "David Kim",
    "deliveryHead": "Bilal Ahmed",
    "overallCompletion": 35,
    "overallStatus": "on-hold",
    "revenueCategory": "Other",
    "value": 6400000,
    "estimatedEndDate": "2026-12-31",
    "totalReceived": 3200000,
    "bidGuaranteeSubmitted": "No",
    "guaranteeAmount": 0,
    "paymentPlanType": "Advance & Completion",
    "attachments": [
      {
        "name": "Signed Contract - Globex Corp.pdf",
        "type": "Contract"
      },
      {
        "name": "Network Design v3 (Approved).pdf",
        "type": "Deliverable"
      }
    ],
    "statusDescription": "Design phase completed and approved. Implementation is on hold pending client budget re-approval for Q4; resuming is contingent on client sign-off.",
    "milestones": [
      {
        "name": "Advance Payment (50%)",
        "type": "Advance",
        "description": "Advance payment on contract signing, per standard 50/50 terms.",
        "dueDate": "2026-05-15",
        "expectedCompleteDate": "2026-05-15",
        "percentage": 50,
        "amount": 3200000,
        "status": "Paid",
        "paymentDate": "2026-05-14",
        "invoice": {
          "number": "INV-1090-ADV",
          "fileName": "Invoice_INV-1090-ADV.pdf",
          "uploadedDate": "2026-05-14"
        },
        "remarks": "Paid 1 day ahead of due date."
      },
      {
        "name": "Final Payment (50%)",
        "type": "Completion",
        "description": "Balance due on project completion and handover.",
        "dueDate": "2026-09-30",
        "expectedCompleteDate": "2026-12-31",
        "percentage": 50,
        "amount": 3200000,
        "status": "Pending",
        "paymentDate": "-",
        "invoice": null,
        "remarks": "Held pending client Q4 budget re-approval and project resumption."
      }
    ],
    "plan": [
      {
        "task": "Traffic & Asset Assessment",
        "description": "Assess existing network assets and traffic patterns.",
        "start": "2026-05-11",
        "end": "2026-05-24",
        "owner": "Network Team",
        "dependency": "\u2014",
        "progress": 100,
        "status": "Completed"
      },
      {
        "task": "Target Design & BOM",
        "description": "Design redundant core and segmentation model.",
        "start": "2026-05-25",
        "end": "2026-06-28",
        "owner": "Nadia Baig",
        "dependency": "Assessment",
        "progress": 100,
        "status": "Completed"
      },
      {
        "task": "Hardware Procurement",
        "description": "Procure core switches and licensing.",
        "start": "2026-07-01",
        "end": "2026-08-01",
        "owner": "Network Team",
        "dependency": "Design Sign-off",
        "progress": 40,
        "status": "Delayed"
      },
      {
        "task": "Core Cutover",
        "description": "Implement and cut over to new core.",
        "start": "2026-08-15",
        "end": "2026-09-15",
        "owner": "Network Team",
        "dependency": "Procurement",
        "progress": 0,
        "status": "Not Started"
      }
    ],
    "services": [
      {
        "name": "Network Assessment",
        "category": "Network & Data Center",
        "description": "Current-state assessment and traffic analysis.",
        "deliveryHead": "Bilal Ahmed",
        "sam": "David Kim",
        "assignedTeam": "Network Team",
        "manpower": 2,
        "days": 12,
        "pricing": 1280000,
        "completion": 100,
        "statusFlag": "completed",
        "statusDescription": "Assessment report delivered and accepted.",
        "projectDetails": "Baseline traffic report and asset inventory delivered May 24."
      },
      {
        "name": "Network Design",
        "category": "Network & Data Center",
        "description": "Redundant core and segmentation design.",
        "deliveryHead": "Nadia Baig",
        "sam": "David Kim",
        "assignedTeam": "Network Team",
        "manpower": 2,
        "days": 20,
        "pricing": 1920000,
        "completion": 100,
        "statusFlag": "completed",
        "statusDescription": "Design and BOM signed off by client.",
        "projectDetails": "Design v3 approved; BOM shared with procurement."
      },
      {
        "name": "Core Implementation",
        "category": "Network & Data Center",
        "description": "Core/distribution switching cutover.",
        "deliveryHead": "Bilal Ahmed",
        "sam": "David Kim",
        "assignedTeam": "Network Team",
        "manpower": 3,
        "days": 25,
        "pricing": 2240000,
        "completion": 5,
        "statusFlag": "on-hold",
        "statusDescription": "Paused pending client Q4 budget re-approval.",
        "projectDetails": "Hardware order placed but shipment on hold until PO confirmed."
      }
    ],
    "updateHistory": [
      {
        "updatedBy": "PMO User",
        "updatedDate": "2026-08-18",
        "service": "Core Implementation",
        "previousStatus": "In Progress",
        "newStatus": "On Hold",
        "previousCompletion": 5,
        "newCompletion": 5,
        "remarks": "Client requested pause pending Q4 budget re-approval."
      }
    ]
  },
  {
    "id": "PRJ-1103",
    "name": "Data Center Setup",
    "client": "Umbrella Corp",
    "startDate": "2026-03-01",
    "endDate": "2026-07-31",
    "description": "Turnkey data-center build-out for Umbrella Corp including rack, power, cooling, and structured cabling for a 40-rack facility.",
    "projectManager": "Sana Tariq",
    "salesAccountManager": "Michael Chen",
    "deliveryHead": "Zara Malik",
    "overallCompletion": 100,
    "overallStatus": "completed",
    "revenueCategory": "Other",
    "value": 22800000,
    "estimatedEndDate": "2026-07-31",
    "totalReceived": 22800000,
    "bidGuaranteeSubmitted": "Yes",
    "guaranteeAmount": 1140000,
    "paymentPlanType": "Milestone-Based",
    "attachments": [
      {
        "name": "Signed Contract - Umbrella Corp.pdf",
        "type": "Contract"
      },
      {
        "name": "Client Acceptance Certificate.pdf",
        "type": "Deliverable"
      },
      {
        "name": "Bid Guarantee Instrument (Released).pdf",
        "type": "Bid Guarantee"
      },
      {
        "name": "Fluke Cabling Test Reports.zip",
        "type": "Other"
      }
    ],
    "statusDescription": "Project completed and handed over. Final acceptance certificate signed by client on Jul 31; 12-month warranty period now in effect.",
    "milestones": [
      {
        "name": "Site Readiness",
        "type": "Milestone",
        "description": "Power, cooling, and shell readiness.",
        "dueDate": "2026-04-01",
        "expectedCompleteDate": "2026-04-01",
        "percentage": 25,
        "amount": 5700000,
        "status": "Paid",
        "paymentDate": "2026-04-02",
        "invoice": {
          "number": "INV-1103-01",
          "fileName": "Invoice_INV-1103-01.pdf",
          "uploadedDate": "2026-04-02"
        },
        "remarks": "Paid 1 day late."
      },
      {
        "name": "Rack & Cabling Install",
        "type": "Milestone",
        "description": "Rack install and structured cabling.",
        "dueDate": "2026-06-01",
        "expectedCompleteDate": "2026-06-01",
        "percentage": 35,
        "amount": 7980000,
        "status": "Paid",
        "paymentDate": "2026-06-01",
        "invoice": {
          "number": "INV-1103-02",
          "fileName": "Invoice_INV-1103-02.pdf",
          "uploadedDate": "2026-06-01"
        },
        "remarks": "Paid on time."
      },
      {
        "name": "Commissioning & Testing",
        "type": "Milestone",
        "description": "Load testing and commissioning.",
        "dueDate": "2026-07-15",
        "expectedCompleteDate": "2026-07-15",
        "percentage": 25,
        "amount": 5700000,
        "status": "Paid",
        "paymentDate": "2026-07-16",
        "invoice": {
          "number": "INV-1103-03",
          "fileName": "Invoice_INV-1103-03.pdf",
          "uploadedDate": "2026-07-16"
        },
        "remarks": "Paid 1 day late."
      },
      {
        "name": "Final Handover",
        "type": "Milestone",
        "description": "Acceptance certificate and handover pack.",
        "dueDate": "2026-07-31",
        "expectedCompleteDate": "2026-07-31",
        "percentage": 15,
        "amount": 3420000,
        "status": "Paid",
        "paymentDate": "2026-07-31",
        "invoice": {
          "number": "INV-1103-04",
          "fileName": "Invoice_INV-1103-04.pdf",
          "uploadedDate": "2026-07-31"
        },
        "remarks": "Paid on time; project closed."
      }
    ],
    "plan": [
      {
        "task": "Power & Cooling Fit-out",
        "description": "UPS, PDU, and CRAC installation.",
        "start": "2026-03-02",
        "end": "2026-04-01",
        "owner": "Facilities Team",
        "dependency": "\u2014",
        "progress": 100,
        "status": "Completed"
      },
      {
        "task": "Rack Installation",
        "description": "Install 40 server racks.",
        "start": "2026-04-02",
        "end": "2026-05-05",
        "owner": "Facilities Team",
        "dependency": "Power & Cooling",
        "progress": 100,
        "status": "Completed"
      },
      {
        "task": "Structured Cabling",
        "description": "Fiber and copper structured cabling.",
        "start": "2026-05-06",
        "end": "2026-06-01",
        "owner": "Cabling Team",
        "dependency": "Rack Installation",
        "progress": 100,
        "status": "Completed"
      },
      {
        "task": "Commissioning & Handover",
        "description": "Load test, document, and hand over.",
        "start": "2026-06-02",
        "end": "2026-07-31",
        "owner": "Zara Malik",
        "dependency": "Cabling",
        "progress": 100,
        "status": "Completed"
      }
    ],
    "services": [
      {
        "name": "Power & Cooling",
        "category": "Network & Data Center",
        "description": "UPS, PDU, and precision cooling install.",
        "deliveryHead": "Zara Malik",
        "sam": "Michael Chen",
        "assignedTeam": "Facilities Team",
        "manpower": 4,
        "days": 30,
        "pricing": 8500000,
        "completion": 100,
        "statusFlag": "completed",
        "statusDescription": "Commissioned and load-tested; no defects.",
        "projectDetails": "N+1 redundancy verified during load test on Jul 10."
      },
      {
        "name": "Structured Cabling",
        "category": "Network & Data Center",
        "description": "Fiber and copper cabling across 40 racks.",
        "deliveryHead": "Zara Malik",
        "sam": "Michael Chen",
        "assignedTeam": "Cabling Team",
        "manpower": 3,
        "days": 25,
        "pricing": 6300000,
        "completion": 100,
        "statusFlag": "completed",
        "statusDescription": "Cabling certified; test reports issued.",
        "projectDetails": "Fluke test reports issued for all fiber and copper runs."
      },
      {
        "name": "Commissioning",
        "category": "Network & Data Center",
        "description": "Full facility load testing and sign-off.",
        "deliveryHead": "Zara Malik",
        "sam": "Michael Chen",
        "assignedTeam": "Facilities Team",
        "manpower": 2,
        "days": 15,
        "pricing": 8000000,
        "completion": 100,
        "statusFlag": "completed",
        "statusDescription": "Client acceptance certificate signed Jul 31.",
        "projectDetails": "Warranty period active through Jul 2027."
      }
    ],
    "updateHistory": [
      {
        "updatedBy": "PMO User",
        "updatedDate": "2026-07-31",
        "service": "Commissioning",
        "previousStatus": "In Progress",
        "newStatus": "Completed",
        "previousCompletion": 90,
        "newCompletion": 100,
        "remarks": "Client signed final acceptance certificate."
      }
    ]
  },
  {
    "id": "PRJ-1121",
    "name": "Managed SOC Services",
    "client": "LexCorp Holdings",
    "startDate": "2026-08-15",
    "endDate": "2027-08-14",
    "description": "Twelve-month managed SOC engagement for LexCorp Holdings covering 24/7 monitoring, threat hunting, and quarterly reporting.",
    "projectManager": "Ayesha Farooq",
    "salesAccountManager": "Sarah Jenkins",
    "deliveryHead": "Hamza Iqbal",
    "overallCompletion": 12,
    "overallStatus": "in-progress",
    "revenueCategory": "Secaas",
    "value": 14400000,
    "estimatedEndDate": "2027-08-14",
    "totalReceived": 1200000,
    "bidGuaranteeSubmitted": "No",
    "guaranteeAmount": 0,
    "paymentPlanType": "Monthly",
    "attachments": [
      {
        "name": "Signed Contract - LexCorp Holdings.pdf",
        "type": "Contract"
      },
      {
        "name": "Onboarding Plan.pdf",
        "type": "Deliverable"
      }
    ],
    "statusDescription": "Onboarding is underway. Initial log source integration is ahead of schedule; SLA reporting cadence to be confirmed with client in September.",
    "milestones": [
      {
        "name": "Sep 2026 Service Period",
        "type": "Monthly",
        "description": "Monthly managed SOC invoice for September 2026.",
        "dueDate": "2026-09-15",
        "expectedCompleteDate": "2026-09-15",
        "percentage": 8,
        "amount": 1200000,
        "status": "Paid",
        "paymentDate": "2026-09-14",
        "invoice": {
          "number": "INV-1121-SEP26",
          "fileName": "Invoice_INV-1121-SEP26.pdf",
          "uploadedDate": "2026-09-14"
        },
        "remarks": "Paid 1 day ahead of due date."
      },
      {
        "name": "Oct 2026 Service Period",
        "type": "Monthly",
        "description": "Monthly managed SOC invoice for October 2026.",
        "dueDate": "2026-10-15",
        "expectedCompleteDate": "2026-10-15",
        "percentage": 8,
        "amount": 1200000,
        "status": "Upcoming",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      },
      {
        "name": "Nov 2026 Service Period",
        "type": "Monthly",
        "description": "Monthly managed SOC invoice for November 2026.",
        "dueDate": "2026-11-15",
        "expectedCompleteDate": "2026-11-15",
        "percentage": 8,
        "amount": 1200000,
        "status": "Pending",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      },
      {
        "name": "Dec 2026 Service Period",
        "type": "Monthly",
        "description": "Monthly managed SOC invoice for December 2026.",
        "dueDate": "2026-12-15",
        "expectedCompleteDate": "2026-12-15",
        "percentage": 8,
        "amount": 1200000,
        "status": "Pending",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      },
      {
        "name": "Jan 2027 Service Period",
        "type": "Monthly",
        "description": "Monthly managed SOC invoice for January 2027.",
        "dueDate": "2027-01-15",
        "expectedCompleteDate": "2027-01-15",
        "percentage": 8,
        "amount": 1200000,
        "status": "Pending",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      },
      {
        "name": "Feb 2027 Service Period",
        "type": "Monthly",
        "description": "Monthly managed SOC invoice for February 2027.",
        "dueDate": "2027-02-15",
        "expectedCompleteDate": "2027-02-15",
        "percentage": 8,
        "amount": 1200000,
        "status": "Pending",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      },
      {
        "name": "Mar 2027 Service Period",
        "type": "Monthly",
        "description": "Monthly managed SOC invoice for March 2027.",
        "dueDate": "2027-03-15",
        "expectedCompleteDate": "2027-03-15",
        "percentage": 8,
        "amount": 1200000,
        "status": "Pending",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      },
      {
        "name": "Apr 2027 Service Period",
        "type": "Monthly",
        "description": "Monthly managed SOC invoice for April 2027.",
        "dueDate": "2027-04-15",
        "expectedCompleteDate": "2027-04-15",
        "percentage": 8,
        "amount": 1200000,
        "status": "Pending",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      },
      {
        "name": "May 2027 Service Period",
        "type": "Monthly",
        "description": "Monthly managed SOC invoice for May 2027.",
        "dueDate": "2027-05-15",
        "expectedCompleteDate": "2027-05-15",
        "percentage": 8,
        "amount": 1200000,
        "status": "Pending",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      },
      {
        "name": "Jun 2027 Service Period",
        "type": "Monthly",
        "description": "Monthly managed SOC invoice for June 2027.",
        "dueDate": "2027-06-15",
        "expectedCompleteDate": "2027-06-15",
        "percentage": 8,
        "amount": 1200000,
        "status": "Pending",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      },
      {
        "name": "Jul 2027 Service Period",
        "type": "Monthly",
        "description": "Monthly managed SOC invoice for July 2027.",
        "dueDate": "2027-07-15",
        "expectedCompleteDate": "2027-07-15",
        "percentage": 8,
        "amount": 1200000,
        "status": "Pending",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      },
      {
        "name": "Aug 2027 Service Period",
        "type": "Monthly",
        "description": "Monthly managed SOC invoice for August 2027 (final month).",
        "dueDate": "2027-08-15",
        "expectedCompleteDate": "2027-08-15",
        "percentage": 8,
        "amount": 1200000,
        "status": "Pending",
        "paymentDate": "-",
        "invoice": null,
        "remarks": ""
      }
    ],
    "plan": [
      {
        "task": "SIEM Connectivity",
        "description": "Establish secure log forwarding pipeline.",
        "start": "2026-08-16",
        "end": "2026-08-29",
        "owner": "SOC Team",
        "dependency": "\u2014",
        "progress": 100,
        "status": "Completed"
      },
      {
        "task": "Log Source Onboarding",
        "description": "Onboard priority log sources.",
        "start": "2026-08-25",
        "end": "2026-09-20",
        "owner": "SOC Team",
        "dependency": "SIEM Connectivity",
        "progress": 30,
        "status": "In Progress"
      },
      {
        "task": "Use Case Baseline",
        "description": "Deploy baseline detection use cases.",
        "start": "2026-09-10",
        "end": "2026-10-05",
        "owner": "SOC Team",
        "dependency": "Log Onboarding",
        "progress": 0,
        "status": "Not Started"
      }
    ],
    "services": [
      {
        "name": "24/7 Monitoring",
        "category": "SECaaS",
        "description": "Round-the-clock SOC monitoring and alert triage.",
        "deliveryHead": "Hamza Iqbal",
        "sam": "Sarah Jenkins",
        "assignedTeam": "SOC Team",
        "manpower": 6,
        "days": 365,
        "pricing": 9600000,
        "completion": 15,
        "statusFlag": "in-progress",
        "statusDescription": "Onboarding in progress; monitoring live for onboarded sources.",
        "projectDetails": "4 of 14 planned log sources onboarded so far."
      },
      {
        "name": "Threat Hunting",
        "category": "VAPT, DFIR & RT",
        "description": "Proactive quarterly threat hunting engagements.",
        "deliveryHead": "Hamza Iqbal",
        "sam": "Sarah Jenkins",
        "assignedTeam": "SOC Team",
        "manpower": 2,
        "days": 40,
        "pricing": 3200000,
        "completion": 0,
        "statusFlag": "not-started",
        "statusDescription": "First hunt scheduled for Q1 service period.",
        "projectDetails": "Hunt hypothesis backlog being prepared with client input."
      },
      {
        "name": "Quarterly Reporting",
        "category": "SOC",
        "description": "Executive and technical reporting cadence.",
        "deliveryHead": "Hamza Iqbal",
        "sam": "Sarah Jenkins",
        "assignedTeam": "SOC Team",
        "manpower": 1,
        "days": 20,
        "pricing": 1600000,
        "completion": 0,
        "statusFlag": "not-started",
        "statusDescription": "Reporting template being finalized with client stakeholders.",
        "projectDetails": "First report due end of Q1 service period."
      }
    ],
    "updateHistory": [
      {
        "updatedBy": "PMO User",
        "updatedDate": "2026-08-29",
        "service": "24/7 Monitoring",
        "previousStatus": "Not Started",
        "newStatus": "In Progress",
        "previousCompletion": 0,
        "newCompletion": 15,
        "remarks": "SIEM connectivity established; onboarding underway."
      }
    ]
  }
];
