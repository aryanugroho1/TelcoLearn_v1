---
topic_key: analytics_powerbi_dax_network_analytics
title: Power BI for Telecommunications - OSS Network KPI Modeling, DAX Calculations & Churn Analytics
source_vendor: powerbi
doc_type: practical_guide
technology: bi_analytics
category: data_analytics
keywords: power bi, dax, telecom, cssr, dcr, drop call rate, prb utilization, throughput, hosr, churn, arpu, star schema, cdr, oss kpi
summary: Comprehensive guide for Telecom Data Analysts and Performance Engineers using Microsoft Power BI and DAX. Covers telecom Star Schema modeling, radio network KPI formulas (CSSR, Drop Rate, PRB Congestion, Throughput), and subscriber churn analytics.
---

# Power BI for Telecommunications: OSS KPI Modeling, DAX Calculations & Churn Analytics

## 1. Overview & Business Context
Telecommunications operators produce massive volumes of granular time-series data:
1. **Network Performance Management (PM/OSS)**: Hourly counters per cell (Ericsson ENM, Nokia NetAct, Huawei MAE/U2020) measuring accessibility, retainability, mobility, and traffic load.
2. **Call Detail Records (CDR) & Billing**: User-level session records, data consumption (Megabytes/Gigabytes), and tariff plans.
3. **Customer Experience & CRM**: Ticket churn status, complaints, Net Promoter Score (NPS), and device models.

**Microsoft Power BI** is the enterprise standard for turning these disparate datasets into interactive executive scorecards and daily Radio Performance Optimization (RPO) health dashboards.

### Notable Open-Source Repositories & References:
- **`133566238/Telecom-Trends`** (GitHub): Power BI model specifically built for LTE cellular network performance monitoring (Accessibility, Retainability, Intra/Inter-frequency Handovers, and 4G VoLTE drop call rate).
- **`UtkarshJd/Telecom-Customer-Churn-Analysis---PowerBI-Dashboard`**: Complete end-to-end repository with custom DAX measures for churn forecasting, tenure cohorts, and contract segmentation.
- **`Tavishi-Jain/Telecom_churn_prediction_system`**: PostgreSQL-backed Star Schema warehousing pipeline integrating predictive churn with Power BI reports.
- **`microsoft/PowerBI-visuals-PowerKPIMatrix`**: Microsoft's official KPI scorecard matrix visual designed for multi-tier hierarchical metrics.

---

## 2. Telecom Data Modeling: Star Schema Best Practices
Avoid flat, unnormalized single-table extracts (e.g. 100M-row CSV with repetitive site names). Instead, structure your Power BI Semantic Model as a **Star Schema**:

```text
               ┌────────────────────────┐
               │    Dim_CellSite        │
               │ (Cell_ID, Site_ID, Lat,│
               │  Lon, Azimuth, Cluster)│
               └───────────┬────────────┘
                           │ 1
                           │
                           │ *
┌────────────────┐ *   ┌───┴────────────────────────┐   * ┌────────────────┐
│    Dim_Date    │─────┤    Fact_Hourly_PM_Counters │─────┤    Dim_Time    │
│ (Date, Year,   │ 1   │ (Date_Key, Time_Key,       │ 1   │ (Hour, TimeKey,│
│  Month, Day)   │     │  Cell_ID, RRC_ConnReq,     │     │  Peak_Indicator│
└────────────────┘     │  RRC_Succ, ERAB_Drop, ...) │     └────────────────┘
                       └────────────────────────────┘
```

- **Fact_Hourly_PM_Counters**: Contains numeric additive counters (e.g., `RRC_Conn_Req`, `RRC_Conn_Succ`, `ERAB_Nbr_Drop`, `PRB_Used_DL`, `PRB_Avail_DL`).
- **Dim_CellSite**: 1-to-Many relationship on `Cell_ID`.
- **Dim_Date & Dim_Time**: Dedicated calendar and 24-hour dimension tables to enable time-intelligence DAX functions without table scans.

---

## 3. Essential DAX Formulas for Telecom Radio Quality (OSS KPIs)

### A. 4G/5G Radio Connection Accessibility (CSSR %)
Call Setup Success Rate (CSSR) measures the probability that a mobile device successfully accesses radio signaling and user plane data channels:
$$\text{CSSR} = \frac{\text{RRC Setup Success}}{\text{RRC Setup Attempts}} \times \frac{\text{E-RAB Setup Success}}{\text{E-RAB Setup Attempts}} \times 100\%$$

```dax
4G_RRC_Setup_SR% = 
DIVIDE(
    SUM(Fact_Hourly_PM_Counters[RRC_Conn_Setup_Succ]),
    SUM(Fact_Hourly_PM_Counters[RRC_Conn_Setup_Att]),
    BLANK()
) * 100

4G_ERAB_Setup_SR% = 
DIVIDE(
    SUM(Fact_Hourly_PM_Counters[ERAB_Setup_Succ]),
    SUM(Fact_Hourly_PM_Counters[ERAB_Setup_Att]),
    BLANK()
) * 100

4G_CSSR% = 
DIVIDE([4G_RRC_Setup_SR%], 100) * DIVIDE([4G_ERAB_Setup_SR%], 100) * 100
```

### B. Retainability: 4G E-RAB Drop Call Rate (DCR %)
Calculates abnormal drops during active user data sessions (e.g., due to handover failure, blind spots, or link budget expiry):
```dax
4G_ERAB_Drop_Rate% = 
DIVIDE(
    SUM(Fact_Hourly_PM_Counters[ERAB_Abnormal_Release]),
    SUM(Fact_Hourly_PM_Counters[ERAB_Normal_Release]) + SUM(Fact_Hourly_PM_Counters[ERAB_Abnormal_Release]),
    BLANK()
) * 100
```
*Standard Industry Target: < 0.8% in urban macro networks.*

### C. Downlink Physical Resource Block (PRB) Utilization %
Measures radio cell spectrum congestion. PRB > 80% during busy hour triggers capacity expansion (adding 2nd carrier or 5G offload):
```dax
4G_DL_PRB_Utilization% = 
DIVIDE(
    SUM(Fact_Hourly_PM_Counters[PRB_Used_DL]),
    SUM(Fact_Hourly_PM_Counters[PRB_Total_Available_DL]),
    BLANK()
) * 100
```

### D. Downlink User Experienced Throughput (Mbps)
Calculates actual payload delivery speed per active user:
```dax
4G_User_DL_Throughput_Mbps = 
DIVIDE(
    SUM(Fact_Hourly_PM_Counters[PDCP_Payload_Vol_DL_Bytes]) * 8, -- Convert Bytes to Bits
    SUM(Fact_Hourly_PM_Counters[PDCP_Transmission_Time_DL_Sec]) * 1000000, -- Convert to Megabits
    BLANK()
)
```

### E. Handover Success Rate (HOSR %)
Measures mobility quality between neighboring cells (intra-frequency and inter-frequency):
```dax
4G_Handover_SR% = 
DIVIDE(
    SUM(Fact_Hourly_PM_Counters[HO_Execution_Succ]),
    SUM(Fact_Hourly_PM_Counters[HO_Execution_Att]),
    BLANK()
) * 100
```

---

## 4. Telecom Commercial & Churn Analytics DAX Measures

### A. Subscriber Churn Rate %
```dax
Total_Subscribers = COUNTROWS(Dim_Subscriber)

Churned_Subscribers = 
CALCULATE(
    COUNTROWS(Dim_Subscriber),
    Dim_Subscriber[Churn_Status] = "Yes"
)

Churn_Rate% = 
DIVIDE([Churned_Subscribers], [Total_Subscribers], 0) * 100
```

### B. Average Revenue Per User (ARPU)
```dax
ARPU = 
DIVIDE(
    SUM(Fact_Billing[Monthly_Charges]),
    DISTINCTCOUNT(Fact_Billing[Subscriber_ID]),
    0
)
```

### C. Dynamic Worst-Cell Identification (Color Formatting Measure)
Used to highlight degraded cells in matrix visuals automatically:
```dax
Cell_Health_Status = 
SWITCH(
    TRUE(),
    [4G_ERAB_Drop_Rate%] > 2.0, "#FF0000", -- Red (Critical degradation)
    [4G_DL_PRB_Utilization%] > 85.0, "#FFA500", -- Orange (Capacity Congestion)
    [4G_CSSR%] < 95.0, "#FFFF00", -- Yellow (Accessibility Warning)
    "#00A86B" -- Green (Healthy Cell)
)
```

---

## 5. Performance Optimization for Large Telco Models
When dealing with hundreds of millions of hourly rows:
1. **Use Summary Aggregation Tables**: Create a pre-aggregated daily table at the `(Site_ID, Date)` grain for high-level executive cards, and keep the hourly `(Cell_ID, Hour)` table for deep-dive diagnostics.
2. **Remove Unused Columns**: Remove high-cardinality raw timestamp strings (e.g., `2026-10-15 14:22:15.123`). Split into separate integer DateKey (`20261015`) and Hour (`14`).
3. **Turn Off Auto Date/Time**: Disable Power BI's automatic date hierarchies to save RAM footprint.
