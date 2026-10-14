---
topic_key: 3gpp_modulation_mcs_cqi_link_adaptation
title: 3GPP Radio Modulation, MCS Tables, CQI Mapping & Outer Loop Link Adaptation (TS 38.214)
source_vendor: 3gpp
doc_type: parameter
technology: 5g_nr
category: 5g_nr
keywords: mcs, modulation, cqi, qpsk, 16qam, 64qam, 256qam, bler, olla, link adaptation, table mcs, ts 38.214, throughput drop, spectral efficiency
summary: Acuan spesifikasi 3GPP TS 38.214 mengenai tabel MCS, modulasi digital (QPSK s/d 256-QAM), pelaporan CQI (1-15), algoritma Link Adaptation (OLLA), dan troubleshooting throughput rendah pada RSRP bagus.
---

### 1. SKEMA MODULASI DIGITAL RADIO SELULER

Jumlah bit data yang dapat dibawa per Resource Element (RE) pada subcarrier OFDM ditentukan oleh skema modulasi:
* **QPSK (Quadrature Phase Shift Keying):** Membawa **2 bit/simbol**. Tahan terhadap interferensi tinggi (SINR rendah: -6 dB s/d 3 dB).
* **16-QAM:** Membawa **4 bit/simbol**. Efisiensi menengah (SINR: 3 dB s/d 10 dB).
* **64-QAM:** Membawa **6 bit/simbol**. Efisiensi tinggi (SINR: 10 dB s/d 18 dB).
* **256-QAM:** Membawa **8 bit/simbol**. Efisiensi maksimum pada kondisi kanal sangat jernih (SINR > 20 dB, RSRP > -80 dBm, Line-of-Sight).

---

### 2. TABEL MCS 3GPP TS 38.214 (DOWNLINK PDSCH TABLE 2 - 256-QAM)

Scheduler gNodeB menentukan nilai **Modulation and Coding Scheme (MCS Index)** berdasarkan laporan Channel Quality Indicator (CQI) dari UE:

| MCS Index ($I_{MCS}$) | Skema Modulasi | Target Code Rate ($R \times 1024$) | Spectral Efficiency (bit/s/Hz) |
| :---: | :---: | :---: | :---: |
| **0** | QPSK | 120 | 0.2344 |
| **4** | QPSK | 608 | 1.1875 |
| **5** | 16-QAM | 378 | 1.4766 |
| **10** | 16-QAM | 658 | 2.5703 |
| **11** | 64-QAM | 466 | 2.7305 |
| **19** | 64-QAM | 873 | 5.1152 |
| **20** | 256-QAM | 682.5 | 5.3320 |
| **27** | 256-QAM | 948 | 7.4063 |
| **28** | reserved | - | qam256 retransmission |

---

### 3. RELASI CQI DENGAN MCS
* **CQI (Channel Quality Indicator):** Nilai integer 4-bit (1 hingga 15) yang dikirimkan UE via PUCCH/PUSCH ke gNodeB.
* Laporan CQI mewakili kondisi kanal terbaik di mana UE mampu mendekode blok transport dengan **Block Error Rate (BLER) tidak melebihi 10%**.
* Jika CQI = 15, base station dapat mengalokasikan MCS 27 (256-QAM penuh).
* Jika CQI = 1–3, base station terpaksa menurunkan modulasi ke QPSK demi mencegah kegagalan transmisi.

---

### 4. OUTER LOOP LINK ADAPTATION (OLLA) & ROOT CAUSE THROUGHPUT LEMOT
* **Algoritma OLLA:** Algoritma penyesuaian dinamis di base station yang memonitor umpan balik HARQ ACK/NACK:
  * Setiap menerima **ACK**, nilai offset dinaikkan sedikit: $\Delta_{up} = \text{StepSize} \times \frac{BLER_{target}}{1 - BLER_{target}}$.
  * Setiap menerima **NACK**, nilai offset diturunkan tajam: $\Delta_{down} = \text{StepSize}$.
  * Target BLER transmisi awal dipertahankan pada **10%**.

#### Investigasi Kasus: RSRP Bagus (-75 dBm) Tapi Throughput Sangat Rendah
1. **Pilot Pollution & SINR Drop:** Beberapa sel memancarkan daya setara sehingga saling menginterferensi. Nilai SINR anjlok ke < 0 dB, memaksa CQI jatuh ke rank 1-3 (QPSK).
2. **Rank Indicator (RI) Drop:** Kanal radio mengalami *high correlation* (tidak ada hamburan multipath), menyebabkan MIMO 4x4 drop menjadi Rank 1 (Single Layer).
3. **High Block Error Rate (BLER > 30%):** Terjadi banyak retransmisi HARQ level fisik yang menghabiskan alokasi resource block.
4. **Alokasi PRB Terbatas:** Sel sedang mengalami kongesti trafik pengguna lain (PRB utilization > 90%).
