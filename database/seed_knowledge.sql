-- SEED KNOWLEDGE BASE SHARETECHNOTE (Hybrid RAG)
-- Mengkompilasi konsep mendalam, urutan call flow, radio channel, timers & IE
-- Berdasarkan referensi terpercaya https://www.sharetechnote.com (4G LTE, 5G NR, O-RAN)

INSERT OR REPLACE INTO knowledge_base (topic_key, title, keywords, category, summary, core_content)
VALUES
(
    'lte_call_flow',
    'LTE Call Flow & Initial Attach Procedure (3GPP Rel-8/14)',
    'lte call flow, call flow lte, attach, initial attach, callflow lte, lte attach, s1ap, rrcconnectionsetup, default eps bearer, nas attach',
    '4g_lte',
    'Alur lengkap prosedur Initial Attach LTE dari sinkronisasi sinyal, RACH, koneksi RRC, otentikasi NAS, hingga pendirian Default EPS Bearer.',
    'PROSEDUR LENGKAP LTE CALL FLOW & INITIAL ATTACH (SHARETECHNOTE REFERENCE):

1. SINKRONISASI SEL & SYSTEM INFORMATION (Layer 1 / Layer 2):
- UE melakukan Cell Search melalui PSS/SSS untuk mendapatkan PCI dan timing slot/frame.
- UE membaca PBCH (Master Information Block / MIB) untuk mendapatkan bandwidth transmisi (DL BW: 6-100 RB) dan konfigurasi PHICH.
- UE membaca PDSCH dengan SI-RNTI untuk menjadwalkan SIB1 (Cell ID, TAC, q-RxLevMin) dan SIB2 (parameter radio & PRACH root sequence).

2. RANDOM ACCESS PROCEDURE (RACH / Uplink Sync):
- Msg1: UE mengirim Random Access Preamble di kanal PRACH menggunakan konfigurasi preamble index dari SIB2.
- Msg2: eNB membalas dengan Random Access Response (RAR) di PDSCH yang dialamatkan ke RA-RNTI. RAR berisi Timing Advance (TA) command 11-bit, Uplink Grant 20-bit, dan Temporary C-RNTI (TC-RNTI).

3. RRC CONNECTION ESTABLISHMENT:
- Msg3: UE mengirim "RRCConnectionRequest" di kanal UL CCCH / PUSCH menggunakan alokasi UL Grant dari RAR. Menyertakan ue-Identity (S-TMSI atau Random Value 40-bit) dan establishmentCause (misal: mo-Signalling).
- Msg4: eNB mengirim "RRCConnectionSetup" di kanal DL CCCH / PDSCH. Mendirikan Signaling Radio Bearer 1 (SRB1) dan mengonfirmasi C-RNTI permanen (Contention Resolution).
- Msg5: UE membalas "RRCConnectionSetupComplete" di kanal UL DCCH (SRB1), yang membungkus piggybacked NAS message: "Attach Request" + "PDN Connectivity Request".

4. KONEKSI KE EPC (S1AP & OTENTIKASI):
- eNB meneruskan pesan NAS ke MME melalui S1AP: "INITIAL UE MESSAGE".
- MME melakukan Identity Request (jika diperlukan) dan mengambil Authentication Vectors dari HSS.
- MME mengirim "Authentication Request" (RAND & AUTN) ke UE -> UE memverifikasi AUTN (anti-replay/network auth) dan membalas "Authentication Response" (RES).
- MME mengirim "Security Mode Command" (algoritma enkripsi & integritas EEA/EIA) -> UE membalas "Security Mode Complete".

5. AS SECURITY & UE CAPABILITY:
- eNB mengirim "SecurityModeCommand" (Access Stratum ciphering & integrity) -> UE membalas "SecurityModeComplete".
- eNB mengirim "UECapabilityEnquiry" (E-UTRA, UTRA) -> UE membalas "UECapabilityInformation" (daftar band didukung, MIMO capability, CA combinations).

6. PENDIRIAN DEFAULT EPS BEARER & USER PLANE:
- MME mengirim "Create Session Request" ke S-GW/P-GW via interface S11/S5/S8 untuk mengalokasikan IP address UE dan TEID GTP-U.
- MME mengirim S1AP: "INITIAL CONTEXT SETUP REQUEST" ke eNB, membungkus "Attach Accept" + "Activate Default EPS Bearer Context Request".
- eNB mengirim "RRCConnectionReconfiguration" ke UE di kanal DL DCCH. Berisi konfigurasi Data Radio Bearer (DRB1) dan radio resource dedicated.
- UE mengalokasikan DRB1 dan membalas "RRCConnectionReconfigurationComplete".
- eNB mengirim S1AP: "INITIAL CONTEXT SETUP RESPONSE" ke MME (menyertakan Downlink TEID GTP-U eNB).
- UE mengirim NAS "Attach Complete" + "Activate Default EPS Bearer Context Accept".
- Aliran paket data IP (User Plane) aktif dua arah!'
),
(
    'ue_signal_acquisition',
    'UE Signal Acquisition & Cell Search Procedure (LTE & 5G NR)',
    'ue signal acquisition, signal acquisition, cell search, akuisisi sinyal, pss, sss, pci, pbch, mib, sib1, ssb, initial access',
    '4g_lte',
    'Tahapan akuisisi sinyal UE dari deteksi PSS/SSS, kalkulasi Physical Cell ID (PCI), decoding PBCH/MIB, hingga pembacaan SIB1 dan evaluasi kriteria seleksi sel (S-Criteria).',
    'PROSEDUR UE SIGNAL ACQUISITION & CELL SEARCH (SHARETECHNOTE REFERENCE):

1. DETEKSI FREKUENSI & TIMING VIA PSS (Primary Synchronization Signal):
- Saat UE baru dinyalakan, UE memindai pita frekuensi RF yang didukung dan mencari PSS di 62 subcarrier tengah (72 subcarrier / 6 Resource Block).
- PSS menggunakan Zadoff-Chu sequence dengan 3 kemungkinan nilai Physical Layer Identity: N_ID_2 (0, 1, atau 2).
- Hasil dari deteksi PSS: UE mengunci simbol timing subframe 5 ms (half-frame timing) dan frekuensi carrier (koreksi Doppler / frequency offset).

2. DETEKSI FRAME TIMING & IDENTITAS SEL VIA SSS (Secondary Synchronization Signal):
- SSS terletak bersebelahan dengan PSS (pada slot 0 dan slot 10 di LTE FDD).
- SSS menggunakan m-sequence biner yang menghasilkan Physical Layer Cell Identity Group: N_ID_1 (nilai 0 hingga 167 untuk LTE, total 168 grup).
- UE menghitung Physical Cell ID (PCI) dengan rumus matematis 3GPP:
  PCI = 3 * N_ID_1 + N_ID_2 (Rentang nilai PCI: 0 hingga 503 di LTE; 0 hingga 1007 di 5G NR).
- Hasil dari SSS: UE mendapatkan batas frame radio 10 ms penuh serta mendeteksi mode duplexing (FDD vs TDD).

3. DECODING MASTER INFORMATION BLOCK (MIB) PADA KANAL PBCH:
- Setelah PCI didapatkan, UE dapat mendeteksi Cell-Specific Reference Signals (CRS) atau Demodulation Reference Signals (DMRS).
- UE membaca PBCH (Physical Broadcast Channel) yang ditransmisikan setiap 40 ms (subframe 0 frame radio).
- Parameter krusial yang didecode dari MIB:
  * dl-Bandwidth: Lebar pita sel (1.4, 3, 5, 10, 15, atau 20 MHz / 6 hingga 100 RB).
  * phich-Config: Konfigurasi durasi dan resource kanal PHICH.
  * systemFrameNumber (SFN): 8-bit MSB dari SFN (2-bit LSB dideteksi secara blind dari repetisi 40 ms TTI).

4. ACQUISITION SYSTEM INFORMATION BLOCK 1 (SIB1) PADA PDSCH:
- UE memonitor kanal PDCCH yang di-scramble dengan SI-RNTI (0xFFFF) di Common Search Space.
- PDCCH memberikan Downlink Control Information (DCI Format 1A/1C) yang mengarahkan alokasi blok resource PDSCH tempat SIB1 berada.
- Informasi penting di dalam SIB1:
  * plmn-IdentityList: Daftar operator jaringan seluler.
  * trackingAreaCode (TAC): Kode area pelacakan UE.
  * cellIdentity: Identitas sel 28-bit global (ECGI).
  * q-RxLevMin & q-RxLevMinOffset: Parameter batas daya minimum sinyal sel.

5. EVALUASI CELL SELECTION CRITERIA (S-CRITERIA):
- UE menghitung kelayakan sinyal sel dengan rumus S-criteria:
  Srxlev = Qrxlevmeas - (Qrxlevmin + Qrxlevminoffset) - Pcompensation
- Jika Srxlev > 0 dan cellBarred bernilai false: Sel dinyatakan LAYAK (Suitable Cell).
- UE mengunci sel (camp on), membaca SIB2, dan siap melakukan inisiasi akses acak (RACH).'
),
(
    'rach_rar',
    'RACH Procedure & Random Access Response (RAR / Msg2)',
    'rar, cara kerja rar, random access response, rach, msg1, msg2, msg3, msg4, prach, preamble, ra-rnti, timing advance, temp c-rnti',
    '4g_lte',
    'Mekanisme kerja prosedur Random Access (RACH), struktur isi Random Access Response (RAR/Msg2), perhitungan RA-RNTI, Timing Advance, dan Contention Resolution.',
    'MEKANISME KERJA RANDOM ACCESS RESPONSE (RAR / MSG2) (SHARETECHNOTE REFERENCE):

1. LATAR BELAKANG PROSEDUR RACH:
Sebelum UE memiliki alokasi kanal dedicated di uplink, UE tidak sinkron secara waktu dengan eNB/gNB karena perbedaan jarak fisik (propagation delay). RACH berfungsi untuk:
- Mendapatkan Uplink Timing Alignment (sinkronisasi waktu kirim sinyal).
- Meminta alokasi grant uplink awal (Initial UL Grant) untuk mengirim pesan RRC.

2. MSG1: RANDOM ACCESS PREAMBLE (PRACH):
- UE memilih salah satu dari 64 Preamble Sequence (Group A jika payload kecil, Group B jika payload besar) yang dikonfigurasi di SIB2.
- UE mengirim preamble pada slot waktu dan frekuensi PRACH yang telah dialokasikan.
- Daya pancar diatur melalui Power Ramping:
  P_PRACH = min(P_CMAX, PREAMBLE_RECEIVED_TARGET_POWER + PL)

3. MSG2: RANDOM ACCESS RESPONSE (RAR) PADA PDSCH:
- Jendela Waktu (Window): UE memonitor PDCCH selama interval "ra-ResponseWindowSize" (dimulai 3 subframe setelah transmisi preamble Msg1).
- Pengalamatan: PDCCH dicari menggunakan identitas RA-RNTI dengan formula:
  RA-RNTI = 1 + t_id + 10 * f_id
  (t_id = indeks subframe pertama PRACH, f_id = indeks frekuensi PRACH).
- Struktur Payload MAC RAR:
  1. RAPID (Random Access Preamble Identifier - 6 bit): Mencocokkan index preamble yang dikirim UE pada Msg1. Jika cocok, UE tahu respon ini ditujukan untuknya.
  2. Timing Advance (TA) Command (11 bit): Memberi tahu modem UE berapa mikrodetik harus memajukan waktu transmisi uplink agar pas tiba di antena eNB.
  3. Initial Uplink Grant (20 bit): Alokasi resource block (RB), skema modulasi (MCS), dan hopping flag untuk transmisi Msg3 di kanal PUSCH.
  4. Temporary C-RNTI (16 bit): Identitas radio sementara yang akan dipakai UE sebelum koneksi RRC permanen terbentuk.

4. MSG3: TRANSMISI TERJADWAL PADA PUSCH:
- Menggunakan nilai TA dan UL Grant dari RAR, UE mengirim pesan "RRCConnectionRequest" / "RRCSetupRequest" di kanal PUSCH.
- Mengikutsertakan UE Identity unik (S-TMSI 40-bit atau Random Identity) sebagai acuan resolusi tabrakan (contention resolution).

5. MSG4: CONTENTION RESOLUTION (PDSCH):
- Jika ada dua UE mengirim preamble yang sama pada waktu bersamaan, eNB mengirim Msg4 yang menggemakan (echo) UE Contention Resolution Identity dari Msg3.
- UE yang melihat identity-nya cocok akan mempromosikan Temp C-RNTI menjadi C-RNTI permanen, sedangkan UE lain mundur dan mengulang proses RACH dengan backoff timer!'
),
(
    'oran_ric',
    'O-RAN Architecture & RAN Intelligent Controller (RIC)',
    'ric, ric itu apa, o-ran, open ran, near-rt ric, non-rt ric, xapps, rapps, e2 interface, a1 interface, o1 interface, smo',
    'o_ran',
    'Konsep dan arsitektur RAN Intelligent Controller (RIC) dalam Open RAN (O-RAN Alliance), pemisahan Near-RT RIC vs Non-RT RIC, xApps, rApps, serta antarmuka E2, A1, dan O1.',
    'ARSITEKTUR & FUNGSI RAN INTELLIGENT CONTROLLER (RIC) (SHARETECHNOTE & O-RAN REFERENCE):

1. PENGERTIAN DASAR RIC:
RIC (RAN Intelligent Controller) adalah komponen perangkat lunak sentral dalam arsitektur Open RAN (didefinisikan oleh O-RAN Alliance) yang memprogram, mengotomatisasi, dan mengoptimalkan fungsi-fungsi jaringan akses radio (gNodeB) menggunakan algoritma Machine Learning dan aplikasi kecerdasan buatan.

2. MENGAPA RIC DIPERLUKAN?
Pada radio monolitik tradisional (Black-box BTS dari vendor tunggal), algoritma Radio Resource Management (RRM) tertutup paten di perangkat keras vendor. RIC mendisagregasi kontrol radio menjadi software terbuka dan berbasis mikroservis cloud-native sehingga operator dapat memasang aplikasi AI/ML independen dari multi-vendor.

3. DUA TINGKATAN UTAMA RIC:

A. Non-Real-Time RIC (Non-RT RIC):
- Penempatan: Berada di lapisan SMO (Service Management and Orchestration) / Core Cloud.
- Siklus Waktu Kontrol: Loop kontrol lambat (interval waktu > 1 detik).
- Aplikasi: Menjalankan "rApps" (aplikasi mikroservis untuk perencanaan kebijakan makro, model training AI, dynamic slicing orchestration, dan efisiensi energi menara seluler).
- Interface: Mengirimkan panduan kebijakan (intent-based policy) ke Near-RT RIC melalui antarmuka A1.

B. Near-Real-Time RIC (Near-RT RIC):
- Penempatan: Berada di Edge Cloud / Regional Data Center, dekat dengan node radio O-CU dan O-DU.
- Siklus Waktu Kontrol: Loop kontrol cepat (interval waktu antara 10 ms hingga 1000 ms).
- Aplikasi: Menjalankan "xApps" (aplikasi real-time untuk load balancing dinamis, kontrol beamforming Massive MIMO, mitigasi interferensi antar-seluler, dan anomaly detection traffic).
- Interface Utama:
  * Antarmuka E2: Menghubungkan Near-RT RIC langsung ke node radio O-CU-CP, O-CU-UP, dan O-DU untuk mengumpulkan telemetri radio dan mengeksekusi aksi kendali radio.
  * Antarmuka A1: Menerima kebijakan dan model AI dari Non-RT RIC.
  * Antarmuka O1: Manajemen OAM (operasi, administrasi, dan pemeliharaan).

4. RINGKASAN STRUKTUR INTERFACE O-RAN:
- E2: Antarmuka real-time kontrol radio (Near-RT RIC <-> O-CU / O-DU).
- A1: Antarmuka pertukaran kebijakan & ML inference guidance (Non-RT RIC <-> Near-RT RIC).
- O1: Antarmuka manajemen konfigurasi, fault, dan logging (SMO <-> Network Elements).
- Open Fronthaul (7-2x split): Antarmuka terbuka antara O-DU dan O-RU.'
),
(
    'nr_endc_setup',
    '5G NSA Dual Connectivity (EN-DC Option 3x) & SgNB Addition',
    'endc, en-dc, 5g nsa, sgnb addition, option 3x, split bearer, x2-c, x2-u, secondary node addition',
    '5g_nr',
    'Alur pensinyalan 5G Non-Standalone (EN-DC Option 3x), prosedur penambahan SgNB (Secondary gNodeB), konfigurasi nr-Config-r15, dan pengalihan jalur data split bearer.',
    'ALUR PENSINYALAN 5G NSA EN-DC OPTION 3X (SHARETECHNOTE REFERENCE):

1. PRINSIP DUAL CONNECTIVITY OPTION 3X:
- MeNB (LTE eNodeB): Bertindak sebagai Master Node penopang Control Plane (RRC dan NAS) yang terhubung ke 4G EPC (MME).
- SgNB (5G gNodeB): Bertindak sebagai Secondary Node penopang User Plane kecepatan tinggi (NR Data Radio Bearer / SCG).
- Pada Option 3x, tunnel GTP-U data user plane dari EPC diarahkan langsung ke SgNB (SN-terminated split bearer), dan SgNB dapat mendistribusikan data ke MeNB bila diperlukan.

2. TAHAPAN CALL FLOW SGNB ADDITION:
Step 1: Pengukuran Sinyal 5G (Measurement Configuration)
- MeNB mengirim RRCConnectionReconfiguration ke UE yang menyertakan konfigurasi pengukuran B1 Event (inter-RAT 5G NR RSRP/RSRQ threshold).
- UE mendeteksi sinyal SSB 5G NR dan membalas dengan "MeasurementReport" (Event B1).

Step 2: Permintaan Alokasi Resource ke 5G (SgNB Addition Request)
- MeNB mengirim pesan via interface X2-C: "SgNB Addition Request" ke gNB target.
- Menyertakan E-RAB ID, QoS profile, UE radio capabilities, dan konfigurasi koordinasi radio.
- gNB mengalokasikan resource radio 5G NR dan membalas dengan "SgNB Addition Request Acknowledge" yang membungkus container RRC NR ("nr-Config-r15").

Step 3: Rekonfigurasi RRC ke Ponsel (RRC Connection Reconfiguration)
- MeNB mengirim "RRCConnectionReconfiguration" ke UE yang membungkus container nr-Config (konfigurasi PSCell, SpCell, SCG radio bearer, dan RACH PRACH parameter).
- UE menerapkan konfigurasi dan membalas "RRCConnectionReconfigurationComplete" ke MeNB.
- MeNB meneruskan "SgNB Reconfiguration Complete" ke gNB via X2-C.

Step 4: Sinkronisasi Fisik ke Sel 5G (RACH pada PSCell)
- UE melakukan prosedur RACH langsung ke sel 5G gNodeB (PSCell) untuk mendapatkan sinkronisasi uplink timing.

Step 5: Path Switch User Plane di EPC
- MeNB mengirim S1AP: "E-RAB Modification Indication" ke MME.
- MME berkoordinasi dengan S-GW/P-GW untuk mengalihkan tunnel user plane S1-U langsung ke alamat IP SgNB.
- Aliran data 5G NR throughput tinggi mulai mengalir!'
),
(
    '5g_sa_registration',
    '5G SA Initial Registration & SUCI / SUPI Authentication Flow',
    '5g sa registration, 5g registration, suci, supi, ausf, udm, amf, 5gmm, nas registration, 5g standalone registration',
    '5g_nr',
    'Prosedur registrasi awal 5G Standalone (3GPP TS 23.502), enkripsi privasi identitas SUCI menggunakan ECIES, otentikasi 5G-AKA via AUSF/UDM, dan setup Security Mode.',
    'ALUR REGISTRASI AWAL 5G STANDALONE (SA) (SHARETECHNOTE REFERENCE):

1. ENKRIPSI IDENTITAS SUPI KE SUCI (PRIVACY PROTECTION):
- Pada 5G SA, identitas permanen IMSI/SUPI tidak pernah dikirim dalam teks biasa (plaintext) di udara untuk mencegah IMSI-catcher.
- USIM/UE mengenkripsi SUPI menjadi SUCI (Subscription Concealed Identifier) menggunakan algoritma ECIES dengan Public Key Home Network (HN-PK).

2. ALUR SINYAL REGISTRASI 5G SA:
Step 1: UE mengirim RRCSetupRequest -> gNB membalas RRCSetup.
Step 2: UE mengirim RRCSetupComplete membungkus pesan NAS: "Registration Request" (menyertakan SUCI, 5GS Registration Type, 5GMM capability, dan Requested NSSAI).
Step 3: gNB memilih AMF dan meneruskan via NG-C (N2) NGAP: "INITIAL UE MESSAGE".
Step 4: AMF mengekstrak SUCI dan meneruskannya ke AUSF via interface N12 (Nausf_UEAuthentication_Authenticate Request).
Step 5: AUSF meminta verifikasi ke UDM via interface N13 (Nudm_UEAuthentication_Get Request). UDM mendekripsi SUCI menjadi SUPI asli menggunakan Private Key dan menghasilkan 5G-AKA Authentication Vectors (RAND, AUTN, HXRES*).
Step 6: AMF mengirim NAS: "Authentication Request" (RAND & AUTN) ke UE.
Step 7: USIM UE memverifikasi AUTN. Jika valid, UE menghitung RES* dan membalas "Authentication Response" (RES*).
Step 8: AMF memverifikasi RES*. Jika cocok, otentikasi berhasil.
Step 9: AMF mengirim NAS: "Security Mode Command" (memilih 128-bit NIA integrity & 128-bit NEA ciphering).
Step 10: UE membalas "Security Mode Complete".
Step 11: AMF mendaftarkan konteks UE ke UDM via N10 dan mengirim NAS: "Registration Accept" (memberikan 5G-GUTI, TAI List, dan Allowed NSSAI slice).
Step 12: UE membalas "Registration Complete".'
);
