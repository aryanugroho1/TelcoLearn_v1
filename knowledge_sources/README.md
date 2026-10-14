# TelcoLearn Knowledge Sources & Ingestion Pipeline

Folder ini adalah **wadah terpusat** untuk menampung dokumentasi telekomunikasi (Standar Terbuka & Vendor) yang di-ingest ke basis data Hybrid RAG TelcoLearn.

## Struktur Direktori

```text
knowledge_sources/
├── 3gpp/             # Spesifikasi 3GPP (Rel-15 s/d Rel-18: TS 38.331, TS 24.501, TS 38.214, dll)
├── oran/             # Dokumen O-RAN Alliance (WG1 Architecture, WG3 Near-RT RIC, WG4 Fronthaul 7.2x)
└── vendors/
    ├── huawei/       # Parameter MML MAE/U2020, MO dictionary, SmartCare, RRU config
    ├── nokia/        # NetAct KPI Counter formulas, AirScale hardware, parameter tuning
    ├── ericsson/     # ENM MoClasses, Counter reference, RBS features
    └── zte/          # ElasticNet / UME parameter guidelines, RANCLI commands
```

## Format Berkas yang Didukung

Anda dapat menambahkan berkas berupa:
1. **Markdown (`.md`)** dengan YAML Frontmatter (Sangat Disarankan):
```markdown
---
topic_key: 3gpp_rrc_timers_rlf
title: 3GPP RRC Timers (T300, T304, T310, T311) & Radio Link Failure
source_vendor: 3gpp
doc_type: parameter
technology: 5g_nr
category: 5g_nr
keywords: t300, t304, t310, t311, n310, n311, rlf, radio link failure, out of sync, in sync
summary: Acuan teknis 3GPP TS 38.331 mengenai mekanisme timer radio L3 dan kriteria RLF.
---

# Isi konten mendalam...
```

2. **JSON (`.json`)**:
```json
{
  "topic_key": "nokia_iot_packet_loss",
  "title": "Nokia NetAct IoT Packet Loss KPI Formula",
  "source_vendor": "nokia",
  "doc_type": "kpi_formula",
  "technology": "4g_lte",
  "category": "4g_lte",
  "keywords": "nokia, iot packet loss, netact, formula, counter",
  "summary": "Formula resmi counter NetAct Nokia untuk IoT Packet Loss",
  "core_content": "Konten detail formula counter..."
}
```

## Menjalankan Ingestion ke Database

Jalankan perintah berikut di folder `telcolearn-engine`:
```bash
node scripts/ingest_knowledge.js
```
atau:
```bash
npm run ingest
```
Skrip akan secara otomatis memindai seluruh folder di atas, memvalidasi format, dan meng-upsert ke tabel `knowledge_base` di SQLite dan PostgreSQL Coolify.
