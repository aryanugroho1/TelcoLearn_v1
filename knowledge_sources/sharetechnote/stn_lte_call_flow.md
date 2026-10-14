---
topic_key: stn_lte_call_flow
title: LTE Call Flow & Initial Attach Procedure (ShareTechNote Reference)
keywords: lte call flow, call flow lte, attach, initial attach, callflow lte, lte attach, s1ap, rrcconnectionsetup, default eps bearer, nas attach, sharetechnote
category: 4g_lte
source_vendor: sharetechnote
doc_type: practical_guide
technology: 4g_lte
summary: Panduan alur lengkap prosedur Initial Attach LTE dari sinkronisasi sinyal, RACH, koneksi RRC, otentikasi NAS, hingga pendirian Default EPS Bearer berdasarkan referensi ShareTechNote.
---

# Prosedur Lengkap LTE Call Flow & Initial Attach (ShareTechNote Practical Reference)

## 1. Sinkronisasi Sel & System Information (Layer 1 / Layer 2)
- **Cell Search**: UE melakukan pemindaian pita RF dan sinkronisasi frekuensi/waktu melalui sinyal PSS (Primary Synchronization Signal) dan SSS (Secondary Synchronization Signal) untuk mendapatkan Physical Cell ID (PCI).
- **PBCH & MIB**: UE membaca Physical Broadcast Channel (PBCH) untuk mendecode Master Information Block (MIB). MIB membawa lebar pita downlink (`dl-Bandwidth`: 1.4, 3, 5, 10, 15, atau 20 MHz / 6 - 100 Resource Block), konfigurasi PHICH, dan System Frame Number (SFN).
- **PDSCH & SIBs**: UE membaca PDCCH dengan SI-RNTI (0xFFFF) untuk menjadwalkan pembacaan SIB1 (Cell ID global, TAC, batas daya minimum `q-RxLevMin`) dan SIB2 (parameter radio & konfigurasi PRACH root sequence).

## 2. Prosedur Random Access (RACH / Uplink Sync)
- **Msg1 (PRACH Preamble)**: UE memilih salah satu dari 64 preamble sequence yang tersedia dan mengirimkannya pada resource waktu/frekuensi PRACH yang telah dialokasikan.
- **Msg2 (Random Access Response / RAR)**: eNodeB membalas melalui kanal PDSCH yang dialamatkan ke RA-RNTI. RAR membawa Timing Advance (TA) command 11-bit untuk mengoreksi penundaan propagasi, alokasi Initial Uplink Grant (20-bit), dan Temporary C-RNTI (TC-RNTI).

## 3. RRC Connection Establishment
- **Msg3 (RRCConnectionRequest)**: UE mengirimkan pesan RRCConnectionRequest di kanal UL CCCH / PUSCH menggunakan UL Grant dari RAR. Menyertakan `ue-Identity` (S-TMSI atau nilai acak 40-bit) dan `establishmentCause` (misalnya: `mo-Signalling` atau `mo-Data`).
- **Msg4 (RRCConnectionSetup)**: eNodeB mengirimkan RRCConnectionSetup di kanal DL CCCH / PDSCH. Mendirikan Signaling Radio Bearer 1 (SRB1) dan mengonfirmasi penetapan C-RNTI permanen (Contention Resolution).
- **Msg5 (RRCConnectionSetupComplete)**: UE membalas dengan RRCConnectionSetupComplete di kanal UL DCCH (SRB1), yang membungkus (*piggybacked*) pesan NAS: **Attach Request** + **PDN Connectivity Request**.

## 4. Koneksi ke EPC (S1AP & Otentikasi)
- eNodeB meneruskan pesan NAS ke MME melalui interface S1-MME menggunakan pesan S1AP: `INITIAL UE MESSAGE`.
- MME melakukan `Identity Request` (bila diperlukan) dan mengambil Authentication Vectors (RAND, AUTN, KASME, XRES) dari HSS.
- MME mengirim `Authentication Request` (RAND & AUTN) ke UE. UE memverifikasi AUTN (otentikasi jaringan anti-spoofing) dan membalas dengan `Authentication Response` (RES).
- MME mengirim `Security Mode Command` (menetapkan algoritma enkripsi EEA dan integritas EIA) -> UE membalas dengan `Security Mode Complete`.

## 5. AS Security & UE Capability
- eNodeB mengirim `SecurityModeCommand` (Access Stratum ciphering & integrity) -> UE membalas `SecurityModeComplete`.
- eNodeB mengirim `UECapabilityEnquiry` (E-UTRA, UTRA) -> UE membalas `UECapabilityInformation` (daftar frekuensi band didukung, kapabilitas MIMO, kombinasi Carrier Aggregation).

## 6. Pendirian Default EPS Bearer & User Plane
- MME mengirim `Create Session Request` ke S-GW/P-GW via interface S11/S5/S8 untuk mengalokasikan alamat IP UE dan TEID GTP-U.
- MME mengirim S1AP: `INITIAL CONTEXT SETUP REQUEST` ke eNodeB, membungkus pesan NAS: `Attach Accept` + `Activate Default EPS Bearer Context Request`.
- eNodeB mengirim `RRCConnectionReconfiguration` ke UE di kanal DL DCCH. Berisi konfigurasi Data Radio Bearer (DRB1) dan dedicated radio resources.
- UE mengalokasikan DRB1 dan membalas `RRCConnectionReconfigurationComplete`.
- eNodeB mengirim S1AP: `INITIAL CONTEXT SETUP RESPONSE` ke MME (menyertakan Downlink TEID GTP-U eNodeB).
- UE mengirim NAS `Attach Complete` + `Activate Default EPS Bearer Context Accept`.
- Tunnel GTP-U User Plane aktif dua arah dan UE terhubung penuh ke internet/layanan data.
