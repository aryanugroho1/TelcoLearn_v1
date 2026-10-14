---
topic_key: 3gpp_5g_nas_cause_codes
title: 3GPP 5G NAS Protocol Reject Cause Codes (5GMM & 5GSM - TS 24.501)
source_vendor: 3gpp
doc_type: alarm_triage
technology: 5gc
category: protocol_qa
keywords: 5gmm cause, 5gsm cause, nas reject, plmn not allowed, fplmn, cause 11, cause 27, cause 31, waittime, rrcconnectionreject, registration reject, pdu session reject
summary: Acuan spesifikasi 3GPP TS 24.501 mengenai katalog cause code penolakan protokol NAS 5G Core (5GMM & 5GSM), dampak pada USIM FPLMN, dan checklist investigasi log modem/OTA.
---

### 1. 5GMM CAUSE CODES (5G MOBILITY MANAGEMENT - REGISTRATION REJECT)

Ketika AMF (*Access and Mobility Management Function*) menolak permintaan registrasi UE via pesan ```Registration Reject```, AMF menyertakan nilai 5GMM Cause Code:

1. **5GMM Cause #11 (PLMN Not Allowed):**
   * **Mekanisme 3GPP:** Core network menolak UE karena PLMN ID (MCC-MNC) yang dituju tidak ada dalam perjanjian roaming komersial atau dilarang untuk SIM card tersebut.
   * **Dampak USIM:** UE **wajib menulis PLMN ID tersebut ke dalam daftar Forbidden PLMN (FPLMN)** pada kartu USIM. UE tidak akan mencoba attach kembali ke PLMN tersebut secara otomatis sampai ponsel di-restart, mode pesawat diaktifkan, atau USIM diganti.
   * **Dampak Radio:** Base station mengirimkan ```RRCConnectionReject``` disertai parameter ```waitTime``` (misal 16 detik) untuk meredam banjir signaling di kanal PRACH.
   * **Langkah Triage:** Verifikasi IMSI profil pelanggan di UDM/HSS, periksa apakah MCC/MNC sel broadcast (SIB1) sesuai dengan SIM profile, atau cek konfigurasi Roaming Steering.

2. **5GMM Cause #3 (Illegal UE):**
   * **Mekanisme:** Otentikasi USIM gagal secara permanen (kegagalan verifikasi RES* vs XRES* di AUSF/UDM) atau IMEI perangkat terdaftar dalam *EIR Blacklist* (stolen device).

3. **5GMM Cause #7 (5GS Services Not Allowed):**
   * **Mekanisme:** Pelanggan tidak memiliki paket data 5G aktif. UE diperintahkan untuk beralih dan mendaftar hanya di jaringan 4G EPC.

4. **5GMM Cause #27 (N1 Mode Not Allowed):**
   * **Mekanisme:** Sel radio 5G melarang koneksi N1 mode mandiri (misal: jaringan beroperasi dalam mode 5G NSA Option 3x sehingga UE harus attach via LTE Anchor eNB, bukan via 5G SA gNB).

5. **5GMM Cause #31 (Redirection to EPC Required):**
   * **Mekanisme:** Jaringan mengarahkan UE untuk segera fallback ke 4G EPC untuk layanan data atau panggilan suara VoLTE (EPS Fallback).

---

### 2. 5GSM CAUSE CODES (5G SESSION MANAGEMENT - PDU SESSION REJECT)

Ketika SMF (*Session Management Function*) menolak pendirian sesi data internet pengguna:

1. **5GSM Cause #27 (Missing or Unknown DNN):**
   * **Penyebab:** *Data Network Name (DNN)* / APN yang dikirim oleh UE pada pesan ```PDU Session Establishment Request``` tidak terdaftar pada profil langganan SIM di UDM atau tidak dikonfigurasi di SMF/UPF.
   * **Solusi Lapangan:** Samakan konfigurasi APN di menu pengaturan ponsel (misal: `internet`, `telkomsel`, atau `indosatgprs`) dengan DNS/DNN yang disetujui di SMF.

2. **5GSM Cause #26 (Insufficient Resources):**
   * **Penyebab:** Terjadi kongesti kapasitas bandwidth di UPF, lisensi sesi data penuh, atau alokasi IP pool (IPv4/IPv6) di SMF telah habis.

3. **5GSM Cause #28 (Unknown PDU Session Type):**
   * **Penyebab:** UE meminta tipe sesi yang tidak didukung oleh jaringan (misal: UE meminta *Ethernet / Unstructured* sementara UPF hanya mendukung tipe *IPv4v6*).

---

### 3. PROTOCOL LOG ANALYSIS CHEATSHEET (QXDM / SHANNON / WIRESHARK)
* Cari paket log ID:
  * **0xB801:** *5G NR NAS Signaling Messages*
  * **0xB821:** *5G NR RRC OTA Messages*
* Jika muncul rantai:
  ```text
  UE  --> Registration Request (0xB801)
  NW  <-- Registration Reject (5GMM Cause = 11)
  gNB <-- RRCConnectionReject (waitTime = 16s)
  ```
  Ini adalah pola klasik USIM dilarang roaming / salah PLMN TAC.
