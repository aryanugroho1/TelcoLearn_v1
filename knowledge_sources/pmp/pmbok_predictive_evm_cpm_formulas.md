---
topic_key: pmbok_predictive_evm_cpm_formulas
title: PMP Formula Masterclass - Earned Value Management (EVM), Critical Path (CPM) & PERT in Telecom Projects
source_vendor: pmbok
doc_type: practical_guide
technology: project_management
category: pmp_telecom
keywords: pmp, pmbok, evm, earned value management, cpi, spi, eac, etc, tcpi, cpm, critical path, float, slack, pert, beta distribution, communication channels, telco rollout
summary: Comprehensive guide and formula reference for PMP exam preparation and telecom project controls. Covers Earned Value Management (EVM), 4 EAC forecasting scenarios, Critical Path Method (CPM), Float calculations, and Three-Point PERT estimating with practical cellular tower rollout examples.
---

# PMP Formula Masterclass: EVM, CPM & Project Controls in Telecom Deployments

## 1. Overview & Project Controls Context
In cellular network rollouts (such as deploying 500 new 5G gNodeB sites or swapping 2,000 LTE base stations), Project Managers must maintain strict controls over cost and schedule baselines. 

This reference compendium consolidates the **Project Management Institute (PMI) PMBOK Standards** and open-source study repositories into an actionable mathematical toolkit tailored for telecommunications delivery leads.

---

## 2. Earned Value Management (EVM) Core Variables
Every EVM question or real-world project audit starts from 4 fundamental figures:

1. **BAC (Budget at Completion)**: Total authorized project budget.
   * *Telco Example*: Total contract value to build 100 macro sites = $\$5,000,000$ ($\$50,000$/site).
2. **PV (Planned Value)**: The authorized budget allocated to work scheduled to be completed by the reporting date.
   * *Formula*: $\text{PV} = \% \text{ planned complete} \times \text{BAC}$.
   * *Telco Example*: At Month 3, 40 sites should be finished $\rightarrow \text{PV} = 40 \times \$50,000 = \$2,000,000$.
3. **EV (Earned Value)**: The value of physical work actually accomplished, expressed in terms of the authorized budget.
   * *Formula*: $\text{EV} = \% \text{ actual complete} \times \text{BAC}$.
   * *Telco Example*: At Month 3, only 30 sites have passed Final Acceptance (FAC) $\rightarrow \text{EV} = 30 \times \$50,000 = \$1,500,000$.
4. **AC (Actual Cost)**: The actual total money spent to accomplish the work (EV).
   * *Telco Example*: Invoice receipts paid to civil and rigging subcontractors = $\$1,800,000$.

---

## 3. Variances & Performance Indices

### A. Variance Formulas (Difference in Dollar Value)
* **Cost Variance (CV)**:
  $$\text{CV} = \text{EV} - \text{AC}$$
  * $\text{CV} > 0$ (Positive): Under budget (Good).
  * $\text{CV} < 0$ (Negative): Over budget (Bad).
  * *Example*: $\$1.5\text{M} - \$1.8\text{M} = -\$300,000$ (Over budget by $\$300\text{k}$).
* **Schedule Variance (SV)**:
  $$\text{SV} = \text{EV} - \text{PV}$$
  * $\text{SV} > 0$ (Positive): Ahead of schedule (Good).
  * $\text{SV} < 0$ (Negative): Behind schedule (Bad).
  * *Example*: $\$1.5\text{M} - \$2.0\text{M} = -\$500,000$ (Behind schedule).

### B. Efficiency Indices (Ratio Value)
* **Cost Performance Index (CPI)**:
  $$\text{CPI} = \frac{\text{EV}}{\text{AC}}$$
  * $\text{CPI} > 1.0$: Cost efficient (e.g., getting $\$1.10$ value for every $\$1.00$ spent).
  * $\text{CPI} < 1.0$: Cost inefficient.
  * *Example*: $\frac{\$1.5\text{M}}{\$1.8\text{M}} = 0.833$ (For every $\$1$ spent, only $\$0.83$ worth of sites delivered).
* **Schedule Performance Index (SPI)**:
  $$\text{SPI} = \frac{\text{EV}}{\text{PV}}$$
  * $\text{SPI} > 1.0$: Progressing faster than planned.
  * $\text{SPI} < 1.0$: Progressing slower than planned.
  * *Example*: $\frac{\$1.5\text{M}}{\$2.0\text{M}} = 0.75$ (Progressing at only $75\%$ of planned velocity).

---

## 4. Forecasting: Estimate at Completion (EAC)

The PMP exam requires selecting the exact EAC formula matching the project's forward-looking assumption:

| Scenario / Assumption | Formula | When to Apply in Telecom Projects |
| :--- | :--- | :--- |
| **Case 1: Typical Variance** (Current rate of cost variance will continue) | $$\text{EAC} = \frac{\text{BAC}}{\text{CPI}}$$ | Subcontractor unit rates are permanently higher than estimated due to steel/fiber price inflation. |
| **Case 2: Atypical Variance** (Future work will proceed at the originally budgeted rate) | $$\text{EAC} = \text{AC} + (\text{BAC} - \text{EV})$$ | A one-time flood delayed foundation pouring in Month 2, but remaining sites face normal dry weather. |
| **Case 3: Both Cost & Schedule impact remaining work** | $$\text{EAC} = \text{AC} + \frac{\text{BAC} - \text{EV}}{\text{CPI} \times \text{SPI}}$$ | Milestone deadline is fixed with severe liquidated damages, and cost overruns continue. |
| **Case 4: Re-baselining (Bottom-up ETC)** | $$\text{EAC} = \text{AC} + \text{Bottom-Up ETC}$$ | Original scope was completely flawed (e.g., radical shift from rooftop monopoles to greenfield towers). |

### Additional Forecasting Metrics:
* **Estimate to Complete (ETC)**: How much more money is needed to finish?
  $$\text{ETC} = \text{EAC} - \text{AC}$$
* **Variance at Completion (VAC)**: Expected surplus or deficit upon project finish:
  $$\text{VAC} = \text{BAC} - \text{EAC}$$
* **To-Complete Performance Index (TCPI)**: The cost efficiency that must be achieved on the remaining work to hit the target:
  * To meet original BAC:
    $$\text{TCPI}_{\text{BAC}} = \frac{\text{BAC} - \text{EV}}{\text{BAC} - \text{AC}}$$
  * To meet revised EAC:
    $$\text{TCPI}_{\text{EAC}} = \frac{\text{BAC} - \text{EV}}{\text{EAC} - \text{AC}}$$
  * *Rule*: If $\text{TCPI} > 1.0$, remaining work must be done significantly more efficiently than planned to avoid blowing the budget.

---

## 5. Critical Path Method (CPM) & Float Calculations

### A. Core Definitions
* **Critical Path**: The longest sequence of dependent activities in a network diagram that determines the **shortest possible total project duration**.
* **Total Float ($TF$)**: Amount of time an activity can be delayed without delaying the project completion date.
  $$\text{Total Float} = \text{LS} - \text{ES} \quad \text{or} \quad \text{LF} - \text{EF}$$
  * Any activity on the Critical Path has **Total Float = 0** (or negative if already behind).
* **Free Float ($FF$)**: Amount of time an activity can be delayed without delaying the *Early Start* of any immediately following activity:
  $$\text{Free Float} = \text{ES}_{\text{successor}} - \text{EF}_{\text{current}}$$

### B. Cellular Tower Rollout Example (Forward & Backward Pass)
Consider activities for a single cell site build:
1. Activity A: Soil Investigation & Civil Design (5 days)
2. Activity B: Foundation Paving & Tower Erection (14 days, depends on A)
3. Activity C: Commercial Power Grid Connection / PLN (20 days, depends on A)
4. Activity D: Telecom Equipment Installation - BBU/AAU (4 days, depends on B)
5. Activity E: Site Integration & On-Air Testing (3 days, depends on C and D)

- **Path 1**: $A \rightarrow B \rightarrow D \rightarrow E = 5 + 14 + 4 + 3 = 26 \text{ days}$.
- **Path 2**: $A \rightarrow C \rightarrow E = 5 + 20 + 3 = 28 \text{ days}$.
- **Critical Path** = Path 2 ($28 \text{ days}$).
- **Total Float of Activity B & D**: $28 - 26 = 2 \text{ days}$ of buffer.

---

## 6. Estimating Techniques & Three-Point Estimating (PERT)

When activity durations are uncertain (e.g., getting municipal site permits from local government):

### A. Beta Distribution (Standard PMP Weighted PERT)
Gives $4\times$ weight to the Most Likely estimate:
$$\text{Expected Duration } (E) = \frac{O + 4M + P}{6}$$
$$\text{Standard Deviation } (\sigma) = \frac{P - O}{6}$$
$$\text{Variance } (\sigma^2) = \left(\frac{P - O}{6}\right)^2$$
*(Where $O = \text{Optimistic}, M = \text{Most Likely}, P = \text{Pessimistic}$)*

### B. Triangular Distribution (Simple Average)
$$E = \frac{O + M + P}{3}$$

---

## 7. Communication Channels Formula
In large multi-party telco projects (Operator PM, Vendor TPM, Subcontractor Leads, TowerCo, NOC):
$$\text{Number of Potential Communication Channels} = \frac{n(n - 1)}{2}$$
*Example*: If your project core team increases from $10$ members to $15$ members:
- For $n = 10$: $\frac{10 \times 9}{2} = 45 \text{ channels}$.
- For $n = 15$: $\frac{15 \times 14}{2} = 105 \text{ channels}$ ($+133\%$ complexity explosion!).
- *Key Takeaway for PM*: High channel count requires formal Communications Management Plans to prevent scope misinterpretation.
