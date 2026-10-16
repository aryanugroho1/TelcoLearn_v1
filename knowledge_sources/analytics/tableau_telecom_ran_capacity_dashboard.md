---
topic_key: analytics_tableau_ran_capacity_dashboard
title: Tableau for Telecommunications - RAN Capacity Dashboards, LOD Expressions & Worst-Cell Triage
source_vendor: tableau
doc_type: practical_guide
technology: bi_analytics
category: data_analytics
keywords: tableau, lod expressions, telco, ran capacity, busy hour, prb utilization, throughput, worst cell, dual axis, scatter plot, customer churn, twbx
summary: Comprehensive guide for Telecom Capacity Planners and Optimization Engineers using Tableau Desktop and Server. Details Level of Detail (LOD) calculations for Busy Hour (BH), dual-axis charts, scatter plots for PRB vs Throughput saturation, and interactive geospatial site triage.
---

# Tableau for Telecommunications: RAN Capacity Dashboards, LOD Expressions & Worst-Cell Triage

## 1. Overview & Telecom Engineering Applications
In cellular network management, **Tableau** is prized for its visual exploratory power and fluid analytical capabilities. Unlike standard static reporting tools, Tableau allows RF engineers and capacity planners to interactively drill down through massive datasets:
- **Radio Access Network (RAN) Capacity Planning**: Uncovering PRB saturation before subscribers experience buffering.
- **Busy Hour (BH) Analysis**: Identifying the peak traffic hour per cluster, site, or carrier band using Level of Detail (LOD) expressions.
- **Worst-Cell Triage & Root Cause Categorization**: Filtering thousands of cellular sectors down to the 5% causing 80% of customer drop calls or packet loss.
- **Geospatial Cross-Filtering**: Overlaying site performance with regional maps to detect geographical clustering of degraded performance.

### Notable Open-Source Repositories & Resources:
- **`madesina2025/Customer-Churn-Tableau`** (GitHub): Packaged Tableau workbooks (`.twbx`) showcasing telecom customer churn KPIs, revenue loss segmentation, and billing cohort retention.
- **`jromer242/bahamas-telecom-analytics`**: Complete telecom analytics workbook with multi-dimensional subscriber lifetime value (CLV) and churn rate metrics.
- **`sahu1234/Telecom-Customer-Churn-Prediction-and-Visualization`**: Integrating data science model predictions with interactive Tableau Public dashboards.
- **Tableau Public Telco Gallery**: Industry-standard community dashboards modeling cellular traffic patterns, Erlang capacity, and LTE/5G throughput curves.

---

## 2. Essential Level of Detail (LOD) Expressions for Telecom

In telecom, networks experience distinct peak usage times across residential and business areas. A simple `AVG()` or `MAX()` aggregation across all hours masks peak cell congestion. Tableau's **Level of Detail (LOD)** expressions allow you to calculate cell-specific metrics independently of view filters.

### A. Network Busy Hour (BH) Traffic Volume
Finds the single hour with maximum traffic volume per day for each site:
```tableau
// Calculation: [Site_Daily_Max_Traffic_GB]
{ FIXED [Date], [Site_ID] : MAX([Payload_DL_GB]) }
```

To flag whether a given hourly record represents the site's official Busy Hour:
```tableau
// Calculation: [Is_Busy_Hour]
IF [Payload_DL_GB] = [Site_Daily_Max_Traffic_GB] THEN "Busy Hour" ELSE "Off-Peak" END
```

### B. Dynamic Worst-Cell Classifier
Flags degraded radio sectors needing urgent field intervention:
```tableau
// Calculation: [Cell_Triage_Category]
IF [Drop_Call_Rate_%] > 2.5 AND [PRB_Utilization_%] > 80 THEN
    "Congestion-Induced Drops (Capacity Expansion Needed)"
ELSEIF [Drop_Call_Rate_%] > 2.5 AND [PRB_Utilization_%] <= 50 THEN
    "Coverage/Interference Drops (RF Optimization / Retilt Needed)"
ELSEIF [Drop_Call_Rate_%] <= 0.8 AND [PRB_Utilization_%] > 85 THEN
    "Healthy Cell - Congestion Warning"
ELSE
    "Nominal Quality"
END
```

### C. Traffic Volume Conversion (Bytes to Terabytes)
```tableau
// Calculation: [Total_Traffic_TB]
SUM([Payload_DL_Bytes] + [Payload_UL_Bytes]) / (1024 * 1024 * 1024 * 1024)
```

---

## 3. High-Impact Telecom Visualizations in Tableau

### A. The PRB vs Throughput Saturation Scatter Plot
This is the single most valuable chart used by RF capacity planners to detect spectrum exhaustion:
- **X-Axis**: `[Downlink PRB Utilization %]` (0% to 100%)
- **Y-Axis**: `[Downlink User Throughput (Mbps)]`
- **Marks**: Shape or Circle, Detailed by `[Cell_ID]`
- **Color**: `[Technology]` (4G LTE vs 5G NR)
- **Size**: `[Total_Traffic_TB]`
- **Reference Line**: Add constant lines at `PRB = 80%` and `Throughput = 5 Mbps`.
- **Interpretation**: 
  - Cells in the *Bottom-Right quadrant* (High PRB > 80%, Low Throughput < 5 Mbps) are **severely congested**. Subscribers are queuing for radio resources.
  - Cells in the *Bottom-Left quadrant* (Low PRB < 40%, Low Throughput < 5 Mbps) suffer from **RF interference, pilot pollution, or weak signal coverage**, not capacity limits.

### B. Dual-Axis Hourly Profile (24-Hour Network Rhythm)
Visualizes the relationship between subscriber traffic load and cell resource strain over a 24-hour cycle:
- **Columns**: `HOUR([Timestamp])` (0 to 23)
- **Rows (Dual Axis)**:
  1. `SUM([Total_Traffic_TB])` represented as **Bar Chart** (Primary Axis)
  2. `AVG([PRB_Utilization_%])` represented as **Line Chart** with dots (Secondary Axis, Synchronized)
- Enables immediate visual detection of morning commute surges (08:00 - 09:00) and evening residential streaming peaks (20:00 - 22:00).

### C. Geospatial Bubble Map for Site Outage & Severity
Tableau natively decodes latitude and longitude coordinates:
- **Columns**: `[Longitude]`
- **Rows**: `[Latitude]`
- **Marks Layer 1**: Points (Sites)
  - Size: `[Total_Connected_Users]`
  - Color: Diverging color ramp on `[Accessibility_SR_%]` (Red < 90%, Yellow 90-95%, Green > 98%)
  - Tooltip: Site Name, Cell Count, Dominant Band, Alarm Status.
- **Background Map**: Select `Satellite` or `Streets` from Map Layers to correlate degraded performance with highway corridors or dense terrain.

---

## 4. Best Practices for Telecom Tableau Dashboards
1. **Extract Data into Hyper (`.hyper`)**: Avoid live SQL queries against raw billing tables containing tens of millions of records. Schedule nightly Hyper extracts aggregated to the hourly grain.
2. **Implement Hierarchical Actions**: Set up **Filter Actions** on your executive summary dashboard allowing engineers to click a **Region (e.g., Jakarta Raya)** ➔ filters **Cluster (e.g., South Jakarta)** ➔ filters **Sites (e.g., JKT001 - JKT050)** ➔ displays specific **Sector KPIs**.
3. **Use Context Filters**: When combining LOD calculations (like `{FIXED [Site_ID] : ...}`) with regional or vendor slicers, add the slicer to **Context** (`Right-click filter -> Add to Context`) so Tableau evaluates the slice *before* calculating the LOD expression.
