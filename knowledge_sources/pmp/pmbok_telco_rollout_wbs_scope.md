---
topic_key: pmbok_telco_rollout_wbs_scope
title: Scope Baseline, WBS Dictionary & Acceptance Milestones (PAT, PAC, FAC) in Telecom Deployments
source_vendor: pmbok
doc_type: practical_guide
technology: project_management
category: pmp_telecom
keywords: pmp, pmbok, scope baseline, wbs, wbs dictionary, scope creep, gold plating, pat, pac, fac, punchlist, sitac, cme, tei, telco rollout, ccb
summary: Comprehensive technical guide for Telecom Project Managers on Scope Management, Work Breakdown Structure (WBS) decomposition for 4G/5G New Site Builds (NSB) and Modernization Swaps, Scope Creep prevention, and formal site acceptance milestones (PAT, PAC, FAC).
---

# Scope Baseline, WBS Decomposition & Acceptance Milestones in Telecom Deployments

## 1. Overview & Scope Management in Telecom
In telecom infrastructure projects, failing to define scope boundaries leads to catastrophic budget overruns and timeline slippage. Scope Management encompasses:
- Developing the **Project Scope Statement** (deliverables, boundaries, acceptance criteria, exclusions).
- Creating the **Work Breakdown Structure (WBS)** and **WBS Dictionary** (100% Rule).
- Validating deliverables through structured technical milestones (**PAT, PAC, FAC**).
- Controlling scope changes via a formal **Change Control Board (CCB)** to stop **Scope Creep** and **Gold Plating**.

---

## 2. The 100% Rule & Standard Telecom WBS Dictionary

The WBS is a hierarchical decomposition of the total scope of work to be carried out by the project team. Under the PMI **100% Rule**, the WBS includes 100% of the work defined by the project scope and captures all deliverables—internal, external, and interim.

### Standard Telecom New Site Build (NSB) WBS Structure:
```text
1.0 4G/5G Macro Rollout Project
├── 1.1 Project Management & Governance
│   ├── 1.1.1 Project Charter & SOW Review
│   ├── 1.1.2 Integrated Project Schedule & Cost Baseline
│   └── 1.1.3 Weekly SteerCo & Stakeholder Progress Reporting
├── 1.2 Site Acquisition (SITAC) & Permitting
│   ├── 1.2.1 Radio Nominal Candidate Search & TSR (Technical Site Survey)
│   ├── 1.2.2 Landlord Lease Agreement & Community Consent (Izin Warga)
│   └── 1.2.3 Municipal Building Permits (PBG / IMB Menara) & Environmental Clearances
├── 1.3 Civil, Mechanical & Electrical (CME) Works
│   ├── 1.3.1 Soil Investigation & Foundation Piling
│   ├── 1.3.2 Tower Erection (Greenfield Lattice 42m / Monopole 30m)
│   ├── 1.3.3 Commercial Power Grid Connection (PLN Transformer / Meter Panel)
│   ├── 1.3.4 Backup Power Installation (Battery Bank / Diesel Generator / ATS)
│   └── 1.3.5 Grounding & Lightning Protection System (< 5 Ohm Test)
├── 1.4 Transmission & Backhaul Connectivity
│   ├── 1.4.1 Microwave Link Installation (ODU, IDU, Alignment)
│   └── 1.4.2 Optical Fiber Termination (ODC, ODF, OTDR Testing)
├── 1.5 Telecom Equipment Installation (TEI)
│   ├── 1.5.1 Baseband Unit (BBU) Rack Mounting & DC Power Cabling
│   ├── 1.5.2 Remote Radio Unit (RRU) / Active Antenna Unit (AAU) Tower Rigging
│   ├── 1.5.3 RF Feeder / SFP Optical Fiber Jumper Installation
│   └── 1.5.4 RET (Remote Electrical Tilt) Cable Connection & Address Scanning
├── 1.6 Commissioning, Integration & Cluster Optimization
│   ├── 1.6.1 Software Script Loading & MME/AMF Initial S1/NG Signaling Integration
│   ├── 1.6.2 Single Site Verification (SSV) / Drive Test (Throughput & Handover Calls)
│   └── 1.6.3 Alarm Clearance & OSS Synchronization
└── 1.7 Acceptance & Handover to Operations (NOC/RPO)
    ├── 1.7.1 Provisional Acceptance Test (PAT)
    ├── 1.7.2 Provisional Acceptance Certificate (PAC) Issuance
    └── 1.7.3 Final Acceptance Certificate (FAC) & Warranty Closeout
```

---

## 3. Scope Creep vs. Gold Plating vs. Formal Change Control

| Concept | Definition in Telecom | Impact | Best Practice Remedy |
| :--- | :--- | :--- | :--- |
| **Scope Creep** | Uncontrolled expansion to product or project scope without adjustments to time, cost, and resources (e.g., operator asks vendor to pave access road for local villagers without change order). | Delays critical path; burns project contingency budget. | Strict adherence to signed Statement of Work (SOW). Any request outside SOW requires a formal **Change Request (CR)**. |
| **Gold Plating** | Giving the customer extra work or higher specs that were not requested or agreed upon (e.g., vendor installing higher-capacity 64T64R massive MIMO instead of budgeted 32T32R). | Increases unbillable costs; exposes project to unverified technical risk. | Prohibited by PMI ethics. Deliver exactly what was agreed in the specification baseline. |
| **Formal Change Control (CCB)** | Documented process through which proposed changes to project baselines are evaluated, approved, or rejected by the **Change Control Board**. | Protects both Operator and Vendor from commercial disputes. | Perform **integrated impact analysis** on Time, Cost, Quality, and Risk before submitting to CCB for sign-off. |

---

## 4. Telecom Technical Acceptance Milestones

In telecommunications contracts (EPC, Turnkey, or Managed Services), progress billing is tied directly to technical acceptance certificates:

### A. Provisional Acceptance Test (PAT) / Technical Audit
- Joint inspection conducted by Operator QC Inspector, Vendor Lead Engineer, and TowerCo Field Specialist.
- **Physical Checklist**: Antenna azimuth/tilt verified with compass and inclinometer; cabling weatherproofed with vulcanized tape; VSWR testing $\le 1.30$; Optical loss $\le 0.5 \text{ dB}$; Grounding resistance $\le 5 \Omega$.
- **Logical Checklist**: 0 active critical/major alarms on OSS (NetAct/ENM/U2020); SSV drive test report approved.

### B. Punchlist Management (Category A vs. Category B)
* **Category A Punchlist (Blocker / Showstopper)**:
  * Defects that compromise network safety or service delivery (e.g., ground cable disconnected, VSWR $> 1.5$, fiber optic severed, structural bolt missing on tower leg).
  * **Rule**: Site **CANNOT** achieve PAC or go on-air until all Cat-A items are rectified 100%.
* **Category B Punchlist (Non-Blocker / Cosmetic)**:
  * Minor issues that do not impact live traffic (e.g., cable labeling missing on cable tray, paint touch-up needed on shelter door).
  * **Rule**: Site can proceed with conditional PAC on-air, with a contractual commitment to rectify Cat-B items within **14 business days**.

### C. Provisional Acceptance Certificate (PAC)
- Official commercial milestone indicating the site is technically ready and carrying commercial traffic.
- Typically unlocks **70% to 80%** of subcontractor contract milestone billing.
- Starts the formal **Warranty Period** (usually 12 months) and operational handover to Managed Services / NOC.

### D. Final Acceptance Certificate (FAC)
- Issued at the end of the warranty period (e.g., 365 days after PAC) after demonstrating sustained network KPI compliance (Availability $\ge 99.95\%$, Drop Call Rate $\le 0.8\%$).
- Releases remaining **10% retention fund (guarantee deposit)** and closes procurement contracts.
