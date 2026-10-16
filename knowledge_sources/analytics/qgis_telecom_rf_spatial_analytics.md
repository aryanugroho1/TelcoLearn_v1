---
topic_key: analytics_qgis_rf_spatial_analytics
title: QGIS for Telecommunications - RF Planning, Cell Sectorization & Drive Test Spatial Analytics
source_vendor: qgis
doc_type: practical_guide
technology: spatial_analytics
category: data_analytics
keywords: qgis, rftools, shapetools, pyqgis, rf planning, azimuth, beamwidth, pci, rsrp, sinr, drive test, heatmap, voronoi, opencellid
summary: Comprehensive technical guide for RF and Telecom Engineers using QGIS, RFTools, and ShapeTools to visualize cell towers, generate 65°/90° sector polygons, analyze drive test log heatmaps (RSRP/SINR), and automate spatial reporting with PyQGIS.
---

# QGIS for Telecommunications: RF Planning, Cell Sectorization & Drive Test Spatial Analytics

## 1. Overview & Industry Relevance
In the cellular telecommunications industry, Geographic Information System (GIS) tools are critical for:
- Radio Frequency (RF) coverage planning and nominal cell placement (2G/3G/4G/5G).
- Visualizing antenna azimuths, mechanical/electrical tilt, and beamwidth radiation patterns.
- Drive Test (DT) log analysis (mapping RSRP, RSRQ, and SINR collected from tools like TEMS, Nemo, or SwissQual).
- Physical Cell ID (PCI) confusion/collision audits and neighbor relation sanity checks.

While legacy workflows heavily depended on proprietary tools like MapInfo Professional, **QGIS (Quantum GIS)** has become the dominant modern, open-source standard across global telecom operators and vendors (Ericsson, Nokia, Huawei, ZTE).

### Notable Open-Source Repositories & Toolsets:
- **`mbebs/RFTools`** (GitHub): The gold-standard QGIS plugin for RF engineers, featuring *Site See* (multi-band antenna sectors, azimuth offset), *Neighbor Analysis*, and *PCI Planning*.
- **`NationalSecurityAgency/qgis-shapetools-plugin`** (ShapeTools): Used to generate geodesic wedge polygons (pie-slice antenna sectors) based on bearing/azimuth and horizontal beamwidth.
- **`Senolbaskaya/Network-Planning-and-Design`**: Python-based automation pipelines converting raw cell coordinates to KML, KMZ, and Shapefiles.
- **OpenCelliD & CellMapper Data**: Open-source cellular site databases providing worldwide base station coordinates (MCC, MNC, LAC/TAC, CID, Lat, Lon, Azimuth).

---

## 2. Setting Up Coordinate Reference Systems (CRS)
A frequent error in telecom GIS is projecting distance buffers using geographic degrees instead of meters:
- **Project CRS (Canvas)**: Use **WGS 84 / Pseudo-Mercator (`EPSG:3857`)** for smooth tile rendering (Google Satellite, OpenStreetMap).
- **Measurement & Geodesic Calculation**: When calculating inter-site distances, sector radius, or coverage buffers in meters, project your layers to the local **UTM Zone** (e.g., `EPSG:32648` for UTM Zone 48N in western Indonesia) or utilize QGIS ellipsoidal geodesic distance functions (`$length` / `geodesic_distance`).

---

## 3. Plotting Cell Towers & Generating Directional Sectors

### A. Expected Input CSV Schema (Site Engineering Table)
Prepare your cell database with the following columns:
```csv
site_id,cell_id,technology,frequency_band,lat,lon,azimuth,beamwidth,antenna_height,m_tilt,e_tilt,pci
JKT001,JKT001_L1,LTE,1800, -6.2088,106.8456,0,65,32,2,4,112
JKT001,JKT001_L2,LTE,1800, -6.2088,106.8456,120,65,32,2,4,113
JKT001,JKT001_L3,LTE,1800, -6.2088,106.8456,240,65,32,2,4,114
```

### B. Creating Directional Sector Polygons (Wedges)
There are two primary methods to render 3-sector or multi-sector cells:

#### Method 1: Using the RFTools Plugin
1. Install **RFTools** via QGIS Plugin Manager (`Plugins` -> `Manage and Install Plugins` -> Search *RFTools*).
2. Open **Site See**:
   - Point to your imported cell layer.
   - Select field mappings: *Azimuth*, *Beamwidth*, *Site ID*, and *Band*.
   - Set Cell Radius (e.g., Urban: 300m - 500m; Suburban: 1.5km - 3km).
   - Click **Run** to automatically generate styled sector lobes with multi-carrier radial offsets.

#### Method 2: Native QGIS Geometry Generator (Zero Plugins)
If plugins are restricted, apply a **Geometry Generator** on the layer symbology:
- Geometry type: `Polygon / MultiPolygon`
- QGIS Expression:
```sql
wedge_buffer(
  center := $geometry,
  azimuth := "azimuth",
  width := "beamwidth",
  outer_radius := 350
)
```
*This renders instant parametric directional antenna wedges directly from your points without creating static shapefiles.*

---

## 4. Drive Test (DT) Log Analysis & Standard 3GPP Color Ramps

### A. Importing Drive Test Data
Import scanner or UE log CSV files (`Layer` -> `Add Layer` -> `Add Delimited Text Layer`), defining `lon` as X Field and `lat` as Y Field with `EPSG:4326`.

### B. 3GPP LTE RSRP Coverage Benchmark Color Ramp
Apply **Graduated Symbology** on the `rsrp` field:

| RSRP Range (dBm) | Coverage Quality | Recommended Hex Color | Action / RF Verdict |
| :--- | :--- | :--- | :--- |
| **>= -80 dBm** | Excellent Coverage | `#00A65A` (Dark Green) | Dominant server, high modulation (64QAM/256QAM) |
| **-90 to -80 dBm** | Good Coverage | `#00C0EF` (Cyan/Light Blue) | Stable user experience, full throughput |
| **-100 to -90 dBm** | Fair / Borderline | `#F39C12` (Orange/Yellow) | Handover zone; monitor interference |
| **-110 to -100 dBm** | Poor Coverage | `#DD4B39` (Red) | High BLER; risk of RRC Re-establishment |
| **< -110 dBm** | Critical / Blind Spot | `#7D1128` (Dark Purple/Black) | Radio Link Failure (RLF) risk; cell addition needed |

### C. LTE/5G SINR (Quality & Interference) Color Ramp
- **SINR > 15 dB**: Green (Clean channel, high spectral efficiency)
- **5 dB to 15 dB**: Yellow/Orange (Acceptable channel condition)
- **< 0 dB**: Magenta/Black (High pilot pollution, cross-feeder, or overshooting cell)

---

## 5. Spatial Analytics Techniques in Telecom

### A. IDW Interpolation (Continuous RF Heatmap Surface)
To estimate signal distribution between drive test sample points:
1. Open `Processing Toolbox` -> `Interpolation` -> **IDW Interpolation**.
2. Vector layer: Select Drive Test Point Layer; Interpolation attribute: `rsrp`.
3. Distance coefficient $P$: `2.0` (standard inverse distance squared).
4. Extent: Set to DT layer bounding box.
5. Apply Singleband Pseudocolor styling using the RSRP color ramp above.

### B. Voronoi Polygons (Theoretical Dominance Area)
To estimate the serving footprint for each cell site without full propagation simulations:
1. Run `Vector` -> `Geometry Tools` -> **Voronoi Polygons**.
2. Buffer parameter: `20% - 30%`.
3. Intersect Voronoi polygons with land-use/clutter layers to estimate subscriber density per site.

---

## 6. PyQGIS Automation: Batch Generating Sectors & Reports
You can run this script directly inside the **QGIS Python Console** to automate telecom plotting:

```python
import processing
from qgis.core import (
    QgsProject,
    QgsVectorLayer,
    QgsField,
    edit
)

def create_sector_wedges(point_layer_name, radius_meters=400):
    project = QgsProject.instance()
    layers = project.mapLayersByName(point_layer_name)
    if not layers:
        print(f"Layer {point_layer_name} not found!")
        return

    src_layer = layers[0]
    # Execute native wedge buffer algorithm
    params = {
        'INPUT': src_layer,
        'AZIMUTH': QgsProperty.fromExpression('"azimuth"'),
        'WIDTH': QgsProperty.fromExpression('"beamwidth"'),
        'OUTER_RADIUS': radius_meters,
        'INNER_RADIUS': 0,
        'OUTPUT': 'memory:Telecom_Sectors'
    }
    result = processing.run("native:wedgebuffers", params)
    project.addMapLayer(result['OUTPUT'])
    print("✅ Telecom antenna sectors generated successfully!")

# Usage:
# create_sector_wedges("My_Cell_Sites", 500)
```
