/**
 * TelcoLearn - Telecom Project Management (PMP) Seeder
 * Menyuntikkan 10 Modul Micro-learning dan 10 Kuis Situasional PMP Dwibahasa (ID & EN)
 * ke tabel modules dan quizzes dengan category = 'pmp'.
 *
 * Jalankan: node scripts/seed_pmp_track.js
 */

import { getDb } from '../database/db.js';

export function seedPmpTrack() {
  console.log('🔄 Memulai penyemaian Modul & Kuis Telecom Project Management (PMP)...');
  const db = getDb();

  const PMP_MODULES = [
    {
      module_code: 'MOD-PMP-01',
      category: 'pmp',
      level: 'Menengah',
      title: 'Project Charter & Stakeholder Management dalam Rollout Seluler',
      title_en: 'Project Charter & Stakeholder Alignment in Cellular Rollout',
      tags: 'PMP,PMBOK,Project Charter,Stakeholder,SITAC,TowerCo,Salience Model',
      summary: 'Fondasi inisiasi proyek rollout BTS/5G, otorisasi Project Manager via Charter, dan matriks Power-Interest pemangku kepentingan.',
      summary_en: 'Foundation of BTS/5G rollout initiation, PM authorization via Project Charter, and stakeholder Power-Interest mapping.',
      sequence_order: 11,
      is_active: 1,
      wa_text_body: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Topik Hari Ini:* *Project Charter & Manajemen Stakeholder Rollout BTS*

🔹 *Konsep Kunci (PMBOK Initiation):*
Dalam proyek penggelaran 500 site 5G, *Project Charter* adalah dokumen resmi dari Project Sponsor (Direksi/PMO Operator) yang memberi wewenang penuh kepada Project Manager (PM) untuk mengalokasikan sumber daya organisasi.

🔹 *Elemen Kritis Charter Rollout Telco:*
1. *Business Case & High-Level Scope:* Target on-air 500 site sebelum kuartal liburan untuk monetisasi trafik data.
2. *Milestone Summary:* Tanggal target Site Acquisition (SITAC), Civil Mechanical Electrical (CME), hingga On-Air.
3. *Pre-approved Budget:* Batasan modal investasi (CAPEX) dan wewenang pengeluaran PM.
4. *Key Assumptions & Constraints:* Ketersediaan pasokan listrik PLN, izin RT/RW warga lokal, dan kuota impor radio RRU.

🔹 *Matriks Power vs. Interest Stakeholder (Salience Model):*
• *High Power, High Interest (Manage Closely):* Operator Network Director, Dinas Tata Kota/Pemerintah Daerah.
• *High Power, Low Interest (Keep Satisfied):* Tim Finansial & Legal Perusahaan (memastikan kepatuhan audit).
• *Low Power, High Interest (Keep Informed):* Pemilik lahan sewa (Landowner), Tokoh Masyarakat sekitar tower.

💡 *Tips Ujian PMP:*
Jika terjadi konflik wewenang antara fungsional manajer dan PM, dokumen pertama yang harus diverifikasi adalah *Project Charter* untuk melihat tingkat otoritas PM!

Ketik */quiz* untuk menguji konsep ini! 📋`,
      wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Today's Topic:* *Project Charter & Stakeholder Alignment in Cellular Rollouts*

🔹 *Key Concepts (PMBOK Initiation):*
In a 500-site 5G rollout, the *Project Charter* is the foundational document signed by the Project Sponsor (Operator PMO/Executive) that officially authorizes the project and grants the Project Manager (PM) authority to assign corporate resources.

🔹 *Critical Elements of a Telco Charter:*
1. *Business Case & High-Level Scope:* Target 500 on-air sites prior to peak holiday season to capture data revenue.
2. *Summary Milestones:* Key milestone dates for Site Acquisition (SITAC), Civil Mechanical Electrical (CME), and On-Air.
3. *Pre-approved Financial Resources:* Approved CAPEX limit and PM expenditure delegation boundaries.
4. *Assumptions & Constraints:* Power grid (PLN) energization lead times, municipal permits, and radio hardware import quotas.

🔹 *Power vs. Interest Grid (Stakeholder Mapping):*
• *High Power, High Interest (Manage Closely):* Operator Network Operations Director, City Permitting Municipalities.
• *High Power, Low Interest (Keep Satisfied):* Corporate Finance & Legal Compliance departments.
• *Low Power, High Interest (Keep Informed):* Tower site Landowners, Local Resident Community heads.

💡 *PMP Exam Tip:*
When authority disputes arise between functional managers and the PM, the primary document to consult is the *Project Charter* to confirm the PM's formal authority level!

Type */quiz* to test your understanding! 📋`
    },
    {
      module_code: 'MOD-PMP-02',
      category: 'pmp',
      level: 'Menengah',
      title: 'Scope Baseline, 100% Rule & WBS Dictionary Rollout Makro Seluler',
      title_en: 'Scope Baseline, 100% Rule & WBS Dictionary for Macro Rollouts',
      tags: 'PMP,PMBOK,WBS,Scope Baseline,Work Package,Gold Plating,Scope Creep',
      summary: 'Struktur dekomposisi kerja (WBS) hirarkis penggelaran site seluler, aturan 100%, dan pengendalian Scope Creep.',
      summary_en: 'Hierarchical Work Breakdown Structure (WBS) for cell site rollout, 100% Rule, and Scope Creep control.',
      sequence_order: 12,
      is_active: 1,
      wa_text_body: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Topik Hari Ini:* *Scope Baseline & WBS Dictionary Rollout Menara Seluler*

🔹 *Komponen Scope Baseline:*
1. *Project Scope Statement:* Deskripsi deliverables proyek, kriteria penerimaan, dan batasan eksplisit.
2. *Work Breakdown Structure (WBS):* Dekomposisi hierarkis berorientasi deliverable dari total lingkup kerja.
3. *WBS Dictionary:* Dokumen rincian teknis untuk setiap Work Package (spesifikasi, SOW, PIC, acceptance criteria).

🔹 *Aturan 100% (The 100% Rule):*
WBS wajib mencakup 100% pekerjaan yang disepakati dalam kontrak proyek—tidak boleh kurang (lingkup tertinggal) dan tidak boleh lebih (*Gold Plating*). Total anak cabang di level terbawah harus sama persis dengan total deliverable di level atasnya.

🔹 *Hirarki WBS Rollout Site Makro:*
• *Level 1:* Proyek Rollout 5G Kota Surabaya
• *Level 2:* 1.0 Site Acquisition (SITAC) | 2.0 Civil Works (CME) | 3.0 Telecom Equipment Installation (TI) | 4.0 Integration & On-Air
• *Level 3 (Work Package CME):* 2.1 Pembuatan Pondasi Tiang Pancang | 2.2 Erection Tower 42m | 2.3 Grounding & Anti-Petir (< 1 Ohm) | 2.4 Pagar & Shelter BBU

🔍 *Scope Creep vs. Gold Plating:*
• *Scope Creep:* Penambahan fitur/pekerjaan tanpa persetujuan resmi Change Control Board (CCB).
• *Gold Plating:* PM/tim memberikan fitur ekstra secara sukarela tanpa diminta pelanggan (misal: memberikan kabel optik kelas militer yang tidak ada di SOW)—ini dilarang dalam standar PMI karena memboroskan biaya dan menambah risiko.

Ketik */quiz* untuk latihan kuis! 🚀`,
      wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Today's Topic:* *Scope Baseline & WBS Dictionary in Cell Tower Rollouts*

🔹 *Components of the Scope Baseline:*
1. *Project Scope Statement:* Detailed deliverables, acceptance criteria, and explicit project exclusions.
2. *Work Breakdown Structure (WBS):* Deliverable-oriented hierarchical decomposition of the total work scope.
3. *WBS Dictionary:* Detailed technical specification sheets for every Work Package (SOW, owner, milestones, acceptance criteria).

🔹 *The 100% Rule:*
The WBS must encompass 100% of the work defined by the project scope and produce all deliverables. Nothing more, nothing less. Sum of subordinate work must roll up mathematically to 100% of parent deliverables.

🔹 *Macro Site WBS Decomposition:*
• *Level 1:* Surabaya National 5G Expansion
• *Level 2:* 1.0 Site Acquisition (SITAC) | 2.0 Civil Works (CME) | 3.0 Telecom Installation (TI) | 4.0 Commissioning & Acceptance
• *Level 3 (CME Work Package):* 2.1 Piling Foundation | 2.2 42m Tower Erection | 2.3 Lightning & Grounding Grid (< 1 Ohm) | 2.4 Shelter & Power Cage

🔍 *Scope Creep vs. Gold Plating:*
• *Scope Creep:* Uncontrolled expansion of scope without formal Change Control Board (CCB) review.
• *Gold Plating:* Giving extras to the customer that were not requested or contracted (e.g., providing mil-spec optical jumpers unrequested). PMI strictly discourages gold plating as it consumes reserves and introduces unbudgeted risk.

Type */quiz* to challenge this lesson! 🚀`
    },
    {
      module_code: 'MOD-PMP-03',
      category: 'pmp',
      level: 'Menengah',
      title: 'Schedule Management & Critical Path Method (CPM) Pembangunan Site',
      title_en: 'Schedule Management & Critical Path Method (CPM) in Tower Civil Works',
      tags: 'PMP,PMBOK,CPM,Critical Path,Total Float,Free Float,Fast Tracking,Crashing',
      summary: 'Kalkulasi lintasan kritis (CPM), Early/Late Start & Finish, kalkulasi Total Float, serta teknik kompresi jadwal.',
      summary_en: 'Critical Path Method (CPM) calculations, Early/Late dates, Total Float math, and schedule compression techniques.',
      sequence_order: 13,
      is_active: 1,
      wa_text_body: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Topik Hari Ini:* *Critical Path Method (CPM) & Kalkulasi Float pada Pembangunan Tower*

🔹 *Konsep Kunci CPM:*
*Critical Path (Lintasan Kritis)* adalah rangkaian aktivitas berurutan terpanjang dalam diagram jaringan proyek yang menentukan *durasi minimum proyek*. Aktivitas di lintasan kritis memiliki *Total Float = 0*. Jika tertunda 1 hari saja, seluruh proyek mundur 1 hari.

🔹 *Kalkulasi Forward & Backward Pass:*
1. *Forward Pass (Kiri ke Kanan):* Menghitung Early Start (ES) dan Early Finish (EF):
   \`\`\`EF = ES + Durasi - 1\`\`\` (atau \`\`\`EF = ES + Durasi\`\`\` model kontinu).
2. *Backward Pass (Kanan ke Kiri):* Menghitung Late Finish (LF) dan Late Start (LS):
   \`\`\`LS = LF - Durasi + 1\`\`\`.

🔹 *Rumus Float (Slack):*
• *Total Float (TF):* Toleransi keterlambatan aktivitas tanpa memundurkan tanggal selesai proyek:
  \`\`\`Total Float = LS - ES = LF - EF\`\`\`
• *Free Float (FF):* Toleransi keterlambatan aktivitas tanpa mengganggu Early Start (ES) aktivitas berikutnya:
  \`\`\`Free Float = ES (Aktivitas Penerus) - EF (Aktivitas Ini)\`\`\`

🔹 *Teknik Kompresi Jadwal (Schedule Compression):*
• *Crashing:* Menambah sumber daya untuk memangkas durasi dengan biaya tambahan (misal: menyewa 2 shift pekerja lembur untuk pengecoran pondasi beton).
• *Fast-Tracking:* Menjalankan aktivitas secara paralel yang semula berurutan (misal: memulai fabrikasi besi menara saat izin pemda masih proses review)—risiko rework tinggi!

Ketik */quiz* untuk menguji pemahaman kalkulasi float! 💡`,
      wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Today's Topic:* *Critical Path Method (CPM) & Float Calculations in Tower Works*

🔹 *Key CPM Concepts:*
The *Critical Path* is the sequence of activities that represents the longest path through a project, which determines the *shortest possible project duration*. Critical Path activities have *Total Float = 0*. Any delay on the critical path directly pushes out the final completion date.

🔹 *Forward & Backward Pass Logic:*
1. *Forward Pass (Left to Right):* Determines Early Start (ES) and Early Finish (EF):
   \`\`\`EF = ES + Duration - 1\`\`\`
2. *Backward Pass (Right to Left):* Determines Late Finish (LF) and Late Start (LS):
   \`\`\`LS = LF - Duration + 1\`\`\`

🔹 *Float (Slack) Formulas:*
• *Total Float (TF):* Amount of time an activity can be delayed without delaying the project finish date:
  \`\`\`Total Float = LS - ES = LF - EF\`\`\`
• *Free Float (FF):* Amount of time an activity can be delayed without delaying the Early Start (ES) of any immediate successor:
  \`\`\`Free Float = ES (Successor) - EF (Current Activity)\`\`\`

🔹 *Schedule Compression Techniques:*
• *Crashing:* Adding resources to shorten duration at the expense of additional cost (e.g., paying overtime for 24/7 concrete curing teams).
• *Fast-Tracking:* Performing activities in parallel that were originally planned sequentially (e.g., pulling fiber cables while civil trenching is halfway done)—increases risk and rework!

Type */quiz* to practice CPM calculations! 💡`
    },
    {
      module_code: 'MOD-PMP-04',
      category: 'pmp',
      level: 'Menengah',
      title: 'Earned Value Management (EVM) - PV, EV, AC, CPI & SPI Proyek Telco',
      title_en: 'Earned Value Management (EVM) - Core PV, EV, AC, CPI & SPI Math',
      tags: 'PMP,PMBOK,EVM,CPI,SPI,Cost Variance,Schedule Variance,EAC,BAC',
      summary: 'Fondasi matematika Earned Value Management (EVM), 4 variabel utama, variansi biaya/jadwal, dan indeks performa.',
      summary_en: 'Mathematical foundations of Earned Value Management (EVM), 4 core variables, variances, and performance indices.',
      sequence_order: 14,
      is_active: 1,
      wa_text_body: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Topik Hari Ini:* *Earned Value Management (EVM) - 4 Variabel & Formula Kunci*

🔹 *4 Variabel Dasar EVM:*
1. *BAC (Budget at Completion):* Total anggaran kontrak resmi (misal: 100 site @ $50.000 = $5.000.000).
2. *PV (Planned Value):* Anggaran yang direncanakan selesai per tanggal evaluasi:
   \`\`\`PV = % Rencana × BAC\`\`\`
3. *EV (Earned Value):* Nilai pekerjaan fisik yang benar-benar selesai diakui:
   \`\`\`EV = % Aktual Selesai × BAC\`\`\`
4. *AC (Actual Cost):* Total biaya nyata yang sudah dikeluarkan (faktur/invoice terbayar).

🔹 *Formula Variansi (Selisih Finansial):*
• *Cost Variance (CV):* \`\`\`CV = EV - AC\`\`\`
  - CV Positif (+) = Hemat / Di Bawah Anggaran (Under Budget).
  - CV Negatif (-) = Boros / Melebihi Anggaran (Over Budget).
• *Schedule Variance (SV):* \`\`\`SV = EV - PV\`\`\`
  - SV Positif (+) = Lebih Cepat dari Jadwal (Ahead of Schedule).
  - SV Negatif (-) = Terlambat dari Jadwal (Behind Schedule).

🔹 *Indeks Efisiensi (Rasio):*
• *Cost Performance Index (CPI):* \`\`\`CPI = EV / AC\`\`\`
  - CPI > 1.0: Efisien (misal 1.20 = tiap $1 pengeluaran menghasilkan $1.20 nilai deliverable).
  - CPI < 1.0: Tidak efisien.
• *Schedule Performance Index (SPI):* \`\`\`SPI = EV / PV\`\`\`
  - SPI > 1.0: Laju kerja lebih cepat dari rencana baseline.
  - SPI < 1.0: Laju kerja lebih lambat dari rencana baseline.

Ketik */quiz* untuk menghitung soal EVM! 📊`,
      wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Today's Topic:* *Earned Value Management (EVM) - 4 Core Variables & Performance Math*

🔹 *The 4 Fundamental EVM Variables:*
1. *BAC (Budget at Completion):* Total approved project budget (e.g., 100 sites @ $50,000 = $5,000,000).
2. *PV (Planned Value):* Authorized budget allocated to scheduled work:
   \`\`\`PV = % Planned Complete × BAC\`\`\`
3. *EV (Earned Value):* Value of physical work actually accomplished in terms of authorized budget:
   \`\`\`EV = % Actual Complete × BAC\`\`\`
4. *AC (Actual Cost):* Real money spent to accomplish the work (invoices paid to contractors).

🔹 *Variance Formulas (Dollar Difference):*
• *Cost Variance (CV):* \`\`\`CV = EV - AC\`\`\`
  - Positive CV (+) = Under Budget (Favorable).
  - Negative CV (-) = Over Budget (Unfavorable).
• *Schedule Variance (SV):* \`\`\`SV = EV - PV\`\`\`
  - Positive SV (+) = Ahead of Schedule (Favorable).
  - Negative SV (-) = Behind Schedule (Unfavorable).

🔹 *Efficiency Indices (Ratios):*
• *Cost Performance Index (CPI):* \`\`\`CPI = EV / AC\`\`\`
  - CPI > 1.0: Cost efficient (e.g., 1.20 = getting $1.20 worth of sites for every $1.00 spent).
  - CPI < 1.0: Cost overrun trend.
• *Schedule Performance Index (SPI):* \`\`\`SPI = EV / PV\`\`\`
  - SPI > 1.0: Progressing faster than baseline pace.
  - SPI < 1.0: Progressing slower than planned baseline.

Type */quiz* to solve an EVM exam calculation! 📊`
    },
    {
      module_code: 'MOD-PMP-05',
      category: 'pmp',
      level: 'Menengah',
      title: 'EVM Forecasting (EAC, ETC & TCPI) dalam Proyek Telekomunikasi',
      title_en: 'EVM Forecasting (EAC, ETC & TCPI) in Telecom Engineering',
      tags: 'PMP,PMBOK,EAC,ETC,TCPI,Forecasting,Estimate at Completion,EVM Math',
      summary: 'Peramalan biaya akhir proyek (EAC 4 skenario), sisa biaya penyelesaian (ETC), dan indeks kinerja yang harus dicapai (TCPI).',
      summary_en: 'Final cost forecasting (4 EAC scenarios), Estimate to Complete (ETC), and To-Complete Performance Index (TCPI).',
      sequence_order: 15,
      is_active: 1,
      wa_text_body: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Topik Hari Ini:* *Peramalan Biaya Akhir: EAC, ETC & TCPI*

🔹 *EAC (Estimate at Completion) - 4 Skenario PMP:*
EAC adalah estimasi total biaya akhir proyek saat selesai:
1. *Variansi tipikal akan terus berlanjut (Default formula):*
   \`\`\`EAC = BAC / CPI\`\`\`
2. *Pekerjaan sisa diestimasi sesuai anggaran rencana awal (Variansi masa lalu adalah atipikal):*
   \`\`\`EAC = AC + (BAC - EV)\`\`\`
3. *Dipengaruhi oleh performa biaya DAN jadwal sekaligus:*
   \`\`\`EAC = AC + [(BAC - EV) / (CPI × SPI)]\`\`\`
4. *Rencana awal cacat total & dilakukan estimasi ulang dari nol (Bottom-up ETC):*
   \`\`\`EAC = AC + Bottom-up ETC\`\`\`

🔹 *ETC (Estimate to Complete):*
Berapa biaya tambahan yang masih harus dikeluarkan untuk menyelesaikan sisa proyek:
\`\`\`ETC = EAC - AC\`\`\`

🔹 *TCPI (To-Complete Performance Index):*
Efisiensi biaya yang WAJIB dicapai pada sisa pekerjaan untuk memenuhi target anggaran:
• *Target memenuhi BAC awal:*
  \`\`\`TCPI = (BAC - EV) / (BAC - AC)\`\`\`
• *Target memenuhi EAC revisi baru:*
  \`\`\`TCPI = (BAC - EV) / (EAC - AC)\`\`\`

💡 *Interpretasi TCPI:*
Jika TCPI = 1.35, artinya untuk setiap sisa $1.00 anggaran, tim proyek wajib bekerja menghasilkan nilai deliverable setara $1.35. Jika TCPI > 1.20, PMI menganggap target hampir mustahil tercapai tanpa memangkas lingkup!

Ketik */quiz* untuk menghitung forecasting! 📈`,
      wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Today's Topic:* *Project Cost Forecasting: EAC, ETC & TCPI*

🔹 *EAC (Estimate at Completion) - 4 Exam Scenarios:*
The projected total cost of the project at completion:
1. *Current cost trends are expected to continue (Standard typical formula):*
   \`\`\`EAC = BAC / CPI\`\`\`
2. *Remaining work will be performed at the budgeted rate (Past variance was atypical):*
   \`\`\`EAC = AC + (BAC - EV)\`\`\`
3. *Both CPI and SPI will influence remaining work:*
   \`\`\`EAC = AC + [(BAC - EV) / (CPI × SPI)]\`\`\`
4. *Original budget baseline is flawed, requiring bottom-up re-estimate:*
   \`\`\`EAC = AC + Bottom-up ETC\`\`\`

🔹 *ETC (Estimate to Complete):*
The expected cost required to finish all remaining work:
\`\`\`ETC = EAC - AC\`\`\`

🔹 *TCPI (To-Complete Performance Index):*
The cost performance efficiency the team must maintain for the remaining work:
• *To finish within original BAC:*
  \`\`\`TCPI = (BAC - EV) / (BAC - AC)\`\`\`
• *To finish within revised EAC:*
  \`\`\`TCPI = (BAC - EV) / (EAC - AC)\`\`\`

💡 *TCPI Strategic Interpretation:*
If TCPI = 1.35, the team must produce $1.35 of output value for every remaining $1.00 spent. A TCPI > 1.20 is generally deemed unrealistic on PMP audits without scope descoping!

Type */quiz* to practice forecasting calculations! 📈`
    },
    {
      module_code: 'MOD-PMP-06',
      category: 'pmp',
      level: 'Menengah',
      title: 'Estimasi Tiga Titik & PERT (Beta Distribution) Gelaran Kabel Optik',
      title_en: 'Three-Point Estimating & PERT (Beta Distribution) in Optical Deployment',
      tags: 'PMP,PMBOK,PERT,Beta Distribution,Standard Deviation,Variance,Estimating',
      summary: 'Formula Program Evaluation and Review Technique (PERT), bobot Beta vs Triangular, standar deviasi, dan probabilitas penyelesaian.',
      summary_en: 'Program Evaluation and Review Technique (PERT) math, Beta vs Triangular weights, standard deviation, and confidence ranges.',
      sequence_order: 16,
      is_active: 1,
      wa_text_body: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Topik Hari Ini:* *Estimasi Tiga Titik & PERT (Beta Distribution) Penarikan Fiber Optik*

🔹 *Tiga Nilai Estimasi Durasi/Biaya:*
Saat mengestimasi durasi penarikan kabel fiber optik sejauh 50 km melintasi perbukitan:
• *Optimistic (O):* Skenario ideal (cuaca cerah, izin lancar, tanah lunak) = 14 hari.
• *Most Likely (M):* Skenario paling realistis dalam kondisi normal = 20 hari.
• *Pessimistic (P):* Skenario terburuk (hujan badai, batu keras, sengketa lahan) = 38 hari.

🔹 *Rumus PERT (Beta / Weighted Average):*
PMBOK standar memberikan bobot 4 kali lebih besar pada nilai paling mungkin (M):
\`\`\`Mean (μ) = (O + 4M + P) / 6\`\`\`

*Contoh Perhitungan:*
\`\`\`μ = [14 + (4 × 20) + 38] / 6 = [14 + 80 + 38] / 6 = 132 / 6 = 22 Hari\`\`\`

🔹 *Standar Deviasi (σ) & Variansi (V):*
• *Standar Deviasi:* \`\`\`σ = (P - O) / 6\`\`\`
  \`\`\`σ = (38 - 14) / 6 = 24 / 6 = 4 Hari\`\`\`
• *Variansi:* \`\`\`V = σ² = 4² = 16\`\`\`

🔹 *Rentang Probabilitas (Empirical Rule):*
• *68.26% Keyakinan (±1σ):* 22 ± 4 hari $\rightarrow$ 18 s/d 26 hari.
• *95.46% Keyakinan (±2σ):* 22 ± 8 hari $\rightarrow$ 14 s/d 30 hari.
• *99.73% Keyakinan (±3σ):* 22 ± 12 hari $\rightarrow$ 10 s/d 34 hari.

Ketik */quiz* untuk menguji rumus PERT! 📐`,
      wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Today's Topic:* *Three-Point Estimating & PERT Math in Fiber Optic Trenching*

🔹 *The Three Estimate Estimates:*
When estimating a 50 km optical fiber backbone installation through mountain terrain:
• *Optimistic (O):* Best-case scenario (dry weather, rapid ROW permits) = 14 days.
• *Most Likely (M):* Realistic everyday conditions = 20 days.
• *Pessimistic (P):* Worst-case scenario (monsoon rain, hard rock drilling) = 38 days.

🔹 *PERT Beta Distribution Formula:*
PMBOK standard weights the Most Likely estimate 4 times:
\`\`\`Expected Duration (μ) = (O + 4M + P) / 6\`\`\`

*Calculation Example:*
\`\`\`μ = [14 + (4 × 20) + 38] / 6 = [14 + 80 + 38] / 6 = 132 / 6 = 22 Days\`\`\`

🔹 *Standard Deviation (σ) & Variance (V):*
• *Standard Deviation:* \`\`\`σ = (P - O) / 6\`\`\`
  \`\`\`σ = (38 - 14) / 6 = 24 / 6 = 4 Days\`\`\`
• *Variance:* \`\`\`V = σ² = 4² = 16\`\`\`

🔹 *Confidence Intervals (Normal Distribution):*
• *68.26% Confidence (±1σ):* 22 ± 4 days $\rightarrow$ 18 to 26 days.
• *95.46% Confidence (±2σ):* 22 ± 8 days $\rightarrow$ 14 to 30 days.
• *99.73% Confidence (±3σ):* 22 ± 12 days $\rightarrow$ 10 to 34 days.

Type */quiz* to calculate a PERT question! 📐`
    },
    {
      module_code: 'MOD-PMP-07',
      category: 'pmp',
      level: 'Menengah',
      title: 'Quality Baseline, Acceptance Milestones (PAT, PAC, FAC) & SLA Telco',
      title_en: 'Quality Baseline, Acceptance Gates (PAT, PAC, FAC) & Carrier SLA',
      tags: 'PMP,PMBOK,PAT,PAC,FAC,Five Nines,Quality,Snag List,Warranty',
      summary: 'Tata kelola penerimaan hasil pekerjaan telekomunikasi: Uji PAT, Provisional Acceptance (PAC), Final Acceptance (FAC), dan SLA Five Nines.',
      summary_en: 'Telecom acceptance governance: PAT, Provisional Acceptance (PAC), Final Acceptance (FAC), and Five Nines SLA tolerances.',
      sequence_order: 17,
      is_active: 1,
      wa_text_body: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Topik Hari Ini:* *Gerbang Penerimaan Proyek: PAT, PAC, FAC & SLA Five-Nines*

🔹 *Tiga Gerbang Penerimaan Proyek Telco:*
1. *PAT (Preliminary Acceptance Test):*
   - Verifikasi teknis fisik per site (VSWR feeder < 1.3, grounding < 1 Ohm, optical loss OTDR < 0.25 dB/km, tes panggilan suara/data).
2. *PAC (Provisional Acceptance Certificate):*
   - Diterbitkan saat site on-air dan integrasi selesai.
   - Hak pengelolaan operasional (*Care, Custody, and Control*) berpindah ke Operator.
   - Memicu pembayaran termin besar (70%–80%) dan memulai masa garansi (*Warranty Period* biasanya 12 bulan).
   - Pekerjaan minor yang belum tuntas dicatat dalam *Snag List / Punch List*.
3. *FAC (Final Acceptance Certificate):*
   - Diterbitkan setelah masa garansi 12 bulan berakhir dan seluruh daftar snag list terselesaikan tanpa menyisakan cacat operasional.
   - Memicu pencairan uang retensi (*Retention Money* 10%–20%) dan penutupan resmi kontrak (*Contract Closure*).

🔹 *Carrier-Grade SLA "Five Nines" (99.999%):*
Downtime maksimum yang diizinkan untuk jaringan telekomunikasi tingkat operator:
• 99.0% Availability: Maksimal toleransi mati = *3.65 hari/tahun*.
• 99.9% Availability: Maksimal toleransi mati = *8.76 jam/tahun*.
• 99.99% Availability: Maksimal toleransi mati = *52.56 menit/tahun*.
• *99.999% (Five Nines):* Maksimal toleransi mati = *5.26 menit/tahun* (hanya 26 detik per bulan)!

Ketik */quiz* untuk menguji konsep acceptance gate! 🛡️`,
      wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Today's Topic:* *Acceptance Milestone Gates: PAT, PAC, FAC & Carrier SLAs*

🔹 *The 3 Formal Telecom Acceptance Gates:*
1. *PAT (Preliminary Acceptance Test):*
   - Individual physical site quality verification (feeder VSWR < 1.3, grounding < 1 Ohm, optical loss < 0.25 dB/km, test calls).
2. *PAC (Provisional Acceptance Certificate):*
   - Issued when site is integrated and live on-air.
   - *Care, Custody, and Control* transitions to the Operator.
   - Triggers the major milestone disbursement (70%–80%) and initiates the *Warranty Period* (typically 12 months).
   - Minor non-blocking items are captured in a binding *Punch List / Snag List*.
3. *FAC (Final Acceptance Certificate):*
   - Executed upon conclusion of the warranty period after all punch-list items are cleared.
   - Releases the contract *Retention Fee* (10%–20%) and triggers formal Contract Closure.

🔹 *Carrier-Grade "Five Nines" (99.999%) SLA Tolerances:*
Permissible cumulative outage windows for telco critical infrastructure:
• 99.0% Availability: Permissible outage = *3.65 days/year*.
• 99.9% Availability: Permissible outage = *8.76 hours/year*.
• 99.99% Availability: Permissible outage = *52.56 minutes/year*.
• *99.999% (Five Nines):* Permissible outage = *5.26 minutes/year* (only ~26 seconds per month)!

Type */quiz* to test acceptance milestones! 🛡️`
    },
    {
      module_code: 'MOD-PMP-08',
      category: 'pmp',
      level: 'Menengah',
      title: 'Risk Management, EMV & Cadangan Anggaran (Contingency vs Management)',
      title_en: 'Risk Management, EMV & Reserves (Contingency vs Management)',
      tags: 'PMP,PMBOK,Risk Register,EMV,Contingency Reserve,Management Reserve,Mitigation',
      summary: 'Identifikasi risiko di Risk Register, Expected Monetary Value (EMV), strategi mitigasi, dan tata kelola cadangan biaya.',
      summary_en: 'Risk Register tracking, Expected Monetary Value (EMV) math, response strategies, and budget reserve governance.',
      sequence_order: 18,
      is_active: 1,
      wa_text_body: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Topik Hari Ini:* *Manajemen Risiko, EMV & Cadangan Biaya Proyek Seluler*

🔹 *Expected Monetary Value (EMV):*
Metode kuantitatif untuk menghitung dampak moneter tertimbang dari risiko:
\`\`\`EMV = Probabilitas (P) × Dampak Finansial (I)\`\`\`

*Contoh Kasus Telco:*
Risiko robohnya crane sewa saat erection tower (P = 10%, Biaya kerugian = $200.000):
\`\`\`EMV = 0.10 × -$200.000 = -$20.000\`\`\`

🔹 *Strategi Respon Risiko Negatif (Threats):*
1. *Avoid (Menghindari):* Mengubah rencana proyek untuk menghilangkan ancaman (misal: memindahkan rute fiber menjauhi tebing rawan longsor).
2. *Mitigate (Memitigasi):* Mengurangi probabilitas atau dampak (misal: memasang genset backup ganda untuk mencegah mati daya).
3. *Transfer (Mengalihkan):* Memindahkan konsekuensi finansial ke pihak ketiga (misal: membeli asuransi konstruksi / CAR Insurance, mensubkontrakkan pekerjaan berisiko tinggi).
4. *Accept (Menerima):* Menerima secara aktif dengan menyiapkan cadangan anggaran (*Contingency Reserve*).

🔹 *Contingency Reserve vs. Management Reserve:*
• *Contingency Reserve:*
  - Mengantisipasi risiko *Known-Unknowns* (risiko yang sudah teridentifikasi dalam Risk Register).
  - Termasuk di dalam *Cost Baseline*.
  - Otoritas penggunaan ada pada *Project Manager*.
• *Management Reserve:*
  - Mengantisipasi risiko *Unknown-Unknowns* (kejadian tak terduga di luar perkiraan, misal: embargo chip semikonduktor mendadak).
  - Di luar Cost Baseline (tetapi bagian dari total Project Budget).
  - Memerlukan persetujuan *Change Control Board (CCB) / Project Sponsor*.

Ketik */quiz* untuk latihan soal risiko PMP! ⚠️`,
      wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Today's Topic:* *Risk Management, EMV & Budget Reserves in Telco Projects*

🔹 *Expected Monetary Value (EMV):*
A quantitative risk modeling technique that calculates probability-weighted financial impact:
\`\`\`EMV = Probability (P) × Impact (I)\`\`\`

*Telco Rollout Example:*
Risk of specialized crane collapse during tower erection (P = 10%, Financial Impact = -$200,000):
\`\`\`EMV = 0.10 × -$200,000 = -$20,000\`\`\`

🔹 *Threat Response Strategies (PMBOK):*
1. *Avoid:* Modify project management plan to eliminate threat entirely (e.g., reroute optical trench away from unstable hillside).
2. *Mitigate:* Reduce probability or severity of impact (e.g., install dual redundant rectifiers).
3. *Transfer:* Shift financial liability to a third party (e.g., purchasing Contractor's All Risk / CAR insurance policies).
4. *Accept:* Passive acceptance (do nothing) or active acceptance by allocating a *Contingency Reserve*.

🔹 *Contingency Reserve vs. Management Reserve:*
• *Contingency Reserve:*
  - Dedicated to *Known-Unknowns* (identified risks cataloged in Risk Register).
  - Included directly within the *Cost Baseline*.
  - Managed under direct authority of the *Project Manager*.
• *Management Reserve:*
  - Dedicated to *Unknown-Unknowns* (unpredictable events, e.g., sudden national trade embargo).
  - Outside the Cost Baseline (part of total Project Budget).
  - Requires formal approval from the *Change Control Board (CCB) or Project Sponsor*.

Type */quiz* to practice risk reserve questions! ⚠️`
    },
    {
      module_code: 'MOD-PMP-09',
      category: 'pmp',
      level: 'Menengah',
      title: 'Pengadaan, Tipe Kontrak (FFP, CPFF, T&M) & Point of Total Assumption (PTA)',
      title_en: 'Procurement, Contract Types (FFP, CPFF, T&M) & PTA Math',
      tags: 'PMP,PMBOK,Procurement,FFP,CPFF,T&M,PTA,Liquidated Damages,Contracts',
      summary: 'Perbandingan risiko finansial kontrak pengadaan, kalkulasi Point of Total Assumption (PTA), dan klausul Liquidated Damages.',
      summary_en: 'Procurement contract risk spectrum, Point of Total Assumption (PTA) mathematical modeling, and Liquidated Damages.',
      sequence_order: 19,
      is_active: 1,
      wa_text_body: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Topik Hari Ini:* *Kontrak Pengadaan, Rumus PTA & Denda Liquidated Damages*

🔹 *Spektrum Risiko Finansial Kontrak:*
• *Firm Fixed Price (FFP):*
  - Harga borongan tetap untuk lingkup kerja yang spesifikasinya terdefinisi sempurna.
  - *Risiko finansial tertinggi ada pada Penjual (Vendor/Subkontraktor)*.
• *Cost Plus Fixed Fee (CPFF):*
  - Pembeli mengganti seluruh biaya riil vendor ditambah fee keuntungan tetap.
  - *Risiko finansial tertinggi ada pada Pembeli (Operator)*.
• *Time & Materials (T&M):*
  - Hibrida berdasarkan jam kerja teknisi + harga suku cadang (cocok untuk perbaikan darurat fiber putus).

🔹 *Point of Total Assumption (PTA) pada Kontrak FPIF:*
Titik biaya di mana setiap tambahan $1 biaya akan ditanggung 100% oleh vendor:
\`\`\`PTA = [(Ceiling Price - Target Price) / Buyer Share Ratio] + Target Cost\`\`\`

*Contoh Perhitungan:*
• Target Cost = $10.000.000, Target Fee = $1.000.000
• Target Price = Target Cost + Fee = $11.000.000
• Ceiling Price = $12.000.000
• Share Ratio = 80% Buyer / 20% Seller (0.80)

\`\`\`PTA = [($12.000.000 - $11.000.000) / 0.80] + $10.000.000\`\`\`
\`\`\`PTA = ($1.000.000 / 0.80) + $10.000.000 = $1.250.000 + $10.000.000 = $11.250.000\`\`\`

🔹 *Liquidated Damages (LD):*
Klausul denda keterlambatan per hari (misal: 0.2% per hari dari nilai PO) jika site telat on-air melewati tanggal komitmen kontrak, umumnya dibatasi maksimal 10% dari total nilai kontrak.

Ketik */quiz* untuk menghitung PTA! ⚖️`,
      wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Today's Topic:* *Procurement Contracts, PTA Formula & Liquidated Damages*

🔹 *Contract Financial Risk Spectrum:*
• *Firm Fixed Price (FFP):*
  - Lump-sum fixed price for thoroughly specified deliverables.
  - *Highest cost risk lies with Seller (Vendor)*.
• *Cost Plus Fixed Fee (CPFF):*
  - Buyer reimburses all legitimate costs plus a fixed fee profit.
  - *Highest cost risk lies with Buyer (Operator)*.
• *Time and Materials (T&M):*
  - Rate per hour plus materials (ideal for ad-hoc emergency fiber splicing crews).

🔹 *Point of Total Assumption (PTA) in FPIF Contracts:*
The cost point beyond which the seller absorbs 100% of cost overruns:
\`\`\`PTA = [(Ceiling Price - Target Price) / Buyer Share Ratio] + Target Cost\`\`\`

*Step-by-Step Calculation:*
• Target Cost = $10,000,000, Target Fee = $1,000,000
• Target Price = Target Cost + Fee = $11,000,000
• Ceiling Price = $12,000,000
• Share Ratio = 80% Buyer / 20% Seller (0.80)

\`\`\`PTA = [($12,000,000 - $11,000,000) / 0.80] + $10,000,000\`\`\`
\`\`\`PTA = ($1,000,000 / 0.80) + $10,000,000 = $1,250,000 + $10,000,000 = $11,250,000\`\`\`

🔹 *Liquidated Damages (LD):*
Pre-agreed financial penalties assessed per day of unauthorized delay beyond contract milestones (e.g., 0.2% per calendar day, typically capped at 10% of total contract value).

Type */quiz* to practice a contract calculation! ⚖️`
    },
    {
      module_code: 'MOD-PMP-10',
      category: 'pmp',
      level: 'Menengah',
      title: 'Pengiriman Agile & Hybrid dalam Jaringan 5G, O-RAN & PMBOK 7th Ed',
      title_en: 'Agile & Hybrid Delivery in 5G Networks, O-RAN & PMBOK 7th Ed',
      tags: 'PMP,PMBOK 7,Agile,Scrum,Sprint,Kanban,WIP Limits,O-RAN,Definition of Done',
      summary: 'Penerapan framework hibrida (Predictive CME + Agile Core/O-RAN), upacara Scrum, limit WIP Kanban, dan Performance Domains PMBOK 7.',
      summary_en: 'Applying Hybrid frameworks (Predictive Civil + Agile 5GC/O-RAN), Scrum ceremonies, Kanban WIP limits, and PMBOK 7th Ed Domains.',
      sequence_order: 20,
      is_active: 1,
      wa_text_body: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Topik Hari Ini:* *Manajemen Proyek Agile & Hibrida pada Jaringan 5G Cloud-Native*

🔹 *Model Pengiriman Hibrida dalam Telekomunikasi:*
Proyek modern 5G membagi pekerjaan ke dalam dua pendekatan simultan:
1. *Lapisan Prediktif (Waterfall):* Pembangunan fisik menara, perizinan pemda, pondasi sipil, dan pasokan kabel listrik PLN (lingkup pasti, biaya perubahan tinggi).
2. *Lapisan Adaptif (Agile / Scrum):* Pengembangan microservices 5G Core, orkestrasi Kubernetes CNF, algoritma rApps/xApps O-RAN, dan otomatisasi pengujian CI/CD (lingkup berkembang, biaya perubahan rendah).

🔹 *Upacara & Artefak Scrum Kunci:*
• *Product Backlog:* Daftar fitur jaringan yang diprioritaskan oleh Product Owner.
• *Sprint Planning & Sprint Backlog:* Komitmen tim teknis untuk deliverable 2 minggu ke depan.
• *Daily Standup (15 Menit):* Apa yang selesai kemarin? Apa rencana hari ini? Apa hambatan (*blockers*)?
• *Definition of Done (DoD):* Standar kualitas sebelum deliverable diakui (unit test lulus, scan celah keamanan lolos, integrasi lab tervalidasi).

🔹 *Kanban untuk Troubleshooting Lapangan & Snag List:*
Kanban mengelola aliran kerja kontinu melalui visualisasi swimlane dan *WIP (Work in Progress) Limits*.
*Tujuan WIP Limit:* Mencegah penumpukan pekerjaan (bottleneck) di tim legal atau RF drive-test agar fokus menyelesaikan tiket yang ada sebelum membuka tiket baru!

🔹 *PMBOK 7th Edition Focus:*
Bergeser dari sekadar "mengikuti proses" menuju *Pengiriman Nilai (Value Delivery)*, Kepemimpinan yang Melayani (*Servant Leadership*), dan ketangkasan mengelola ketidakpastian.

Ketik */quiz* untuk menguji konsep Agile/Hybrid PMP! 🚀`,
      wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Telecom Project Management (PMP)*

*Today's Topic:* *Agile & Hybrid Delivery in 5G Cloud-Native Networks (PMBOK 7)*

🔹 *The Telco Hybrid Delivery Model:*
Modern 5G infrastructure projects integrate dual delivery lifecycles:
1. *Predictive Layer (Waterfall):* Tower civil works, municipal right-of-way permits, foundation piling, and power grid interconnects (fixed specs, high cost of change).
2. *Adaptive Layer (Agile / Scrum):* 5G Core microservices, Kubernetes CNF orchestration, O-RAN xApps/rApps algorithms, and CI/CD automated pipeline testing (emergent features, low cost of change).

🔹 *Core Scrum Ceremonies & Artifacts:*
• *Product Backlog:* Global prioritized requirement list curated by the Product Owner.
• *Sprint Planning & Sprint Backlog:* Development team's 2-week timeboxed commitment.
• *Daily Scrum (15 Minutes):* What did I do yesterday? What will I do today? Are there any blockers?
• *Definition of Done (DoD):* Universal quality checklist (e.g., unit test >80%, security scan passed, pre-prod lab verified).

🔹 *Kanban for Field Troubleshooting & Punch-Lists:*
Kanban optimizes continuous flow using visual boards and strict *Work in Progress (WIP) Limits*.
*Purpose of WIP Limits:* Eliminates bottlenecks in site auditing or drive test triage by preventing teams from starting new tasks before finishing active work in progress!

🔹 *PMBOK 7th Edition Mindset:*
Transitioning from rigid process compliance to *Value Delivery*, *Servant Leadership*, and navigating complex uncertainty across the 8 Project Performance Domains.

Type */quiz* to practice Agile hybrid questions! 🚀`
    }
  ];

  const PMP_QUIZZES = [
    {
      module_code: 'MOD-PMP-01',
      category: 'pmp',
      question: 'Seorang Project Manager (PM) memimpin penggelaran 300 site 5G. Saat proses konstruksi menara dimulai, sekelompok tokoh masyarakat lokal memblokir akses ke lokasi karena kekhawatiran radiasi elektromagnetik (EMF). Apa tindakan PERTAMA yang harus diambil oleh PM sesuai standar PMBOK?',
      question_en: 'A Project Manager (PM) is leading a 300-site 5G rollout. When tower construction begins, local community leaders block site access due to electromagnetic radiation (EMF) health concerns. What is the FIRST action the PM should take according to PMBOK standards?',
      option_a: 'Meminta bantuan aparat keamanan untuk membubarkan warga agar proyek tidak terlambat',
      option_a_en: 'Request police assistance to disperse the community to protect the project schedule',
      option_b: 'Meninjau Stakeholder Engagement Plan dan mengadakan sesi dialog edukasi dengan menyajikan laporan kepatuhan standar keselamatan radiasi ICNIRP/WHO',
      option_b_en: 'Review the Stakeholder Engagement Plan and conduct an educational dialogue presenting official ICNIRP/WHO radiation safety compliance reports',
      option_c: 'Langsung merelokasi menara ke lokasi lain tanpa berkonsultasi dengan Project Sponsor',
      option_c_en: 'Immediately relocate the tower to an alternate candidate site without consulting the Project Sponsor',
      option_d: 'Menghentikan proyek secara permanen dan menerbitkan Change Request pembatalan site',
      option_d_en: 'Permanently cancel the site build and submit a Change Request to de-scope the site',
      correct_option: 'B',
      explanation: 'Sesuai standar PMI PMBOK (Stakeholder Management), saat terjadi resistensi pemangku kepentingan, PM harus berkonsultasi dengan Stakeholder Engagement Plan dan melakukan pendekatan proaktif edukatif (Manage Closely/Keep Informed) dengan menyajikan data teknis keselamatan radiasi terverifikasi sebelum mengambil tindakan eskalasi atau relokasi.',
      explanation_en: 'According to PMI PMBOK (Stakeholder Engagement), when stakeholder resistance arises, the PM must first consult the Stakeholder Engagement Plan and engage proactively through transparent dialogue and validated safety data (ICNIRP/WHO) before contemplating costly site relocations or heavy-handed escalation.',
      difficulty: 'Menengah',
      is_active: 1
    },
    {
      module_code: 'MOD-PMP-02',
      category: 'pmp',
      question: 'Subkontraktor CME berinisiatif mengganti kabel jumper tembakau standar dengan kabel optik lapis baja kelas militer berkecepatan tinggi tanpa meminta biaya tambahan kepada PM. Dalam terminologi PMI, tindakan ini disebut...',
      question_en: 'A CME civil contractor decides on their own initiative to replace standard feeder jumpers with military-grade armored optical fiber jumpers at no extra charge to the project. In PMI terminology, this is known as...',
      option_a: 'Scope Creep',
      option_a_en: 'Scope Creep',
      option_b: 'Value Engineering',
      option_b_en: 'Value Engineering',
      option_c: 'Gold Plating',
      option_c_en: 'Gold Plating',
      option_d: 'Crashing',
      option_d_en: 'Crashing',
      correct_option: 'C',
      explanation: 'Tindakan memberikan deliverable atau kualitas ekstra di luar lingkup resmi yang disepakati tanpa persetujuan pelanggan/CCB disebut "Gold Plating". Standar PMI melarang Gold Plating karena dapat menambah risiko pemeliharaan, kompatibilitas, dan memboroskan sumber daya organisasi.',
      explanation_en: 'Providing extra features or higher specifications not contracted in the agreed scope without customer/CCB approval is called "Gold Plating". PMI strictly discourages Gold Plating because it introduces hidden maintenance risks, potential compatibility issues, and expends reserves needlessly.',
      difficulty: 'Menengah',
      is_active: 1
    },
    {
      module_code: 'MOD-PMP-03',
      category: 'pmp',
      question: 'Pada jadwal pembangunan menara telekomunikasi, Aktivitas "Pengecoran Pondasi Beton" memiliki Early Start (ES) = Hari 12, Early Finish (EF) = Hari 20, Late Start (LS) = Hari 18, dan Late Finish (LF) = Hari 26. Berapa nilai Total Float dari aktivitas ini?',
      question_en: 'In a cell tower construction schedule, Activity "Concrete Foundation Curing" has Early Start (ES) = Day 12, Early Finish (EF) = Day 20, Late Start (LS) = Day 18, and Late Finish (LF) = Day 26. What is the Total Float of this activity?',
      option_a: '0 Hari (Aktivitas Kritis)',
      option_a_en: '0 Days (Critical Activity)',
      option_b: '4 Hari',
      option_b_en: '4 Days',
      option_c: '6 Hari',
      option_c_en: '6 Days',
      option_d: '8 Hari',
      option_d_en: '8 Days',
      correct_option: 'C',
      explanation: 'Rumus Total Float adalah TF = LS - ES atau TF = LF - EF. Dengan memasukkan angka: TF = 18 - 12 = 6 hari (atau TF = 26 - 20 = 6 hari). Karena TF > 0, aktivitas ini memiliki kelonggaran 6 hari sebelum menggeser tanggal akhir proyek.',
      explanation_en: 'The formula for Total Float is TF = LS - ES or TF = LF - EF. Calculating: TF = 18 - 12 = 6 days (or TF = 26 - 20 = 6 days). Since TF = 6 > 0, this activity has 6 days of float and is not on the critical path.',
      difficulty: 'Menengah',
      is_active: 1
    },
    {
      module_code: 'MOD-PMP-04',
      category: 'pmp',
      question: 'Sebuah proyek penggelaran 100 site memiliki total anggaran BAC = $4.000.000 ($40.000/site). Pada bulan ke-4, rencana menjadwalkan 50 site selesai (PV = $2.000.000). Namun, data lapangan menunjukkan baru 40 site yang selesai dan tim telah menghabiskan dana aktual AC = $2.500.000. Berapa nilai CPI dan SPI proyek saat ini?',
      question_en: 'A 100-site rollout project has an approved BAC of $4,000,000 ($40,000/site). At month 4, the plan called for 50 sites to be completed (PV = $2,000,000). However, field reports verify only 40 sites are finished, and Actual Cost spent is AC = $2,500,000. What are the current CPI and SPI?',
      option_a: 'CPI = 0.64 dan SPI = 0.80',
      option_a_en: 'CPI = 0.64 and SPI = 0.80',
      option_b: 'CPI = 0.80 dan SPI = 0.80',
      option_b_en: 'CPI = 0.80 and SPI = 0.80',
      option_c: 'CPI = 0.80 dan SPI = 1.25',
      option_c_en: 'CPI = 0.80 and SPI = 1.25',
      option_d: 'CPI = 1.25 dan SPI = 0.64',
      option_d_en: 'CPI = 1.25 and SPI = 0.64',
      correct_option: 'A',
      explanation: 'Langkah hitung: 1. EV = 40 site × $40.000 = $1.600.000. 2. CPI = EV / AC = $1.600.000 / $2.500.000 = 0.64 (Over Budget / Boros). 3. SPI = EV / PV = $1.600.000 / $2.000.000 = 0.80 (Behind Schedule / Terlambat). Maka CPI = 0.64 dan SPI = 0.80.',
      explanation_en: 'Step-by-step: 1. EV = 40 sites × $40,000 = $1,600,000. 2. CPI = EV / AC = $1,600,000 / $2,500,000 = 0.64 (Over budget). 3. SPI = EV / PV = $1,600,000 / $2,000,000 = 0.80 (Behind schedule). Therefore, CPI = 0.64 and SPI = 0.80.',
      difficulty: 'Menengah',
      is_active: 1
    },
    {
      module_code: 'MOD-PMP-05',
      category: 'pmp',
      level: 'Menengah',
      question: 'Sebuah proyek modernisasi transmisi memiliki BAC = $1.000.000. Saat ini EV = $600.000 dan AC = $750.000. Berapa nilai TCPI (To-Complete Performance Index) yang harus dijaga tim agar proyek tetap selesai dalam batas anggaran awal (BAC)?',
      question_en: 'A transmission modernization project has a BAC of $1,000,000. Currently, EV = $600,000 and AC = $750,000. What is the TCPI (To-Complete Performance Index) required to finish the project within the original approved budget (BAC)?',
      option_a: '0.80',
      option_a_en: '0.80',
      option_b: '1.25',
      option_b_en: '1.25',
      option_c: '1.60',
      option_c_en: '1.60',
      option_d: '2.00',
      option_d_en: '2.00',
      correct_option: 'C',
      explanation: 'Rumus TCPI berbasis BAC adalah TCPI = (BAC - EV) / (BAC - AC). Masukkan angka: TCPI = ($1.000.000 - $600.000) / ($1.000.000 - $750.000) = $400.000 / $250.000 = 1.60. Artinya sisa pekerjaan harus dikerjakan dengan efisiensi 160% untuk mengkompensasi pemborosan masa lalu.',
      explanation_en: 'The formula for TCPI based on original BAC is TCPI = (BAC - EV) / (BAC - AC). Substituting: TCPI = ($1,000,000 - $600,000) / ($1,000,000 - $750,000) = $400,000 / $250,000 = 1.60. The remaining work must be executed at 160% cost efficiency to recover the budget deficit.',
      difficulty: 'Menengah',
      is_active: 1
    },
    {
      module_code: 'MOD-PMP-06',
      category: 'pmp',
      level: 'Menengah',
      question: 'Untuk penarikan kabel optik backbone bawah tanah, estimator lapangan memberikan estimasi tiga titik: Optimistic = 10 hari, Most Likely = 16 hari, dan Pessimistic = 34 hari. Berdasarkan metode PERT (Beta Distribution), berapa durasi yang diharapkan (Mean) dan Standar Deviasi (σ)?',
      question_en: 'For underground backbone fiber installation, field estimators provide three-point estimates: Optimistic = 10 days, Most Likely = 16 days, and Pessimistic = 34 days. Using the PERT Beta Distribution, what is the Expected Duration (Mean) and Standard Deviation (σ)?',
      option_a: 'Mean = 16 hari, σ = 4 hari',
      option_a_en: 'Mean = 16 days, σ = 4 days',
      option_b: 'Mean = 18 hari, σ = 4 hari',
      option_b_en: 'Mean = 18 days, σ = 4 days',
      option_c: 'Mean = 18 hari, σ = 6 hari',
      option_c_en: 'Mean = 18 days, σ = 6 days',
      option_d: 'Mean = 20 hari, σ = 4 hari',
      option_d_en: 'Mean = 20 days, σ = 4 days',
      correct_option: 'B',
      explanation: '1. Rumus PERT Mean = (O + 4M + P) / 6 = [10 + (4 × 16) + 34] / 6 = [10 + 64 + 34] / 6 = 108 / 6 = 18 Hari. 2. Standar Deviasi σ = (P - O) / 6 = (34 - 10) / 6 = 24 / 6 = 4 Hari. Jadi Mean = 18 hari dan σ = 4 hari.',
      explanation_en: '1. PERT Mean = (O + 4M + P) / 6 = [10 + (4 × 16) + 34] / 6 = [10 + 64 + 34] / 6 = 108 / 6 = 18 days. 2. Standard Deviation σ = (P - O) / 6 = (34 - 10) / 6 = 24 / 6 = 4 days. Therefore, Mean = 18 days and σ = 4 days.',
      difficulty: 'Menengah',
      is_active: 1
    },
    {
      module_code: 'MOD-PMP-07',
      category: 'pmp',
      level: 'Menengah',
      question: 'Sebuah site 5G telah on-air dan seluruh trafik pelanggan beroperasi normal dengan KPI prima. Namun, subkontraktor belum mengecat ulang pagar pembatas shelter dan belum merapikan sisa puing semen (cacat minor non-kritis). Manakah tindakan kontrak yang paling tepat menurut tata kelola proyek telekomunikasi?',
      question_en: 'A 5G cell site is live on-air and customer traffic is operating normally with excellent KPIs. However, the civil subcontractor has not repainted the shelter security fence and left minor masonry debris on site (minor non-blocking snags). What is the most appropriate contractual action under standard telecom project governance?',
      option_a: 'Menolak menerbitkan PAC dan mematikan pemancar radio sampai puing dibersihkan',
      option_a_en: 'Refuse to issue PAC and shut down the radio transmitters until debris is cleared',
      option_b: 'Menerbitkan PAC bersyarat dengan melampirkan Punch List / Snag List yang wajib diselesaikan sebelum pengajuan FAC',
      option_b_en: 'Issue a conditional PAC with an attached Snag List / Punch List that must be resolved prior to FAC',
      option_c: 'Langsung menerbitkan FAC dan mencairkan uang retensi 100%',
      option_c_en: 'Immediately issue FAC and disburse 100% of retention funds',
      option_d: 'Memutus kontrak subkontraktor secara sepihak tanpa membayar pekerjaan yang sudah selesai',
      option_d_en: 'Unilaterally terminate the subcontractor contract without paying for completed work',
      correct_option: 'B',
      explanation: 'Dalam proyek telekomunikasi, jika fungsi utama sudah beroperasi dan aman, sertifikat penerimaan sementara (Provisional Acceptance Certificate / PAC) diterbitkan agar kepemilikan operasional berpindah ke operator, dengan melampirkan Punch List (daftar snag) untuk diselesaikan sebelum Final Acceptance (FAC) dan pencairan retensi.',
      explanation_en: 'In telecom infrastructure governance, when core services operate safely and meet KPIs, a Provisional Acceptance Certificate (PAC) is granted with an attached Punch List of minor items to be resolved before Final Acceptance (FAC) and warranty retention release.',
      difficulty: 'Menengah',
      is_active: 1
    },
    {
      module_code: 'MOD-PMP-08',
      category: 'pmp',
      level: 'Menengah',
      question: 'Di tengah proyek rollout nasional, kementerian perdagangan tiba-tiba mengeluarkan kebijakan embargo tarif impor baru sebesar 25% untuk modul radio Massive MIMO. Risiko tak terduga (Unknown-Unknown) ini harus ditangani menggunakan...',
      question_en: 'Midway through a national network rollout, the Ministry of Trade unexpectedly enacts a 25% import tariff on Massive MIMO radio units. This unforeseen unknown-unknown risk event should be funded from the...',
      option_a: 'Contingency Reserve dengan persetujuan langsung dari Project Manager',
      option_a_en: 'Contingency Reserve approved directly by the Project Manager',
      option_b: 'Management Reserve dengan persetujuan formal dari Project Sponsor / Change Control Board (CCB)',
      option_b_en: 'Management Reserve approved formally by the Project Sponsor / Change Control Board (CCB)',
      option_c: 'Gaji operasional tim proyek',
      option_c_en: 'Project engineering team operational payroll',
      option_d: 'Meminta subkontraktor lokal menanggung seluruh kenaikan tarif impor',
      option_d_en: 'Demanding local subcontractors absorb the entire import tariff surge',
      correct_option: 'B',
      explanation: 'Sesuai PMI PMBOK, risiko "Unknown-Unknown" (peristiwa tak terduga yang tidak pernah diidentifikasi dalam Risk Register) dibiayai menggunakan Management Reserve. Karena Management Reserve berada di luar Cost Baseline, penggunaannya WAJIB melalui persetujuan Change Request oleh Sponsor atau CCB.',
      explanation_en: 'According to PMI PMBOK, "Unknown-Unknowns" (unforeseen events not identified in the Risk Register) are funded via the Management Reserve. Since the Management Reserve sits outside the Cost Baseline, drawing from it requires formal Change Request approval from the Sponsor or CCB.',
      difficulty: 'Menengah',
      is_active: 1
    },
    {
      module_code: 'MOD-PMP-09',
      category: 'pmp',
      level: 'Menengah',
      question: 'Sebuah kontrak FPIF (Fixed Price Incentive Fee) memiliki Target Cost = $800.000, Target Fee = $80.000, Ceiling Price = $960.000, dan Rasio Bagi Biaya 80% Pembeli / 20% Penjual. Berapa nilai Point of Total Assumption (PTA)?',
      question_en: 'An FPIF (Fixed Price Incentive Fee) contract has Target Cost = $800,000, Target Fee = $80,000, Ceiling Price = $960,000, and a Share Ratio of 80% Buyer / 20% Seller. What is the Point of Total Assumption (PTA)?',
      option_a: '$850.000',
      option_a_en: '$850,000',
      option_b: '$880.000',
      option_b_en: '$880,000',
      option_c: '$900.000',
      option_c_en: '$900,000',
      option_d: '$960.000',
      option_d_en: '$960,000',
      correct_option: 'C',
      explanation: '1. Target Price = Target Cost + Target Fee = $800.000 + $80.000 = $880.000. 2. Rumus PTA = [(Ceiling Price - Target Price) / Buyer Share Ratio] + Target Cost. 3. PTA = [($960.000 - $880.000) / 0.80] + $800.000 = ($80.000 / 0.80) + $800.000 = $100.000 + $800.000 = $900.000.',
      explanation_en: '1. Target Price = Target Cost + Target Fee = $800,000 + $80,000 = $880,000. 2. PTA formula = [(Ceiling Price - Target Price) / Buyer Share Ratio] + Target Cost. 3. PTA = [($960,000 - $880,000) / 0.80] + $800,000 = ($80,000 / 0.80) + $800,000 = $100,000 + $800,000 = $900,000.',
      difficulty: 'Menengah',
      is_active: 1
    },
    {
      module_code: 'MOD-PMP-10',
      category: 'pmp',
      level: 'Menengah',
      question: 'Dalam proyek 5G hibrida, tim pengembang software O-RAN xApp sedang berada di pertengahan Sprint 2 minggu. Tiba-tiba perwakilan operator meminta penambahan fitur algoritma handover darurat ke dalam sprint yang sedang berjalan. Menurut praktik Agile / Scrum, tindakan terbaik Scrum Master adalah...',
      question_en: 'In a hybrid 5G project, the O-RAN xApp software team is midway through a 2-week Sprint. Suddenly, an operator stakeholder requests adding an emergency handover optimization algorithm into the active sprint. According to Agile / Scrum best practices, what should the Scrum Master do?',
      option_a: 'Langsung menyuruh para developer menghentikan tugas mereka dan memprogram fitur baru tersebut',
      option_a_en: 'Immediately direct developers to stop their tasks and code the new feature',
      option_b: 'Menolak secara kasar dan menyatakan bahwa Agile tidak menerima perubahan sama sekali',
      option_b_en: 'Rude rejection stating that Agile forbids any changes',
      option_c: 'Mengarahkan stakeholder untuk berdiskusi dengan Product Owner agar fitur tersebut dinilai nilainya, diestimasi, dan diprioritaskan ke dalam Product Backlog untuk sprint berikutnya',
      option_c_en: 'Direct the stakeholder to the Product Owner so the feature can be valued, estimated, and prioritized into the Product Backlog for upcoming sprints',
      option_d: 'Membatalkan sprint secara permanen dan kembali ke metode Waterfall',
      option_d_en: 'Permanently cancel the sprint and revert back to Waterfall',
      correct_option: 'C',
      explanation: 'Dalam Scrum, tim pengembang dilindungi dari gangguan perubahan mendadak selama Sprint aktif. Setiap kebutuhan baru wajib diarahkan kepada Product Owner (PO) yang memegang wewenang atas Product Backlog untuk diprioritaskan pada Sprint Planning berikutnya.',
      explanation_en: 'In Scrum, the development team is protected from scope churn during an active Sprint. Any new requests must be routed to the Product Owner (PO), who owns the Product Backlog and decides prioritization for subsequent sprints.',
      difficulty: 'Menengah',
      is_active: 1
    }
  ];

  // 1. Upsert Modul
  const modStmt = db.prepare(`
    INSERT INTO modules (
      module_code, category, level, title, title_en, tags, summary, summary_en,
      wa_text_body, wa_text_body_en, sequence_order, is_active
    ) VALUES (
      @module_code, @category, @level, @title, @title_en, @tags, @summary, @summary_en,
      @wa_text_body, @wa_text_body_en, @sequence_order, @is_active
    ) ON CONFLICT(module_code) DO UPDATE SET
      category = excluded.category,
      level = excluded.level,
      title = excluded.title,
      title_en = excluded.title_en,
      tags = excluded.tags,
      summary = excluded.summary,
      summary_en = excluded.summary_en,
      wa_text_body = excluded.wa_text_body,
      wa_text_body_en = excluded.wa_text_body_en,
      sequence_order = excluded.sequence_order,
      is_active = excluded.is_active
  `);

  for (const mod of PMP_MODULES) {
    modStmt.run(mod);
    console.log(`  ✅ Modul disemai: [${mod.module_code}] ${mod.title}`);
  }

  // 2. Map Module Codes ke Module IDs untuk Quizzes
  const quizStmt = db.prepare(`
    INSERT INTO quizzes (
      module_id, category, question, question_en,
      option_a, option_b, option_c, option_d,
      option_a_en, option_b_en, option_c_en, option_d_en,
      correct_option, explanation, explanation_en,
      difficulty, is_active
    ) VALUES (
      @module_id, @category, @question, @question_en,
      @option_a, @option_b, @option_c, @option_d,
      @option_a_en, @option_b_en, @option_c_en, @option_d_en,
      @correct_option, @explanation, @explanation_en,
      @difficulty, @is_active
    )
  `);

  for (const q of PMP_QUIZZES) {
    const modRow = db.prepare('SELECT id FROM modules WHERE module_code = ?').get(q.module_code);
    if (!modRow) {
      console.warn(`⚠️ Modul ${q.module_code} tidak ditemukan untuk kuis.`);
      continue;
    }

    const { module_code, level, ...quizData } = q;
    const params = { ...quizData, module_id: modRow.id };

    // Periksa apakah kuis untuk modul ini sudah ada di database
    const existingQuiz = db.prepare('SELECT id FROM quizzes WHERE module_id = ?').get(modRow.id);
    if (existingQuiz) {
      db.prepare(`
        UPDATE quizzes SET
          module_id = @module_id,
          category = @category,
          question = @question,
          question_en = @question_en,
          option_a = @option_a,
          option_b = @option_b,
          option_c = @option_c,
          option_d = @option_d,
          option_a_en = @option_a_en,
          option_b_en = @option_b_en,
          option_c_en = @option_c_en,
          option_d_en = @option_d_en,
          correct_option = @correct_option,
          explanation = @explanation,
          explanation_en = @explanation_en,
          difficulty = @difficulty,
          is_active = @is_active
        WHERE id = @id
      `).run({ ...params, id: existingQuiz.id });
      console.log(`  🔄 Kuis diperbarui untuk modul: [${q.module_code}]`);
    } else {
      quizStmt.run(params);
      console.log(`  ✅ Kuis disemai untuk modul: [${q.module_code}]`);
    }
  }

  console.log('🎉 Penyemaian Track Telecom Project Management (PMP) Selesai!');
}

// Eksekusi langsung jika dipanggil via node
if (process.argv[1] && process.argv[1].endsWith('seed_pmp_track.js')) {
  seedPmpTrack();
}
