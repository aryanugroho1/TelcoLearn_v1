---
topic_key: stn_oran_ric
title: O-RAN Architecture & RAN Intelligent Controller (RIC) (ShareTechNote Reference)
keywords: ric, ric itu apa, o-ran, open ran, near-rt ric, non-rt ric, xapps, rapps, e2 interface, a1 interface, o1 interface, smo, sharetechnote
category: o_ran
source_vendor: sharetechnote
doc_type: practical_guide
technology: o_ran
summary: Panduan konsep arsitektur RAN Intelligent Controller (RIC) dalam Open RAN (O-RAN Alliance), pemisahan Near-RT RIC vs Non-RT RIC, xApps, rApps, serta antarmuka E2, A1, dan O1 berdasarkan referensi ShareTechNote.
---

# Arsitektur & Fungsi RAN Intelligent Controller (RIC) (ShareTechNote Practical Reference)

## 1. Pengertian Dasar RIC
**RIC (RAN Intelligent Controller)** adalah komponen perangkat lunak sentral dalam arsitektur Open RAN (didefinisikan oleh O-RAN Alliance) yang bertugas memprogram, mengotomatisasi, dan mengoptimalkan fungsi-fungsi jaringan akses radio (gNodeB) menggunakan algoritma Machine Learning dan aplikasi kecerdasan buatan (*software-defined radio intelligence*).

## 2. Mengapa RIC Diperlukan?
Pada arsitektur radio monolitik tradisional (*Black-box BTS* dari vendor tunggal), algoritma Radio Resource Management (RRM) tertanam tertutup pada perangkat keras vendor. RIC mendisagregasi kontrol radio menjadi software terbuka dan berbasis mikroservis cloud-native sehingga operator telekomunikasi dapat memasang aplikasi AI/ML independen dari multi-vendor.

## 3. Dua Tingkatan Utama RIC

### A. Non-Real-Time RIC (Non-RT RIC)
- **Penempatan**: Berada di lapisan SMO (Service Management and Orchestration) / Core Cloud.
- **Siklus Waktu Kontrol**: Loop kontrol lambat (interval waktu > 1 detik).
- **Aplikasi**: Menjalankan **rApps** (aplikasi mikroservis untuk perencanaan kebijakan makro, model training AI, dynamic slicing orchestration, dan efisiensi energi menara seluler).
- **Interface**: Mengirimkan panduan kebijakan (*intent-based policy*) ke Near-RT RIC melalui antarmuka **A1**.

### B. Near-Real-Time RIC (Near-RT RIC)
- **Penempatan**: Berada di Edge Cloud / Regional Data Center, dekat dengan node radio O-CU dan O-DU.
- **Siklus Waktu Kontrol**: Loop kontrol cepat (interval waktu antara 10 ms hingga 1000 ms).
- **Aplikasi**: Menjalankan **xApps** (aplikasi real-time untuk load balancing dinamis, kontrol beamforming Massive MIMO, mitigasi interferensi antar-seluler, dan deteksi anomali trafik radio).
- **Interface Utama**:
  - **Antarmuka E2**: Menghubungkan Near-RT RIC langsung ke node radio O-CU-CP, O-CU-UP, dan O-DU untuk mengumpulkan telemetri radio dan mengeksekusi aksi kendali radio secara real-time.
  - **Antarmuka A1**: Menerima kebijakan dan model inferensi AI dari Non-RT RIC.
  - **Antarmuka O1**: Manajemen OAM (operasi, administrasi, pemeliharaan, dan provisioning).

## 4. Ringkasan Struktur Interface O-RAN
- **E2**: Antarmuka kontrol radio real-time (Near-RT RIC $\leftrightarrow$ O-CU / O-DU).
- **A1**: Antarmuka pertukaran kebijakan & ML inference guidance (Non-RT RIC $\leftrightarrow$ Near-RT RIC).
- **O1**: Antarmuka manajemen konfigurasi, fault, dan logging (SMO $\leftrightarrow$ Network Elements).
- **Open Fronthaul (Split 7.2x)**: Antarmuka terbuka antara O-DU dan O-RU.
