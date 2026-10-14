---
topic_key: stn_nr_endc_setup
title: 5G NSA Dual Connectivity (EN-DC Option 3x) & SgNB Addition (ShareTechNote Reference)
keywords: endc, en-dc, 5g nsa, sgnb addition, option 3x, split bearer, x2-c, x2-u, secondary node addition, dual connectivity, sharetechnote
category: 5g_nr
source_vendor: sharetechnote
doc_type: practical_guide
technology: 5g_nr
summary: Panduan alur pensinyalan 5G Non-Standalone (EN-DC Option 3x), prosedur penambahan SgNB (Secondary gNodeB), konfigurasi nr-Config-r15, dan pengalihan jalur data split bearer berdasarkan referensi ShareTechNote.
---

# Alur Pensinyalan 5G NSA EN-DC Option 3x (ShareTechNote Practical Reference)

## 1. Prinsip Dual Connectivity Option 3x
- **MeNB (LTE eNodeB)**: Bertindak sebagai Master Node yang mengendalikan Control Plane (pensinyalan RRC dan NAS) yang terhubung ke 4G EPC (MME/HSS).
- **SgNB (5G gNodeB)**: Bertindak sebagai Secondary Node penopang User Plane pita lebar kecepatan tinggi (NR Data Radio Bearer / SCG).
- **Option 3x Split Bearer**: Tunnel data user plane GTP-U dari EPC diarahkan langsung ke SgNB (SN-terminated split bearer). SgNB dapat mendistribusikan aliran data secara lokal ke MeNB melalui interface X2-U bila diperlukan.

## 2. Tahapan Call Flow SgNB Addition

### Step 1: Pengukuran Sinyal 5G (Measurement Configuration)
- MeNB mengirimkan pesan `RRCConnectionReconfiguration` ke UE yang menyertakan konfigurasi pengukuran **B1 Event** (inter-RAT 5G NR RSRP/RSRQ threshold).
- UE memindai frekuensi 5G NR, mendeteksi sinyal SSB, dan membalas dengan pesan `MeasurementReport` (Event B1).

### Step 2: Permintaan Alokasi Resource ke 5G (SgNB Addition Request)
- MeNB mengirim pesan via interface X2-C: `SgNB Addition Request` ke gNodeB target.
- Menyertakan E-RAB ID, profil QoS, kapabilitas radio UE, dan konfigurasi koordinasi radio.
- gNodeB mengalokasikan resource radio 5G NR dan membalas dengan `SgNB Addition Request Acknowledge` yang membungkus container RRC NR (`nr-Config-r15`).

### Step 3: Rekonfigurasi RRC ke Ponsel (RRC Connection Reconfiguration)
- MeNB mengirim pesan `RRCConnectionReconfiguration` ke UE yang membungkus container `nr-Config` (konfigurasi PSCell, SpCell, SCG radio bearer, dan parameter PRACH).
- UE menerapkan konfigurasi dan membalas `RRCConnectionReconfigurationComplete` ke MeNB.
- MeNB meneruskan konfirmasi melalui pesan `SgNB Reconfiguration Complete` ke gNodeB via interface X2-C.

### Step 4: Sinkronisasi Fisik ke Sel 5G (RACH pada PSCell)
- UE melakukan prosedur Random Access (RACH) langsung ke sel 5G gNodeB (PSCell) untuk mendapatkan sinkronisasi uplink timing.

### Step 5: Path Switch User Plane di EPC
- MeNB mengirim pesan S1AP: `E-RAB Modification Indication` ke MME.
- MME berkoordinasi dengan S-GW/P-GW untuk mengalihkan tunnel user plane S1-U langsung ke alamat IP SgNB.
- Aliran paket data kecepatan tinggi 5G NR aktif penuh dua arah!
