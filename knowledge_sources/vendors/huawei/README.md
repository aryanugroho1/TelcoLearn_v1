# Huawei Documentation Dropzone

Letakkan berkas markdown (`.md`) atau `.json` terkait dokumentasi Huawei di folder ini.

## Contoh Template Berkas (.md):

```markdown
---
topic_key: huawei_camgtcfg_parameters
title: Huawei MO CAMGTCFG & Carrier Aggregation Parameters
source_vendor: huawei
doc_type: parameter
technology: 4g_lte
category: 4g_lte
keywords: huawei, camgtcfg, carrier aggregation, scell, pcell, scc, a4 threshold, u2020, mae
summary: Panduan parameter Managed Object CAMGTCFG pada Huawei U2020/MAE untuk tuning Carrier Aggregation.
---

### Parameter Penting di MO CAMGTCFG:
1. `CaMgtCfgGroup`: ID grup manajemen CA.
2. `SCellA4ThdRsrp`: Threshold RSRP event A4 untuk menambah SCell.
...
```

Jalankan `npm run ingest` setelah menambahkan berkas.
