---
topic_key: nokia_sran_4g_lte_parameters
title: Nokia SRAN 4G LTE Parameters (LNBTS & LNCEL 25R2)
source_vendor: nokia
doc_type: parameter
technology: 4g_lte
category: 4g_lte
keywords: nokia, sran, 4g, lte, lnbts, lncel, sib, acbpr, catmcel, 25r2, parameter reference
summary: Daftar parameter resmi Nokia SRAN 25R2 untuk domain 4G LTE (LNBTS, LNCEL, SIB, dan Cell Resource Management).
---

# Nokia SRAN 4G LTE Parameters (LNBTS & LNCEL 25R2)

Daftar parameter resmi Nokia SRAN 25R2 untuk domain 4G LTE (LNBTS, LNCEL, SIB, dan Cell Resource Management).

| Abbreviated Name | MO Class | Full Name | Default Value | Range / Unit | Deskripsi Parameter |
|---|---|---|---|---|---|
| **`act1xCsfb`** | `MRBTS/LNBTS` | Activate 1xCSFB | - | 0 (false), 1 (true) | This parameter enables the feature LTE1441 enhanced CSFB to CDMA2000 1xRTT.  This parameter enables also the feature LTE1635 SIB8 AC Barring. |
| **`act64Mmes`** | `MRBTS/LNBTS` | Activate support of 64 LNMME instances per eNB | - | 0 (false), 1 (true) | Parameter act64Mmes activates the support of 64 LNMME instances per eNB. |
| **`act8EpsBearers`** | `MRBTS/LNBTS` | Activate Support of 8 EPS Bearers | - | 0 (false), 1 (true) | This parameter activates the support up to 8 EPS bearers. |
| **`actA3ScellSelect`** | `MRBTS/LNBTS` | Activate A3-based SCell selection | - | 0 (false), 1 (true) | This parameter activates the functionality for "Measurement-based SCell selection". |
| **`actASSecurityForCSFB`** | `MRBTS/LNBTS` | Activate AS security for Circuit Switch Fallback | - | 0 (false), 1 (true) | Parameter actASSecurityForCSFB activates/deactivates security enhancement for 2G/3G redirection. When this parameter is set to 'true', eNB will always enable AS(Access Stratum) security before trigger |
| **`actAcBarringACS`** | `MRBTS/LNBTS` | Activate AACB alarms counters and status | - | 0 (false), 1 (true) | This parameter activates/deactivates the feature Automatic Access Class Barring Alarms and Counters Enhancement. |
| **`actAcBarringCFR`** | `MRBTS/LNBTS` | Activate CFR based access class barring | - | 0 (false), 1 (true) | This parameter activates LTE4175 'Connection failure rate-based Access Class Barring'. The feature aggregates the number of RRC Connection Requests and the connection failure rate defined by the ratio |
| **`actAcBarringPlmn`** | `MRBTS/LNBTS` | Activate automatic access class barring per PLMN | - | 0 (false), 1 (true) | This parameter activates LTE2996 'PLMN Specific Access Class Barring'. |
| **`actAcBarringRrcConn`** | `MRBTS/LNBTS` | Activate RRC connection triggered access class barring | - | 0:None;
1:CellOnly;
2:CellAndPool | This parameter activates LTE2823 'RRC Connection triggered access class barring' or LTE3811 'RRC connection triggered access class barring - BB pool' in addition to LTE2823. The feature detects that n |
| **`actAcBarringRrcReq`** | `MRBTS/LNBTS` | Activate RACH load triggered access class barring | - | 0 (false), 1 (true) | This parameter activates  'RACH load triggered access class barring'.  The feature aggregates the number of RRC Connection Requests over sliding window and if it's exceeding start threshold it trigger |
| **`actAcBarringSpecialClass`** | `MRBTS/LNBTS` | Activate automatic access class barring for special classes | - | 0 (false), 1 (true) | This parameter activates LTE4627 'Step-wise Automatic Access Class Barring for Special Classes'.  Feature allows step-wise Special Access Class (AC11-AC15) barring. Maximum five steps are allowed and  |
| **`actAcSrvcc`** | `MRBTS/LNBTS` | Activate AC triggered SRVCC | - | 0 (false), 1 (true) | This parameter activates the functionality to accept an E-RAB with QCI#1 by overbooking in RAC and/or TAC and immediately trigger SRVCC to WCDMA for respective UE. |
| **`actAdvScellMeas`** | `MRBTS/LNBTS` | Activate advanced SCell measurement handling | - | 0 (false), 1 (true) | This parameter activates the feature for advanced SCell measurement handling for carrier aggregation. |
| **`actAdvStepwiseScellAdd`** | `MRBTS/LNBTS` | Activate advanced step-wise SCell addition | - | 0:off;
1:oneStepAdvanced;
2:buffer-based | Activate advanced step-wise SCell addition. If this parameter is set to 'oneStepAdvanced', and step-wise cell addition is enabled (numTxWithHighNonGbr is not equal to '0'), one step SCell addition occ |
| **`actAdvUlScellHandling`** | `MRBTS/LNBTS` | Activate advanced UL SCell handling | - | 0 (false), 1 (true) | This parameter activates the advanced SCell handling in uplink carrier aggregation:  - the PCell UL pathloss is checked for adding a DL+UL SCell and for downgrading a DL+UL SCell to a DL-only SCell. |
| **`actAmbrModCaTrigger`** | `MRBTS/LNBTS` | Activate CA algorithm trigger based on UE AMBR change | - | 0 (false), 1 (true) | This parameter activates the processing of UE AMBR received in E-RAB Modify Request in order to start carrier aggregation trigger algorithms. Depending on numTxWithHighNonGbr eNB may start either non- |
| **`actAnrRtt`** | `MRBTS/LNBTS` | Activate ANR 1xRTT | - | 0:false;
1:oamAssisted | Feature 'ANR interRAT 1xRTT - O&M assisted' is activated, if actAnrRtt is set to "oamAssisted".   Feature 'ANR interRAT 1xRTT - O&M assisted' is deactivated, if  actAnrRtt is set to "false".    Note t |
| **`actArpAcOffset`** | `MRBTS/LNBTS` | Activate ARP based Admission Control Offsets | - | 0 (false), 1 (true) | This parameter activates the support of ARP based admission control offsets function on eNB level. The operator can enable/disable this function per cell level for wideband UEs by using independent AR |
| **`actArpBasedQosScaling`** | `MRBTS/LNBTS` | Active ARP based QoS scaling | - | 0:disabled;
1:singleArpProfiling;
2:multiArpProfiling | This parameter activates/deactivates the feature ARP based QoS scaling for single ARP or multiple ARPs. |
| **`actAutoAcBarring`** | `MRBTS/LNBTS` | Activation of Automatic AC Barring | - | 0 (false), 1 (true) | This parameter activates the feature LTE1788 'Automatic access class barring'. |
| **`actAutoPlmnRemoval`** | `MRBTS/LNBTS` | Activate automatic PLMN removal | - | 0 (false), 1 (true) | This parameter activates the feature LTE2460, i.e. the autonomous removal of further PLMN in SIB1 during C-plane overload. |
| **`actB1ExtMeasNR`** | `MRBTS/LNBTS` | Activate B1 extended measurement report for NR | - | 0 (false), 1 (true) | This parameter activates B1 extended measurement report for NR |
| **`actB1NrBasedImlb`** | `MRBTS/LNBTS` | Activate B1-NR based EN-DC primary target selection in IMLB | - | 0 (false), 1 (true) | This parameter activates B1-NR measurement-based EN-DC primary target selection in idle mode load balancing. |
| **`actB1NrBasedImlb5GSa`** | `MRBTS/LNBTS` | Activate B1-NR based SA NR primary target selection in IMLB | - | 0 (false), 1 (true) | This parameter activates B1-NR measurement based SA NR primary target selection in IMLB. |
| **`actBbPooling`** | `MRBTS/LNBTS` | Activate baseband pooling | - | 0 (false), 1 (true) | This parameter activates baseband pooling. This activation flag is relevant for any variant of AirScale ABIA/ABIC/ABIN/ABIO/ABIP/ABIQ/ASOE/ASOF/ASOH/ASOG. On any variant of AirScale ABIC, ABIN, ABIO,  |
| **`actBufferUlDirectTransferICS`** | `MRBTS/LNBTS` | Activate uplink NAS and CDMA2000 message buffering in ICS procedure | - | 0 (false), 1 (true) | This parameter activates the uplink NAS and CDMA2000 message buffering during ongoing Initial Context Setup (ICS) procedure. If activated: NAS or 1xRTT or eHRPD PDUs received from UE in RRC:UL Informa |
| **`actCAggrLteNrDualConnectivity`** | `MRBTS/LNBTS` | Activation of CA in LTE-NR Dual Connectivity | - | 0:disabled;
1:blind_CA_LTE_NR;
2:enhanced_CA_LTE_NR | This parameter activates Carrier Aggregation in LTE-NR Dual Connectivity scenarios in the LTE BTS. Meaning of parameter values is: - blind_CA_LTE_NR: attempt to keep LTE CA when EN-DC is set up, possi |
| **`actCMAS`** | `MRBTS/LNBTS` | Activation CMAS support | - | 0 (false), 1 (true) | Activates CMAS support If CMAS support is set to 'true', CMAS warning messages are broadcast (SIB12) in case of Write-Replace Warning Request incl. CMAS data is received from MME  This parameter also  |
| **`actCSFBRedir`** | `MRBTS/LNBTS` | Activate CS fallback via redirection | - | 0:Disabled;
1:Enabled | The parameter activates the feature 'Circuit Switched Fallback to UTRAN or GSM via Redirection'.  If the feature is activated, mobile originated and mobile terminated CS calls are redirected to target |
| **`actCbrsMobEnh`** | `MRBTS/LNBTS` | Activate the support for CBRS mobility enhancement | - | 0 (false), 1 (true) | This parameter activates the support for CBRS (Citizens Broadband Radio Service) mobility enhancement. It is used to enable/disable the mobility enhancement for CBRS service on non-CBRS eNB (the FDD o |
| **`actCellSwitchOnForCmUpdate`** | `MRBTS/LNBTS` | Activate cell switch on for online configuration management update | - | 0 (false), 1 (true) | This parameter activates/deactivates cell switch on for online configuration management update.  If this parameter is not configured or is configured and equal to 'false', then cell switch on for onli |
| **`actCellTrace`** | `MRBTS/LNBTS` | Activate cell trace | - | 0 (false), 1 (true) | This is a feature flag to enable or disable Cell Trace feature. |
| **`actCellTraceNB`** | `MRBTS/LNBTS` | Activate cell trace for NB-IoT | - | 0 (false), 1 (true) | This is a feature flag to enable or disable Cell Trace feature for NB-IoT. |
| **`actCellTraceWithIMSI`** | `MRBTS/LNBTS` | Activate cell trace with IMSI | - | 0 (false), 1 (true) | This parameter is used for enabling/disabling of the feature "Cell Trace with IMSI". It will be only utilized when cell trace is activated, i.e. actCellTrace is TRUE. If the value is set to TRUE the e |
| **`actCiphering`** | `MRBTS/LNBTS` | Ciphering algorithm activation parameter | 1 | 0 (false), 1 (true) | This parameter enables/disables optional ciphering algorithms. |
| **`actCmasConfigurablePrio`** | `MRBTS/LNBTS` | Activate CMAS configurable prioritization | - | 0 (false), 1 (true) | This parameter activates the feature 'CMAS Operator Configurable Prioritization of Message IDs'. |
| **`actCmasTransOptimization`** | `MRBTS/LNBTS` | This parameter indicates whether CMAS transmission optimization is enabled or disabled | - | 0 (false), 1 (true) | CMAS transmission is optimized to broadcast SIB12 only during times when there is an alert message to transmit according to the Write-Replace Warning Request message parameter. |
| **`actCoC2kWcdmaGsmMob`** | `MRBTS/LNBTS` | Activate CDMA2000 1xRTT coexistence with WCDMA/GSM mobility | - | 0 (false), 1 (true) | The parameter activates the feature 'CDMA2000 1xRTT coexistence with WCDMA/GSM mobility '. |
| **`actCoMp`** | `MRBTS/LNBTS` | Activate CoMP | - | 0:disabled;
1:fixedULCoMp;
2:CRAN;
3:measBasedCoMp | Coordinated multipoint (CoMP) feature activation for the eNB. The parameter is used to configured CoMP features supported by the eNB for UL CoMP.  For any variant of AirScale ABIA (and FSMr3) UL CoMP  |
| **`actCompChecks`** | `MRBTS/LNBTS` | Activation of complete consistency checks | 1 | 0 (false), 1 (true) | The parameter activates Complete Consistency Checks in Validator tool. This parameter can be used to disable the checks that could block eNB reconfiguration after SW upgrade. Only particular checks in |
| **`actContextPreemption`** | `MRBTS/LNBTS` | Activate RRC connection and SCell context pre-emption | - | 0 (false), 1 (true) | This parameter activates the support of RRC connection and UE SCell context pre-emption. |
| **`actCoordEnDssPowerSaving`** | `MRBTS/LNBTS` | Activation of coordinated enhanced DSS Power Saving | - | 0 (false), 1 (true) | This parameter activates coordinated enhanced DSS Power Saving. |
| **`actCoordinated4g5gPowerSaving`** | `MRBTS/LNBTS` | Activate coordinated 4G-5G power saving | - | 0:disabled;
1:cellDeactivation;
2:cellDeactAndReact | Functional description: 1:cellDeactivation: - Coordination of NR power saving state to eNB. 2:cellDeactAndReact - Coordination of NR power saving state to eNB and reactivation of NR cell by eNB |
| **`actCplaneOvlHandling`** | `MRBTS/LNBTS` | Activation of C-plane overload handling | - | 0 (false), 1 (true) | Feature enabling flag for LTE1047 'C-plane overload handling'.  The feature detects overload and triggers countermeasures. |
| **`actCsfbECRestrRem`** | `MRBTS/LNBTS` | Activate CSFB EC access restriction removal | - | 0 (false), 1 (true) | This parameter activates the feature LTE2410. If the feature is activated, the CS Fallback Indicator will be verified, roaming and access restriction will not apply for CSFB emergency calls. |
| **`actCsfbPsHoToUtra`** | `MRBTS/LNBTS` | Activate CS fallback with PS-HO to UTRA | - | 0 (false), 1 (true) | This parameter activates the feature 'Circuit Switched Fallback with Packet Switched Handover to UTRA'. |
| **`actCsgS1Mobility`** | `MRBTS/LNBTS` | Activate CSG S1 mobility | - | 0 (false), 1 (true) | The parameter activates CSG (Closed Subscriber Group) mobility. |
| **`actDCN`** | `MRBTS/LNBTS` | Activate Dedicated Core Networks | - | 0 (false), 1 (true) | This parameter is used for enabling/disabling of the feature "Dedicated Core Network support". If the value is set to TRUE the eNB will Reroute the NAS messages to another Dedicated Core Network (DCN) |
| **`actDLCAggr`** | `MRBTS/LNBTS` | Activation of downlink carrier aggregation | - | 0 (false), 1 (true) | The parameter activates the family of downlink carrier aggregation features.  The feature allows higher UE downlink peak data rates by aggregation of two cells. The BTS will dynamically decide dependi |
| **`actDLUnicastMbsfn`** | `MRBTS/LNBTS` | Activate DL unicast over MBSFN subframe | - | 0 (false), 1 (true) | Activates DL unicast  TM9 over MBSFN subframe. |
| **`actDrxCoordEnDc`** | `MRBTS/LNBTS` | Activate DRX coordination for LTE-NR DC | - | 0:disabled;
1:basic DRX coordination;
2:basic DRX and SgNB initiated | Activates DRX coordination for LTE-NR dual connectivity.  Following options are available:  basic DRX coordination -- DRX coordination during SgNB addition  basic DRX and SgNB initiated -- In addition |
| **`actDssDlShareAlgNrUlLoad`** | `MRBTS/LNBTS` | Activate LTE-NR DSS DL share algorithm with NR UL load | - | 0 (false), 1 (true) | This parameter activates LTE-NR DSS DL share algorithm based on NR UL load measurement and NR/LTE DL load measurements. When this parameter is set to 'false' then the LTE-NR DSS DL share algorithm is  |
| **`actDualRx1xCsfb`** | `MRBTS/LNBTS` | Activate CSFB to CDMA 1xRTT for dual RX UEs | - | 0 (false), 1 (true) | Activates the feature CS fallback to CDMA 1xRTT for dual Rx UEs. |
| **`actDynMBMSRes`** | `MRBTS/LNBTS` | Activate support for dynamic allocation of eMBMS resources | - | 0 (false), 1 (true) | Activates the feature 'Dynamic allocation of eMBMS resources'. If the LTE BTS is configured to support FDD and TDD concurrently (i.e. if supportedCellTechnology is configured to 'mixed_FDD_TDD') and f |
| **`actDynTrafficShaper`** | `MRBTS/LNBTS` | Activate dynamic traffic shaper | - | 0 (false), 1 (true) | This parameter activates and deactivates the dynamic traffic shaper enhancements which are based on the usage of CPU and memory. |
| **`actDynTrigLteNrDualConnectivity`** | `MRBTS/LNBTS` | Activation of dynamic trigger for LTE-NR Dual Connectivity | - | 0 (false), 1 (true) | This parameter activates measurement-based dynamic triggering of LTE-NR Dual Connectivity in the LTE BTS. This includes UE measurements for RSRP, RSRQ and eNB internal L2 buffer overflow verification. |
| **`actECallOverIMS`** | `MRBTS/LNBTS` | Activate support of in-vehicle emergency call service called NG eCall (eCall over IMS). | - | 0 (false), 1 (true) | This parameter activates the support of NG-eCall (eCall over IMS), the Pan-European in-vehicle emergency call service defined under the eSafety initiative of the European Commission, supplemented with |
| **`actEEEmergAct`** | `MRBTS/LNBTS` | Activate  energy-efficient emergency activation | - | 0 (false), 1 (true) | This parameter enables handling of external alarm for energy-efficient emergency activation for lnCelId(s) listed in eeeaCellList.   When actEEEmergAct is set to 'true' then energy-efficient emergency |
| **`actERabModify`** | `MRBTS/LNBTS` | Activate E-RAB modification | - | 0 (false), 1 (true) | This parameter activates the E-RAB Modification by the S1AP message E-RAB MODIFY REQUEST. This parameter also activates the modification of the GBR related QoS parameters. |
| **`actERabModifyNonGbrToSig`** | `MRBTS/LNBTS` | Activate support of non-GBR QCI8 bearer to signaling QCI5 bearer E-RAB modification. | - | 0 (false), 1 (true) | This parameter activates support for modification of non-GBR QCI8 bearer to signaling QCI5 bearer by S1AP message E-RAB MODIFY REQUEST.  Note: For example, modification of non-GBR QCI8 bearer to signa |
| **`actERabModifyQci66and65`** | `MRBTS/LNBTS` | Activate modification between QCI 66 and QCI 65 | - | 0 (false), 1 (true) | This parameter activates the feature 'Modification between QCI 66 and QCI 65' via E-RAB Modify procedure. |
| **`actETWS`** | `MRBTS/LNBTS` | Activation ETWS support | - | 0 (false), 1 (true) | Activates ETWS support If ETWS support is set to 'true', ETWS primary and secondary notification are broadcast (SIB10 and SIB11) in case of Write-Replace Warning Request incl. ETWS, data is received f |
| **`actEmerCallRedir`** | `MRBTS/LNBTS` | Activate emergency call via redirection | - | 0:Disabled;
1:Enabled | The parameter activates the feature 'Emergency Call Via Redirection'.  The feature can be only activated if at least one redirection target for UTRAN or GSM has been created before.  At the same time  |
| **`actEnDcDssCellsCoex`** | `MRBTS/LNBTS` | Activate coexistence between EN-DC and DSS LTE-NR cells | - | 0:disabled;
1:LTE DSS SCell band blacklist | This parameter defines how to handle the coexistence of LTE and NR DSS cells in the same frequency band for EN-DC.  When this parameter is set to 'LTE DSS SCell band blacklist' and the MR-DC band comb |
| **`actEnDcLteDlMimoOptBcSel`** | `MRBTS/LNBTS` | Activate LTE DL MIMO optimized EN-DC BC list selection | - | 0 (false), 1 (true) | This parameter enhances the creation of the allowedBC-ListMRDC provided to the target en-gNB during the SgNB Addition or SgNB Modification procedure by taking into account the DL MIMO mode configurati |
| **`actEnDcLteDlTputBcSel`** | `MRBTS/LNBTS` | Activate LTE DL throughput based EN-DC BC list selection | - | 0 (false), 1 (true) | When parameter actEnDcLteDlTputBcSel is set to 'true' and the MRBTS/LNBTS/NRDCDPR-allowedBcSelectMethod set to a value different than 'no preference', eNB acting as MeNB enhances the creation of the a |
| **`actEnDcNrFeatSetIdBcSel`** | `MRBTS/LNBTS` | Activate EN-DC BC list selection with NR FeatureSet IDs | - | 0 (false), 1 (true) | This parameter enhances the EN-DC band combination grouping from LTE4549, based on different NR band combinations, using also the corresponding NR FeatureSetDownlinkId and NR FeatureSetUplinkId of a g |
| **`actEnDcX2PartialReset`** | `MRBTS/LNBTS` | Activate X2 partial reset in LTE-NR DC | - | 0:disabled;
1:gNB triggered | This parameter activates X2 partial reset in LTE-NR DC. |
| **`actEndcAdjCarrierChk`** | `MRBTS/LNBTS` | Activate EN-DC carrier allocation sanity check | - | 0:disabled;
1:eNBConfig_PCellAndSCellContiguity | Activates carrier allocation sanity check. If activated,  - eNB checks intra-band contiguous/non-contiguous between LTE PCell/SCell and NR PSCell/SSCell according to UE capability (intra-bandENDCSuppo |
| **`actEndcAutoX2Setup`** | `MRBTS/LNBTS` | Activate ANR automatic X2 setup for EN-DC | - | 0 (false), 1 (true) | This parameter activates ANR automatic X2 setup for EN-DC. |
| **`actEndcAutoX2SetupSbts`** | `MRBTS/LNBTS` | Activate ANR automatic X2 setup for EN-DC in SBTS | - | 0 (false), 1 (true) | This parameter activates the feature 'Automatic Direct X2 Setup between eNB and gNB within an SBTS'. If this feature is activated, the LNADJGNB instance representing the neighbor gNB in a SBTS EN-DC d |
| **`actEndcBlockPerCauseValue`** | `MRBTS/LNBTS` | Activate EN-DC blocking per cause value | - | Bit 0:RNL cause: Insufficient UE capabilities:0:; Bit 1:RNL cause: Not supported QCI value:0:; Bit 2:RNL cause: Target not allowed:0:; Bit 3:RNL cause: No radio resources available:0:; 
Bit 4::0:; Bit 5::0:; Bit 6::0:; Bit 7::0: | This parameter activates EN-DC blocking due to different causes. Each cause is enabled independently by setting the corresponding bit value to '1'.  This parameter is a 4 bits bitmask with following m |
| **`actEndcDropMonitor`** | `MRBTS/LNBTS` | Activate blocking of B1-NR measurements for EN-DC capable UE | - | 0 (false), 1 (true) | Activates blocking of B1-NR measurements for EN-DC capable UEs. If enabled, eNB will start monitoring the number of 5G drops (Reception of X2AP:SgNBReleaseRequired with cause code "Radio connection wi |
| **`actEndcHo`** | `MRBTS/LNBTS` | Activate EN-DC capability based handover | - | 0:disabled;
1:enabled | The parameter is used to activate the EN-DC capability based handover to steer EN-DC capable UEs to EN-DC dedicated frequency layers.  Please note that the change of the actEndcHo value will have no i |
| **`actEndcMaskedIMEISVFwd`** | `MRBTS/LNBTS` | Activate Masked IMEISV forwarding in EN-DC | - | 0 (false), 1 (true) | This parameter activates/deactivates Masked IMEISV transmission on X2 in NSA procedure. |
| **`actEndcRelRemCondOption`** | `MRBTS/LNBTS` | Activates ENDC relation removal condition option | - | 0 (false), 1 (true) | The parameter provides algorithm options for LNRELGNBCELL cell removal condition. Autonomous LNRELGNBCELL removal could be done when the removal condition for a given LNRELGNBCELL is met ANR-anrNrNbrR |
| **`actEndcSpidFwd`** | `MRBTS/LNBTS` | Activate SPID forwarding in EN-DC | - | 0 (false), 1 (true) | This parameter activates SPID forwarding in EN-DC |
| **`actEnforceHRL`** | `MRBTS/LNBTS` | Activate enforcement of HRL for all types of calls | - | 0 (false), 1 (true) | This parameter activates the enforcement of the Handover Restriction List (HRL) to all types of calls (including emergency calls). This functionality is applied for intra-LTE handovers, both via X2 an |
| **`actEnhAcAndGbrServices`** | `MRBTS/LNBTS` | Activate enhanced AC and GBR services | - | 0 (false), 1 (true) | This parameter activates support of the following features LTE534: ARP based Admission Control  LTE497: Smart Admission Control, comprising RAC and TAC LTE496: EPS bearers with QCI 2, 3 and 4 Feature  |
| **`actEnhCbrsCAggr`** | `MRBTS/LNBTS` | Activate enhanced CBRS carrier aggregation | - | 0 (false), 1 (true) | The parameter activates the CBRS carrier aggregation operation enhancement in order to adapt CBSD cell EARFCN change during negotiation with SAS. |
| **`actEnhFlexCaWithEnDc`** | `MRBTS/LNBTS` | Activation of Flexible LTE CA with EN-DC enhancements | - | 0 (false), 1 (true) | This parameter activates Flexible LTE CA with EN-DC enhancements. |
| **`actEnhLPPaEcid`** | `MRBTS/LNBTS` | Activate enhanced LPPa cell ID location service | - | 0 (false), 1 (true) | The parameter activates retrieval of MAC assisted measurements e.g. Timing Advance Type 1, Timing Advance Type 2 and/or AoA at the expiry of ecidMeasSupervisionTimer. |
| **`actEvtSecRatRep`** | `MRBTS/LNBTS` | Activate non-periodic secondary RAT usage data report for EN-DC | - | 0 (false), 1 (true) | This parameter activates the non-periodic secondary RAT usage data report for EN-DC. When activated, eNB forwards a secondary RAT usage data report received on X2 from gNB via S1 to MME. Report might  |
| **`actExConfLBPSTXPathsRed`** | `MRBTS/LNBTS` | Activate Extended Configuration for Load Based Power Saving TX paths reduction | - | 0 (false), 1 (true) | This parameter enables activation of load based power saving MIMO muting features on Airscale SBTS even if there are massive MIMO(mMIMO) cells configured. |
| **`actExpandedBasicCoMp`** | `MRBTS/LNBTS` | Max size allowed per Basic CoMP Set | 3 | 3...12, step 1 | Defines the maximum size of a Basic CoMP Set.  Default value '3' means, standard Basic ulCoMP is supported, expanded Basic ulCoMP is switched off. By default, each configured Basic CoMP set must inclu |
| **`actExt2N77Support`** | `MRBTS/LNBTS` | Activate extended n77 band support 2 | - | 0 (false), 1 (true) | This parameter activates the extended n77 band support 2 (3650 - 3980 MHz) in the eNB in countries where usage of n77 band might be restricted otherwise.  Note: eNB does not check the PLMN ID to deter |
| **`actExtCellSOMethod`** | `MRBTS/LNBTS` | Activate Extended Cell Switch Off Method | - | 0 (false), 1 (true) | This parameter indicates whether Extended Cell Switch Off Method is enabled or disabled.   The feature CB008800 introduces additional configuration parameters to allow Operator more flexibility with c |
| **`actExtMeasCtrl`** | `MRBTS/LNBTS` | Activation for extended inter-freq measurement control | - | 0 (false), 1 (true) | This parameter enables the extended inter-freq measurement control |
| **`actExtN77Support`** | `MRBTS/LNBTS` | Activate extended n77 band support | - | 0 (false), 1 (true) | This parameter activates the extended n77 band support (3450-3550 MHz) in the eNB in countries where usage of n77 band might be restricted otherwise.  Note: eNB does not check the PLMN ID to determine |
| **`actFastUECRelease`** | `MRBTS/LNBTS` | Activate fast UE context release | - | 0 (false), 1 (true) | This parameter activates the Fast UE Context Release procedure. The procedure speeds up the UE context release if RRC Connection Reconfiguration procedure is ongoing when intra-eNB or X2AP inter-eNB R |
| **`actFault6056Recovery`** | `MRBTS/LNBTS` | Activate recovery of PhyRx Symbol Index Shift detected | - | 0 (false), 1 (true) | This parameter activates automatic recovery flow in case of Fault 6056 "PhyRx Symbol Index Shift Detected".  If actFault6056Recovery is 'true', then eNB will try to automatically recover the faulty si |
| **`actFlexCaMgmt`** | `MRBTS/LNBTS` | Activate flexible carrier aggregation management | - | 0 (false), 1 (true) | This parameter activates the feature "Flexible carrier aggregation management". |
| **`actFlexCarrierSpacingNB`** | `MRBTS/LNBTS` | Activate flexible carrier spacing for NB-IoT standalone | - | 0 (false), 1 (true) | This parameter activates the flexible carrier spacing between NB-IoT standalone carriers and wideband LTE or NB-IoT standalone carriers. If actFlexCarrierSpacingNB is set to 'false', at least 100 kHz  |
| **`actFlexQCIARPPMProfiles`** | `MRBTS/LNBTS` | Activate flexible QCI and ARP PM counter profiles | - | 0 (false), 1 (true) | Parameter actFlexQCIARPPMProfiles activates or deactivates the respective counters introduced by feature LTE2766. |
| **`actFlexScellSelect`** | `MRBTS/LNBTS` | Activate flexible SCell selection | - | 0 (false), 1 (true) | This parameter activates the feature for flexible SCell selection for carrier aggregation. |
| **`actForcedCellSwitchOff`** | `MRBTS/LNBTS` | Activate forced cell switch off | - | 0 (false), 1 (true) | Parameter actForcedCellSwitchOff activates/deactivates the forced cell switch off. |
| **`actFstDmrsBasedShrinkage`** | `MRBTS/LNBTS` | Activate first DMRS based shrinkage algorithm | 1 | 0 (false), 1 (true) | This parameter activates first DMRS only based shrinking algorithm on LTE PUSCH.  This functionality is applicable for all cells which are hosted on BB cards of AirScale ABIO/ABIN/ABIP/ABIQ/ASOE/ASOF/ |
| **`actGTPpktSeqMon`** | `MRBTS/LNBTS` | Activate feature LTE4656 GTP Packet Sequence Monitoring | - | 0 (false), 1 (true) | This parameter activates feature LTE4656 GTP packet sequence monitoring. |
| **`actGsmRedirWithSI`** | `MRBTS/LNBTS` | Activate GSM redirect with system information | - | 0 (false), 1 (true) | This parameter activates the feature "GSM redirect with system information". |
| **`actGtpUpSeqNumX2Ul`** | `MRBTS/LNBTS` | Activate GTP UP Sequence Numbers on the X2 interface in Uplink | 2 | 2:disabled;
3:enabled | This parameter enables filling the GTP UP Sequence numbers on X2 interface in Uplink.  Note: Sequence Numbers are needed for monitoring the uplink packet loss on the 5G side. |
| **`actHOtoHrpd`** | `MRBTS/LNBTS` | Activate handover from LTE to eHRPD | - | 0 (false), 1 (true) | This parameter activates the feature Handover from LTE to eHRPD. |
| **`actHOtoNR`** | `MRBTS/LNBTS` | Activate handover to NR | - | 0 (false), 1 (true) | With this parameter the feature CB007742 'Handover from LTE to 5G Option 2' can be activated and deactivated. |
| **`actHOtoWcdma`** | `MRBTS/LNBTS` | Activate handover from LTE to WCDMA | - | 0 (false), 1 (true) | This parameter enables the Handover from LTE to WCDMA feature. |
| **`actHeNBMobility`** | `MRBTS/LNBTS` | Activate home eNB mobility | - | 0 (false), 1 (true) | Activates open access home eNB mobility. |
| **`actHeNBS1Mobility`** | `MRBTS/LNBTS` | Activate home eNB S1 mobility | - | 0 (false), 1 (true) | This parameter activates the feature LTE1723, i.e. S1 based handover towards home eNB |
| **`actHeNBS1MobilityPS`** | `MRBTS/LNBTS` | Activate home eNB S1 mobility with public safety | - | 0 (false), 1 (true) | This parameter activates the feature CB008607, i.e. S1 based handover to home eNB for UE with public safety bearer. |
| **`actHoFromNr`** | `MRBTS/LNBTS` | Activate handover from NR SA | - | 0 (false), 1 (true) | This parameter enables the feature handover from NR SA (5GS to EPS handover). |
| **`actHoFromNrDlDataForward`** | `MRBTS/LNBTS` | Activate DL data forwarding during handover from NR SA | - | 0 (false), 1 (true) | This parameter activates the feature 'Data forwarding during HO from 5G SA to LTE' (DL user data forwarding during handover from 5GS to EPS). |
| **`actHoFromUtran`** | `MRBTS/LNBTS` | Activate handover from UTRAN | - | 0 (false), 1 (true) | This parameter enables the feature Handover from UTRAN. |
| **`actHoWoSnChg`** | `MRBTS/LNBTS` | Activation HO without SgNB change | - | 0:disabled;
1:intraEnbHoEnabled;
2:x2HoEnabled;
3:intraEnbAndX2HoEnabled | This parameter activates handover without SgNB change functionality for LTE-NR DC Option 3X.  Currently, intra-eNB inter-cell handover without SgNB change functionality and inter-eNB X2 handover witho |
| **`actHrlBasedEutraCapaEnquiry`** | `MRBTS/LNBTS` | Activate HRL-based UE EUTRA capability enquiry | - | 0 (false), 1 (true) | This parameter activates the HRL-based (Handover Restriction List) UE EUTRA capability enquiry on eNB. If this parameter is not configured or is equal to 'false', HRL restriction on EN-DC is not consi |
| **`actHybridS1Mobility`** | `MRBTS/LNBTS` | Activate Hybrid S1 mobility | - | 0 (false), 1 (true) | The parameter activates mobility to hybrid cells. |
| **`actIPThrpCountNonPMQAP`** | `MRBTS/LNBTS` | Activate IP Throughput Counting Method for NonPMQAP Counters | - | 0:Current;
1:Legacy;
2:LTE5077 | This parameter activates IP Throughput counting method for non-PMQAP counters in the following way: 0: Currently defined method is used, depending on the counter it could be the legacy method or the L |
| **`actIPThrpCountPMQAP`** | `MRBTS/LNBTS` | Activate IP Throughput Counting Method for PMQAP Counters | - | 0:Current;
1:Legacy;
2:LTE5077 | This parameter activates IP Throughput counting method for PMQAP counters in the following way: 0: Currently defined method is used, depending on the counter it could be the legacy method or the LTE50 |
| **`actIPv6MBMS`** | `MRBTS/LNBTS` | Activate IPv6 MBMS M1 Interface Support | - | 0 (false), 1 (true) | This parameter activates IPv6 MBMS support on the M1 interface.  Note:  actIPv6MBMS is only allowed to be set to "true" for AirScale and FSMr3 eNBs. |
| **`actIdleLB`** | `MRBTS/LNBTS` | Activation of idle mode load balancing (IdleLB) | - | 0 (false), 1 (true) | The parameter activates the feature Idle Mode Load Balancing This flag also activates the following functionalities: - inter-RAT IdleLB targets - Load balancing for redirection (requires also the feat |
| **`actIdleLBCaAware`** | `MRBTS/LNBTS` | Activation of idle mode load balancing for CA capable UEs | - | 0 (false), 1 (true) | The parameter activates the feature Idle Mode Load Balancing for CA capable UEs This flag also activates the following functionalities: - inter-RAT IdleLB targets - IdleLB targets in Mobility profiles |
| **`actIdleLBCaAwareAdv`** | `MRBTS/LNBTS` | Activation of advanced CA aware idle mode load balancing | - | 0 (false), 1 (true) | The parameter activates the feature Carrier aggregation aware idle mode load balancing - II (advanced).  If activated, not only the PCell CA capabilities of a UE but also its SCell CA capabilities are |
| **`actIdleLBEnDcAware`** | `MRBTS/LNBTS` | Activation of idle mode load balancing for EN-DC capable UEs | - | 0 (false), 1 (true) | The parameter activates the feature EN-DC aware idle mode load balancing for EN-DC capable UEs. |
| **`actIdleLBNrAware`** | `MRBTS/LNBTS` | Activation of idle mode load balancing for NR SA capable UEs | - | 0 (false), 1 (true) | The parameter activates the feature NR SA aware idle mode load balancing for NR SA capable UEs. |
| **`actIdleLBSupportedBands`** | `MRBTS/LNBTS` | Activate idle mode load balancing supported band list | - | 0 (false), 1 (true) | This parameter activates use of the supportedBandListEUTRA (from UE capabilities) to populate the secondary target frequencies from the idleLBEutCelResPrio parameters. Additionally, if activated, the  |
| **`actIdleLBTM9aware`** | `MRBTS/LNBTS` | Activate idle mode load balancing for TM9 capable UEs | - | 0 (false), 1 (true) | The parameter activates the feature Idle Mode Load Balancing for TM9 capable UEs. This flag also activates the following functionalities: - intra-RAT IdleLB targets - IdleLB targets in Mobility profil |
| **`actIfHo`** | `MRBTS/LNBTS` | Enable interFrequency handover | 1 | 0:disabled;
1:enabled | This parameter enables the feature Inter Frequency Handover to FDD and TDD neighbor cells. |
| **`actImmHRPD`** | `MRBTS/LNBTS` | Activation idle mode mobility CDMA/eHRPD | - | 0 (false), 1 (true) | Activates "Idle mode mobility from LTE to CDMA/eHRPD". |
| **`actImmXrtt`** | `MRBTS/LNBTS` | Activation idle mode mobility CDMA/1xRTT | - | 0 (false), 1 (true) | Activates idle mode mobility from LTE to CDMA/1xRTT. |
| **`actIncCarrMonit`** | `MRBTS/LNBTS` | activate increased carrier monitoring | - | 0 (false), 1 (true) | feature flag for increased carrier monitoring |
| **`actIncNumOperatorQci`** | `MRBTS/LNBTS` | Activation of Increased Number Operator Specific QCIs | - | 0 (false), 1 (true) | CB007897 feature allows to configure up to 42 different QCI values from 3GPP defined range of operator specific QCIs (values 98-100 or 128-254) in LTE eNB database. When activated it increases number  |
| **`actInitialMmegi`** | `MRBTS/LNBTS` | Activation of Initial MME Group Identifier | - | 0:Disabled;
1:initialMMEGI | CB008049 MME selection enhancement with initial MME group Id, feature activation flag.  With this feature, the configurable Initial MME Group Id is used to select an MME when a UE enters a pool area ( |
| **`actInterEnbDLCAggr`** | `MRBTS/LNBTS` | Activate inter-eNB DL carrier aggregation | - | 0 (false), 1 (true) | This parameter activates the features 'Inter-eNB DL carrier aggregation' and 'Inter-site DL carrier aggregation' for up to 4 macro or 2 FZM eNBs. |
| **`actInterEnbULCAggr`** | `MRBTS/LNBTS` | Activate inter-eNB UL carrier aggregation | - | 0 (false), 1 (true) | This parameter activates the functionality for 'Inter-eNB uplink carrier aggregation'. |
| **`actInterFreqMDTCellTrace`** | `MRBTS/LNBTS` | Activate MDT inter-frequency periodic measurement | - | 0 (false), 1 (true) | This parameter enables the activation of MDT inter-frequency UE periodic measurements. |
| **`actInterFreqRstdMeasSupp`** | `MRBTS/LNBTS` | Activate inter-frequency RSTD measurement support | - | 0 (false), 1 (true) | The parameter configures feature LTE1638 "Inter-frequency RSTD measurement support". If the feature is activated (configured to 'true') the Flexi-BTS supports UE RSTD (reference signal time difference |
| **`actIratGummeiSupport`** | `MRBTS/LNBTS` | Enable inter RAT GUMMEI support | - | 0 (false), 1 (true) | This parameter indicates whether inter-RAT GUMMEI support for X2 HO is enabled. If this parameter is not configured or is equal to 'false', inter-RAT GUMMEI support for X2 HO is disabled. If this para |
| **`actIscaHarqEnh`** | `MRBTS/LNBTS` | Activate inter-site CA HARQ enhancement | - | 0 (false), 1 (true) | This parameter activates/de-activates the feature 'Inter-site DL carrier aggregation HARQ enhancement'. |
| **`actL1PM`** | `MRBTS/LNBTS` | Feature Activation Flag Additional Layer 1 PM Group 1 and Group 3 Counters | - | 0 (false), 1 (true) | This parameter activates/deactivates the following PM counters from feature Additional Layer 1 Performance Measurements:  Group 1: M8005C306-M8005C313, M8005C336-M8805C339, M8005C317-M8005C325, M8005C |
| **`actLBPowerSaving`** | `MRBTS/LNBTS` | Activate load-based power saving | - | 0 (false), 1 (true) | This parameter activates the feature 'Load-Based Power Saving for Multi-Layered Networks'. When the feature is activated, intra-eNB cells that provide service to the same coverage area may be automati |
| **`actLBRTXPowerSaving`** | `MRBTS/LNBTS` | Activate load-based reduced TX power saving | - | 0 (false), 1 (true) | This parameter activates the feature 'Load-Based Power Saving with TX-Path Switch Off'. When the feature is activated, intra-eNB cells that provide service to the same coverage area may have TX-Paths  |
| **`actLPPaEcid`** | `MRBTS/LNBTS` | Activate LPPa enhanced cell ID location service | - | 0 (false), 1 (true) | The parameter activates the support of the enhanced cell ID measurement initiation procedure on the LPPa layer. |
| **`actLPPaEcidNB`** | `MRBTS/LNBTS` | Activate LPPa enhanced cell ID location service for NB-IoT | - | 0 (false), 1 (true) | The parameter activates the support of the enhanced cell ID measurement initiation procedure on the LPPa layer for NB-IoT.  Note: Only Timing Advance Type 2 is supported for NB-IoT cell. |
| **`actLPPaOtdoa`** | `MRBTS/LNBTS` | Activate LPPa support for OTDOA | - | 0 (false), 1 (true) | Activates support of the LPPa OTDOA information request procedure via S1AP |
| **`actLTES1Ho`** | `MRBTS/LNBTS` | Activate intra LTE S1based handover | - | 0 (false), 1 (true) | This parameter enables the feature Intra LTE Inter eNodeB Handover via S1. |
| **`actLaaPrefOverEnDc`** | `MRBTS/LNBTS` | Activate LAA prioritization over EN-DC | - | 0 (false), 1 (true) | This parameter activates LAA prioritization over EN-DC for UEs which doesn't support LAA and EN-DC on NR FR1 bands simultaneously.  Only those LNCEL which are configured to support Flexible LTE CA wit |
| **`actLbpsCtrlLogicEnh`** | `MRBTS/LNBTS` | Activate load based PSG control logic enhancement | - | 0 (false), 1 (true) | This parameter activates/deactivates the Cell/TX switch off and PSG control logic enhancement. |
| **`actLoadPmCounter`** | `MRBTS/LNBTS` | Activate eNB system load PM counter | - | 0 (false), 1 (true) | This parameter activates/deactivates the feature eNB System Load PM Counter. |
| **`actLocRep`** | `MRBTS/LNBTS` | Activate location reporting | - | 0 (false), 1 (true) | Activation/deactivation of Location Reporting (feature 'Support of cell based location service'). |
| **`actLocRepNB`** | `MRBTS/LNBTS` | Activate location reporting for NB-IoT | - | 0 (false), 1 (true) | Activation/deactivation of Location Reporting for NB-IoT. |
| **`actLteNrDss`** | `MRBTS/LNBTS` | Activate LTE-NR dynamic spectrum sharing | - | 0 (false), 1 (true) | This parameter activates dynamic spectrum sharing between LTE and NR. If activated, DSS mode for each DSS cell needs to be configured. Depending on the DSS mode (lteNrDssMode), the necessary structure |
| **`actLteNrDualConnectivity`** | `MRBTS/LNBTS` | Activation LTE-NR dual connectivity | - | 0 (false), 1 (true) | This parameter activates LTE-New Radio Dual Connectivity (EN-DC) functionality. |
| **`actLteNrFastNbrRelAdd`** | `MRBTS/LNBTS` | Activate LTE-NR fast neighbor relation addition | - | 0 (false), 1 (true) | This parameter activates NR ANR fast neighbor relation addition. |
| **`actMBMS`** | `MRBTS/LNBTS` | Activate support for MBMS | - | 0 (false), 1 (true) | Activates the feature 'Multimedia Broadcast/Multicast Service (MBMS)'. If the LTE BTS is configured to support FDD and TDD concurrently (i.e. supportedCellTechnology is set to 'mixed_FDD_TDD') and MBM |
| **`actMBMSMaxShare`** | `MRBTS/LNBTS` | Activates cell resource allocation to eMBMS in 3 MHz bandwidth | - | 0 (false), 1 (true) | Activates guaranteed cell resource allocation of 60% to eMBMS in 3 MHz bandwidth. |
| **`actMBMSPS`** | `MRBTS/LNBTS` | Activate eMBMS for public safety | - | 0 (false), 1 (true) | Activates eMBMS enhancements for Public Safety. |
| **`actMBMSServiceContinuity`** | `MRBTS/LNBTS` | Activate MBMS service continuity | - | 0 (false), 1 (true) | This parameter activates the feature "MBMS Service Continuity".  Please note that the feature is only active in cells with SIB15 configured in sibSchedulingList. |
| **`actMDTCellTrace`** | `MRBTS/LNBTS` | Activate MDT cell trace | - | 0 (false), 1 (true) | This is a feature flag to enable or disable LTE953 MDT Trace feature. The same feature flag is also used for LTE1501 and LTE1308. |
| **`actMDTSubscriberTrace`** | `MRBTS/LNBTS` | Activate MDT Subscriber Trace | - | 0 (false), 1 (true) | This is a feature flag to enable or disable MDT Subscriber trace feature. |
| **`actMDTloggedCellTrace`** | `MRBTS/LNBTS` | Activate MDT logged MBA | - | 0 (false), 1 (true) | This parameter activates the feature LTE1049: MDT - UE measurement logs If new TCE connections are added or existing TCE connections are deleted, while LTRACE sessions are active, please check the des |
| **`actMFBI`** | `MRBTS/LNBTS` | Activate MFBI support | - | 0 (false), 1 (true) | This parameter activates/deactivates the feature "Multiple Frequency Band Indicator" (LTE1534) Note: This parameter is used in NB-IoT cell also. |
| **`actMPMeasGapForNR`** | `MRBTS/LNBTS` | Activate mobility profile level measurement gap | - | 0 (false), 1 (true) | This parameter activates the feature 'NR Measurement Gap Need in mobility profile'. |
| **`actMappedBandIFMeas`** | `MRBTS/LNBTS` | Activate mapped band support in inter-frequency measurement | - | 0 (false), 1 (true) | This parameter activates/deactivates mapped band support during inter-frequency measurements. |
| **`actMeasBasedIMLB`** | `MRBTS/LNBTS` | Activate measurement-based idle mode load balancing | - | 0 (false), 1 (true) | This parameter activates the feature 'measurement-based idle mode load balancing'. |
| **`actMeasGapCoordEnDc`** | `MRBTS/LNBTS` | Activate measurement gaps coordination in LTE-NR DC | - | 0:disabled;
1:eNB initiated;
2:eNB and SgNB initiated | This parameter is used to activate measurement gaps coordination in LTE-NR dual connectivity. |
| **`actMeasGapIfEnDc`** | `MRBTS/LNBTS` | Activate measurement gaps for all inter-frequency and inter-RAT measurements while in EN-DC | - | 0 (false), 1 (true) | Parameter to activate trigger of measurement gap configuration when UE is in EN-DC and LTE inter-frequency or inter-RAT measurements are configured. |
| **`actMfbiNr`** | `MRBTS/LNBTS` | Activate NR-MFBI support in EN-DC | - | 0 (false), 1 (true) | This parameter activates MFBI support in NR frequencies for EN-DC. |
| **`actMixedSOMethod`** | `MRBTS/LNBTS` | Activate mixed switch off method of MIMO Muting | - | 0 (false), 1 (true) | This parameter activates additional mixed power saving operation mode to support both switch off options of MIMO Muting, respectively Cell Switch Off, for a same cell during same period of time. |
| **`actMmecPlmnIdMmeSelection`** | `MRBTS/LNBTS` | Activate MMEC PLMN ID based MME selection | - | 0 (false), 1 (true) | This parameter activates the MMEC and PLMN ID based MME selection. If this parameter is set to 'true', then for UEs moving from 2G/3G to LTE, exclusion of MMEGI information in MME selection is possibl |
| **`actMobProfileDataVol`** | `MRBTS/LNBTS` | Activate feature LTE5701 Mobility profile based Data Volume Counters | - | 0 (false), 1 (true) | This parameter activates feature LTE5701 Mobility profile based Data Volume Counters |
| **`actMroInterRatUtran`** | `MRBTS/LNBTS` | Activate MRO inter-RAT UTRAN | - | 0 (false), 1 (true) | The parameter is used to enable feature LTE1749 "MRO InterRat UTRAN".  The activation of the feature for functional usage does require to activate LTE56 "Inter RAT handover to WCDMA" or LTE898 "TDD in |
| **`actMultBearers`** | `MRBTS/LNBTS` | Activate multiple bearers | - | 0 (false), 1 (true) | This parameter activates the support of multiple EPS Bearers. |
| **`actMultGbrBearers`** | `MRBTS/LNBTS` | Activate multiple GBR bearers | - | 0 (false), 1 (true) | This parameter activates the support of multiple GBR EPS Bearers. |
| **`actMultiSCGSplit`** | `MRBTS/LNBTS` | Activation EN-DC multiple SCG split bearers | - | 0 (false), 1 (true) | This parameter activates LTE-NR Dual Connectivity (EN-DC) support for multiple SCG split bearers functionality. |
| **`actMultiSCGSplitwoeLcId`** | `MRBTS/LNBTS` | Activates multiple EN-DC bearers without eLCID | - | 0 (false), 1 (true) | This parameter activates multiple EN-DC bearers without eLCID. |
| **`actMultipleCarrier`** | `MRBTS/LNBTS` | Activate multiple carrier operation | 1 | 1:false;
2:2_carrierOperation;
3:3_carrierOperation;
4:4_carrierOperation;
5:5_carrierOperation;
6:6_carrierOperation | This parameter activates multiple carrier operation. When the parameter is set to value "false", the eNB is working in a single carrier operation, when set to one of the other values, it is working in |
| **`actNonGbrServiceDiff`** | `MRBTS/LNBTS` | Activate nonGBR service differentiation | - | 0 (false), 1 (true) | This parameter activates the Service Differentiation for non-GBR Bearers. |
| **`actNrFreqFilterForEnDc`** | `MRBTS/LNBTS` | Activate NR frequency filter for EN-DC | - | 0 (false), 1 (true) | This parameter activates the feature 'EN-DC control per mobility profile'. |
| **`actNwReqUeCapa`** | `MRBTS/LNBTS` | Activate network requested UE radio capabilities | - | 0 (false), 1 (true) | This parameter activates the feature 'Network requested UE radio capabilities'. The feature'Network requested UE radio capabilities' implements the eNB functionality for 3GPP CR 1515/1630 to 3GPP 36.3 |
| **`actOnlineTXSwitch`** | `MRBTS/LNBTS` | Activate online TX switching | - | 0 (false), 1 (true) | This parameter activates the feature SR003080 'Power saving with online TX path switching off for Energy Efficiency'. When the feature is activated, 2Tx/4Tx cell will support load based TX-Paths autom |
| **`actOperatorQCI`** | `MRBTS/LNBTS` | Activate support of operator specific QCIs | - | 0 (false), 1 (true) | This parameter activates the support of establishment of EPS bearers with QCI in the range of (98-100 or 128-254) in case of non-GBR and in the range of (128-254) for GBR. |
| **`actOperatorQCIGBR`** | `MRBTS/LNBTS` | Activate support of operator specific GBR QCIs | - | 0 (false), 1 (true) | This parameter activates the support of establishment of GBR EPS bearers with QCI in the range of 128...254. |
| **`actOptMmeSelection`** | `MRBTS/LNBTS` | Activate optimized MME selection | - | 0 (false), 1 (true) | Activates the optimized MME selection algorithm If this parameter is set to 'true', the MME selection function distinguishes native and mapped GUMMEIs according to TS 23.401. If UE provides its (old)  |
| **`actOptimizedL3Pool`** | `MRBTS/LNBTS` | Activate optimized L3 pool | - | 0 (false), 1 (true) | This parameter activates the feature LTE5582 'Single C-plane pool per ASIA/ASIB with ABIA/ABIAL as a BB card', optimized C-Plane pool deployment on the eNB. |
| **`actPCMDReport`** | `MRBTS/LNBTS` | Activate PCMD report | - | 0 (false), 1 (true) | This parameter enables the activation of PCMD Report on eNB level. Although PCMD reporting uses the trace framework the enabling of the feature flag for cell tracing is not a precondition for PCMD rep |
| **`actPMQAPProfilesExtension`** | `MRBTS/LNBTS` | Activate feature LTE4254 PMQAP profiles extension per counters | - | 0 (false), 1 (true) | This parameter activates feature LTE4254 PMQAP profiles extension per counters |
| **`actPSBlockForCellWithPACall`** | `MRBTS/LNBTS` | Activation PS blocking for cell with PA call | - | 0 (false), 1 (true) | This parameter activates Power Saving blocking for cell with Priority access call ongoing. |
| **`actPartialAcHo`** | `MRBTS/LNBTS` | Activate partial admission for handover | - | 0 (false), 1 (true) | This parameter activates the feature 'ARP based partial admission control for handover'. If the feature is activated Target eNodeB will perform ARP based partial admission control for incoming handove |
| **`actPcellSwap`** | `MRBTS/LNBTS` | Activate PCell swap | - | 0 (false), 1 (true) | This parameter activates the feature 'PCell Swap' for the Flexi Macro FDD and TDD eNBs. |
| **`actPdcpRohc`** | `MRBTS/LNBTS` | Activate PDCP robust header compression | - | 0 (false), 1 (true) | This parameter activates the usage of PDCP Robust  Header Compression. |
| **`actPlmnBasedPreemption`** | `MRBTS/LNBTS` | Activate PLMN based preemption | - | 0 (false), 1 (true) | This parameter activates the feature 'PLMN based pre-emption candidate selection'.  Please note that the feature is only activated in cells where a preemption profile (PREEMPPR) is assigned with the p |
| **`actPlmnUnavailForCellReport`** | `MRBTS/LNBTS` | Activate PLMN Unavailable for cell(s) fault report | - | 0:disabled;
1:cell | Activate 'No PLMN available for cell(s)' fault report mode. If 'disabled' is selected, the 'No PLMN available for cell(s)' fault report function is disabled. If 'cell' is selected, the alarm will be r |
| **`actPredKpisObservability`** | `MRBTS/LNBTS` | Activation of Predefined KPIs Observability | - | 0 (false), 1 (true) | This parameter activates the feature LTE3577  'Predefined KPIs observability based on real time selected counters'. |
| **`actPreempVulCatM`** | `MRBTS/LNBTS` | Indicates if Cat-M preemption vulnerability for DRB bearers and UE Contexts is disabled or not | - | 0 (false), 1 (true) | This parameter indicates if DRB bearer and UE context pre-emption vulnerability for CAT-M devices is honored by eNB (enabled) or always treated as false (disabled) regardless of the value provided by  |
| **`actProhibitCaSpecCellDepl`** | `MRBTS/LNBTS` | Activate prohibition of CA-specific cell deployments | - | 0 (false), 1 (true) | This parameter activates prohibition of the usage of CA-specific cell deployments for FDD cells in AirScaleABIA/ABIAL for inter-eNB FDD-TDD CA if baseband pooling is activated (actBbPooling is 'true') |
| **`actProhibitWcdmaMobPreQci1`** | `MRBTS/LNBTS` | Activate prohibition of WCDMA mobility before QCI1 | - | 0 (false), 1 (true) | This parameter activates/deactivates prevention of WCDMA mobility before QCI1 bearer setup. |
| **`actPwsRstrtFlrInd`** | `MRBTS/LNBTS` | Activation of PWS Restart & Failure Indication | - | 0 (false), 1 (true) | When the parameter is set to 'true',  S1AP: PWS Restart Indication and S1AP: PWS Failure Indication procedures are supported. |
| **`actQCIPLMNIDProfiles`** | `MRBTS/LNBTS` | Activate QCI and PLMN ID counter profiles | - | 0 (false), 1 (true) | Parameter actQCIPLMNIDProfiles activates or deactivates the QCI and PLMNID differentiation for the PMQAP Profiles containing the PLMN ID configuration. |
| **`actQciArpToDscpMarking`** | `MRBTS/LNBTS` | Activate marking of DSCP based on QCI and ARP | - | 0 (false), 1 (true) | This parameter activates the Differentiated Services Code Point (DSCP) marking based on Quality of service Class Identifier (QCI) ) and Allocation and Retention Priority (ARP).  Note1: If the feature  |
| **`actRCEFReporting`** | `MRBTS/LNBTS` | Activate RRC Connection Establishment Failure reporting | - | 0 (false), 1 (true) | This parameter is used for enabling/disabling of the feature "MDT - UE RRC Connection Establishment Failure reporting".  RRC Connection Establishment Failure report can be created by UE upon failed RR |
| **`actRCREnDc`** | `MRBTS/LNBTS` | Activate support for RRC Connection Re-establishment with EN-DC SCG split bearers | - | 0:disabled;
1:RCR-servingCell | This parameter activates feature 'RRC Connection Re-establishment with EN-DC SCG split bearers' by enabling different groups of RRC Re-establishment scenarios as they are defined in legacy RRC re-esta |
| **`actRCRMacRetry`** | `MRBTS/LNBTS` | Activate RRC Connection reestablishment using MAC retry | - | 0 (false), 1 (true) | Activate support for the MAC retry procedures by the UE during RRC Reestablishment procedure. Activating this parameter will allow subsequent RRC Re-establishments during RRC Re-establishment procedur |
| **`actRIMforGSM`** | `MRBTS/LNBTS` | Activate RAN Information Management for GSM | - | 0 (false), 1 (true) | The parameter activates the LTE498: RAN Information Management (RIM) for GSM feature. |
| **`actRIMforUTRAN`** | `MRBTS/LNBTS` | Activate RAN information management for UTRAN | - | 0 (false), 1 (true) | The parameter activates the feature LTE1196 'RAN Information Management (RIM) for WCDMA'. |
| **`actRLFReportEval`** | `MRBTS/LNBTS` | Activate RLF report evaluation | - | 0 (false), 1 (true) | This parameter is used for enabling/disabling of the feature "UE Radio Link Failure report evaluation". When the feature is activated the eNB will trigger the retrieval of RLF reports from UEs if it h |
| **`actRLFbasedRCR`** | `MRBTS/LNBTS` | Activate RLF based RRC connection reestablishment | - | 0 (false), 1 (true) | Activates the feature 'Radio Link Failure (RLF) based RRC connection reestablishment (RCR)' |
| **`actRLFbasedRCRConfigL1`** | `MRBTS/LNBTS` | Activate RLF based RRC connection reestablishment during L1 reconfiguration | - | 0 (false), 1 (true) | Activates the support of RLF based RRC connection reestablishment during the reconfiguration of SR, SRS and CQI reporting. |
| **`actRLFbasedRCREnhanced`** | `MRBTS/LNBTS` | Activate enhanced RLF based RRC connection reestablishment | - | 0 (false), 1 (true) | Activates the feature 'Enhanced Radio Link Failure (RLF) based RRC connection reestablishment (RCR)' |
| **`actRLFbasedRCREnhancedIntra`** | `MRBTS/LNBTS` | Activate enhanced RLF based RRC connection reestablishment for intra-eNB. | 1 | 0 (false), 1 (true) | Activates the feature 'Enhanced Radio Link Failure (RLF) based RRC connection reestablishment (RCR)' for intra-eNB cases. This can be activated independent of actRLFbasedRCREnhanced (LTE3105) or actRL |
| **`actRLFbasedRCRTargetCRNTI`** | `MRBTS/LNBTS` | Activate RLF based RRC Connection Reestablishment with Target CRNTI | - | 0 (false), 1 (true) | Activates the feature 'Radio Link Failure (RLF) based RRC Connection Reestablishment (RCR) with Target CRNTI'. |
| **`actRRCConnReestablRLF`** | `MRBTS/LNBTS` | Activate RRC reestablishment and RLF PM counters per QCI and ARP PM counter profiles | - | 0 (false), 1 (true) | Parameter actRRCConnReestablRLF files activates or deactivates the respective counters introduced by feature LTE2782. |
| **`actRSRPRSRQHist`** | `MRBTS/LNBTS` | Activate RSRP and RSRQ histograms | - | 0 (false), 1 (true) | Parameter actRSRPRSRQHist activates or deactivates the  RSRP and RSRQ Histogram counters |
| **`actRadioPosFlexibility`** | `MRBTS/LNBTS` | Activate radio position flexibility | - | 0 (false), 1 (true) | This parameter indicates whether the cell should be mapped to the configured topology RMOD-connectionList-positionInChain or to the same previously connected radio when there is an OBSAI Optical Trans |
| **`actRanSharingEnh`** | `MRBTS/LNBTS` | Activate RAN sharing enhancements | - | 0:disabled;
10:max_10_PLMNs | This parameter activates RAN sharing enhancements.  Allowed values are: 0:disabled (default): RAN sharing enhancements are disabled and legacy limits apply, i.e., there can be a maximum of 8 PLMNs and |
| **`actRecalcCaUnlockedScells`** | `MRBTS/LNBTS` | Activate recalculating unlocked SCells as CA candidates | - | 0 (false), 1 (true) | This parameter activates triggering CA capability re-calculation after a cell becomes unlocked. The BTS then takes this unlocked cell as a SCell candidate by (re) starting non-GBR buffer monitoring, n |
| **`actRedirect`** | `MRBTS/LNBTS` | Enable UE context release with redirect | 1 | 0:disabled;
1:enabled | This parameter enables the feature UE context release with redirect. |
| **`actReduceAcqiReqTxSkip`** | `MRBTS/LNBTS` | Activate Reduction of Aperiodic CQI Requests with Fast UL grants | - | 0 (false), 1 (true) | This parameter enables reduction of aperiodic CQI / RI / PMI  requests for Rel 14 UEs configured for "skippable" UL grants. |
| **`actRejHoInCellResForOpUse`** | `MRBTS/LNBTS` | Activation reject HO in cell reserved for operator use | - | 0 (false), 1 (true) | This parameter enables the feature rejection of incoming X2/S1 handover in a target cell reserved for the operator use. When feature is enabled, handover for UEs for which selected PLMN ID in the targ |
| **`actRemoteInterferenceReport`** | `MRBTS/LNBTS` | Activate TDD Remote Interference Report | - | 0 (false), 1 (true) | This parameter enables the activation of Remote Interference Report on eNB level. |
| **`actRrcConnNoActivity`** | `MRBTS/LNBTS` | Activate RRC connected mode while no activity | - | 0 (false), 1 (true) | This parameter activates the functionality to keep the UE in RRC connected mode even if there is no activity (e.g. during ringtone) until QCI1 establishment triggered protection timer expiry. |
| **`actRrcConnRelDelay`** | `MRBTS/LNBTS` | Activate prohibit timer for RRC Connection Release after last QCI1 bearer release | - | 0 (false), 1 (true) | This parameter activates the functionality to keep Wide Band UE in RRC connected mode for a longer period than legacy C-Plane/ U-Plane inactivity timers after last QCI1 is released to help reduce call |
| **`actRsrqInterFreqMobility`** | `MRBTS/LNBTS` | Activate RSRQ-based A5 | - | 0 (false), 1 (true) | This parameter activates the inter-frequency mobility based on A5 RSRQ measurements. |
| **`actRsrqInterRatMobility`** | `MRBTS/LNBTS` | Activate RSRQ-based B2 | - | 0 (false), 1 (true) | This parameter activates the inter-RAT mobility based on B2 RSRQ measurements. |
| **`actRtPerfMonitoring`** | `MRBTS/LNBTS` | Activate RT performance monitoring | - | 0:false;
1:All_PM_Counters;
2:PDCP_SDU_Group | This is a feature flag to enable or disable the RT Performance Monitoring Feature and to select which type of RT PM is chosen. The value All_PM_Counters is used for enabling the LTE1053 feature conten |
| **`actS1Flex`** | `MRBTS/LNBTS` | Activation status of S1 flex feature | 1 | 0:disabled;
1:enabled | This parameter indicates whether S1 Flex feature is enabled or disabled. |
| **`actS1InducedX2Closure`** | `MRBTS/LNBTS` | Activate X2 closure induced by all S1-C link deactivation | - | 0 (false), 1 (true) | This parameter activates the closure of all X2-C links to neighbor en-gNBs including the collocated ones if all S1-C links are down on the eNB side, e.g. due to transport outage, fiber cut or other is |
| **`actS1OlHandling`** | `MRBTS/LNBTS` | Activate S1 overload handling | 1 | 0 (false), 1 (true) | This parameter activates the S1 Overload Handling feature. |
| **`actSIB24`** | `MRBTS/LNBTS` | Activation idle mode mobility to NR SA (SIB24) | - | 0 (false), 1 (true) | This parameter activates SIB24 for cell reselection from LTE to NR SA (standalone). |
| **`actSatBackhaul`** | `MRBTS/LNBTS` | Activate satellite backhaul support | - | 0 (false), 1 (true) | The parameter activates the support of satellite connections within S1- and X2 links.  Setting the parameter to 'true' does not indicate that the eNB itself has satellite backhaul. For indication of e |
| **`actSdl`** | `MRBTS/LNBTS` | SDL activation flag | - | 0 (false), 1 (true) | This is a feature flag to enable or disable the SDL Feature. |
| **`actSecRatRep`** | `MRBTS/LNBTS` | Activate secondary RAT usage data report for EN-DC | - | 0 (false), 1 (true) | This parameter activates the secondary RAT usage data report for EN-DC. When activated, eNB forwards a secondary RAT usage data report received on X2 from gNB via S1 to MME.   Note: Forwarding of even |
| **`actSegUeCapInfo`** | `MRBTS/LNBTS` | Activate UE capability information segmentation | - | 0 (false), 1 (true) | This parameter activates the support for uplink dedicated message (RRC:UECapabilityInformation) segmentation in the eNB. |
| **`actSelMobPrf`** | `MRBTS/LNBTS` | Activate selective mobility profiles | - | 0 (false), 1 (true) | This parameter activates the features 'Selective Mobility Profiles' and - in case the LNBTS parameter moProfileSelect is set to 'plmn' or 'combined' - also 'PLMN ID and SPID selected mobility profiles |
| **`actServBasedMobThr`** | `MRBTS/LNBTS` | Activate service based mobility thresholds | - | 0 (false), 1 (true) | This parameter activates the features 'Dedicated mobility thresholds for SRVCC' and 'Service based handover thresholds' and activates a mechanism for different points of triggering handover. Dedicated |
| **`actServicePRButiL`** | `MRBTS/LNBTS` | Feature Activation Flag Additional Layer 1 PM Group 2 Counters | - | 0 (false), 1 (true) | This parameter activates/deactivates the following PM counters from feature Additional Layer 1 Performance Measurements:  Group 2: M8011C151-M8011C160, M8011C140-M8011C149, M8011C150, M8011C161  Activ |
| **`actSnChangeSnInit`** | `MRBTS/LNBTS` | Activation SN initiated SN change for LTE-NR DC Option 3X | - | 0 (false), 1 (true) | This parameter activates SN initiated SN change for LTE-NR DC Option 3X |
| **`actSpecDupGapNB`** | `MRBTS/LNBTS` | Activate special duplexing gap for NB-IoT standalone | - | 0 (false), 1 (true) | This parameter activates 3 SA NB-IoT carriers with special duplexing gap in NB-IoT cell |
| **`actSplitUeNrCapRetrieval`** | `MRBTS/LNBTS` | Activation of Split UE NR Capability Retrieval | - | 0 (false), 1 (true) | CB010232: 'Splitting combined NR/EUTRA-NR UE Capability Transfer procedure' feature activation flag, this parameter indicates whether  "nr" and "eutra-nr" UE capabilities shall be retrieved together o |
| **`actStepAddBearENDC`** | `MRBTS/LNBTS` | Activation of stepwise addition of multiple bearers for EN-DC | - | 0 (false), 1 (true) | This parameter activates LTE-NR Dual Connectivity (EN-DC) support for stepwise addition of multiple SCG split bearers functionality. |
| **`actSubscriberTrace`** | `MRBTS/LNBTS` | Activate subscriber and equipment trace | - | 0 (false), 1 (true) | This is a feature flag to enable or disable Subscriber & Equipment Trace feature. |
| **`actTM9Block`** | `MRBTS/LNBTS` | Activate UE IMEI SV based TM9 blocking | - | 0 (false), 1 (true) | This parameter enables the feature UE IMEI SV based TM9 blocking. |
| **`actTaHistCounters`** | `MRBTS/LNBTS` | Activate timing advance histogram PM counters | - | 0 (false), 1 (true) | The parameter activates the feature 'Timing advance histogram PM counters' Note: In addition, the measurement M8029 needs to be started in each LNCEL separately. |
| **`actTcpBoost`** | `MRBTS/LNBTS` | Activate TCP booster simplified solution | - | 0 (false), 1 (true) | This parameter activates TCP booster function. |
| **`actTempHoBlacklisting`** | `MRBTS/LNBTS` | Activate temporary handover blacklisting | - | 0 (false), 1 (true) | This parameter activates the feature 'Temporary handover blacklisting'. If activated, handover target cells will be temporarily blacklisted for some time in case of consecutive HO preparation failures |
| **`actTraceOvlProt`** | `MRBTS/LNBTS` | Activate trace overload protection | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the overload protection mechanism due to debug trace streaming. More precisely, if this parameter is equal to TRUE, this activates the mechanism to automatically s |
| **`actTransmittedBelowGap`** | `MRBTS/LNBTS` | Block support of out of sequence ENDC DUD frames | - | 0 (false), 1 (true) | This parameter indicates the NR-U DUD loss reporting procedure.  False - the loss report is delayed after NR-U SN gap is detected, while waiting for a possible out of order DUD. True - the loss report |
| **`actTransportSeparationLte`** | `MRBTS/LNBTS` | Activate transport separation for LTE RAN sharing | - | 0 (false), 1 (true) | This parameter configures the use of the feature "Transport Separation for LTE RAN Sharing". |
| **`actUL256QamForEnDc`** | `MRBTS/LNBTS` | Activate UL 256 QAM for EN-DC capable UEs | - | 0:disabled;
1:nonConcurrent;
2:concurrent | This parameter activates UL 256 QAM for EN-DC capable UEs in the following way: 0: disabled 1: nonConcurrent - - EN-DC capable UEs may get UL 256QAM on PCell/SCell with UL carrier configured when not  |
| **`actULCAggr`** | `MRBTS/LNBTS` | Activation of uplink carrier aggregation | - | 0:false;
1:UL_CA_without_smartSched;
2:UL_CA_with_smartSched | The parameter activates uplink carrier aggregation. The feature can only be activated in addition to downlink carrier aggregation.  If activated (actULCAggr is configured to 'UL_CA_with_smartSched'),  |
| **`actULCaForEnDc`** | `MRBTS/LNBTS` | Activate UL CA for EN-DC | - | 0:disabled;
1:nonConcurrentULCaAndEnDc | Activation parameter for UL CA configuration of EN-DC capable UEs. A value of 'nonConcurrentULCaAndEnDc' activates the configuration of UL CA for UEs which are EN-DC capable but not in EN-DC mode. |
| **`actUTCBroadcast`** | `MRBTS/LNBTS` | Activate GPS and UTC time broadcast | - | 0 (false), 1 (true) | This parameter enables the feature LTE3056 support GPS and UTC time Information broadcast (SIB16).  Note: If SIB16 is configured in this cell, all Cat-M UEs in RRC Connected mode will be released when |
| **`actUavSupport`** | `MRBTS/LNBTS` | Activate UAV support | - | 0:disabled;
1:basic support | Activates support for Unmanned Aerial Vehicles (drones).  Available options: - disabled: UAVs are handled in the same way as terrestrial UEs; - basic support: UAV-specific handling (including uplink p |
| **`actUeBasedAnrInterFreqLte`** | `MRBTS/LNBTS` | Activate UE-based ANR for Inter-frequency LTE | - | 0 (false), 1 (true) | This parameter indicates if the 'Intra-LTE Inter-Frequency UE-based ANR' feature is activated by the operator. |
| **`actUeBasedAnrIntraFreqLte`** | `MRBTS/LNBTS` | Activate UE-based ANR for intra-Frequency LTE | - | 0 (false), 1 (true) | This parameter indicates if the 'Intra-LTE Intra-Frequency UE-based ANR' feature is activated by the operator. |
| **`actUeBasedAnrNr`** | `MRBTS/LNBTS` | Activate ANR for EN-DC with resolution of unknown cells | - | 0 (false), 1 (true) | This parameter activates the feature ANR for EN-DC with resolution of unknown cells (NR-reportCGI) and enables activation of auto-removal of unused NR neighbor relations. |
| **`actUeBasedAnrNrHo`** | `MRBTS/LNBTS` | Activate ANR for 5G HO with resolution of unknown cells | - | 0 (false), 1 (true) | This parameter activates the feature ANR for 5G-HO with resolution of unknown cells (NR-reportCGI) and enables activation of auto removal of unused NR neighbor relations. |
| **`actUeBasedAnrUtran`** | `MRBTS/LNBTS` | Activate UE-based ANR for UTRAN | - | 0 (false), 1 (true) | This parameter indicates if the feature ''UE-based ANR for Inter-RAT UTRAN" neighbor cells is activated by the operator. |
| **`actUeCapEndcHo`** | `MRBTS/LNBTS` | Activate UE MR-DC capability based handover | - | 0 (false), 1 (true) | The parameter is used to activate the EN-DC capability based handover to steer EN-DC capable UEs to dedicated frequency layers which are also reported in UE MR-DC capabilities as EN-DC anchor layers f |
| **`actUeLevelMro`** | `MRBTS/LNBTS` | Activation UE level MRO | - | 0 (false), 1 (true) | Feature activation/deactivating flag of UE Level MRO |
| **`actUeLocInfo`** | `MRBTS/LNBTS` | Activate support of user location information reporting | - | 0 (false), 1 (true) | This parameter activates support of user location information reporting |
| **`actUeThroughputMeas`** | `MRBTS/LNBTS` | Activate UE throughput measurements | - | 0 (false), 1 (true) | This parameter is used for enabling/disabling of the feature "Addition of MAC measurements to cell trace". |
| **`actUeTrigEnDcTakeBack`** | `MRBTS/LNBTS` | Activate UE triggered EN-DC take-back | - | 0:disabled;
1:ignore;
2:release | This parameter activates UE triggered EN-DC take-back If activated, the MeNB detects 'SCGFailureInformationNR' from the UE with the specific settings of particular information elements (measResultFreq |
| **`actUlGrantEffTcpBoost`** | `MRBTS/LNBTS` | Activate improve UL grant efficiency for TCP Boost | - | 0 (false), 1 (true) | This parameter activates improvements in proactive UL grant efficiency for TCP Boost. |
| **`actUlInDevCoexGNSS`** | `MRBTS/LNBTS` | Activate in-device coexistence for UL CA with GNSS | - | 0:false;
1:true | This parameter activates feature "In-Device Coexistence."  If the LTE BTS is configured to support FDD and TDD concurrently (i.e. supportedCellTechnology is configured to 'mixed_FDD_TDD'), and feature |
| **`actUlTraffDrivUlCa`** | `MRBTS/LNBTS` | Activate UL traffic-driven UL CA | - | 0 (false), 1 (true) | This parameter activates the feature 'UL traffic-driven UL carrier aggregation SCell configuration'. |
| **`actUlTxSkip`** | `MRBTS/LNBTS` | Activate low latency fast UL grants | - | 0 (false), 1 (true) | This parameter activates LTE4066 Low Latency Fast UL Grants |
| **`actUlpcDiffPusch`** | `MRBTS/LNBTS` | Activate Differentiation for PUSCH closed loop power control | - | 0 (false), 1 (true) | This parameter activates differentiation for PUSCH closed loop power control, per single specific QCI selected by the operator and per UL modulation. Differentiation here refers to ability of operator |
| **`actUplaneOvlHandling`** | `MRBTS/LNBTS` | Activate U-plane overload handling | - | 0 (false), 1 (true) | This parameter activates the feature 'U-plane overload handling'.  Three levels of load are defined and, if configured and enabled, countermeasures will be executed according to load level. |
| **`actUserLayerTcpMssClamping`** | `MRBTS/LNBTS` | Activation of user layer TCP MSS clamping | - | 0 (false), 1 (true) | This parameter activates the feature LTE 1240 'User layer TCP MSS clamping'. If activated, the MSS in end user TCP SYN packets is reduced to a value avoiding IP fragmentation in the transport layer. |
| **`actVendSpecCellTraceEnh`** | `MRBTS/LNBTS` | Activate vendor specific cell trace enhancements | - | 0 (false), 1 (true) | Parameter actVendSpecCellTraceEnh activates or deactivates additional vendor specific Cell Trace enhancements (LTE1501, LTE1931, LTE1914). |
| **`actVoLTEQualInterFreqMobility`** | `MRBTS/LNBTS` | Activate VoLTE quality triggered inter frequency mobility | - | 0 (false), 1 (true) | This parameter activates the feature LTE3723 'VoLTE quality triggered inter frequency mobility'. |
| **`actVoLTEQualSRVCCtoGsm`** | `MRBTS/LNBTS` | Activate VoLTE quality triggered SRVCC to GSM | - | 0 (false), 1 (true) | This parameter activates the feature LTE3443 'VoLTE quality triggered SRVCC to GSM'. |
| **`actVoLTEQualSrvccToWcdma`** | `MRBTS/LNBTS` | Activate VoLTE quality triggered SRVCC to WCDMA | - | 0 (false), 1 (true) | This parameter activates VoLTE Quality triggered SRVCC to WCDMA. |
| **`actVoLteNoEnDc`** | `MRBTS/LNBTS` | Activate the prevention of EN-DC setup during VoLTE | - | 0:disabled;
1:non-emergency QCI1 calls;
2:emergency QCI1 calls;
3:all QCI1 calls;
4:QCI65 and QCI66 calls;
5:QCI65/66 and non-emergency QCI1;
6:QCI65/66 and emergency QCI1;
7:QCI65/66 and all QCI1 calls | This parameter activates the prevention of EN-DC setup during VoLTE.  Following options are available: disabled -- EN-DC setup is allowed during VoLte calls non-emergency QCI1 calls -- EN-DC setup pre |
| **`actVoLteNoEnDcDrop`** | `MRBTS/LNBTS` | Activate keep En-Dc during VoLte setup | - | 0 (false), 1 (true) | This parameter activates keeping ongoing En-Dc during VoLte setup. It works on top of the feature 'VoLTE without EN-DC'  (actVoLteNoEnDc) which triggers SgNB release in case of VoLte establishment.  I |
| **`actX2gNB128`** | `MRBTS/LNBTS` | Activate X2 links to gNB to 128 | - | 0 (false), 1 (true) | This feature increases the maximal number of X2 links to NR en-gNB up to 128. The maximal number of X2 links to LTE eNB is not modified. |
| **`actZUC`** | `MRBTS/LNBTS` | Activation of ZUC algorithm | - | 0 (false), 1 (true) | Controls optional ZUC ciphering and integrity protection algorithms. This parameter enables/disables optional ZUC ciphering algorithms. |
| **`acteNACCtoGSM`** | `MRBTS/LNBTS` | Activate eNACC to GSM | - | 0 (false), 1 (true) | This parameter enables the feature LTE442 Network Assisted Cell Change from LTE to GSM |
| **`amRlcPBTab1`** | `MRBTS/LNBTS` | AM RLC poll byte table 1 | - | - | AM RLC Poll Byte Table for UE Category 1. It is used to obtain the UL pollByte and  DL pollByte values for UE category 1. |
| **`dlPollByte`** | `MRBTS/LNBTS` | DL poll byte | - | 0:25kB;
1:50kB;
2:75kB;
3:100kB;
4:125kB;
5:250kB;
6:375kB;
7:500kB;
8:750kB;
9:1000kB;
10:1250kB;
11:1500kB;
12:2000kB;
13:3000kB;
14:Infinity | AM RLC Poll Byte value in DL direction for UE category 1. |
| **`ueCategory`** | `MRBTS/LNBTS` | UE category | 1 | 1...1, step 1 | Category of UE. |
| **`ulPollByte`** | `MRBTS/LNBTS` | UL poll byte | 1 | 0:25kB;
1:50kB;
2:75kB;
3:100kB;
4:125kB;
5:250kB;
6:375kB;
7:500kB;
8:750kB;
9:1000kB;
10:1250kB;
11:1500kB;
12:2000kB;
13:3000kB;
14:Infinity | AM RLC Poll Byte value in UL direction for UE category 1. |
| **`amRlcPBTab2`** | `MRBTS/LNBTS` | AM RLC poll byte table 2 | - | - | AM RLC Poll Byte Table for UE Category 2. It is used to obtain the UL pollByte and  DL pollByte values for UE category 2. |
| **`dlPollByte`** | `MRBTS/LNBTS` | DL poll byte | 4 | 0:25kB;
1:50kB;
2:75kB;
3:100kB;
4:125kB;
5:250kB;
6:375kB;
7:500kB;
8:750kB;
9:1000kB;
10:1250kB;
11:1500kB;
12:2000kB;
13:3000kB;
14:Infinity | AM RLC Poll Byte value in DL direction for UE category 2. |
| **`ueCategory`** | `MRBTS/LNBTS` | UE category | 2 | 2...2, step 1 | Category of UE. |
| **`ulPollByte`** | `MRBTS/LNBTS` | UL poll byte | 5 | 0:25kB;
1:50kB;
2:75kB;
3:100kB;
4:125kB;
5:250kB;
6:375kB;
7:500kB;
8:750kB;
9:1000kB;
10:1250kB;
11:1500kB;
12:2000kB;
13:3000kB;
14:Infinity | AM RLC Poll Byte value in UL direction for UE category 2. |
| **`amRlcPBTab3`** | `MRBTS/LNBTS` | AM RLC poll byte table 3 | - | - | AM RLC Poll Byte Table for UE Category 3. It is used to obtain the UL pollByte and  DL pollByte values for UE category 3. |
| **`dlPollByte`** | `MRBTS/LNBTS` | DL poll byte | 5 | 0:25kB;
1:50kB;
2:75kB;
3:100kB;
4:125kB;
5:250kB;
6:375kB;
7:500kB;
8:750kB;
9:1000kB;
10:1250kB;
11:1500kB;
12:2000kB;
13:3000kB;
14:Infinity | AM RLC Poll Byte value in DL direction for UE category 3. |
| **`ueCategory`** | `MRBTS/LNBTS` | UE category | 3 | 3...3, step 1 | Category of UE. |
| **`ulPollByte`** | `MRBTS/LNBTS` | UL poll byte | 7 | 0:25kB;
1:50kB;
2:75kB;
3:100kB;
4:125kB;
5:250kB;
6:375kB;
7:500kB;
8:750kB;
9:1000kB;
10:1250kB;
11:1500kB;
12:2000kB;
13:3000kB;
14:Infinity | AM RLC Poll Byte value in UL direction for UE category 3. |
| **`amRlcPBTab4`** | `MRBTS/LNBTS` | AM RLC poll byte table 4 | - | - | AM RLC Poll Byte Table for UE Category 4. It is used to obtain the UL pollByte and  DL pollByte values for UE category 4. |
| **`dlPollByte`** | `MRBTS/LNBTS` | DL poll byte | 5 | 0:25kB;
1:50kB;
2:75kB;
3:100kB;
4:125kB;
5:250kB;
6:375kB;
7:500kB;
8:750kB;
9:1000kB;
10:1250kB;
11:1500kB;
12:2000kB;
13:3000kB;
14:Infinity | AM RLC Poll Byte value in DL direction for UE category 4. |
| **`ueCategory`** | `MRBTS/LNBTS` | UE category | 4 | 4...4, step 1 | Category of UE. |
| **`ulPollByte`** | `MRBTS/LNBTS` | UL poll byte | 8 | 0:25kB;
1:50kB;
2:75kB;
3:100kB;
4:125kB;
5:250kB;
6:375kB;
7:500kB;
8:750kB;
9:1000kB;
10:1250kB;
11:1500kB;
12:2000kB;
13:3000kB;
14:Infinity | AM RLC Poll Byte value in UL direction for UE category 4. |
| **`amRlcPBTab5`** | `MRBTS/LNBTS` | AM RLC poll byte table 5 | - | - | AM RLC Poll Byte Table for UE Category 5. It is used to obtain the UL pollByte and  DL pollByte values for UE category 5. |
| **`dlPollByte`** | `MRBTS/LNBTS` | DL poll byte | 6 | 0:25kB;
1:50kB;
2:75kB;
3:100kB;
4:125kB;
5:250kB;
6:375kB;
7:500kB;
8:750kB;
9:1000kB;
10:1250kB;
11:1500kB;
12:2000kB;
13:3000kB;
14:Infinity | AM RLC Poll Byte value in DL direction for UE category 5. |
| **`ueCategory`** | `MRBTS/LNBTS` | UE category | 5 | 5...5, step 1 | Category of UE. |
| **`ulPollByte`** | `MRBTS/LNBTS` | UL poll byte | 9 | 0:25kB;
1:50kB;
2:75kB;
3:100kB;
4:125kB;
5:250kB;
6:375kB;
7:500kB;
8:750kB;
9:1000kB;
10:1250kB;
11:1500kB;
12:2000kB;
13:3000kB;
14:Infinity | AM RLC Poll Byte value in UL direction for UE category 5. |
| **`anrOmExtEnable`** | `MRBTS/LNBTS` | Activate ANR support for LTE with OAM extension | 1 | 0 (false), 1 (true) | Optional feature flag for feature LTE492 ANR support for LTE with O&M extension |
| **`arpOffsetUsageOnBBpool`** | `MRBTS/LNBTS` | ARP Admission Control offset usage on baseband pooling | 1 | 0 (false), 1 (true) | This parameter activates the ARP offset treatment on baseband pool resources (DRB admission requests) on AirScale eNodeBs.  Only in case actArpAcOffset is set to 'true' and the ARP offset for the admi |
| **`b1NrRedirectTimer`** | `MRBTS/LNBTS` | Supervision timer for B1-NR for redirect to 5G SA | 1000 | 500...2000, step 100 ms | Supervision timer for reception of B1-NR measurement report for redirection to 5G SA. After SCG split bearer take back is executed for redirection to 5G SA carrier and timer is started, it indicates h |
| **`b1SupervisionOffset`** | `MRBTS/LNBTS` | Offset for calculation of B1 supervision time | 1000 | 0...10000, step 50 ms | The parameter defines the offset value for calculation of the maximum waiting time for "CSFB with PS-HO" related B1 measurement reports.  If the supervision timer expires eNB will trigger CS Fallback  |
| **`bbPoolAllocPrioList`** | `MRBTS/LNBTS` | Baseband pool allocation priority list | - | - | Defines criteria and priorities for automatic cell allocation to baseband pools. |
| **`allocCriterion`** | `MRBTS/LNBTS` | Allocation criterion | - | 0:Bandwidth;
1:CoMp Set;
2:Frequency;
3:Logical group;
4:Power saving groups;
5:RX antennas;
6:NB-IOT mode;
7:CatM;
8:Cell Technology;
9:Timing groups;
10:L1 balanced;
11:secondary power group first;
12:First power group WCDMA;
13:PSGRP priority | Criterion for mapping of cells to baseband pools.  For AirScale ABIA/ABIAL: - Parameter value 'L1 balanced' is not supported - Parameter value 'secondary power group first' can be selected if at least |
| **`allocPriority`** | `MRBTS/LNBTS` | Allocation priority | - | 1...11, step 1 | For AirScale ABIA/ABIAL: - Parameter value 'L1 balanced' is not supported  For AirScale ABIN/ABINL: - the supported parameter value is 'Logical group'  For AirScale ABIO/ABIOL/ABIP/ABIQ or AirScale AS |
| **`bbPoolEvalPeriod`** | `MRBTS/LNBTS` | Evaluation period of the pool resources | 50 | 10...250, step 10 ms | Period during which the load measurements are evaluated on cell basis. Based on the load measurements the pool manager redistributes the shared resources again. |
| **`bbPoolMinResource`** | `MRBTS/LNBTS` | Minimum of baseband pool resources | 5 | 1...50, step 1 % | Minimum resource share in percent the baseband pool manager shall assign to the cells. The same share shall be assigned for PUSCH and PDSCH UEs / TTI. This parameter defines the percentage of the dyna |
| **`blacklistS1HoEPCFailure`** | `MRBTS/LNBTS` | Blacklist S1 handover target cells special cause values | - | 0 (false), 1 (true) | If this parameter is set to 'true', eNodeB shall temporarily blacklist S1 Handover target cells in case a S1 Handover preparation is rejected with cause value 'Radio Network Layer Cause (Handover Fail |
| **`blockEndcHoRetryAtHoFromTrg`** | `MRBTS/LNBTS` | Blocking ENDC-HO retry after HO from target | - | 0:no blocking;
1:MR-DC based HO;
2:ENDC HO to preferred layer;
3:both | This parameter enables blocking periodic retry (as enabled by configUeCapEndcHoRetry) in the target cell for a UE arriving from ENDC-HO target layer.  Following options are available: 0: no blocking - |
| **`blockNrEndcHoAtHoFromTrg`** | `MRBTS/LNBTS` | Blocking NR coverage-based EN-DC steering after HO from target layer | - | 0:no blocking;
1:EN-DC NR-coverage HO | This parameter enables blocking of NR coverage-based EN-DC handover in the target cell for a UE arriving from ENDC-HO target layer.  Following options are available: 0: no blocking: NR coverage based  |
| **`blockingState`** | `MRBTS/LNBTS` | Blocking state | - | 0:Blocked;
1:Unblocked;
2:Blocking;
3:Unblocking | This parameter describes blocking state of the eNodeB. The value is set by the system. |
| **`btsResetRequest`** | `MRBTS/LNBTS` | BTS reset requested | - | 1...40 characters | RAT Reset request for LTE part of the BTS. Whenever a (delta-)plan modifying or setting this parameter is downloaded, LTE RAT will reset automatically. This parameter is not intended for use by the op |
| **`cPlaneDscp`** | `MRBTS/LNBTS` | Control plane DSCP | 46 | 0...63, step 1 | This parameter defines the differentiated services code point (DSCP) value assigned to the control plane traffic. |
| **`caClusterId`** | `MRBTS/LNBTS` | Carrier aggregation cluster ID | - | 0...65535, step 1 | Defines the eNBs (system modules) that are combined in carrier aggregation.  eNBs that host cells that are combined for carrier aggregation are connected via SRIO interface and must have the same caCl |
| **`caClusterMemberId`** | `MRBTS/LNBTS` | Carrier aggregation cluster member ID | - | 1:1;
2:2;
3:3;
4:4 | Identifies the eNB within a carrier aggregation cluster. Each eNB inside the a cluster must get a unique member ID.  In combination with measurement based CoMP feature fixed parameter value combinatio |
| **`caConfigRatioOvl1`** | `MRBTS/LNBTS` | CA config overload ratio | - | 0...100, step 1 % | Carrier Aggregation (CA) SCell configuration ratio in overload level 1. 0% means no SCell configuration requests are handled in overload 1. 100% (or parameter not defined) means all SCell configuratio |
| **`caIntraCellHoMode`** | `MRBTS/LNBTS` | CA  intra-cell handover mode | - | 0:disabled;
1:nonCAtoCA;
2:moreDLCACapacity | The following intra-cell handover modes to mFBI mapped or native frequency with carrier aggregation needs are supported:  disabled: intra-cell handover to mFBI mapped or native frequency with CA needs |
| **`caMinDlAmbr`** | `MRBTS/LNBTS` | Min UE-AMBR downlink for carrier aggregation | 512 | 64...150000, step 1 kbit/s | This parameter excludes those UEs from carrier aggregation, in which UE-AMBR Downlink is below the caMinDlAmbr threshold. |
| **`caMinUlAmbr`** | `MRBTS/LNBTS` | Min UE-AMBR uplink for carrier aggregation | 512 | 64...150000, step 1 kbit/s | This parameter excludes those UEs from uplink carrier aggregation, whose UE-AMBR Uplink is below the caMinUlAmbr threshold. Downlink carrier aggregation is still possible for the UE when the DL condit |
| **`caSchedFairFact`** | `MRBTS/LNBTS` | Scheduling CA fairness control factor | - | 0...1, step 0.1 | This parameter controls scheduling fairness between UEs with and without activated SCell (S-LNCEL). This parameter controls scheduling fairness in DL time and frequency domain scheduling between UEs w |
| **`caUlIntraBandAmpr`** | `MRBTS/LNBTS` | Additional MPR for UL intra-band carrier aggregation | 1 | 0:disabled;
1:enabled | This parameter defines whether or not A-MPR values as defined in Tables 6.2.4.A-1 and 6.2.4.A-2 of 3GPP 36.101 will be sent to the UE.  If set to 'disabled', A-MPR values will NOT be sent to the UE.   |
| **`cellResourceSharingType`** | `MRBTS/LNBTS` | Cell resource sharing type | - | 0:plmnBased;
1:spidBased | The parameter controls whether PLMN ID-based or SPID-based cell resource sharing shall apply if cell resource sharing is activated in one or more cells, i.e. if cellResourceSharingMode is set to value |
| **`cipherPrefL`** | `MRBTS/LNBTS` | Ciphering algorithm parameters | - | - | A list of supported AS ciphering algorithms. The algorithm is identified by the parameter name, and the assigned value determines the algorithm preference. |
| **`eea0`** | `MRBTS/LNBTS` | Null ciphering algorithm | 1 | 0...9, step 1 | Null ciphering algorithm preference. A lower value represents a lower preference, and 0 does not admit the algorithm. |
| **`eea1`** | `MRBTS/LNBTS` | SNOW 3G-based algorithm | 9 | 0...9, step 1 | SNOW 3G-based algorithm preference. A lower value represents a lower preference, and 0 does not admit the algorithm. |
| **`eea2`** | `MRBTS/LNBTS` | AES-based algorithm | 9 | 0...9, step 1 | AES-based algorithm preference. A lower value represents a lower preference, and 0 does not admit the algorithm. |
| **`eea3`** | `MRBTS/LNBTS` | ZUC-based algorithm | 8 | 0...9, step 1 | ZUC-based algorithm preference. A lower value represents a lower preference, and 0 does not admit the algorithm. |
| **`cmasProlongOffsetCoeff`** | `MRBTS/LNBTS` | CMAS prolonged offset coefficient | 1 | 0...500, step 0.5 | The parameter defines the length of the prolong offset. |
| **`congWeightAlg`** | `MRBTS/LNBTS` | Congestion weight algorithm | - | 0:qciPrio;
1:arpPrioPerVul | The Parameter congWeightAlg defines a prioritization behavior in layer 2 (MAC) until either the congestion situation ends or until the congestion situation is resolved by higher layers. There are two  |
| **`cpovlha`** | `MRBTS/LNBTS` | C-plane overload handling | - | - | Container for all parameters related to C-plane overload handling. |
| **`enableInHoRed`** | `MRBTS/LNBTS` | Enable incoming HO reduction | 1 | 0:none;
1:OVL1andL2;
2:OVL2only | This parameter enables the C-plane overload countermeasure 'Rejection of incoming inter-eNB handover requests' to reduce the amount of active RRC connections. Dependent on the detected overload level, |
| **`enableRrcConnRed`** | `MRBTS/LNBTS` | Enable RRC connection reduction | 1 | 0:none;
1:OVL1andL2;
2:OVL2only | This parameter enables the C-plane overload countermeasure 'Rejection of RRC connection requests' to reduce the amount of active RRC connections dependent on the detected overload level.  Explanation  |
| **`defDcnGroupId`** | `MRBTS/LNBTS` | Default DCN Group Id | - | 0...65535, step 1 | The default Dedicated Core Network (DCN) Group Identity per PLMN is optionally configured for rerouting UE to an MME Group when the indicated MME is not available when DECOR (actDCN) feature is activa |
| **`defProfIdxAM`** | `MRBTS/LNBTS` | Default profile index AM | 2 | 1...5, step 1 | Default Profile Index for RLC and PDCP profiles for RLC AM mode. The indicated RLC and PDCP profile is used for the configuration of a bearer that has been configured in RLC AM in the source cell of a |
| **`defProfIdxUM`** | `MRBTS/LNBTS` | Default profile index UM | 104 | 104...104, step 1 | Default Profile Index for RLC and PDCP profiles for RLC UM mode. The indicated RLC and PDCP profile is used for the configuration of a bearer that has been configured in RLC UM in the source cell of a |
| **`dlCaPreferred`** | `MRBTS/LNBTS` | Preference for SCell addition | - | 0:DLonly;
1:DLandUL | The parameter defines the preference for SCell addition in case of DL+UL carrier aggregation. dlCaPreferred is used to decide whether to add an additional downlink SCell when that additional DL SCell  |
| **`dynBlacklistingHoTimer`** | `MRBTS/LNBTS` | Duration for dynamic blacklisting | 60 | 1:1s;
2:2s;
5:5s;
10:10s;
20:20s;
30:30s;
60:60s;
90:90s;
120:120s;
180:180s;
300:300s | This parameter defines the time for which a neighbor cell shall be dynamically blacklisted if it is considered to be barred, to be under C-Plane or U-Plane overload or to be a sleeping cell |
| **`enableAutoLock`** | `MRBTS/LNBTS` | Enable automatic locking | 1 | 0:Disabled;
1:Enabled | The parameter enables the feature "Automatic locking".  If the feature is enabled, objects are automatically locked and unlocked by eNB if a parameter which requires object locking is modified via del |
| **`enableBwComSetChkEnDc`** | `MRBTS/LNBTS` | Enable bandwidth combination set check for EN-DC band combinations | - | 0 (false), 1 (true) | This parameter enables bandwidth combination set check for EN-DC band combinations. This is to allow bandwidth combination set check of EN-DC band combinations to be disabled.  When this parameter is  |
| **`enableBwCombCheck`** | `MRBTS/LNBTS` | Enable Bandwidth Combination Checks | 1 | 0 (false), 1 (true) | This parameter enables the check of bandwidth combinations according to 36.101 If the bandwidths of the bands of a configured CA configuration are not listed in 36.101 or have not been arranged with t |
| **`enableCombRsrpRsrq`** | `MRBTS/LNBTS` | Enable combined RSRP and RSRQ check | - | 0 (false), 1 (true) | This parameter enables combined RSRP and RSRQ threshold check after A5 inter-frequency measurement report is received from UE. When this flag is enabled, handover preparation is triggered only if both |
| **`enableEnDcRed`** | `MRBTS/LNBTS` | Activate EN-DC overload protection | - | 0:none;
1:HighLoadOVL1andL2;
2:OVL1andL2;
3:OVL2only | This parameter enables the C-plane overload countermeasure 'Restricting admission of EN DC services to reduce the C-plane load by reducing the X2(gNB) signalling' - New EN DC users - establishing SCG  |
| **`enableGrflShdn`** | `MRBTS/LNBTS` | Enable graceful cell shutdown | 1 | 0:Disabled;
1:Enabled | The parameter enables the feature 'Graceful Cell Shutdown'.  If the feature is activated an additional administrative state 'shuttingdown' is supported. It allows a less service impacting cell locking |
| **`enableNonCompBcsChkEnDc`** | `MRBTS/LNBTS` | Enable BW combination set check for 3GPP non-compliant UEs | - | 0 (false), 1 (true) | This parameter enables Bandwidth combination set check for EN-DC band combinations for 3GPP non-compliant UEs.  Here 3GPP non-compliant UE means UEs which do not provide the supported Bandwidth Combin |
| **`enbName`** | `MRBTS/LNBTS` | eNB name | - | 1...80 characters | Human-readable name of the eNB. It corresponds to the eNB name according to 3GPP 36.413.  The character set is restricted to Printable string according to 3GPP with following supported character: lowe |
| **`endcAnrAutoRemDisallNrCellEss`** | `MRBTS/LNBTS` | ENDC ANR auto removal disallowed for NR cells in ESS | - | 0 (false), 1 (true) | EN-DC ANR auto-removal for NR cells in Energy Saving state is disallowed if this parameter flag is set to 'true'. |
| **`endcSchedWeightBoostDl`** | `MRBTS/LNBTS` | EN-DC Scheduling Weight Boost for Downlink | 1 | 1...10, step 0.5 | This parameter specifies the DL scheduling weight scaling factor of a non-GBR bearer if NR PDCP is configured on the bearer. If set to '1', the EN-DC DL scheduling weight boost is deactivated. |
| **`endcSchedWeightBoostUl`** | `MRBTS/LNBTS` | EN-DC Scheduling Weight Boost for Uplink | 1 | 1...10, step 0.5 | This parameter specifies the UL scheduling weight scaling factor of a non-GBR bearer if NR PDCP is configured on the bearer. If set to '1', the EN-DC UL scheduling weight boost is deactivated. |
| **`estCauseArpMapConfig`** | `MRBTS/LNBTS` | RRC establishment cause to ARP mapping configurations | - | - | RRC Establishment Cause To Arp Mapping Configurations. |
| **`arpPriority`** | `MRBTS/LNBTS` | Assigned ARP priority level | - | 1...15, step 1 | ARP priority level assigned by eNB to the RRC Connection which is valid until first DRB is established. The range of the ARP priority level is 1 to 15 with 1 as the highest level of priority. |
| **`estCause`** | `MRBTS/LNBTS` | RRC establishment cause | - | 0:emergency;
1:highPriorityAccess;
2:mt-Access;
3:mo-Signalling;
4:mo-Data;
5:delayTolerantAccess-v1020 | Establishment Cause of RRC Connection for which ARP parameter assignment is done (valid until first DRB is established). |
| **`preemptionCap`** | `MRBTS/LNBTS` | Assigned ARP pre-emption capability | - | 0 (false), 1 (true) | ARP Pre-emption Capability  assigned by eNB to the RRC Connection which is valid until first DRB is established. This parameter defines whether a service data flow can get resources that were already  |
| **`etwsPrimNotifBcDur`** | `MRBTS/LNBTS` | ETWS primary notification broadcast duration | 60 | 1...600, step 1 s | Duration during which an ETWS primary Notification is broadcasted. As the broadcast parameter delivered with Write-Replace Warning Request are not to be used for ETWS primary notification (SIB10), the |
| **`forcedDrxTReportCGI`** | `MRBTS/LNBTS` | Forced DRX ReportCGI timer for S1HO to HeNB/CSG/Hybrid | 250 | 150:150ms;
200:200ms;
250:250ms;
300:300ms;
350:350ms;
400:400ms;
450:450ms;
500:500ms;
550:550ms;
600:600ms;
650:650ms;
700:700ms;
750:750ms;
800:800ms;
850:850ms;
900:900ms;
950:950ms;
1000:1000ms | It defines the maximum time in ms at the eNB for receiving the RRC Measurement Report message with an LTE (intra- or inter-frequency) ReportCGI measurement results for home eNB/CSG/Hybrid neighbor cel |
