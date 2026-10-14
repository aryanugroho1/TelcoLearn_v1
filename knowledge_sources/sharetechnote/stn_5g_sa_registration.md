---
topic_key: stn_5g_sa_registration
title: 5G SA Initial Registration & SUCI / SUPI Authentication Flow (ShareTechNote Reference)
keywords: 5g sa registration, 5g registration, suci, supi, ausf, udm, amf, 5gmm, nas registration, 5g standalone registration, ecies, 5g-aka, sharetechnote
category: 5g_nr
source_vendor: sharetechnote
doc_type: practical_guide
technology: 5g_nr
summary: Panduan prosedur registrasi awal 5G Standalone (3GPP TS 23.502), enkripsi privasi identitas SUCI menggunakan ECIES, otentikasi 5G-AKA via AUSF/UDM, dan setup Security Mode berdasarkan referensi ShareTechNote.
---

# Alur Registrasi Awal 5G Standalone (SA) (ShareTechNote Practical Reference)

## 1. Enkripsi Identitas SUPI ke SUCI (Privacy Protection)
- Pada arsitektur 5G SA (Stand-Alone), identitas permanen pelanggan (IMSI / SUPI - Subscription Permanent Identifier) tidak pernah dikirim dalam bentuk teks terbuka (*plaintext*) melalui udara guna mencegah serangan intersepsi *IMSI-catcher*.
- Modem / USIM ponsel mengenkripsi nilai SUPI menjadi **SUCI (Subscription Concealed Identifier)** menggunakan algoritma kriptografi kurva eliptik **ECIES** dengan kunci publik jaringan asal (*Home Network Public Key / HN-PK*).

## 2. Alur Pensinyalan Registrasi 5G SA Step-by-Step
1. **Step 1 (RRC Setup)**: UE mengirim pesan `RRCSetupRequest` $\rightarrow$ gNodeB membalas dengan `RRCSetup`.
2. **Step 2 (NAS Registration Request)**: UE mengirim `RRCSetupComplete` yang membungkus pesan NAS: **Registration Request** (menyertakan SUCI, 5GS Registration Type, 5GMM capability, dan Requested NSSAI).
3. **Step 3 (N2 NGAP Initial UE Message)**: gNodeB memilih AMF dan meneruskan pesan via antarmuka NG-C (N2) menggunakan pesan NGAP: `INITIAL UE MESSAGE`.
4. **Step 4 (N12 Auth Request)**: AMF mengekstrak SUCI dan meneruskannya ke AUSF melalui interface N12 (`Nausf_UEAuthentication_Authenticate Request`).
5. **Step 5 (N13 De-concealment & Vectors)**: AUSF meminta verifikasi ke UDM via interface N13 (`Nudm_UEAuthentication_Get Request`). UDM mendekripsi SUCI menjadi SUPI asli menggunakan Private Key dan menghasilkan 5G-AKA Authentication Vectors (RAND, AUTN, HXRES*).
6. **Step 6 (NAS Auth Request)**: AMF mengirim pesan NAS: `Authentication Request` (membawa parameter tantangan RAND & AUTN) ke UE.
7. **Step 7 (USIM Verification & RES*)**: Kartu USIM UE memverifikasi keabsahan AUTN. Jika valid, UE menghitung respon kriptografi `RES*` dan membalas dengan `Authentication Response` (RES*).
8. **Step 8 (Auth Confirmation)**: AMF memverifikasi nilai `RES*`. Jika cocok, proses otentikasi pelanggan dinyatakan sukses.
9. **Step 9 (NAS Security Mode)**: AMF mengirim pesan NAS: `Security Mode Command` (memilih algoritma integritas 128-bit NIA dan enkripsi 128-bit NEA).
10. **Step 10 (Security Complete)**: UE membalas dengan pesan `Security Mode Complete`.
11. **Step 11 (Registration Accept)**: AMF mendaftarkan konteks mobilitas UE ke UDM via interface N10 dan mengirimkan pesan NAS: `Registration Accept` (memberikan alokasi identitas sementara 5G-GUTI, daftar TAI List, dan Allowed NSSAI slice).
12. **Step 12 (Registration Complete)**: UE membalas dengan `Registration Complete` dan sesi komunikasi 5G SA siap digunakan.
