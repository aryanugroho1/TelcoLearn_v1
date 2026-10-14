---
topic_key: stn_ue_signal_acquisition
title: UE Signal Acquisition & Cell Search Procedure (ShareTechNote Reference)
keywords: ue signal acquisition, signal acquisition, cell search, akuisisi sinyal, pss, sss, pci, pbch, mib, sib1, ssb, initial access, s-criteria, sharetechnote
category: 4g_lte
source_vendor: sharetechnote
doc_type: practical_guide
technology: 4g_lte
summary: Panduan tahapan akuisisi sinyal UE dari deteksi PSS/SSS, kalkulasi Physical Cell ID (PCI), decoding PBCH/MIB, hingga pembacaan SIB1 dan evaluasi kriteria seleksi sel (S-Criteria) berdasarkan referensi ShareTechNote.
---

# Prosedur UE Signal Acquisition & Cell Search (ShareTechNote Practical Reference)

## 1. Deteksi Frekuensi & Timing via PSS (Primary Synchronization Signal)
- Saat UE baru dinyalakan atau keluar dari mode Airplane, UE memindai pita frekuensi RF yang didukung dan mencari sinyal PSS pada 62 subcarrier tengah (72 subcarrier / 6 Resource Block).
- PSS menggunakan Zadoff-Chu sequence di domain frekuensi dengan 3 kemungkinan nilai Physical Layer Identity: $N_{ID}^{(2)}$ (bernilai 0, 1, atau 2).
- **Hasil Deteksi PSS**: UE mengunci simbol timing subframe 5 ms (half-frame timing) dan frekuensi carrier (koreksi frequency offset dan Doppler shift).

## 2. Deteksi Frame Timing & Identitas Sel via SSS (Secondary Synchronization Signal)
- SSS terletak bersebelahan dengan PSS (pada slot 0 dan slot 10 untuk sistem LTE FDD).
- SSS menggunakan m-sequence biner yang menghasilkan Physical Layer Cell Identity Group: $N_{ID}^{(1)}$ (bernilai 0 hingga 167 untuk LTE, menghasilkan total 168 grup sel).
- **Kalkulasi PCI (Physical Cell ID)**:
  $$\text{PCI} = 3 \times N_{ID}^{(1)} + N_{ID}^{(2)}$$
  *(Rentang nilai PCI: 0 hingga 503 di 4G LTE; 0 hingga 1007 di 5G NR).*
- **Hasil Deteksi SSS**: UE memperoleh batas radio frame 10 ms penuh serta mendeteksi mode duplexing (FDD vs TDD).

## 3. Decoding Master Information Block (MIB) pada Kanal PBCH
- Setelah PCI diketahui, UE dapat mendeteksi pola referensi Cell-Specific Reference Signals (CRS di LTE) atau Demodulation Reference Signals (DMRS di 5G).
- UE membaca kanal PBCH (Physical Broadcast Channel) yang ditransmisikan setiap 40 ms (subframe 0 radio frame).
- Parameter krusial yang diperoleh dari MIB:
  - `dl-Bandwidth`: Lebar pita transmisi sel (1.4, 3, 5, 10, 15, atau 20 MHz / 6 hingga 100 RB).
  - `phich-Config`: Konfigurasi durasi dan alokasi resource kanal PHICH.
  - `systemFrameNumber (SFN)`: 8-bit MSB dari SFN (2-bit LSB dideteksi secara blind dari repetisi 40 ms TTI).

## 4. Acquisition System Information Block 1 (SIB1) pada Kanal PDSCH
- UE memonitor kanal kontrol PDCCH yang di-scramble dengan identitas SI-RNTI (`0xFFFF`) pada Common Search Space.
- PDCCH memberikan Downlink Control Information (DCI Format 1A/1C) yang mengarahkan alokasi resource block PDSCH tempat SIB1 berada.
- Informasi penting di dalam SIB1:
  - `plmn-IdentityList`: Daftar operator seluler yang dilayani oleh sel.
  - `trackingAreaCode (TAC)`: Kode area pelacakan UE.
  - `cellIdentity`: Identitas sel 28-bit global (ECGI).
  - `q-RxLevMin` & `q-RxLevMinOffset`: Parameter batas daya minimum penerimaan sinyal sel.

## 5. Evaluasi Cell Selection Criteria (S-Criteria)
- UE menghitung kelayakan sinyal sel dengan formula matematis 3GPP S-criteria:
  $$S_{rxlev} = Q_{rxlevmeas} - (Q_{rxlevmin} + Q_{rxlevminoffset}) - P_{compensation}$$
- Jika $S_{rxlev} > 0$ dan parameter `cellBarred` bernilai `false`, sel dinyatakan **LAYAK (Suitable Cell)**.
- UE mengunci sel (*camp on*), membaca SIB2 untuk parameter PRACH, dan siap memulai prosedur Random Access (RACH).
