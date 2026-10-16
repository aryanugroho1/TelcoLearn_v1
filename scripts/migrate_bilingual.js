/**
 * Migration script to populate English content for modules and quizzes
 */
import { getDb } from '../database/db.js';

export const ENGLISH_MODULES = {
  'MOD-5G-SA-01': {
    title_en: 'PDU Session Establishment & User Plane Setup',
    summary_en: '5G SA data session establishment flow from UE, AMF, SMF to gNodeB DRB allocation.',
    wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] 5G Standalone (SA) Call Flow*

*Today's Topic:* *PDU Session Establishment & User Plane Setup*

🔹 *Key Concepts:*
After the UE successfully registers with the AMF, it requires an IP data connection (*PDU Session*) to activate user plane traffic.

🔹 *Over-The-Air (OTA) Signaling Flow:*
1. The UE sends a NAS message: \`\`\`PDU Session Establishment Request\`\`\` (containing PDU Session ID, DNN/APN, and S-NSSAI slice).
2. The AMF forwards this over the N11 interface to the *SMF*.
3. The SMF selects a *UPF* and initiates a data tunnel across the N4 interface using *PFCP* (_Packet Forwarding Control Protocol_).
4. The gNB receives radio resource allocation and transmits \`\`\`RRCReconfiguration\`\`\` to establish a *Data Radio Bearer (DRB)* with the UE.

🔍 *Troubleshooting Tip in QXDM Logs:*
Look for packet *0xB801 (5G NAS)*. If \`\`\`5GSM Cause #27 (Missing or unknown DNN)\`\`\` appears, verify whether the APN/DNN in the SIM card profile matches the core network configuration.

Type */quiz* to test this concept or feel free to ask any technical questions! 🚀`
  },
  'MOD-5G-NSA-02': {
    title_en: '5G Non-Standalone (EN-DC Option 3x) & SgNB Addition',
    summary_en: 'Dual connectivity architecture with LTE Master Node and 5G Secondary Node.',
    wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] 5G NSA Architecture (EN-DC)*

*Today's Topic:* *EN-DC Option 3x & SgNB Addition Procedure*

🔹 *Key Concepts:*
In Option 3x (EN-DC), the LTE eNB acts as the *Master Node (MeNB)* connected to the EPC (4G Core), while the 5G gNB acts as the *Secondary Node (SgNB)* to boost user plane throughput.

🔹 *Signaling Flow:*
1. The UE sends a B1 measurement report (detecting strong NR signal).
2. The MeNB sends \`\`\`SgNB Addition Request\`\`\` to the gNB via the X2-C interface.
3. The gNB allocates NR radio resources and acknowledges with \`\`\`SgNB Addition Request Acknowledge\`\`\`.
4. The MeNB sends \`\`\`RRCConnectionReconfiguration\`\`\` enclosing *nr-Config-r15* to the UE.
5. The UE synchronizes to the NR carrier and returns \`\`\`RRCConnectionReconfigurationComplete\`\`\`.

🔍 *Troubleshooting Tip in Logs:*
Inspect packet *0xB0C0 (LTE RRC)*. A common failure is *SCG Failure Information* (such as \`\`\`synchReconfigFailureSCG\`\`\`) due to timing drift or beam failure on the secondary cell.

Type */quiz* to test your understanding! 💡`
  },
  'MOD-RRC-RLF-03': {
    title_en: 'Radio Link Failure (RLF) & Timers T310/T311',
    summary_en: 'Physical layer out-of-sync detection, T310 expiry, and RRC re-establishment.',
    wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Radio Protocols & OTA Logs*

*Today's Topic:* *Radio Link Failure (RLF) & Timers T310/T311*

🔹 *Key Concepts:*
When a UE enters a coverage hole or experiences sudden signal degradation, the physical layer reports *Out-Of-Sync (OOS)* indications to the RRC layer.

🔹 *RLF Timer Mechanism:*
1. When Layer 1 detects PDCCH BLER below threshold Qout for *N310* consecutive times, timer *T310* starts.
2. If recovery (*N311 In-Sync*) does not occur before T310 expires (default 1000ms), a *Radio Link Failure (RLF)* is declared.
3. The UE suspends radio transmissions and starts timer *T311* to search for a suitable cell.
4. The UE transmits an \`\`\`RRCReestablishmentRequest\`\`\` with cause \`\`\`otherFailure\`\`\` or \`\`\`handoverFailure\`\`\`.

🔍 *Troubleshooting Tip in QXDM Logs:*
If the log shows \`\`\`RRCConnectionReject\`\`\` or the UE drops directly to RRC_IDLE, check whether neighbor cells have a matching *UE context* or if *PCI confusion* exists.

Type */quiz* to take today's quiz!`
  },
  'MOD-NAS-SEC-04': {
    title_en: 'NAS Security Mode Command & 5G-GUTI Allocation',
    summary_en: 'NAS signaling encryption procedure and IMSI catcher mitigation.',
    wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Cellular Network Security*

*Today's Topic:* *NAS Security Mode Command & 5G-GUTI*

🔹 *Key Concepts:*
5G adopts much stricter device identity privacy compared to 4G LTE. The UE never transmits its raw IMSI in cleartext over the air; instead, it uses an encrypted *SUCI (Subscription Concealed Identifier)*.

🔹 *Security Setup Flow:*
1. The network validates UE authentication credentials via the *AUSF*.
2. The AMF sends \`\`\`Security Mode Command\`\`\` (selecting Ciphering & Integrity protection algorithms, e.g., NEA2/NIA2).
3. The UE verifies message integrity, enables ciphering, and responds with \`\`\`Security Mode Complete\`\`\`.
4. The network issues a new *5G-GUTI* to disguise the permanent identity in subsequent sessions.

🔍 *Troubleshooting Tip in Logs:*
If \`\`\`5GMM cause #9 (UE identity cannot be derived by the network)\`\`\` appears, the AMF has typically lost the context mapping for the previous GUTI stored in the modem.

Type */quiz* for a quick quiz challenge!`
  },
  'MOD-ML-RF-05': {
    title_en: 'Drive Test Anomaly Detection Using Isolation Forest & Autoencoder',
    summary_en: 'Unsupervised learning application to detect abnormal RSRP vs. Throughput correlations.',
    wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Applied Telco Machine Learning*

*Today's Topic:* *Drive Test Anomaly Detection (Isolation Forest & Autoencoder)*

🔹 *Key Concepts:*
In drive testing, the relationship between radio metrics (RSRP, SINR) and Throughput is non-linear and multidimensional. Static threshold rules (e.g., RSRP < -100 dBm) often miss complex failure modes.

🔹 *Real-World Scenario:*
A scenario where *RSRP is excellent (-75 dBm)* but *Throughput abruptly drops to 0 Mbps*.
• Root causes: MIMO rank degradation, scheduler bufferbloat, or cross-cell pilot pollution.

🔹 *ML Architecture:*
1. *Isolation Forest*: Isolates abnormal data points based on random binary tree partition depth (efficient for tabular datasets with hundreds of thousands of rows).
2. *Deep Autoencoder*: A neural network trained to reconstruct normal RF conditions. When an anomaly occurs, the *Reconstruction Loss (MSE)* spikes well beyond the 99th percentile threshold.

🔍 *Field Implementation:*
This model automates drive test log triage and flags problematic road segments for field engineer inspection!

Type */quiz* to test your Telco ML knowledge! 🤖`
  },
  'MOD-5G-NAS-06': {
    title_en: '5GMM Cause #11 (PLMN Not Allowed) & USIM FPLMN Handling',
    summary_en: 'Network SIM registration rejection and Forbidden PLMN list management.',
    wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] NAS & USIM Protocols*

*Today's Topic:* *5GMM Cause #11 (PLMN Not Allowed) & FPLMN Handling*

🔹 *Key Concepts:*
When a UE attempts registration with a cellular operator but the MCC-MNC identity is disallowed or lacks a roaming agreement, the Core Network (AMF) sends a NAS rejection.

🔹 *Rejection Mechanism:*
1. The AMF sends \`\`\`Registration Reject\`\`\` with IE \`\`\`5GMM Cause = 11 (PLMN not allowed)\`\`\`.
2. Per 3GPP TS 24.501, the UE immediately writes the target PLMN into the USIM memory under the EF_FPLMN (*Forbidden PLMN*) elementary file.
3. The UE modem enters *5GMM-DEREGISTERED.ATTEMPTING-REGISTRATION* or *LIMITED SERVICE* state.
4. The UE will NOT automatically re-attempt attachment on this PLMN until a power-cycle, SIM toggle, or manual network search in Settings is performed.

🔍 *Troubleshooting Tip in Lab Testing:*
Inspect your test SIM's FPLMN table using the modem AT command: \`\`\`AT+CPOL?\`\`\` or clear the FPLMN table using SIM configuration tools (e.g., SysmoSIM / Comprion tools).

Type */quiz* to test your understanding!`
  },
  'MOD-4G5G-HO-07': {
    title_en: '5G to 4G Inter-RAT Handover & Timer T304 Expiry',
    summary_en: 'Cross-generation 5G SA to LTE mobility flow and handover failure investigation.',
    wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Call Flow & Radio Mobility*

*Today's Topic:* *5G to 4G Inter-RAT Handover & Timer T304*

🔹 *Key Concepts:*
When 5G NR coverage degrades, the gNB commands the UE to hand over to a 4G LTE carrier without interrupting active user data sessions (*Inter-RAT Handover*).

🔹 *OTA Signaling Flow:*
1. The gNB configures measurement event B1/B2 (neighbor LTE cell signal exceeds threshold).
2. The UE sends a \`\`\`MeasurementReport\`\`\`.
3. The gNB initiates handover preparation to the AMF over N2, and the AMF coordinates with the 4G MME.
4. The UE receives \`\`\`RRCReconfiguration\`\`\` with *mobilityControlInfo* (carrying the target LTE cell PCI and timer T304).
5. Timer *T304* starts on the UE. The UE performs random access (RACH) to the target LTE cell.
6. If RACH succeeds before T304 expires, the UE transmits \`\`\`RRCConnectionReconfigurationComplete\`\`\` to the 4G eNB.

🔍 *Troubleshooting Tip in QXDM Logs:*
If \`\`\`HandoverFailure (T304 Expiry)\`\`\` appears, check if the target PCI suffers from heavy interference or unsynchronized timing advance (TA).

Type */quiz* for the evaluation quiz!`
  },
  'MOD-RF-KPI-08': {
    title_en: 'RF Optimization Metrics: RSRP, SINR, CQI, MCS, and BLER',
    summary_en: 'Key radio link quality metrics and link adaptation parameters.',
    wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Field & Drive Test Optimization*

*Today's Topic:* *Key RF Quality Metrics & Link Adaptation*

🔹 *Key Concepts:*
User plane throughput is governed by a chain of radio metrics from the physical layer up to transport:
• *RSRP (Reference Signal Received Power)*: Metric for coverage signal strength (dBm). Good rating: > -85 dBm.
• *SINR (Signal-to-Interference-plus-Noise Ratio)*: Signal purity relative to interference and noise (dB). High values (> 15 dB) enable 256-QAM modulation.
• *CQI (Channel Quality Indicator)*: 4-bit report (1–15) from UE to base station reflecting channel conditions.
• *MCS (Modulation and Coding Scheme)*: Combination of modulation order (QPSK, 16QAM, 64QAM, 256QAM) and code rate selected by the scheduler.
• *BLER (Block Error Rate)*: Transport block error ratio. Outer Loop Link Adaptation (OLLA) algorithms typically target ~10% initial transmission BLER.

🔍 *Troubleshooting Tip in the Field:*
If RSRP is strong (-75 dBm) but CQI is low (3–5), check for *Modulation de-correlation* or *pilot pollution* from overlapping neighbor cells with similar power levels.

Type */quiz* to test these concepts!`
  },
  'MOD-ML-LSTM-09': {
    title_en: 'Radio Traffic & Throughput Forecasting with LSTM Networks',
    summary_en: 'Recurrent neural network application for time-series cellular traffic load forecasting.',
    wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Machine Learning Telco*

*Today's Topic:* *Cellular Traffic Forecasting Using LSTM (Long Short-Term Memory)*

🔹 *Key Concepts:*
Cellular radio traffic (PRB utilization, active user count, download throughput) exhibits diurnal patterns (morning-afternoon-night) and weekly seasonality (weekdays vs. weekends).

🔹 *Model Architecture:*
1. Input tensor: Time-series sliding window of size [batch_size, time_steps, features] (features: PRB, mean RSRP, connected UEs, hour of day, day of week).
2. *LSTM* layers: Captures long-term temporal dependencies and traffic peak cycles without vanishing gradients.
3. Output layer: Multi-step traffic load forecast for 1 to 24 hours ahead.

🔹 *Industry Applications:*
• *Energy Saving (Cell Sleep Mode)*: Turning off secondary radio power amplifiers during predicted low-traffic periods without degrading customer QoS.
• *Proactive Admission Control*: Offloading traffic before public events or stadium matches cause cell congestion.

Type */quiz* for the ML quiz challenge!`
  },
  'MOD-ML-XGB-10': {
    title_en: 'UE Power Drain & Thermal Prediction Using Gradient Boosting (XGBoost)',
    summary_en: 'Predicting battery consumption and modem overheating in 5G carrier aggregation scenarios.',
    wa_text_body_en: `⏰ *[TelcoLearn Micro-Learning] Machine Learning Telco Testing*

*Today's Topic:* *Modem Power Drain & Thermal Prediction via XGBoost*

🔹 *Key Concepts:*
Operating 5G Standalone with Dual Uplink (Tx switching), Carrier Aggregation (CA 3CC/4CC), and continuous high-throughput transmission causes significant heat dissipation (*thermal throttling*) and aggressive battery consumption.

🔹 *Why XGBoost?*
Lab device test datasets consist of hundreds of tabular log parameters (Tx Power dBm, Band Combination, MIMO layers, thermal sensor ADC, ambient temperature, screen refresh rate). *XGBoost (Extreme Gradient Boosting)* excels on tabular data with high feature importance interpretability.

🔹 *Model Insights:*
• The #1 feature most strongly correlated with modem temperature increase is *continuous Uplink Tx Power above 20 dBm*.
• Enables QA teams to predict modem crash risks before launching 24-hour endurance field tests!

Type */quiz* for the ultimate module quiz! 🚀`
  }
};

export const ENGLISH_QUIZZES = {
  1: {
    question_en: 'In 5G Standalone (SA) architecture, what protocol is used between SMF and UPF to control packet forwarding over the N4 interface?',
    option_a_en: 'Diameter Protocol',
    option_b_en: 'Packet Forwarding Control Protocol (PFCP)',
    option_c_en: 'GTP-C (GPRS Tunneling Protocol Control)',
    option_d_en: 'HTTP/2 REST API',
    explanation_en: 'SMF and UPF communicate via the N4 interface using the PFCP protocol (3GPP TS 29.244) to separate control and user planes (CUPS).'
  },
  2: {
    question_en: 'In 5G Non-Standalone (EN-DC Option 3x) architecture, which interface connects the Master Node (LTE eNB) and Secondary Node (5G gNB) for control signaling?',
    option_a_en: 'S1-MME Interface',
    option_b_en: 'N2 Interface',
    option_c_en: 'X2-C Interface',
    option_d_en: 'F1-C Interface',
    explanation_en: 'In EN-DC architecture, control coordination between eNB and gNB runs over the X2-C (Control Plane) interface.'
  },
  3: {
    question_en: 'Which RRC timer is started when the UE physical layer detects consecutive Out-Of-Sync indications N310 times?',
    option_a_en: 'T300',
    option_b_en: 'T301',
    option_c_en: 'T310',
    option_d_en: 'T311',
    explanation_en: 'Timer T310 runs when the UE Layer 1 detects consecutive out-of-sync indications. If T310 expires before N311 in-sync indications are reached, Radio Link Failure (RLF) occurs.'
  },
  4: {
    question_en: 'To prevent IMSI Catcher attacks on 5G networks, what identity does the UE transmit over the air during initial registration before security context is established?',
    option_a_en: 'Plain IMSI',
    option_b_en: 'SUCI (Subscription Concealed Identifier)',
    option_c_en: 'MSISDN mobile number',
    option_d_en: 'Temporary IP Address',
    explanation_en: '5G introduces SUCI (Subscription Concealed Identifier), encrypted using the home network public key stored in the USIM card.'
  },
  5: {
    question_en: 'During 5G drive testing, if RSRP is excellent (-78 dBm) but download Throughput suddenly drops close to 0 Mbps, which unsupervised ML algorithm is ideal for detecting this multidimensional anomaly?',
    option_a_en: 'Linear Regression',
    option_b_en: 'Isolation Forest & Autoencoder',
    option_c_en: '1-Dimensional K-Means',
    option_d_en: 'Naive Bayes Classifier',
    explanation_en: 'Isolation Forest and Autoencoders are highly effective for detecting non-linear multidimensional anomalies without ground truth labels, where Autoencoder reconstruction error spikes noticeably.'
  },
  6: {
    question_en: 'When a UE receives a NAS Registration Reject with 5GMM Cause #11 (PLMN not allowed), what action does the UE take regarding this PLMN according to 3GPP TS 24.501?',
    option_a_en: 'Retry registration every 5 seconds',
    option_b_en: 'Add the PLMN to the Forbidden PLMN (FPLMN) list in the USIM',
    option_c_en: 'Resend RRCSetupRequest with emergency priority',
    option_d_en: 'Delete all APN profiles on the device',
    explanation_en: 'Per 3GPP specifications, Cause #11 mandates the UE to enter the target PLMN into the Forbidden PLMN (EF_FPLMN) list in the USIM and disallow automatic re-attempts on that PLMN.'
  },
  7: {
    question_en: 'In 5G to 4G Inter-RAT Handover, which RRC timer is started on the UE upon receiving RRCReconfiguration with mobilityControlInfo to limit the duration for completing RACH on the target cell?',
    option_a_en: 'Timer T300',
    option_b_en: 'Timer T310',
    option_c_en: 'Timer T304',
    option_d_en: 'Timer T311',
    explanation_en: 'Timer T304 controls the handover execution window. If the UE fails to complete Random Access (RACH) on the target cell before T304 expires, a Handover Failure occurs.'
  },
  8: {
    question_en: 'In cellular Outer Loop Link Adaptation (OLLA), what initial transmission Block Error Rate (BLER) target does the base station scheduler typically maintain?',
    option_a_en: 'Approximately 0.1%',
    option_b_en: 'Approximately 10%',
    option_c_en: 'Approximately 50%',
    option_d_en: 'Approximately 90%',
    explanation_en: 'Cellular network schedulers target approximately 10% first-transmission BLER to optimize spectral efficiency without excessive retransmissions.'
  },
  9: {
    question_en: 'In cellular time-series traffic load forecasting, why is LSTM architecture superior to a standard Feedforward Neural Network (MLP)?',
    option_a_en: 'Because LSTM only requires a single sample row',
    option_b_en: 'Because LSTM utilizes gating mechanisms to retain long-term sequential dependencies and diurnal patterns without vanishing gradients',
    option_c_en: 'Because LSTM does not require matrix multiplication',
    option_d_en: 'Because LSTM operates exclusively on frequency domain signals',
    explanation_en: 'LSTM cells use input, forget, and output gates to preserve long-term temporal dependencies across diurnal and weekly cycles without gradient degradation.'
  },
  10: {
    question_en: 'In 5G lab device thermal and battery testing, which feature is typically identified by tree-based models (like XGBoost) as having the highest correlation with rapid modem overheating?',
    option_a_en: 'Screen brightness level',
    option_b_en: 'Sustained continuous Uplink Tx Power above 20 dBm (e.g. Dual Tx / Band CA)',
    option_c_en: 'Audio codec sampling frequency',
    option_d_en: 'SIM card storage capacity',
    explanation_en: 'Sustained high Uplink RF transmission power (>20 dBm) drives peak power amplifier power dissipation and thermal buildup in the RF front-end module.'
  }
};

export function applyBilingualMigrations(db) {
  // 1. Alter modules table
  try {
    const modCols = db.prepare("PRAGMA table_info(modules)").all().map(c => c.name);
    if (!modCols.includes('wa_text_body_en')) {
      db.exec("ALTER TABLE modules ADD COLUMN wa_text_body_en TEXT;");
    }
    if (!modCols.includes('title_en')) {
      db.exec("ALTER TABLE modules ADD COLUMN title_en TEXT;");
    }
    if (!modCols.includes('summary_en')) {
      db.exec("ALTER TABLE modules ADD COLUMN summary_en TEXT;");
    }
  } catch (e) {
    console.warn('modules table alter warning:', e.message);
  }

  // 2. Alter quizzes table
  try {
    const quizCols = db.prepare("PRAGMA table_info(quizzes)").all().map(c => c.name);
    if (!quizCols.includes('question_en')) {
      db.exec("ALTER TABLE quizzes ADD COLUMN question_en TEXT;");
    }
    if (!quizCols.includes('option_a_en')) {
      db.exec("ALTER TABLE quizzes ADD COLUMN option_a_en TEXT;");
    }
    if (!quizCols.includes('option_b_en')) {
      db.exec("ALTER TABLE quizzes ADD COLUMN option_b_en TEXT;");
    }
    if (!quizCols.includes('option_c_en')) {
      db.exec("ALTER TABLE quizzes ADD COLUMN option_c_en TEXT;");
    }
    if (!quizCols.includes('option_d_en')) {
      db.exec("ALTER TABLE quizzes ADD COLUMN option_d_en TEXT;");
    }
    if (!quizCols.includes('explanation_en')) {
      db.exec("ALTER TABLE quizzes ADD COLUMN explanation_en TEXT;");
    }
  } catch (e) {
    console.warn('quizzes table alter warning:', e.message);
  }

  // 3. Update modules with English content
  const updateModStmt = db.prepare(`
    UPDATE modules 
    SET wa_text_body_en = ?, title_en = ?, summary_en = ?
    WHERE module_code = ?
  `);
  for (const [code, data] of Object.entries(ENGLISH_MODULES)) {
    updateModStmt.run(data.wa_text_body_en, data.title_en, data.summary_en, code);
  }

  // 4. Update quizzes with English content
  const updateQuizStmt = db.prepare(`
    UPDATE quizzes
    SET question_en = ?, option_a_en = ?, option_b_en = ?, option_c_en = ?, option_d_en = ?, explanation_en = ?
    WHERE id = ?
  `);
  for (const [id, data] of Object.entries(ENGLISH_QUIZZES)) {
    updateQuizStmt.run(
      data.question_en,
      data.option_a_en,
      data.option_b_en,
      data.option_c_en,
      data.option_d_en,
      data.explanation_en,
      parseInt(id, 10)
    );
  }

  console.log('✅ [Bilingual Migration] Successfully seeded English modules and quizzes into SQLite.');
}

// If run directly
if (process.argv[1] && process.argv[1].endsWith('migrate_bilingual.js')) {
  const db = getDb();
  applyBilingualMigrations(db);
}
