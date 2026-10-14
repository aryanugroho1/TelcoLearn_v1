---
topic_key: stn_rach_rar
title: RACH Procedure & Random Access Response (RAR / Msg2) (ShareTechNote Reference)
keywords: rar, cara kerja rar, random access response, rach, msg1, msg2, msg3, msg4, prach, preamble, ra-rnti, timing advance, temp c-rnti, contention resolution, sharetechnote
category: 4g_lte
source_vendor: sharetechnote
doc_type: practical_guide
technology: 4g_lte
summary: Panduan mendalam mekanisme kerja prosedur Random Access (RACH), struktur isi Random Access Response (RAR/Msg2), perhitungan RA-RNTI, Timing Advance, dan Contention Resolution berdasarkan referensi ShareTechNote.
---

# Mekanisme Kerja Random Access Response (RAR / Msg2) (ShareTechNote Practical Reference)

## 1. Latar Belakang Prosedur RACH
Sebelum UE memiliki alokasi kanal dedicated di uplink, UE belum sinkron secara waktu dengan eNodeB/gNodeB akibat penundaan perambatan gelombang radio (*propagation delay*) yang berbeda-beda tergantung jarak UE ke menara seluler. Prosedur RACH berfungsi untuk:
1. Memperoleh **Uplink Timing Alignment** (sinkronisasi waktu pengiriman sinyal uplink).
2. Memperoleh alokasi grant uplink awal (**Initial UL Grant**) untuk mengirim pesan lapisan RRC.

## 2. Msg1: Random Access Preamble (PRACH)
- UE memilih salah satu dari 64 Preamble Sequence yang dikonfigurasi pada SIB2 (Preamble Group A untuk payload pesan kecil, Group B untuk payload besar).
- UE memancarkan preamble pada slot waktu dan alokasi frekuensi PRACH yang valid.
- Pengaturan daya pancar menggunakan algoritma *Power Ramping*:
  $$P_{\text{PRACH}} = \min(P_{\text{CMAX}}, \text{PREAMBLE\_RECEIVED\_TARGET\_POWER} + \text{PL})$$
  *(Jika tidak mendapat balasan, UE menaikkan daya sebesar `powerRampingStep` dB pada percobaan ulang berikutnya).*

## 3. Msg2: Random Access Response (RAR) pada Kanal PDSCH
- **Jendela Penerimaan (Window)**: UE memonitor kanal PDCCH selama interval `ra-ResponseWindowSize` (dimulai 3 subframe setelah transmisi preamble Msg1).
- **Pengalamatan**: UE mencari PDCCH yang dialamatkan menggunakan identitas **RA-RNTI** dengan formula perhitungan:
  $$\text{RA-RNTI} = 1 + t_{id} + 10 \times f_{id}$$
  *(di mana $t_{id}$ adalah indeks subframe pertama PRACH, dan $f_{id}$ adalah indeks frekuensi PRACH).*
- **Struktur Payload MAC RAR**:
  1. **RAPID (Random Access Preamble Identifier - 6 bit)**: Mencocokkan indeks preamble yang dipancarkan UE pada Msg1. Jika nilainya cocok, UE memastikan pesan balasan ini ditujukan untuknya.
  2. **Timing Advance (TA) Command (11 bit)**: Nilai offset waktu yang menginstruksikan modem UE memajukan transmisi uplink agar tiba secara sinkron pada antena penerima eNodeB/gNodeB.
  3. **Initial Uplink Grant (20 bit)**: Alokasi resource block (RB), skema modulasi (MCS), dan hopping flag untuk mentransmisikan pesan Msg3 di kanal PUSCH.
  4. **Temporary C-RNTI (16 bit)**: Alamat identitas radio sementara yang akan digunakan UE sebelum koneksi RRC permanen terbentuk.

## 4. Msg3: Transmisi Terjadwal pada PUSCH
- Menggunakan nilai TA dan UL Grant dari pesan RAR, UE mentransmisikan pesan `RRCConnectionRequest` (LTE) atau `RRCSetupRequest` (5G) di kanal PUSCH.
- Pesan ini menyertakan UE Identity unik (S-TMSI 40-bit atau Random Value 40-bit) yang menjadi acuan penyelesaian konflik tabrakan (*contention resolution*).

## 5. Msg4: Contention Resolution (PDSCH)
- Jika terdapat dua atau lebih UE yang memancarkan preamble yang sama secara simultan, eNodeB/gNodeB membalas dengan Msg4 yang menggemakan kembali (*echo*) UE Contention Resolution Identity dari Msg3.
- UE yang mendeteksi identity miliknya cocok akan mempromosikan Temporary C-RNTI menjadi C-RNTI permanen, sedangkan UE yang tidak cocok akan mundur dan mengulang prosedur RACH setelah jeda *backoff timer*.
