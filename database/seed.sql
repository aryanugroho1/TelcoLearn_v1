-- SEED DATA UNTUK TELCOLEARN ENGINE
-- Modul Pembelajaran & Bank Soal Kuis

-- 1. Modul Pembelajaran
INSERT OR IGNORE INTO modules (module_code, category, level, title, tags, summary, wa_text_body, sequence_order, is_active)
VALUES
(
    'MOD-5G-SA-01',
    'callflow',
    'Menengah',
    'PDU Session Establishment & User Plane Setup',
    '5G,NAS,SMF,UPF,PFCP,QXDM',
    'Alur pendirian sesi data PDU 5G SA dari UE, AMF, SMF hingga gNodeB DRB allocation.',
    '⏰ *[TelcoLearn Micro-Learning] Call Flow 5G Standalone (SA)*

*Topik Hari Ini:* *PDU Session Establishment & User Plane Setup*

🔹 *Konsep Kunci:*
Setelah UE sukses registrasi ke AMF, UE memerlukan koneksi data IP (*PDU Session*) agar aliran internet aktif.

🔹 *Alur Sinyal OTA (Over-The-Air):*
1. UE mengirim pesan NAS: \`\`\`PDU Session Establishment Request\`\`\` (membungkus PDU Session ID, DNN/APN, dan S-NSSAI slice).
2. AMF meneruskan via interface N11 ke *SMF*.
3. SMF memilih *UPF* dan menginisiasi tunnel data via interface N4 menggunakan protokol *PFCP* (_Packet Forwarding Control Protocol_).
4. gNB menerima alokasi radio dan mengirim \`\`\`RRCReconfiguration\`\`\` untuk mendirikan *Data Radio Bearer (DRB)* ke UE.

🔍 *Troubleshooting Tip di Log QXDM:*
Cari paket *0xB801 (5G NAS)*. Jika muncul \`\`\`5GSM Cause #27 (Missing or unknown DNN)\`\`\`, periksa apakah APN/DNN pada profil SIM card sesuai dengan konfigurasi core network.

Ketik */quiz* untuk menguji materi ini atau tanyakan langsung jika ada bagian yang belum jelas! 🚀',
    1,
    1
),
(
    'MOD-5G-NSA-02',
    'architecture',
    'Menengah',
    '5G Non-Standalone (EN-DC Option 3x) & SgNB Addition',
    'EN-DC,NSA,Option3x,MeNB,SgNB,X2',
    'Arsitektur Dual Connectivity LTE Master Node dan 5G Secondary Node.',
    '⏰ *[TelcoLearn Micro-Learning] Arsitektur 5G NSA (EN-DC)*

*Topik Hari Ini:* *EN-DC Option 3x & SgNB Addition Procedure*

🔹 *Konsep Kunci:*
Pada Option 3x (EN-DC), LTE eNB bertindak sebagai *Master Node (MeNB)* terhubung ke EPC (4G Core), sedangkan 5G gNB bertindak sebagai *Secondary Node (SgNB)* untuk boosting throughput data user plane.

🔹 *Alur Pensinyalan:*
1. UE melaporkan B1 measurement report (menemukan sinyal NR kuat).
2. MeNB mengirim \`\`\`SgNB Addition Request\`\`\` ke gNB via interface X2-C.
3. gNB mengalokasikan resource radio NR dan membalas \`\`\`SgNB Addition Request Acknowledge\`\`\`.
4. MeNB mengirim \`\`\`RRCConnectionReconfiguration\`\`\` yang membungkus *nr-Config-r15* ke UE.
5. UE sync ke carrier NR dan mengirim \`\`\`RRCConnectionReconfigurationComplete\`\`\`.

🔍 *Troubleshooting Tip di Log:*
Periksa paket *0xB0C0 (LTE RRC)*. Kegagalan umum adalah *SCG Failure Information* (seperti \`\`\`synchReconfigFailureSCG\`\`\`) akibat timing drift atau beam failure pada sel sekunder.

Ketik */quiz* untuk menguji pemahaman Anda! 💡',
    2,
    1
),
(
    'MOD-RRC-RLF-03',
    'logfile',
    'Lanjutan',
    'Radio Link Failure (RLF) & Timer T310/T311',
    'RLF,T310,T311,Reestablishment,Layer3',
    'Deteksi out-of-sync fisik, expiry timer T310, dan prosedur RRC Re-establishment.',
    '⏰ *[TelcoLearn Micro-Learning] Protokol Radio & OTA Log*

*Topik Hari Ini:* *Radio Link Failure (RLF) & Timer T310/T311*

🔹 *Konsep Kunci:*
Saat UE berada di blind-spot atau cakupan sel drop drastis, layer fisik melaporkan *Out-Of-Sync (OOS)* ke RRC layer.

🔹 *Mekanisme Timer RLF:*
1. Ketika Layer 1 mendeteksi sinyal PDCCH di bawah threshold Qout sebanyak *N310* kali berturut-turut, timer *T310* aktif.
2. Jika tidak ada pemulihan (*N311 In-Sync*) sebelum T310 habis (default 1000ms), maka terjadi *Radio Link Failure (RLF)*.
3. UE menghentikan transmisi radio dan memulai timer *T311* untuk mencari sel target baru.
4. UE mengirim pesan \`\`\`RRCReestablishmentRequest\`\`\` dengan cause \`\`\`otherFailure\`\`\` atau \`\`\`handoverFailure\`\`\`.

🔍 *Troubleshooting Tip di Log QXDM:*
Jika di log muncul \`\`\`RRCConnectionReject\`\`\` atau UE langsung jatuh ke state RRC_IDLE, periksa apakah sel tetangga memiliki *UE context* yang cocok, atau konfigurasi *PCI confusion*.

Ketik */quiz* untuk latihan kuis hari ini!',
    3,
    1
),
(
    'MOD-NAS-SEC-04',
    'callflow',
    'Dasar',
    'NAS Security Mode Command & 5G-GUTI Allocation',
    'NAS,Security,Integrity,Ciphering,5G-GUTI,SUCI',
    'Prosedur enkripsi pensinyalan NAS dan pencegahan IMSI catching.',
    '⏰ *[TelcoLearn Micro-Learning] Keamanan Jaringan Seluler*

*Topik Hari Ini:* *NAS Security Mode Command & 5G-GUTI*

🔹 *Konsep Kunci:*
5G mengadopsi privasi identitas perangkat yang jauh lebih ketat dibanding 4G LTE. UE tidak pernah mengirim IMSI dalam teks polos di udara, melainkan *SUCI (Subscription Concealed Identifier)* terenkripsi.

🔹 *Alur Security Setup:*
1. Jaringan memvalidasi kredensial autentikasi UE via *AUSF*.
2. AMF mengirim \`\`\`Security Mode Command\`\`\` (memilih algoritma Ciphering & Integrity protection, misal NEA2/NIA2).
3. UE memverifikasi integritas pesan, mengaktifkan ciphering, lalu membalas dengan \`\`\`Security Mode Complete\`\`\`.
4. Jaringan menerbitkan *5G-GUTI* baru untuk menyamarkan identitas permanen selama sesi berikutnya.

🔍 *Troubleshooting Tip di Log:*
Jika muncul \`\`\`5GMM cause #9 (UE identity cannot be derived by the network)\`\`\`, biasanya AMF kehilangan mapping konteks dari GUTI lama yang disimpan modem.

Ketik */quiz* untuk evaluasi kuis kilat!',
    4,
    1
),
(
    'MOD-ML-RF-05',
    'ml',
    'Lanjutan',
    'Deteksi Anomali Drive Test Menggunakan Isolation Forest & Autoencoder',
    'MachineLearning,IsolationForest,Autoencoder,DriveTest,KPI',
    'Penerapan unsupervised learning untuk mendeteksi korelasi abnormal RSRP vs Throughput.',
    '⏰ *[TelcoLearn Micro-Learning] Applied Telco Machine Learning*

*Topik Hari Ini:* *Deteksi Anomali Drive Test (Isolation Forest & Autoencoder)*

🔹 *Konsep Kunci:*
Pada pengujian drive test, hubungan antara metrik radio (RSRP, SINR) dan Throughput bersifat non-linear multidimensi. Rule threshold statis (misal: RSRP < -100 dBm) sering gagal mendeteksi kasus kompleks.

🔹 *Kasus Nyata:*
Kondisi di mana *RSRP sangat baik (-75 dBm)* namun *Throughput mendadak drop ke 0 Mbps*.
• Penyebab: MIMO rank drop, bufferbloat di scheduler, atau interferensi pilot cross-cell.

🔹 *Arsitektur ML:*
1. *Isolation Forest*: Mengisolasi titik sampel abnormal berdasarkan jarak pohon partisi biner acak (efisien untuk dataset drive test tabular ratusan ribu baris).
2. *Deep Autoencoder*: Neural Network dilatih merekonstruksi kondisi RF normal. Ketika anomali terjadi, nilai *Reconstruction Loss (MSE)* melonjak tajam melewati batas 99th percentile.

🔍 *Implementasi Lapangan:*
Model ini mengotomatiskan triase log drive test dan menandai segmen jalan yang perlu diinspeksi oleh Field Engineer!

Ketik */quiz* untuk menguji pengetahuan ML Telco Anda! 🤖',
    5,
    1
),
(
    'MOD-5G-NAS-06',
    'logfile',
    'Menengah',
    '5GMM Cause #11 (PLMN Not Allowed) & USIM FPLMN Handling',
    '5GMM,NAS,FPLMN,USIM,Roaming,Cause11',
    'Penolakan registrasi kartu SIM oleh jaringan dan penulisan daftar Forbidden PLMN.',
    '⏰ *[TelcoLearn Micro-Learning] Protokol NAS & USIM*

*Topik Hari Ini:* *5GMM Cause #11 (PLMN Not Allowed) & FPLMN Handling*

🔹 *Konsep Kunci:*
Ketika UE mencoba registrasi ke operator seluler tetapi identitas MCC-MNC tidak diizinkan atau tidak memiliki perjanjian roaming, Core Network (AMF) mengirimkan pesan penolakan NAS.

🔹 *Mekanisme Penolakan:*
1. AMF mengirim \`\`\`Registration Reject\`\`\` dengan IE \`\`\`5GMM Cause = 11 (PLMN not allowed)\`\`\`.
2. Sesuai spesifikasi 3GPP TS 24.501, UE segera menyimpan PLMN tersebut ke dalam memori USIM di berkas EF_FPLMN (*Forbidden PLMN*).
3. Modem UE beralih ke status *5GMM-DEREGISTERED.ATTEMPTING-REGISTRATION* atau *LIMITED SERVICE*.
4. UE tidak akan mencoba attach ulang ke frekuensi PLMN tersebut secara otomatis sampai dilakukan siklus power-cycle, SIM toggle, atau pencarian manual di menu Settings.

🔍 *Troubleshooting Tip di Lab Test:*
Periksa tabel FPLMN kartu SIM uji Anda menggunakan AT command modem: \`\`\`AT+CPOL?\`\`\` atau bersihkan tabel FPLMN via software konfig SIM (misal: SysmoSIM / Comprion tool).

Ketik */quiz* untuk menguji pemahaman Anda!',
    6,
    1
),
(
    'MOD-4G5G-HO-07',
    'callflow',
    'Lanjutan',
    '5G to 4G Inter-RAT Handover & Xn/N2 Mobility Procedures',
    'Handover,InterRAT,Xn,N2,Mobility,T304',
    'Alur mobilitas antar-teknologi 5G SA ke LTE dan investigasi kegagalan handover.',
    '⏰ *[TelcoLearn Micro-Learning] Call Flow & Mobilitas Radio*

*Topik Hari Ini:* *5G to 4G Inter-RAT Handover & Timer T304*

🔹 *Konsep Kunci:*
Ketika cakupan sinyal 5G NR menipis, gNB mengarahkan UE untuk berpindah ke carrier 4G LTE tanpa memutus sesi data pengguna (*Inter-RAT Handover*).

🔹 *Alur Sinyal OTA:*
1. gNB mengonfigurasi measurement event B1/B2 (sinyal sel tetangga LTE melewati threshold).
2. UE mengirim \`\`\`MeasurementReport\`\`\`.
3. gNB menginisiasi handover preparation ke AMF via N2, lalu AMF berkoordinasi ke 4G MME.
4. UE menerima \`\`\`RRCReconfiguration\`\`\` dengan elemen *mobilityControlInfo* (membawa target LTE cell PCI dan timer T304).
5. Timer *T304* mulai berjalan di UE. UE melakukan random access (RACH) ke sel LTE target.
6. Jika RACH berhasil sebelum T304 habis, UE mengirim \`\`\`RRCConnectionReconfigurationComplete\`\`\` ke eNB 4G.

🔍 *Troubleshooting Tip di Log QXDM:*
Jika di log muncul \`\`\`HandoverFailure (T304 Expiry)\`\`\`, periksa apakah target PCI mengalami interferensi berat atau parameter timing advance (TA) tidak sinkron.

Ketik */quiz* untuk kuis evaluasi!',
    7,
    1
),
(
    'MOD-RF-KPI-08',
    'architecture',
    'Dasar',
    'RF Optimization Metrics: RSRP, SINR, CQI, MCS, and BLER',
    'RF,RSRP,SINR,CQI,MCS,BLER,LinkAdaptation',
    'Parameter kunci kualitas gelombang radio dan link adaptation.',
    '⏰ *[TelcoLearn Micro-Learning] Field & Drive Test Optimization*

*Topik Hari Ini:* *Metrik Kunci Kualitas RF & Link Adaptation*

🔹 *Konsep Kunci:*
Kinerja throughput user plane ditentukan oleh rantai metrik radio dari layer fisik hingga transport:
• *RSRP (Reference Signal Received Power)*: Indikator kuat sinyal cakupan (dBm). Kategori bagus: > -85 dBm.
• *SINR (Signal-to-Interference-plus-Noise Ratio)*: Rasio kejernihan sinyal terhadap interferensi (dB). Nilai tinggi (> 15 dB) memungkinkan modulasi 256-QAM.
• *CQI (Channel Quality Indicator)*: Laporan 4-bit (1–15) dari UE ke base station mengenai kondisi kanal.
• *MCS (Modulation and Coding Scheme)*: Penentuan kombinasi modulasi (QPSK, 16QAM, 64QAM, 256QAM) dan code rate oleh scheduler.
• *BLER (Block Error Rate)*: Rasio blok transport error. Algoritma Outer Loop Link Adaptation (OLLA) menargetkan BLER transmisi awal sekitar 10%.

🔍 *Troubleshooting Tip di Lapangan:*
Jika RSRP kuat (-75 dBm) namun CQI rendah (3-5), periksa adanya *Modulation de-correlation* atau *pilot pollution* dari beberapa sel tetangga dengan daya pancar setara.

Ketik */quiz* untuk menguji konsep ini!',
    8,
    1
),
(
    'MOD-ML-LSTM-09',
    'ml',
    'Menengah',
    'Radio Traffic & Throughput Forecasting with LSTM Networks',
    'MachineLearning,LSTM,DeepLearning,Time-Series,Forecasting,PRB',
    'Penerapan recurrent neural network untuk prediksi beban seluler time-series.',
    '⏰ *[TelcoLearn Micro-Learning] Machine Learning Telco*

*Topik Hari Ini:* *Peramalan Trafik Seluler Menggunakan LSTM (Long Short-Term Memory)*

🔹 *Konsep Kunci:*
Trafik data radio seluler (PRB utilization, active user count, download throughput) memiliki pola diurnal (pagi-siang-malam) dan musiman mingguan (hari kerja vs akhir pekan).

🔹 *Arsitektur Model:*
1. Input tensor: Time-series sliding window berukuran [batch_size, time_steps, features] (fitur: PRB, RSRP rata-rata, connected UE, jam, hari).
2. Layer *LSTM*: Menangkap dependensi jangka panjang dan siklus puncak trafik tanpa mengalami vanishing gradient.
3. Output layer: Estimasi beban trafik untuk 1 hingga 24 jam ke depan.

🔹 *Aplikasi Industri:*
• *Energy Saving (Cell Sleep Mode)*: Mematikan carrier amplifier radio sekunder saat prediksi beban sangat rendah tanpa mengorbankan QoS pelanggan.
• *Proactive Admission Control*: Mengalihkan traffic sebelum terjadi congesti pada jam pertandingan atau event publik.

Ketik */quiz* untuk tantangan kuis ML!',
    9,
    1
),
(
    'MOD-ML-XGB-10',
    'ml',
    'Lanjutan',
    'UE Power Drain & Thermal Prediction Menggunakan Gradient Boosting (XGBoost)',
    'MachineLearning,XGBoost,PowerConsumption,Thermal,BatteryDrain,Tabular',
    'Prediksi konsumsi baterai dan overheating modem pada skenario agregasi frekuensi 5G.',
    '⏰ *[TelcoLearn Micro-Learning] Machine Learning Telco Testing*

*Topik Hari Ini:* *Prediksi Power Drain & Suhu Modem via XGBoost*

🔹 *Konsep Kunci:*
Penggunaan 5G Standalone dengan Dual Uplink (Tx switching), Carrier Aggregation (CA 3CC/4CC), dan transmisi continuous throughput tinggi memicu disipasi panas (*thermal throttling*) dan konsumsi baterai UE yang agresif.

🔹 *Mengapa XGBoost?*
Dataset pengujian laboratorium perangkat terdiri dari ratusan parameter tabular log (Tx Power dBm, Band Combination, MIMO layers, thermal sensor ADC, ambient temperature, screen refresh rate). *XGBoost (Extreme Gradient Boosting)* unggul pada data tabular dengan feature importance interpretability.

🔹 *Insight Model:*
• Fitur nomor 1 yang paling berkorelasi dengan kenaikan temperatur modem adalah *Uplink Tx Power berkelanjutan di atas 20 dBm*.
• Membantu tim QA memprediksi crash modem sebelum pengujian lapangan 24 jam dilakukan!

Ketik */quiz* untuk kuis pamungkas modul ini! 🚀',
    10,
    1
);

-- 2. Bank Soal Kuis
INSERT OR IGNORE INTO quizzes (id, module_id, category, question, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty, is_active)
VALUES
(
    1,
    1,
    'callflow',
    'Pada arsitektur 5G Standalone (SA), protokol apa yang digunakan antara SMF dan UPF untuk mengontrol packet forwarding pada interface N4?',
    'Diameter Protocol',
    'Packet Forwarding Control Protocol (PFCP)',
    'GTP-C (GPRS Tunneling Protocol Control)',
    'HTTP/2 REST API',
    'B',
    'SMF dan UPF berkomunikasi via interface N4 menggunakan protokol PFCP (3GPP TS 29.244) untuk memisahkan control plane dan user plane (CUPS).',
    2,
    1
),
(
    2,
    2,
    'architecture',
    'Pada arsitektur 5G Non-Standalone (EN-DC Option 3x), interface apa yang menghubungkan Master Node (LTE eNB) dan Secondary Node (5G gNB) untuk pensinyalan kontrol?',
    'Interface S1-MME',
    'Interface N2',
    'Interface X2-C',
    'Interface F1-C',
    'C',
    'Pada arsitektur EN-DC, koordinasi kontrol antara eNB dan gNB berjalan di atas interface X2-C (Control Plane).',
    2,
    1
),
(
    3,
    3,
    'logfile',
    'Timer RRC apa yang diaktifkan ketika layer fisik UE mendeteksi sinyal radio Out-Of-Sync berturut-turut sebanyak N310 kali?',
    'T300',
    'T301',
    'T310',
    'T311',
    'C',
    'Timer T310 berjalan saat layer 1 UE mendeteksi consecutive out-of-sync indications. Jika T310 kedaluwarsa sebelum in-sync N311 tercapai, terjadilah Radio Link Failure (RLF).',
    2,
    1
),
(
    4,
    4,
    'callflow',
    'Untuk mencegah aksi penyerangan IMSI Catcher pada jaringan 5G, identitas apa yang dikirimkan oleh UE di udara saat initial attach sebelum security konteks terbentuk?',
    'Plain IMSI',
    'SUCI (Subscription Concealed Identifier)',
    'MSISDN nomor ponsel',
    'IP Address sementara',
    'B',
    '5G mengenalkan SUCI (Subscription Concealed Identifier) yang dienkripsi menggunakan public key home network (HN) yang tersimpan di kartu USIM.',
    1,
    1
),
(
    5,
    5,
    'ml',
    'Saat pengujian drive test 5G, jika nilai RSRP sangat bagus (-78 dBm) namun Throughput download drop mendadak mendekati 0 Mbps, algoritma ML unsupervised mana yang paling ideal mendeteksi anomali multidimensi ini?',
    'Linear Regression',
    'Isolation Forest & Autoencoder',
    'Simple K-Means 1-Dimensi',
    'Naive Bayes Classifier',
    'B',
    'Isolation Forest dan Autoencoder sangat efektif untuk mendeteksi anomali non-linear multidimensi tanpa label ground truth, di mana reconstruction error Autoencoder akan melonjak tajam.',
    3,
    1
),
(
    6,
    6,
    'logfile',
    'Ketika UE menerima pesan NAS Registration Reject dengan 5GMM Cause #11 (PLMN not allowed), tindakan apa yang dilakukan UE terhadap PLMN tersebut sesuai 3GPP TS 24.501?',
    'Mencoba registrasi ulang setiap 5 detik',
    'Memasukkan PLMN ke daftar Forbidden PLMN (FPLMN) di USIM',
    'Mengirim pesan RRCSetupRequest ulang dengan prioritas darurat',
    'Menghapus seluruh profil APN di perangkat',
    'B',
    'Sesuai spesifikasi 3GPP, penolakan Cause #11 mewajibkan UE memasukkan PLMN target ke daftar Forbidden PLMN (EF_FPLMN) di USIM dan tidak mengizinkan re-attempt otomatis pada PLMN tersebut.',
    2,
    1
),
(
    7,
    7,
    'callflow',
    'Dalam prosedur handover 5G ke 4G (Inter-RAT Handover), timer RRC apa yang diaktifkan di UE saat menerima RRCReconfiguration dengan mobilityControlInfo untuk membatasi durasi penyelesaian RACH ke sel target?',
    'Timer T300',
    'Timer T310',
    'Timer T304',
    'Timer T311',
    'C',
    'Timer T304 mengontrol durasi handover. Jika UE gagal menyelesaikan Random Access (RACH) pada sel target sebelum T304 kedaluwarsa, dinyatakan terjadi Handover Failure.',
    3,
    1
),
(
    8,
    8,
    'architecture',
    'Pada algoritma Outer Loop Link Adaptation (OLLA) seluler, berapakah target Block Error Rate (BLER) transmisi radio awal yang umumnya dijaga oleh scheduler base station?',
    'Sekitar 0.1%',
    'Sekitar 10%',
    'Sekitar 50%',
    'Sekitar 90%',
    'B',
    'Scheduler jaringan seluler menargetkan BLER transmisi pertama sekitar 10% untuk memaksimalkan efisiensi spektral tanpa memicu retransmisi berlebihan.',
    2,
    1
),
(
    9,
    9,
    'ml',
    'Dalam peramalan beban trafik radio seluler time-series, mengapa arsitektur LSTM lebih unggul dibanding Standard Feedforward Neural Network (MLP)?',
    'Karena LSTM hanya membutuhkan 1 baris sampel data',
    'Karena LSTM memiliki mekanisme internal memory cell & gates untuk menangkap dependensi temporal sekuensial',
    'Karena LSTM tidak menggunakan proses backpropagation',
    'Karena LSTM hanya dapat memproses data teks NLP',
    'B',
    'LSTM dirancang dengan forget gate, input gate, dan output gate untuk mempertahankan konteks informasi temporal melintasi langkah waktu yang panjang (time-series).',
    2,
    1
),
(
    10,
    10,
    'ml',
    'Pada pemodelan kenaikan suhu (thermal) modem 5G menggunakan algoritma XGBoost pada data pengujian QA, metrik apa yang paling sering ditemukan memiliki bobot feature importance tertinggi?',
    'Screen brightness',
    'Continuous Uplink Transmission Power (Tx Power dBm)',
    'Versi Bluetooth controller',
    'Kapasitas RAM sisa',
    'B',
    'Daya pancar uplink (Uplink Tx Power) yang tinggi secara terus-menerus adalah sumber disipasi daya dan pembangkit panas utama pada sirkuit RF Front-End (Power Amplifier) modem UE.',
    2,
    1
);

