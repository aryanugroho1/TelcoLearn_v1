---
topic_key: 3gpp_rrc_timers_and_rlf
title: 3GPP RRC Timers (T300, T301, T304, T310, T311) & Radio Link Failure (TS 38.331)
source_vendor: 3gpp
doc_type: parameter
technology: 5g_nr
category: 5g_nr
keywords: t300, t301, t304, t310, t311, n310, n311, rlf, radio link failure, out of sync, in sync, rrc setup, handover failure, ts 38.331, rrc reestablishment
summary: Acuan spesifikasi 3GPP TS 38.331 mengenai mekanisme kerja timer radio Layer 3 (T300, T301, T304, T310, T311), konstanta N310/N311, deteksi Radio Link Failure (RLF), dan prosedur re-establishment.
---

### 1. MEKANISME TIMER RRC UTAMA (3GPP TS 38.331)

1. **Timer T300 (RRC Setup Request Timer):**
   * **Start:** UE mengirim pesan ```RRCSetupRequest``` di kanal UL-CCCH.
   * **Stop:** UE menerima pesan ```RRCSetup``` atau ```RRCReject```, atau sel mengalami barring.
   * **Expiry:** UE membatalkan prosedur pendirian koneksi RRC, melaporkan kegagalan ke NAS layer, dan kembali ke state ```RRC_IDLE```.
   * **Rentang Nilai Standar:** 100ms, 200ms, 300ms, 400ms, 600ms, 1000ms, 1500ms, 2000ms (Default rekomendasi: 400ms - 1000ms).

2. **Timer T301 (RRC Reestablishment Request Timer):**
   * **Start:** UE mengirim pesan ```RRCReestablishmentRequest``` setelah terjadi RLF.
   * **Stop:** UE menerima pesan ```RRCReestablishment``` atau ```RRCReestablishmentReject```, atau sel yang dipilih tidak memiliki konteks UE.
   * **Expiry:** UE langsung jatuh ke state ```RRC_IDLE``` dan memutus sesi user plane aktif.
   * **Rentang Nilai Standar:** 100ms s/d 2000ms (Default rekomendasi: 400ms).

3. **Timer T304 (Handover Execution Timer):**
   * **Start:** UE menerima pesan ```RRCReconfiguration``` yang membawa elemen informasi *mobilityControlInfo* / *reconfigurationWithSync* (perintah Handover ke target cell).
   * **Stop:** UE berhasil menyelesaikan prosedur Random Access (RACH) ke sel target dan mengirim pesan ```RRCReconfigurationComplete```.
   * **Expiry:** Terjadi *Handover Failure*. UE memicu prosedur pemulihan koneksi RRC (mengaktifkan timer T311 dan mencari sel terbaik untuk re-establishment).
   * **Rentang Nilai Standar:** 50ms, 100ms, 150ms, 200ms, 500ms, 1000ms, 2000ms (Default: 500ms - 1000ms).

4. **Timer T310 (Radio Link Failure Detection Timer):**
   * **Start:** Layer Fisik (L1) UE mendeteksi sinyal downlink (PDCCH BLER > threshold Qout) dan mengirimkan indikasi *Out-Of-Sync (OOS)* berturut-turut sebanyak konstanta **N310** kali ke RRC layer.
   * **Stop:** L1 UE mendeteksi sinyal pulih (PDCCH BLER < threshold Qin) dan mengirimkan indikasi *In-Sync (IS)* berturut-turut sebanyak konstanta **N311** kali, atau ketika prosedur handover dipicu.
   * **Expiry:** Terjadi **Radio Link Failure (RLF)** resmi. UE menghentikan semua transmisi radio uplink, mengaktifkan timer **T311**, dan memulai pencarian sel (*Cell Selection*) untuk re-establishment.
   * **Rentang Nilai Standar:** 0ms, 50ms, 100ms, 200ms, 500ms, 1000ms, 2000ms (Default operator: 1000ms).

5. **Timer T311 (Cell Selection for Re-establishment Timer):**
   * **Start:** Dipicu saat terjadi RLF (T310 expiry), Integrity Check Failure, atau Handover Failure (T304 expiry).
   * **Stop:** UE berhasil menemukan sel kandidat yang memenuhi kriteria seleksi sel (S-criteria) pada RAT yang sama.
   * **Expiry:** UE gagal menemukan sel pemulihan dalam batas waktu. UE melepaskan semua radio bearer dan beralih ke state ```RRC_IDLE```.
   * **Rentang Nilai Standar:** 1000ms, 3000ms, 5000ms, 10000ms, 30000ms (Default: 3000ms - 5000ms).

---

### 2. KONSTANTA FILTER FISIK (N310 & N311)
* **N310:** Jumlah berturut-turut indikasi *Out-Of-Sync* dari L1 untuk menyalakan T310. Pilihan nilai: n1, n2, n3, n4, n6, n8, n10, n20 (Default: n2 atau n6).
* **N311:** Jumlah berturut-turut indikasi *In-Sync* dari L1 untuk menghentikan dan mereset T310 sebelum habis. Pilihan nilai: n1, n2, n3, n4, n5, n6, n8, n10 (Default: n1 atau n2).

---

### 3. AKAR PENYEBAB & TRIAGE LAPANGAN (DRIVE TEST / QXDM)
1. **Drop Call Tanpa RRC Release:** Jika di log radio UE mengalami T310 expiry diikuti T311 expiry tanpa pernah menerima pesan ```RRCRelease``` dari base station, ini murni disebabkan oleh *coverage hole*, deep fading di terowongan/lift, atau *pilot pollution* berat di mana SINR drop ke bawah -6 dB secara mendadak.
2. **Handover Drop (T304 Expiry):** Jika T304 habis, periksa apakah target PCI mengalami *PCI confusion/collision*, azimuth target antena salah arah (*cross-feeder*), atau parameter Timing Advance (TA) tidak sinkron saat Random Access Preamble (Msg1) dikirim.
