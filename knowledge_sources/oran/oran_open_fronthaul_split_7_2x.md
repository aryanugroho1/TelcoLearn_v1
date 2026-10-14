---
topic_key: oran_open_fronthaul_split_7_2x
title: O-RAN Open Fronthaul Interface Specification (Split 7.2x - WG4)
source_vendor: o_ran
doc_type: architecture
technology: o_ran
category: o_ran
keywords: o-ran, fronthaul, 7.2x, split 7.2x, o-du, o-ru, ecpri, c-plane, u-plane, s-plane, m-plane, ieee 1588, ptp, synce, bfp, beamforming weights
summary: Spesifikasi mendalam antarmuka Open Fronthaul O-RAN 7.2x (WG4), pembagian fungsi antara O-DU dan O-RU, serta 4 bidang transmisi (C-Plane, U-Plane, S-Plane, M-Plane).
---

### 1. ARSITEKTUR FUNCTIONAL SPLIT 7.2x (O-RAN WG4)

O-RAN Alliance Working Group 4 (WG4) membakukan antarmuka **Open Fronthaul** dengan membagi Layer Fisik (PHY) antara **O-DU (O-RAN Distributed Unit)** dan **O-RU (O-RAN Radio Unit)** pada titik **Split 7.2x**:

* **O-DU (High-PHY Layer):**
  * Bertanggung jawab atas: FEC Encoding/Decoding (LDPC untuk data, Polar untuk signaling), Scrambling, Modulation/Demodulation (QPSK s/d 256-QAM), Layer Mapping, dan kalkulasi bobot beamforming (*Digital Beamforming Weight Calculation*).
* **O-RU (Low-PHY Layer & Analog Radio):**
  * Bertanggung jawab atas: Penerapan bobot beamforming (*Digital Beamforming Application*), FFT/IFFT (Fast Fourier Transform), Penambahan/Pembuangan Cyclic Prefix (CP), konversi Digital-to-Analog (DAC/ADC), Power Amplifier (PA), dan filter RF antena.
* **Keunggulan Split 7.2x:**
  * Menekan kebutuhan bandwidth transmisi kabel optik fronthaul secara dramatis dibandingkan antarmuka tradisional CPRI (Common Public Radio Interface Option 8).
  * Menjadikan perangkat radio (O-RU) lebih ringan, hemat daya, dan multi-vendor interoperable.

---

### 2. EMPAT BIDANG PROTOKOL TRANSMISI (THE 4 PLANES)

Antarmuka Open Fronthaul 7.2x beroperasi di atas protokol **eCPRI (Enhanced CPRI)** atau **IEEE 1914.3 (RoE)** melalui 4 bidang terpisah:

1. **Control Plane (C-Plane):**
   * Mentransmisikan instruksi scheduling real-time dari O-DU ke O-RU.
   * Berisi informasi penempatan Resource Element (RE), alokasi slot OFDM, beam ID, dan bobot beamforming (*Beamforming Section Extensions 1, 2, 3, 4, 5*).
2. **User Plane (U-Plane):**
   * Mentransmisikan sampel domain frekuensi In-phase dan Quadrature (**IQ data**) untuk downlink dan uplink.
   * Menggunakan kompresi data IQ cerdas: **BFP (Block Floating Point)** (misal kompresi 9-bit atau 12-bit) untuk menghemat kapasitas link optik 10G/25G.
3. **Synchronization Plane (S-Plane):**
   * Menjamin sinkronisasi waktu dan fase super-ketat antar sel radio (toleransi deviasi waktu maksimum: **$\pm$ 1.5 microsecond** untuk TDD dan MIMO).
   * Standar acuan: **IEEE 1588v2 Precision Time Protocol (PTP)** profil telekomunikasi (G.8275.1) dikombinasikan dengan **SyncE (Synchronous Ethernet)**.
4. **Management Plane (M-Plane):**
   * Mengelola konfigurasi perangkat, software download/upgrade firmware, serta alarm dan pemantauan temperatur/VSWR O-RU.
   * Protokol acuan: **NETCONF / YANG Data Model** berbasis SSH.

---

### 3. FRONTHAUL DEPLOYMENT & TROUBLESHOOTING CHECKLIST
* **SFP Link Down:** Pastikan modul transceiver optik SFP28 (25 Gbps) mendukung panjang gelombang (wavelength) CWDM/DWDM yang tepat dan tidak ada tekukan (*macro-bend*) pada kabel fiber optik.
* **Sync Loss Alarm (S-Plane Alarm):** Jika O-RU mematikan transmisi radio RF (*RF mute*), periksa apakah status clock PTP berstatus `LOCKED` terhadap Grandmaster Clock (G.8275.1 Telecom Profile).
* **High Packet Loss eCPRI:** Periksa jitter antrian buffer pada switch fronthaul TSN (Time-Sensitive Networking) jika utilisasi bandwidth melebihi ambang batas.
