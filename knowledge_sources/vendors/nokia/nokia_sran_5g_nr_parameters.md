---
topic_key: nokia_sran_5g_nr_parameters
title: Nokia SRAN 5G NR Parameters (NRBTS & NRCELL 25R2)
source_vendor: nokia
doc_type: parameter
technology: 5g_nr
category: 5g_nr
keywords: nokia, sran, 5g, nrbts, nrcell, nrhoif, nrmeaspr, beamforming, 25r2, parameter reference
summary: Daftar parameter resmi Nokia SRAN 25R2 untuk domain 5G NR (NRBTS, NRCELL, Handover, dan Beamforming).
---

# Nokia SRAN 5G NR Parameters (NRBTS & NRCELL 25R2)

Daftar parameter resmi Nokia SRAN 25R2 untuk domain 5G NR (NRBTS, NRCELL, Handover, dan Beamforming).

| Abbreviated Name | MO Class | Full Name | Default Value | Range / Unit | Deskripsi Parameter |
|---|---|---|---|---|---|
| **`act3gppBL22R2`** | `MRBTS/NRBTS` | Activate 3GPP standard baseline for gNB 22R2 release | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the functional changes to support the 3GPP standard baseline for the gNB 22R2 release.  Note: This parameter is frozen; it can only be set to TRUE. |
| **`act3gppBL22R3`** | `MRBTS/NRBTS` | Activate 3GPP standard baseline for gNB 22R3 release | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the functional changes to support the 3GPP standard baseline for the gNB 22R3 release.  Note: This parameter is frozen; it can only be set to TRUE. |
| **`act3gppBL22R4`** | `MRBTS/NRBTS` | Activate 3GPP standard baseline for gNB 22R4 release | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the functional changes to support the 3GPP standard baseline for the gNB 22R4 release.  Note: This parameter is frozen; it can only be set to TRUE. |
| **`act3gppBL23R1`** | `MRBTS/NRBTS` | Activate 3GPP standard baseline for gNB 23R1 release | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the functional changes to support the 3GPP standard baseline for the gNB 23R1 release.  Note: This parameter is frozen; it can only be set to TRUE. |
| **`act5gRTPM`** | `MRBTS/NRBTS` | Activate 5G RTPM | - | 0 (false), 1 (true) | This parameter activates/deactivates Real-time Performance Monitoring (RTPM) in 5G |
| **`act5gUserLayerTcpMssClamping`** | `MRBTS/NRBTS` | Activate 5G user layer TCP MSS clamping | - | 0 (false), 1 (true) | This parameter activates/deactivates 5G User Plane Configurable TCP MSS Clamping. If activated, the MSS in end-user TCP SYN packets is reduced to a value avoiding IP fragmentation in the transport lay |
| **`act5qiAndUlNguTnlQosFlowMod`** | `MRBTS/NRBTS` | Activate modification of 5QI for nonGBR QoS flows and UPF endpoint for NG-U transport bearers | - | 0 (false), 1 (true) | This parameter activates/deactivates the modification of 5QI value for nonGBR QoS flows and UPF endpoint for the NG-U transport bearers.  This parameter is applicable only for SA NR Cells. |
| **`actA1HoPrefNRLayer`** | `MRBTS/NRBTS` | Activate A1 based traffic steering to preferred NR layer | - | 0:none;
1:SA;
2:NSA;
3:SA+NSA | This parameter activates/deactivates A1 based traffic steering to preferred NR layer |
| **`actA2SgnbRelease`** | `MRBTS/NRBTS` | Activate A2 based SgNB release | - | 0 (false), 1 (true) | This parameter activates/deactivates A2 based SgNB release |
| **`actA3A5MRDuringDRXSetup`** | `MRBTS/NRBTS` | Activate A3/A5 measurement report handling during DRX setup | - | 0 (false), 1 (true) | This parameter enables/disables enhanced concurrency handling of A3/A5 measurement reports during DRX setup during incoming intra-gNB handover and incoming inter-gNB handover via Xn. |
| **`actAdaptiveSchedulerBudgetOlc`** | `MRBTS/NRBTS` | Activate adaptive scheduler budget overload control | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the dynamic allocation of the processing time provided to all the schedulers such that there is still enough processing resources available to process asynchronous |
| **`actAdditionalSliceSupport`** | `MRBTS/NRBTS` | Activate additional standard slice support | - | 0 (false), 1 (true) | This parameter activates/deactivates additional standard slice support. More precisely, it activates/deactivates DRB inactivity timer per slice and per DRB profile. It also allows to use the full rang |
| **`actAllowedBcListMrdcPrioBcSel`** | `MRBTS/NRBTS` | Activate prioritization of band combinations based on allowedBC-ListMRDC order applied by MeNB | - | 0 (false), 1 (true) | This parameter activates/deactivates prioritization of band combinations according to their order in the allowedBC-ListMRDC IE received from the MeNB during EN-DC setup or modification.  Prioritizatio |
| **`actAmfPlannedRemoval`** | `MRBTS/NRBTS` | Activate AMF planned removal | - | 0 (false), 1 (true) | This parameter activates/deactivates AMF planned removal. |
| **`actArpBasedQosScaling`** | `MRBTS/NRBTS` | Activate ARP based QoS scaling | - | 0 (false), 1 (true) | This parameter activates/deactivates ARP based QoS scaling. It introduces the possibility to configure scaling factors per each ARP priority level for non-GBR bearers (non-GBR QoS flows). |
| **`actArpToDscpMarking`** | `MRBTS/NRBTS` | Activate ARP to DSCP marking | - | 0 (false), 1 (true) | This parameter activates/deactivates the ARP based DSCP (Differentiated Services Code Point) marking. |
| **`actAssumeVoNRCapability`** | `MRBTS/NRBTS` | Activate assume VoNR capability | - | 0 (false), 1 (true) | This parameter activates/deactivates the assumption of Voice over New Radio (VoNR) capability in User Equipment (UE) by the gNB. If NRBTS.actAssumeVoNRCapability is set to True and the UE Capability i |
| **`actAutoPrachConfigIndexFdd`** | `MRBTS/NRBTS` | Activate automated PRACH configuration index assignment in FDD FR1 | - | 0 (false), 1 (true) | This parameter activates/deactivates automated PRACH configuration Index assignment in FDD FR1. Updating this parameter requires a restart of all the NRCELL instances with NRCELL.cellTechnology equal  |
| **`actAutoPrachConfigIndexFddEnh`** | `MRBTS/NRBTS` | Activate enhanced automated PRACH configuration Index assignment | - | 0 (false), 1 (true) | This parameter activates/deactivates enhanced automated PRACH configuration Index assignment. If it is activated, automatic PRACH Configuration Index assignment is possible also when cells with differ |
| **`actBbPoolExtensionTddFr1`** | `MRBTS/NRBTS` | Activate baseband resource pooling FR1 TDD extension | - | 0 (false), 1 (true) | This parameter activates/deactivates FR1 TDD baseband resource pooling extension |
| **`actBbPoolTddFr1`** | `MRBTS/NRBTS` | Activate baseband resource pooling FR1 TDD | - | 0 (false), 1 (true) | This parameter activates/deactivates FR1 TDD baseband resource pooling. |
| **`actBbPoolTddFr1AlgEnh`** | `MRBTS/NRBTS` | Activate enhanced algorithm of baseband resource pooling FR1 TDD | - | 0 (false), 1 (true) | This parameter activates/deactivates the enhanced algorithm of FR1 TDD baseband resource pooling. |
| **`actBbPoolTddFr1Enh`** | `MRBTS/NRBTS` | Activate baseband resource pooling FR1 TDD enhancements | - | 0 (false), 1 (true) | This parameter activates/deactivates baseband resource pooling FR1 TDD enhancements |
| **`actBcsCheck`** | `MRBTS/NRBTS` | Activate bandwidth combination set check | 1 | 0:disabled;
1:enabled_FR1;
2:enabled_NRDC;
12:enabled_FR1+NRDC | This parameter activates/deactivates Bandwidth Combination Set (BCS) checks in carrier aggregation or NR-DC. The gNB performs a BCS check during FR1 CA secondary cell selection to ensure the bandwidth |
| **`actBeamControlImprovement1`** | `MRBTS/NRBTS` | Activate beam control improvement 1 | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the TCI state indication while beam toggling.  The value of this parameter is used on all the cells that satisfy the following conditions: - NRCELL.actBeamforming  |
| **`actBeamControlImprovement2`** | `MRBTS/NRBTS` | Activate beam control improvement 2 | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the reduction of the UL beam re-probing rate, especially for the 4Rx receivers.  The value of this parameter is used on all the cells that satisfy the following co |
| **`actBtcOvlProt`** | `MRBTS/NRBTS` | Activate BTC Overload Protection | 1 | 0 (false), 1 (true) | This parameter activates or deactivates the BTC crash protection and overload handling. |
| **`actBufferBasedSCellAddition`** | `MRBTS/NRBTS` | Activate buffer-based SCell addition | - | 0:disabled;
1:oneShot_Dl_Fr1;
2:oneShot_stepWise_Dl_Fr1 | This parameter enables the buffer-based SCell addition. Possible values are: - disabled: Functionality is disabled. - oneShot_Dl_Fr1: Activates one-shot buffer based SCell Addition. The gNB may trigge |
| **`actCAMeasInMeasProf`** | `MRBTS/NRBTS` | Activates CA measurements under Measurement Profile | - | 0:deactivated;
1:SA;
2:NSA;
3:SA+NSA | This parameter activates/deactivates Carrier Aggregation related measurements under measurement profiles. If this feature is activated and there is no measurement profile mapping configured in NRCELL. |
| **`actCMAS`** | `MRBTS/NRBTS` | Activate CMAS broadcasting | - | 0 (false), 1 (true) | This parameter activates/deactivates CMAS broadcasting |
| **`actCaContCalcMaxAllowedScsFr1`** | `MRBTS/NRBTS` | Activate calculation of carriers contiguity checks using maximum allowed subcarrier spacing for FR1 CA | - | 0 (false), 1 (true) | This parameter activates/deactivates the gNB and UE configuration independent contiguity check calculation of nominal channel spacing between two intra-band carriers using the maximum allowed subcarri |
| **`actCaDlDataBundling`** | `MRBTS/NRBTS` | Activate CA DL data bundling | 1 | 0 (false), 1 (true) | This parameter activates/deactivates DL data bundling at RLC entity when carrier aggregation is configured.  Note: This parameter is frozen; it can only be set to TRUE. |
| **`actCaOverloadCtrlEnh`** | `MRBTS/NRBTS` | Activate CA overload control enhancements | 1 | 0 (false), 1 (true) | This parameter controls the activation/deactivation of the functionalities for CA overload control enhancement. This parameter is applicable to FR1 cells only, not applicable to FR2 cells. |
| **`actCarAgPmCount`** | `MRBTS/NRBTS` | Activate carrier aggregation performance measurement counters | - | 0 (false), 1 (true) | This parameter activates/deactivates the carrier aggregation related performance measurement counters |
| **`actCarrierAggregation`** | `MRBTS/NRBTS` | Activate carrier aggregation | - | 0 (false), 1 (true) | This parameter activates/deactivates the 5G carrier aggregation feature. This parameter is applicable only for aggregation of FR2/TDD NSA and NR-DC NR Cells. |
| **`actCarrierAggregationFr2SA`** | `MRBTS/NRBTS` | Activate carrier aggregation for FR2 TDD SA | - | 0 (false), 1 (true) | This parameter activates/deactivates the 5G intra-band carrier aggregation feature. This parameter is applicable only for aggregation of FR2 TDD SA NR Cells. |
| **`actCbrsEnhMeas`** | `MRBTS/NRBTS` | Activate CBRS enhanced measurement | - | 0 (false), 1 (true) | This parameter activates/deactivates CBRS (Citizens Broadband Radio Service) enhanced measurement. |
| **`actCbrsMobEnh`** | `MRBTS/NRBTS` | Activate CBRS mobility enhancement | - | 0 (false), 1 (true) | This parameter activates/deactivates CBRS (Citizens Broadband Radio Service) mobility enhancement. |
| **`actCellSwitchOnForCmUpdate`** | `MRBTS/NRBTS` | Activate cell switch on for configuration management update | - | 0 (false), 1 (true) | This parameter activates/deactivates cell switch on for configuration management update.  If this parameter is not configured or is configured and equal to FALSE, then cell switch on for configuration |
| **`actCellTraceReport`** | `MRBTS/NRBTS` | Activate cell trace report | - | 0 (false), 1 (true) | This parameter activates/deactivates cell trace report at gNB level. |
| **`actChannelMapVal`** | `MRBTS/NRBTS` | Activate channel mapping validation | 1 | 0:Disabled;
1:ShowAsWarning;
2:ShowAsError | This parameter activates/deactivates channel object mapping validation checks to match the NR cell type.   The possible values are: - Disabled: the checks are deactivated and any wrong configuration m |
| **`actChipsetAndRanInfoExchange`** | `MRBTS/NRBTS` | Activate chipset and RAN information exchange | - | 0 (false), 1 (true) | This parameter activates/deactivates chipset and RAN information exchange. gNB will provide information about the RAN manufacturer and running version, while the UE will provide an identification of t |
| **`actConflictConfiguration`** | `MRBTS/NRBTS` | Activate Xn conflicting configuration | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the management of conflicting configuration of incoming Xn links. |
| **`actConnRrcPooling`** | `MRBTS/NRBTS` | Activate baseband pooling of RRC connected users | - | 0 (false), 1 (true) | This parameter activates/deactivates baseband pooling of RRC connected users. |
| **`actCoordEnDssPowerSaving`** | `MRBTS/NRBTS` | Activate coordinated EN DSS power saving for 5G | - | 0 (false), 1 (true) | This parameter activates/deactivates coordinated EN DSS power saving for 5G. |
| **`actCoordinated4g5gPowerSaving`** | `MRBTS/NRBTS` | Activate coordinated 4G-5G power saving, 5G | - | 0:disabled;
1:cellDeactivation;
2:cellDeactAndReact | This parameter activates/deactivates coordinated 4G-5G power saving, 5G. |
| **`actCoverageNonCoherentUes`** | `MRBTS/NRBTS` | Activate coverage non-coherent MIMO UEs | - | 0 (false), 1 (true) | This parameter activates/deactivates the coverage based handling of non-coherent MIMO UEs |
| **`actCsReductionFactorOlc`** | `MRBTS/NRBTS` | Activate reduction factor for overload control | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the algorithm of maximum CS2 list size reduction and controlling the maximum number of FDM UEs with respect to maximum number of CS1 list size during high load for |
| **`actCsiReportsMuxOnPucch`** | `MRBTS/NRBTS` | Activate PUCCH multiplexing of CSI reports | - | 0 (false), 1 (true) | This parameter activates/deactivates the 5G PUCCH multiplexing of CSI reports feature.  It is applicable only for TDD NR cells. Activating this feature significantly reduces the PUCCH F2 coverage (e.g |
| **`actCsiTciRelAdjust`** | `MRBTS/NRBTS` | Activate CSI and TCI release during PSCell change | - | 0 (false), 1 (true) | This parameter activates/deactivates a workaround for some legacy UEs' problems during PSCell change by adjusting the TCI relations and explicitly releasing the SCell's CSI and TCI configurations that |
| **`actCustomBsr`** | `MRBTS/NRBTS` | Activate custom beam set realization | - | 0 (false), 1 (true) | This parameter activates/deactivates custom beam set realization in the gNB. |
| **`actDDDSPeriodOptimization`** | `MRBTS/NRBTS` | Activate DDDS period optimization | 1 | 0 (false), 1 (true) | This parameter activates/deactivates DDDS period optimization.  If NRCELLs with high loads are expected in configuration the recommended value for this parameter is TRUE.  Note: Optimization is known  |
| **`actDataDuplicationForMobility`** | `MRBTS/NRBTS` | Activate data duplication for mobility | - | 0 (false), 1 (true) | This parameter activates/deactivates data duplication for mobility. It defines whether the gNB is allowed to send duplicate PDCP PDU when mobility is ongoing to improve PDCP PDU delivery reliability. |
| **`actDataDuplicationForSAMobility`** | `MRBTS/NRBTS` | Activate data duplication for SA mobility | - | 0 (false), 1 (true) | This parameter activates/deactivates data duplication for SA mobility. It defines whether the gNB is allowed to send duplicate PDCP PDU when mobility is ongoing to improve PDCP PDU delivery reliabilit |
| **`actDedicatedAnrDrxProfile`** | `MRBTS/NRBTS` | Activate special DRX profiles for NR ANR functionality | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the special DRX profiles for NR ANR functionality.  Note: This parameter is frozen; it can only be set to TRUE. |
| **`actDirectSnTermBearEstSnModNSA`** | `MRBTS/NRBTS` | Activate direct SN terminated split bearer establishment by SgNB modification procedure for NSA | - | 0 (false), 1 (true) | This parameter activates/deactivates SN terminated split bearer establishment directly without PDCP anchor change by MeNB initiated SgNB modification procedure. |
| **`actDisableNrRimRsAtGnbLevel`** | `MRBTS/NRBTS` | Activate disabling of NR remote interference management RS at gNB level | - | 0 (false), 1 (true) | This parameter activates/deactivates the disabling of remote interference management RS at gNB level. When equal to TRUE, it is not allowed to support RIM framework-0 nor framework-1 at gNB level. Whe |
| **`actDisableUPIPFor64kPreferred`** | `MRBTS/NRBTS` | Activate disabling user plane integrity protection for 64kbpsPreferred | - | 0 (false), 1 (true) | Activation Flag to Disable the UPIP for a PDU session of the UE having the max supported data rate per UE for integrity protection 64kbps for "Preferred" case. |
| **`actDisableUlProactGrantAnr`** | `MRBTS/NRBTS` | Activate disabling of UL proactive grant for NR ANR functionality | - | 0 (false), 1 (true) | This parameter activates/deactivates the disabling of UL proactive grant for NR ANR functionality. |
| **`actDlAmbr`** | `MRBTS/NRBTS` | Activate DL UE AMBR limitation | - | 0:disabled;
1:SA | This parameter activates/deactivates the DL UE AMBR limitation for SA non-GBR DRBs. |
| **`actDlDataForwardingX2`** | `MRBTS/NRBTS` | Activate DL data forwarding over X2 | 1 | 0 (false), 1 (true) | This parameter activates/deactivates DL data forwarding over X2 |
| **`actDlDataForwardingX2Limit`** | `MRBTS/NRBTS` | Activate DL data forwarding limitation over X2 | - | 0 (false), 1 (true) | This parameter activates/deactivates DL data forwarding limitation over X2 towards the MeNB to protect LTE's PDCP buffer overrun.   If set to true, the amount of data to be forwarded to the MeNB will  |
| **`actDrbDrx`** | `MRBTS/NRBTS` | Activate DRB DRX | - | 0 (false), 1 (true) | This parameter activates/deactivates the extension of DRX profiles which allows operator to improve UE battery consumption by optimizing DRX for each specific service 5QI and/or QCI. |
| **`actDrbPreemption`** | `MRBTS/NRBTS` | Activate DRB preemption | - | 0 (false), 1 (true) | This parameter activates/deactivates DRB preemption. |
| **`actDrbProfileForCellAggrLevel`** | `MRBTS/NRBTS` | Activate DRB profile for cell aggregation level | - | 0:disabled;
1:FR1_SA | This parameter activates/deactivates DRB profile for cell aggregation level. |
| **`actDualSectorRu`** | `MRBTS/NRBTS` | Activate dual sector RU | - | 0 (false), 1 (true) | This parameter activates/deactivates 5G dual sector/dual band RU. It is applicable only for FR2/TDD NR sectors in an AirScale mmWave Radio (ASMR) RU. |
| **`actDynamicFirewall`** | `MRBTS/NRBTS` | Activate dynamic firewall | - | 0 (false), 1 (true) | This parameter activates/deactivates the dynamic firewall configuration on the S1, X2, Xn, NG and Xg interfaces. |
| **`actDynamicTargetShareCalcForRg`** | `MRBTS/NRBTS` | Activate dynamic target share calculation for RG | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the usage of dynamic target share calculation for a resource group when NRBTS.actSliceAwareScheduler is equal to TRUE. If NRBTS.actSliceAwareScheduler is equal to  |
| **`actE2CA`** | `MRBTS/NRBTS` | Activate E2 based carrier aggregation | - | 0 (false), 1 (true) | This parameter activates/deactivates E2 based carrier aggregation by adapting the A1 threshold for secondary cell addition, secondary cell selection weight and A2 threshold for secondary cell release  |
| **`actE2IMLB`** | `MRBTS/NRBTS` | Activate E2 based idle mode load balancing | - | 0 (false), 1 (true) | This parameter activates/deactivates E2 based idle mode load balancing with adaption of the cell re-selection priority with RIC (RAN Intelligent Controller) generated offset according to machine learn |
| **`actE2Interface`** | `MRBTS/NRBTS` | Activate E2 interface | - | 0 (false), 1 (true) | This parameter activates/deactivates the E2 interface between the E2 Node (gNB-CU-CP) and the Near-RT RIC. Note that, in the Cloud vCU deployment, if this parameter is equal to TRUE then the optional  |
| **`actETWS`** | `MRBTS/NRBTS` | Activate ETWS broadcasting | - | 0 (false), 1 (true) | This parameter activates/deactivates ETWS broadcasting |
| **`actEcpriPhase2`** | `MRBTS/NRBTS` | Activate eCPRI Phase 2 | - | 0 (false), 1 (true) | This parameter activates/deactivates the eCPRI phase 2 |
| **`actEcpriPhase3`** | `MRBTS/NRBTS` | Activate eCPRI Phase 3 | - | 0 (false), 1 (true) | This parameter activates/deactivates the eCPRI phase 3 |
| **`actEcpriRuPtpOnlySync`** | `MRBTS/NRBTS` | Activate eCPRI RU PTP only synchronization | - | 0 (false), 1 (true) | This parameter activates/deactivates the eCPRI RU PTP only synchronization mode over the ethernet interface.  Updating this parameter may provoke a RU reset, depending on the RU capability. In case RU |
| **`actEmergencyFallback`** | `MRBTS/NRBTS` | Activate emergency services fallback to LTE | - | 0 (false), 1 (true) | This parameter activates/deactivates emergency services fallback to LTE |
| **`actEnDcCuReattempt`** | `MRBTS/NRBTS` | Activate EN-DC Configuration Update Reattempt | - | 0 (false), 1 (true) | This parameter activates/deactivates the Periodic retries of EN-DC Configuration Update to MeNB from SgNB. |
| **`actEnhCpueLoadBalancing`** | `MRBTS/NRBTS` | Activate enhanced control plane UE load balancing | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the enhanced control plane UE load balancing functionality |
| **`actEnhRrcReconfUlPrbRandom`** | `MRBTS/NRBTS` | Activate Enhanced RRC Reconfiguration with Robustness handing & UL PRB Randomization | - | 0 (false), 1 (true) | This parameter activates/deactivates the robustness of RRC reconfiguration procedure and UL PRB Randomization for RRC Reconfiguration complete |
| **`actEnhanceIntraNrIntraFreqAnr`** | `MRBTS/NRBTS` | Activate enhancements on intra-NR intra-frequency ANR | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the enhancements on intra-NR intra-frequency ANR concerning the maintenance of neighbor relations.  Note: This parameter is frozen; it can only be set to TRUE. |
| **`actEnhancedLinkAdaptation`** | `MRBTS/NRBTS` | Activate the enhanced link adaptation procedures | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the enhanced link adaptation procedure |
| **`actEnhancedNgRanSupport`** | `MRBTS/NRBTS` | Activate enhanced NG RAN support | - | 0 (false), 1 (true) | This parameter activates/deactivates the NG enhancements for multi-vendor AMF support. |
| **`actEnhancedX2LinkSupervision`** | `MRBTS/NRBTS` | Activate enhanced X2 link supervision | - | 0 (false), 1 (true) | This parameter activates/deactivates enhanced X2 link supervision |
| **`actEutranFreqBandFiltering`** | `MRBTS/NRBTS` | Activate E-UTRAN frequency band filtering | - | 0 (false), 1 (true) | This parameter activates/deactivates the capability request filter when UE-Capability is requested to the UE for E-UTRAN. |
| **`actEutranFreqBandNrMrdcFilter`** | `MRBTS/NRBTS` | Activate E-UTRAN frequency band NR MRDC filtering | - | 0 (false), 1 (true) | This parameter activates/deactivates the usage of the requestedFreqBandsNR-MRDC IE in the 3GPP 36.331 UE capability Enquiry message. requestedFreqBandsNR-MRDC ensures that the UE includes all necessar |
| **`actExcludingEutranBandCheck`** | `MRBTS/NRBTS` | Activate excluding E-UTRAN band check | - | 0 (false), 1 (true) | This parameter activates / deactivates the exclusion of E-UTRAN band check when interRAT-Parameters is not present in the UE-NR-Capability. |
| **`actExcludingEutranCells`** | `MRBTS/NRBTS` | Activate excluding E-UTRAN cells | - | 0 (false), 1 (true) | This parameter activates/deactivates the exclusion of E-UTRAN cells.  Note: This parameter is frozen; it can only be set to FALSE. |
| **`actExplicitCsirsPoolSolution`** | `MRBTS/NRBTS` | Activate explicit TRS CSI-RS pooling solution | - | 0 (false), 1 (true) | This parameter activates/deactivates explicit baseband pooling extension TRS and cell specific CSI-RS resources pooling solution in the gNB. If this parameter is equal to TRUE, then In that case pooli |
| **`actExt2N77Support`** | `MRBTS/NRBTS` | Activate extended n77 band support 2 | - | 0 (false), 1 (true) | This parameter activates/deactivates the extended n77 band support 2 (3650- 3980 MHz) in the gNB in countries where usage of the n77 band might be restricted otherwise.  Note: The gNB does not check t |
| **`actExtN77Support`** | `MRBTS/NRBTS` | Activate extended n77 band support | - | 0 (false), 1 (true) | This parameter activates/deactivates the extended n77 band support (3450-3550 MHz) in the gNB in countries where usage of the n77 band might be restricted otherwise.  Note: The gNB does not check the  |
| **`actExtSchedWeightAndPrefWrrAlg`** | `MRBTS/NRBTS` | Activate extended schedulWeight and pref WRR algorithm | - | 0:disabled;
1:ExtendedRange_LegacyWrr;
2:ExtendedRange_EnhancedWrr | This Parameter activates/deactivates the enhanced weighted round robin (WRR) algorithm and extends the range of the scheduling weight which is used for frequency domain resource allocation. - disabled |
| **`actFdmEnhancedScheduling`** | `MRBTS/NRBTS` | Activate enhanced frequency domain scheduling | 1 | 0 (false), 1 (true) | This parameter activates/deactivates enhanced frequency domain (FDM) scheduling.  Note: This parameter is frozen; it can only be set to TRUE. |
| **`actFdmScheduling`** | `MRBTS/NRBTS` | Activate frequency domain scheduling | 1 | 0 (false), 1 (true) | This parameter activates/deactivates frequency domain scheduling.  Note: This parameter is frozen; it can only be set to TRUE. |
| **`actFdmUeSkippingOlc`** | `MRBTS/NRBTS` | Activate FDM UE skipping overload control | - | 0 (false), 1 (true) | This parameter activates/deactivates FDM UE skipping overload control |
| **`actFixNonCompRarWinFddDss`** | `MRBTS/NRBTS` | Activate a fix for non-3GPP compliant random access response window in specific vendor UEs for FDD DSS cells | 1 | 0 (false), 1 (true) | This parameter activates/deactivates a fix for non-3GPP compliant random access response window in specific vendor UEs for FDD DSS cells. This allows such UEs to correctly receive msg2 in cells with p |
| **`actFlexSCellSelectFr1`** | `MRBTS/NRBTS` | Activate flexible SCell selection for FR1 | - | 0 (false), 1 (true) | This parameter activates/deactivates more flexible SCell selection for carrier aggregation (CA) for frequency range 1 (FR1).  If this parameter is equal to TRUE, then the following limits apply for CA |
| **`actFlexibleBISlotDurationMode`** | `MRBTS/NRBTS` | Activate flexible bidirectional slot duration mode | - | 0:disabled;
1:partial | This parameter activates/deactivates the flexible bidirectional slot (BI, slot need to schedule both DL and UL) duration pattern. When it is activated, gNB supports to increase 50% processing time for |
| **`actFlexibleIcmpRouting`** | `MRBTS/NRBTS` | Activate flexible ICMP routing | - | 0 (false), 1 (true) | This parameter indicates if DL ICMP traffic is directed to the UE preferred UL path or the NR path. If this parameter is equal to TRUE, DL ICMP traffic is directed to the UE preferred UL path. If this |
| **`actFlowControlLoadBalance`** | `MRBTS/NRBTS` | Activate flow control load balance | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the flow control load balance. |
| **`actForceFullRRCConfigurationSaHo`** | `MRBTS/NRBTS` | Activate force full RRC configuration for SA HO | - | 0:disabled;
1:enabled;
2:onlyXnHo;
3:onlyNgHo | This parameter activates/deactivates enforcement of full RRC configuration for SA Inter-gNB handover.  The possible values are:-  -'disabled' meaning full RRC configuration for SA HO is not enforced a |
| **`actForceHoInsuffUeCap`** | `MRBTS/NRBTS` | Activate admitting HO with insufficient UE capability | - | 0 (false), 1 (true) | This parameter activates/deactivates admitting incoming handover in case of insufficient supportBandCombination capabilities received during Handover. This parameter is also used to activates/deactiva |
| **`actForcedCellSwitchOff`** | `MRBTS/NRBTS` | Activate forced cell switch off | - | 0 (false), 1 (true) | This parameter activates/deactivates the New Radio forced cell switch off.  Note: There is no coordination between the technologies that are configured for RF Sharing. |
| **`actFr2L2DlTdMetricPreCalc8CC`** | `MRBTS/NRBTS` | Activate L2 DL pre-calculation of TD metric for FR2 8CC | 1 | 0 (false), 1 (true) | This parameter activates/deactivates TD metric parallelization for TDD FR2 8CC deployment by updating TD metric independently of TD user selection. |
| **`actFr2Sa`** | `MRBTS/NRBTS` | Activate FR2 SA | - | 0 (false), 1 (true) | This parameter activates/deactivates FR2 standalone (SA) mode in the gNB. |
| **`actFullPlmnList`** | `MRBTS/NRBTS` | Activate full PLMN List | 1 | 0 (false), 1 (true) | This parameter activates/deactivates reading full PLMN list during Xn setup |
| **`actFullRRCConfigurationSaHo`** | `MRBTS/NRBTS` | Activate full RRC configuration for SA HO | - | 0:disabled;
1:enabled;
2:DrbToQosMappingOnly;
3:extended | This parameter activates/deactivates full RRC configuration for SA HO.  The possible values are: - 'disabled' meaning full RRC configuration for SA HO is deactivated. - 'enabled' meaning full RRC conf |
| **`actFullRrcConfNsaPscellChange`** | `MRBTS/NRBTS` | Activate full RRC configuration for NSA PSCell change | - | 0:disabled;
1:enabled;
2:enforced | This parameter activates/deactivates full RRC configuration for NSA PSCell change.  The possible values are: - 'disabled' meaning full RRC configuration for NSA PSCell change is deactivated. - 'enable |
| **`actGnbInitRlf`** | `MRBTS/NRBTS` | Activate gNB initiated RLF | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the gNB initiated RLF feature |
| **`actGrflShdn`** | `MRBTS/NRBTS` | Activate graceful cell shutdown | - | 0 (false), 1 (true) | This parameter activates/deactivates graceful cell shutdown. This feature allows a less service impacting cell locking.  Graceful shutdown is also used during Radio Units reset which happens as part o |
| **`actGtpUpSeqNum`** | `MRBTS/NRBTS` | Activate GTP-U Sequence Numbers for PM Counters Calculation | - | 0 (false), 1 (true) | This parameter enables filling the GTP-U Sequence numbers for PM Counters Calculation.  Note:  GTP-U Sequence numbers are used for monitoring the downlink packet loss rate on the 5G side. |
| **`actHighSliceWeightFactor`** | `MRBTS/NRBTS` | Activate high slice weight factor | - | 0 (false), 1 (true) | This parameter activates/deactivates high slice weight factor. When activated, the high value of slice weight factor is applied for slice resource control algorithm to address issue of resource share  |
| **`actHigherPrioFreqHo`** | `MRBTS/NRBTS` | Activate mobility to higher priority NR frequency | - | 0:none;
1:SA;
2:NSA;
3:SA+NSA | This parameter activates/deactivates mobility to higher priority NR frequency |
| **`actHigherPrioFreqHoForCA`** | `MRBTS/NRBTS` | Activate mobility to higher priority NR frequency for CA UEs | - | 0:disabled;
1:NSA;
2:SA;
3:SA+NSA | This parameter activates/deactivates mobility to higher priority NR frequency for CA UEs.  If this parameter is set to 'disabled' or is not configured, then inter-frequency A4 measurements will not be |
| **`actHighestEstNrTputBcSel`** | `MRBTS/NRBTS` | Activate band combination selection based on highest estimated NR throughput | 1 | 0 (false), 1 (true) | This parameter activates/deactivates band combination selection based on the highest estimated NR throughput calculated using both the gNB configuration of P(S)Cell and SCell(s) and UE Capabilities.   |
| **`actHoOptimizationCa`** | `MRBTS/NRBTS` | Activate handover optimization for carrier aggregation | - | 0 (false), 1 (true) | This parameter activates/deactivates handover related optimizations for carrier aggregation. It activates/deactivates secondary cell addition based on the UE measurement results for the target primary |
| **`actIdlMMEnDcSteering`** | `MRBTS/NRBTS` | Activate idle mode traffic steering from NR SA to LTE EN-DC carrier | - | 0 (false), 1 (true) | This parameter activates/deactivates idle mode traffic steering from NR SA to LTE EN-DC carrier.  There are two options to define/configure the idle mode mobility EN-DC aware steering functionality to |
| **`actIdleMMSteering`** | `MRBTS/NRBTS` | Activate idle mode mobility steering | - | 0 (false), 1 (true) | This parameter activates/deactivates idle mode mobility steering. |
| **`actInactDetNSAUe`** | `MRBTS/NRBTS` | Activate inactivity detection for NSA UE | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the UE inactivity handling feature for non standalone UE in mode 3x.  Note: This parameter is frozen; it can only be set to TRUE. |
| **`actIncXn`** | `MRBTS/NRBTS` | Activate incoming Xn | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the management of incoming Xn links |
| **`actIncludeNrdcInCapaEnquiryMsg`** | `MRBTS/NRBTS` | Activate including of includeNR-DC IE UECapabilityEnquiry | - | 0 (false), 1 (true) | This parameter activates / deactivates the including of includeNR-DC IE in RRC: UECapabilityEnquiry Message when NR-DC is not enabled and EN-DC traffic steering is enabled with A4 measurement. |
| **`actInterFreqHoSA`** | `MRBTS/NRBTS` | Activate inter-frequency handover for the Standalone mode | - | 0 (false), 1 (true) | This parameter activates/deactivates the inter-frequency handover for the Standalone mode. |
| **`actInterFreqInterGnbMobilityNSA`** | `MRBTS/NRBTS` | Activate inter-frequency inter-gNB mobility NSA | - | 0 (false), 1 (true) | This parameter activates/deactivates the inter-frequency inter-gNB mobility NSA 3X. |
| **`actInterFreqIntraGnbMobilityNSA`** | `MRBTS/NRBTS` | Activate inter-frequency intra-gNB mobility NSA | - | 0 (false), 1 (true) | This parameter activates/deactivates the inter-frequency intra-gNB mobility NSA 3X. |
| **`actInterGnbRREPreparedCell`** | `MRBTS/NRBTS` | Activate RRC connection re-establishment under a prepared gNB during inter-gNB handover via Xn or NG | - | 0 (false), 1 (true) | This parameter activates/deactivates the RRC connection re-establishment under a prepared gNB during Inter-gNB handover via Xn or NG (SA). |
| **`actInterMeNBMobility`** | `MRBTS/NRBTS` | Activate inter MeNB mobility | - | 0 (false), 1 (true) | This parameter activates/deactivates inter MeNB Mobility in the gNB. |
| **`actInterRatHoDirectDlDataFwd`** | `MRBTS/NRBTS` | Activate direct data forwarding for IRAT to LTE | - | 0:noIRATDirectDataFwd;
1:IRATDirectDataFwdOnXn;
2:IRATDirectDataFwdOnNg;
3:IRATDirectDataFwdOnX2 | This parameter activates / deactivates the possibility to have direct data forwarding during IRAT HO to LTE If this parameter is set to 'IRATDirectDataFwdOnXn', it indicates that direct data forwardin |
| **`actInterRatHoFromEutraToSA`** | `MRBTS/NRBTS` | Activate inter-RAT handover from E-UTRA to NR-SA UE | - | 0 (false), 1 (true) | This parameter activates/deactivates the inter-RAT handover from E-UTRA to SA UE. |
| **`actInterRatHoSA`** | `MRBTS/NRBTS` | Activate inter-RAT handover for SA UE | - | 0 (false), 1 (true) | This parameter activates/deactivates the inter-RAT handover to E-UTRA for SA UE |
| **`actInterRatHoSADlDataForward`** | `MRBTS/NRBTS` | Activate DL data forwarding for inter-RAT handover for SA UE | - | 0 (false), 1 (true) | This parameter activates/deactivates DL data forwarding for inter-RAT handover for SA UE |
| **`actIntraFreqHoSA`** | `MRBTS/NRBTS` | Activate intra-frequency handover for the Standalone mode | - | 0 (false), 1 (true) | This parameter activates/deactivates the intra-frequency handover for the Standalone mode. |
| **`actIntraFreqInterGnbMobilityNSA3x`** | `MRBTS/NRBTS` | Activate intra-frequency inter-gNB mobility NSA 3x | - | 0 (false), 1 (true) | This parameter activates/deactivates the intra-frequency inter-gNB mobility NSA 3x. |
| **`actIntraFreqIntraGnbMobilityNSA`** | `MRBTS/NRBTS` | Activate intra-frequency intra-gNB mobility NSA | - | 0 (false), 1 (true) | This parameter activates/deactivates the intra-frequency intra-gNB mobility NSA, which covers both intra-DU and inter-DU case. |
| **`actIntraMeNBMobility`** | `MRBTS/NRBTS` | Activate intra MeNB mobility | - | 0 (false), 1 (true) | This parameter activates/deactivates intra MeNB Mobility in the gNB. |
| **`actIntraNRMRO`** | `MRBTS/NRBTS` | Activate Intra-NR Mobility Robustness Optimization | - | 0 (false), 1 (true) | This parameter activates Intra-NR Mobility Robustness Optimization |
| **`actIntraNrNgHo`** | `MRBTS/NRBTS` | Activate intra-NR NG based handover | - | 0:disabled;
1:sourceAndTarget;
2:targetOnly;
3:basicTargetOnly | This parameter activates/deactivates intra-NR NG based handover for the Standalone mode.  The supported values are: - disabled meaning that intra-NR NG based handover is deactivated - sourceAndTarget  |
| **`actIpThpt`** | `MRBTS/NRBTS` | Activate reporting of DL PDCP cell level and DL/UL RLC cell level throughput PM counters | - | 0 (false), 1 (true) | This parameter activates/deactivates reporting of DL PDCP cell level and DL/UL RLC cell level for throughput PM counters and PDCP and RLC level PCMD throughput reports. |
| **`actL2TrafficShapingX2`** | `MRBTS/NRBTS` | Activate traffic shaping at gNB L2 with DL data over X2-U | - | 0 (false), 1 (true) | This parameter activates/deactivates traffic shaping at gNB L2 with DL data over X2-U |
| **`actL4sSupport`** | `MRBTS/NRBTS` | Activate L4S Support | - | 0 (false), 1 (true) | This parameter activates/deactivates the feature activation of the L4S support. |
| **`actLargeBbPoolTddFr1`** | `MRBTS/NRBTS` | Activate large baseband resource pooling FR1 TDD | - | 0 (false), 1 (true) | This parameter activates/deactivates FR1 TDD baseband resource pooling on full baseband board deployment. |
| **`actLargeBbPoolTddFr1Enh`** | `MRBTS/NRBTS` | Activate refinement of large BB resource pooling FR1 TDD | - | 0 (false), 1 (true) | This parameter activates/deactivates the refinement function of large baseband resource pooling on full board with single L1 pool deployment, this function is applicable on ABIP/ABIQ/ASOG/ASOH/RINLINE |
| **`actLastSchedulerOlcEnh`** | `MRBTS/NRBTS` | Activate OLC enhancements | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the overload control (OLC) enhancements for the last scheduler in a slot.  Note: This parameter is frozen; it can only be set to TRUE. |
| **`actLatencyPmCount`** | `MRBTS/NRBTS` | Activate reporting of NR latency PM counters | - | 0 (false), 1 (true) | This parameter activates/deactivates reporting of NR latency PM counters. This parameter controls both PMQAP and non PMQAP NR latency PM counters. |
| **`actLbpsCtrlLogicEnh`** | `MRBTS/NRBTS` | Activate load-based PS control logic enhancement | - | 0 (false), 1 (true) | This parameter activates/deactivates the cell switch off and power saving control logic enhancement. |
| **`actLocationInformationAtSgnb`** | `MRBTS/NRBTS` | Activate location information at SgNB | - | 0 (false), 1 (true) | This parameter activates/deactivates NRCGI information to be sent by the SgNB during each SgNB addition or SgNB modification procedure. |
| **`actLocationReportingSA`** | `MRBTS/NRBTS` | Activate location reporting in SA | - | 0 (false), 1 (true) | This parameter activates/deactivates location reporting in SA. |
| **`actLteNrDss`** | `MRBTS/NRBTS` | Activate LTE-NR dynamic spectrum sharing | - | 0 (false), 1 (true) | This parameter activates/deactivates LTE-NR dynamic spectrum sharing. If activated, sharing mode must be defined in each cell.  Updating this parameter will provoke gNB reset if NRBTS.actSlowPrbPoolin |
| **`actMDTTraceReport`** | `MRBTS/NRBTS` | Activate MDT trace report | - | 0 (false), 1 (true) | This parameter activates/deactivates Minimization of Drive Test (MDT) trace report at gNB level. |
| **`actMFBIEutra`** | `MRBTS/NRBTS` | Activate MFBI for E-UTRA | - | 0 (false), 1 (true) | This parameter activates/deactivates the multiple frequency band indicator (MFBI) for E-UTRA |
| **`actMacUserThpt`** | `MRBTS/NRBTS` | Activate reporting of DL MAC SDU user throughput PM counters per NR P(S) cell | - | 0 (false), 1 (true) | This parameter activates/deactivates reporting of DL MAC SDU user throughput PM counters per NR P(S) cell |
| **`actMacUserThptDist`** | `MRBTS/NRBTS` | Activate reporting of DL MAC SDU user throughput distribution PM counters at P(S)Cell | - | 0 (false), 1 (true) | This parameter activates/deactivates reporting of DL MAC SDU user throughput distribution PM counters at P(S)Cell. This parameter controls both PMQAP and Non PMQAP throughput distribution PM counters. |
| **`actMaxCcLimitPerFrGap`** | `MRBTS/NRBTS` | Activate IE maximum number of CC limit per FR gap | - | 0 (false), 1 (true) | This parameter activates/deactivates the capability IE 'independentGapConfig-maxCC-r17' for UE to indicate to the gNB the maximum amount of configured CC serving cells that the UE can perform measurem |
| **`actMeasBasedSCellAdditionNsa`** | `MRBTS/NRBTS` | Activate measurement based secondary cell addition for NSA | - | 0 (false), 1 (true) | This parameter activates/deactivates secondary cell addition for carrier aggregation based on UE measurement for NSA 3x. Note: This parameter is applicable for A1-based secondary cell addition only. |
| **`actMeasBasedSCellAdditionSa`** | `MRBTS/NRBTS` | Activate measurement based secondary cell addition for SA | - | 0:disabled;
1:A1-based;
2:A4-based | This parameter activates/deactivates secondary cell addition for carrier aggregation based on UE measurements for FR1 SA (Option 2). Measurements can be from event A1 or from event A4 or from both. |
| **`actMeasProfPowerCoordNSA`** | `MRBTS/NRBTS` | Activate power class determination based on MeNB power coordination for NSA cells | - | 0:deactivated;
1:activated | This parameter  activates/deactivates power class determination based on MeNB power coordination for NSA cells.   By default or if value 'deactivated' is configured, measurement profile selection proc |
| **`actMeasProfileCa`** | `MRBTS/NRBTS` | Activate measurement profile for CA-capable UEs | - | 0:deactivated;
1:SA | This parameter activates/deactivates the possibility to define dedicated measurement profiles for Carrier Aggregation capable UEs |
| **`actMeasurementProfReselForCA`** | `MRBTS/NRBTS` | Activate measurement profile reselection for CA | - | 0:deactivated;
1:pcInSaUlCaNotSupported;
2:pcInSaUlCaSupported;
3:pcInSaUlAndDlCaSupported | This parameter activates/deactivates measurement profile reselection for carrier aggregation of SA cells.  By default or if value 'deactivated' is configured, measurement profile selection procedure d |
| **`actMeasurementProfile`** | `MRBTS/NRBTS` | Activate measurement profile | - | 0:deactivated;
1:SA;
2:NSA;
3:SA+NSA | This parameter activates/deactivates measurement profiles. If this feature is activated and there is no measurement profile mapping configured with NRCELL.measPrMaSAList for SA cells or NRCELL.measPrM |
| **`actMeasurementStrategy`** | `MRBTS/NRBTS` | Activate measurement prioritization in coverage-based mobility | - | 0:disabled;
1:cellQuality;
2:priority | This parameter activates / deactivates the measurement prioritization in coverage based mobility |
| **`actMfbiNrCaMeasConfResolv`** | `MRBTS/NRBTS` | Activate resolving MFBI DL CA measurement config conflicts | - | 0 (false), 1 (true) | This parameter activates/deactivates the resolution of measurement configuration conflicts between SCell and potential target cells for inter-frequency mobility. |
| **`actMfbiNrCaSupportFr1`** | `MRBTS/NRBTS` | Activate multi-frequency band support for FR1 CA | - | 0 (false), 1 (true) | This parameter activates/deactivates the multi-frequency band support for carrier aggregation for NR FR1. |
| **`actMfbiNrCaSupportFr2`** | `MRBTS/NRBTS` | Activate multi-frequency band support for FR2 DL CA | - | 0:none;
2:NSA | This parameter activates/deactivates the multi-frequency band support for carrier aggregation for NR FR2.  Note: For time being, this parameter is applicable in NSA mode only. In SA mode, this paramet |
| **`actMobilityProfile`** | `MRBTS/NRBTS` | Activate mobility profile | - | 0 (false), 1 (true) | This parameter activates/deactivates the mobility profiles |
| **`actMobilityProfileReSelect`** | `MRBTS/NRBTS` | Activate mobility profile reselection | - | 0 (false), 1 (true) | This parameter activates/deactivates the mobility profile reselection |
| **`actMobilityRetryToSecondBestCell`** | `MRBTS/NRBTS` | Activate mobility retry to second best cell | - | 0 (false), 1 (true) | This parameter activates/deactivates one mobility retry to second best cell |
| **`actMultVlan`** | `MRBTS/NRBTS` | Activate Multiple VLAN interfaces | - | 0 (false), 1 (true) | This parameter activates/deactivates the Multiple VLAN interfaces feature. |
| **`actMultiDrbNSA`** | `MRBTS/NRBTS` | Activate multi DRBs per NSA UE | - | 0 (false), 1 (true) | This parameter activates/deactivates multi DRBs per NSA UE in the gNB. |
| **`actMultiFrequencyBandIndicatorNRSupport`** | `MRBTS/NRBTS` | Activate multi-frequency band support | - | 0 (false), 1 (true) | This parameter activates/deactivates the multi-frequency band feature. |
| **`actMultipleDedicatedBWPs`** | `MRBTS/NRBTS` | Activate multiple dedicated bandwidth parts (BWPs) | - | 0 (false), 1 (true) | This parameter activates/deactivates multiple dedicated bandwidth parts (BWPs). |
| **`actNgSetupRespTmrExt`** | `MRBTS/NRBTS` | Activation flag for extending the ngSetupRespTmr | - | 0 (false), 1 (true) | This Parameter is used to extend the ngSetupRespTmr to be used also for the case the NG Setup failure message does not include a Time to Wait indication. |
| **`actNgcFlexSaMode`** | `MRBTS/NRBTS` | Activate NG-C flex SA mode | - | 0 (false), 1 (true) | This parameter activates/deactivates the NG-C flex (SA mode). |
| **`actNonGbrServiceDiff`** | `MRBTS/NRBTS` | Activate non-GBR service differentiation | - | 0 (false), 1 (true) | This parameter activates/deactivates non-GBR service differentiation according to the scheduling weight configuration. |
| **`actNormVCFallback`** | `MRBTS/NRBTS` | Activate normal voice call fallback to LTE | - | 0 (false), 1 (true) | This parameter activates/deactivates normal voice fallback to LTE |
| **`actNormVCFallbackEnh`** | `MRBTS/NRBTS` | Activate normal voice call fallback to LTE enhancement | - | 0 (false), 1 (true) | This parameter activates/deactivates EPS fallback enhancement for normal voice call which sends NAS PDU to the UE and NGAP: Initial Context Setup Response to the AMF.  If an NGAP: Initial Context Setu |
| **`actNrCbrs`** | `MRBTS/NRBTS` | Activate NR CBRS | - | 0 (false), 1 (true) | This parameter activates/deactivates New Radio CBRS (Citizens Broadband Radio Service).  A New Radio cell (NRCELL instance) is considered to be a CBRS cell if NRCELL.freqBandIndicatorNR is equal to 48 |
| **`actNrDc`** | `MRBTS/NRBTS` | Activate NR-NR dual connectivity | - | 0:disabled;
1:enabled | This parameter activates/deactivates NR-DC on the BTS. It is applicable to both MN and SN.  Note 1: For NR-DC it is required to have master node NRCELL configured as stand alone with NR-DC enabled and |
| **`actNrEEEmergAct`** | `MRBTS/NRBTS` | Activate NR energy-efficient emergency activation | - | 0 (false), 1 (true) | This parameter activates/deactivates the handling of external alarm for energy-efficient emergency activation for the NR cells listed in NRPSGRP_EEEA.eeeaCellList.   If this parameter is equal to TRUE |
| **`actNrExtCellSOMethod`** | `MRBTS/NRBTS` | Activate NR cell-level extended configurations for MIMO muting and cell switch off | - | 0 (false), 1 (true) | This parameter activates/deactivates New Radio cell-level extended configurations for MIMO muting and cell switch off. |
| **`actNrLBPowerSaving`** | `MRBTS/NRBTS` | Activate NR load-based power saving | - | 0 (false), 1 (true) | This parameter activates/deactivates NR load-based power saving feature.  When it is equal to TRUE, intra-gNB NR cells that provide service to the same coverage area may be automatically switched off/ |
| **`actNrLBRTXPowerSaving`** | `MRBTS/NRBTS` | Activate NR load-based reduced TX power saving | - | 0 (false), 1 (true) | This parameter activates/deactivates the NR load-based MIMO muting feature. When the feature is activated, intra-gNB NR cells that provide service to the same coverage area may have TX-Paths automatic |
| **`actNrLBmMimoRTXPowerSaving`** | `MRBTS/NRBTS` | Activate NR load-based mMIMO TX power saving | - | 0 (false), 1 (true) | This parameter activates/deactivates NR load-based mMIMO TX power saving.  If this parameter is equal to FALSE, then updating this parameter will provoke gNB reset. If this parameter is equal to TRUE, |
| **`actNrMixedSOMethod`** | `MRBTS/NRBTS` | Activate mixed mode load-based power saving | - | 0 (false), 1 (true) | This parameter activates/deactivates mixed mode load-based power saving. |
| **`actNrRimRsResourcePooling`** | `MRBTS/NRBTS` | Activate NR RIM-RS resource pooling | - | 0 (false), 1 (true) | This parameter activates/deactivates RIM-RS resource pooling for TDD FR1 cells per L1 pool. |
| **`actNrUlRipMeasurement`** | `MRBTS/NRBTS` | Activate NR UL Received Interference Power including thermal Noise measurement | - | 0:disabled;
1:enabledWithPRACH_PUCCH_F1;
2:enabledWithoutPRACH;
3:enabledWithoutPUCCH_F1;
4:enabledWithoutPRACH_PUCCH_F1 | This parameter activates/deactivates the NR UL Received Interference Power including thermal Noise measurement.  The possible values are the following: - disabled means no NR UL Received Interference  |
| **`actNrpmqapProfiles`** | `MRBTS/NRBTS` | Activate QOS NRPMQAP profiles | - | 0 (false), 1 (true) | This parameter activates/deactivates the NRPMQAP profiles. |
| **`actNsaPSCellLoadBalancingInFR1`** | `MRBTS/NRBTS` | Activate NSA PSCell load balancing in FR1 | - | 0 (false), 1 (true) | This parameter activates/deactivates the PSCell load balancing in FR1 during NSA initial access |
| **`actNsaSlice`** | `MRBTS/NRBTS` | Activate NSA network slicing support | - | 0 (false), 1 (true) | This parameter activates/deactivates NSA network slicing support |
| **`actNsaUeBasedAnrNr`** | `MRBTS/NRBTS` | Activate ANR for EN-DC with resolution of unknown cells | - | 0 (false), 1 (true) | This parameter activates/deactivates ANR for EN-DC with resolution of unknown cells (NR-reportCGI).  Note: A separate activation parameter is used to enable automatic removal of unused NR neighbor rel |
| **`actNsaUeBasedInterFreqAnrNr`** | `MRBTS/NRBTS` | Activate ANR for EN-DC with resolution of unknown cells based on inter frequency UE measurements | - | 0 (false), 1 (true) | This parameter activates/deactivates ANR for EN-DC with resolution of unknown cells based on inter frequency UE measurements (NR-reportCGI).  Note: A separate activation parameter is used to enable au |
| **`actOldAmfIeIgnoreNGAP`** | `MRBTS/NRBTS` | Activate ignoring of Old AMF IE in specific NGAP procedures | - | 0 (false), 1 (true) | This parameter activates/deactivates the handling or ignoring of Old AMF IE in specific NGAP procedures - Initial Context Setup Request and Downlink NAS Transport messages: - If this parameter is equa |
| **`actOranCUPlanePhase1`** | `MRBTS/NRBTS` | Activate O-RAN CU-Plane phase 1 | - | 0 (false), 1 (true) | This parameter activates/deactivates O-RAN CU-Plane phase 1, which introduces the O-RAN compliant eCPRI C-Plane and U-Plane for either NR TDD FR1 on ABIO/ABIOL/ABIP/ASOH (Nokia's O-DU) or NR FDD FR1 o |
| **`actOverheatingAssistance`** | `MRBTS/NRBTS` | Activate UE overheating assistance handling | - | 0 (false), 1 (true) | This parameter activates/deactivates UE overheating assistance handling which consists in deactivating, or keeping inactive, UE configured SCells according to the UE indication via the field reducedCC |
| **`actOvlProtL2Sched`** | `MRBTS/NRBTS` | Activate L2 scheduling overload protection | - | 0 (false), 1 (true) | This parameter activates/deactivates the overload protection due to L2 scheduling overload. |
| **`actOvlProtL2Sig`** | `MRBTS/NRBTS` | Activate L2 signalling overload protection | - | 0 (false), 1 (true) | This parameter activates/deactivates the overload protection due to L2 signalling overload. |
| **`actPCMDReport`** | `MRBTS/NRBTS` | Activate PCMD report | - | 0 (false), 1 (true) | This parameter activates/deactivates PCMD report at gNB level. |
| **`actPaging`** | `MRBTS/NRBTS` | Activate Paging | 1 | 0 (false), 1 (true) | This parameter activates/deactivates paging.  Note: This parameter is frozen; it can only be set to TRUE. |
| **`actPagingEnh`** | `MRBTS/NRBTS` | Activate paging enhancements | - | 0:disabled;
1:postponedPaging;
2:pagingStratForRrcInact | This parameter activates/deactivates paging enhancements. The possible values are the following: - 'disabled' means paging enhancements are deactivated. - 'postponedPaging' means that if paging record |
| **`actPartialSlotUlCceCountDss`** | `MRBTS/NRBTS` | Activate partial slot UL CCE count for DSS cells | - | 0 (false), 1 (true) | This parameter activates/deactivates partial slot UL CCE count for DSS cells. More precisely, for EN DSS NR load reporting to CRM,  - if this parameter is equal to TRUE, then the PRBs in slots that ca |
| **`actPdcpHfnDesyncDetectAlgo`** | `MRBTS/NRBTS` | Activate PDCP HFN desynchronization detection algorithm | - | 0 (false), 1 (true) | This parameter activates/deactivates the HFN/SN desynchronization detection and recovery action functionality.  When activated, this functionality enables to recover frozen bearers faster due to HFN i |
| **`actPdcpRlcBufCongestionMechsm`** | `MRBTS/NRBTS` | Activate PDCP/RLC buffer congestion mechanism | - | 0:disabled;
1:gbrOnly;
2:gbrNonGbr;
3:rrcInactive;
4:gbrAndRrcInactive;
5:gbrNonGbrAndRrcInactive;
6:bufferOverflowProtection | This parameter activates/deactivates a PDCP/RLC buffer congestion mechanism. Buffer congestion is detected via the NRBTS.pdcpBufUsageThreshold/NRBTS.rlcBufUsageThreshold parameters.  The possible valu |
| **`actPerCCDLUserThpt`** | `MRBTS/NRBTS` | Activate reporting of DL MAC SDU nonGBR user throughput PM counters for each Carrier Combination | - | 0 (false), 1 (true) | This parameter activates/deactivates reporting of DL MAC SDU nonGBR user throughput PM counters for each Carrier Combination |
| **`actPerCCULUserThpt`** | `MRBTS/NRBTS` | Activate reporting of UL RLC SDU nonGBR user throughput PM counters for each Carrier Combination | - | 0 (false), 1 (true) | This parameter activates/deactivates reporting of UL RLC SDU nonGBR user throughput PM counters for each Carrier Combination |
| **`actPerCellMacUserThpt`** | `MRBTS/NRBTS` | Activate reporting of DL MAC SDU user throughput PM counters per NR serving cell | - | 0 (false), 1 (true) | This parameter activates/deactivates reporting of DL MAC SDU user throughput PM counters per NR serving cell. |
| **`actPersistentSysSetMOI`** | `MRBTS/NRBTS` | Activate persistent storage of system-set managed object instance(s) | - | 0 (false), 1 (true) | This parameter activates/deactivates the persistent storage of set-by-the-system managed object instance(s) during system upgrade. This parameter is only applicable to LTEENB managed object instances. |
| **`actPlmnCellResForOpUse`** | `MRBTS/NRBTS` | Activate PLMN based cell reserved for operator use | - | 0 (false), 1 (true) | This parameter activates/deactivates cell reserved for operator use functionality per PLMN group. |
| **`actPrioProcOverAnr`** | `MRBTS/NRBTS` | Activate handling of higher priority procedures during ANR | - | 0 (false), 1 (true) | This parameter activates/deactivates the handling of higher priority procedures during ANR |
| **`actPrioVoiceFallback`** | `MRBTS/NRBTS` | Activate priority voice fallback | - | 0 (false), 1 (true) | This parameter activates/deactivates the gNB prioritisation of redirection to LTE in SA calls for setup of VoNR bearers if the inter-RAT parameters are available in UE capability.  Only If redirection |
| **`actProactResendRlcPdu`** | `MRBTS/NRBTS` | Activate proactive re-sending of RLC PDUs | - | 0 (false), 1 (true) | This parameter activates/deactivates the proactive re-sending of RLC PDUs. |
| **`actPucchF3BasedTaGrantsRed`** | `MRBTS/NRBTS` | Activate time alignment UL grant reduction based on PUCCH format 3 | 1 | 0 (false), 1 (true) | This parameter activates/deactivates time alignment UL grant reduction based on PUCCH format 3. If this parameter is equal to TRUE and NRBTS.actTimeAlignExtension is equal to TRUE and NRCELL.pucchMode |
| **`actPuschRepTypeAv16c0`** | `MRBTS/NRBTS` | Activation flag for pusch-RepetitionTypeA-v16c0 | - | 0 (false), 1 (true) | This parameter activates/deactivates per band, IE capability for pusch-RepetitionTypeA-v16c0. |
| **`actRanSharing`** | `MRBTS/NRBTS` | Activate RAN sharing | - | 0 (false), 1 (true) | This parameter activates/deactivates 5G RAN sharing.  If equal to TRUE, then at least one NRPLMNSET_NSA or NRPLMNSET_SA instance shall be configured for each NR cell. In this case, the Primary PLMN (d |
| **`actRanSharingEnh`** | `MRBTS/NRBTS` | Activate RAN sharing enhancement | - | 0:disabled;
10:max_10_PLMNs | This parameter activates/deactivates the enhancements to support RAN sharing for up to 10 PLMNs per gNB and transport separation for up to 10 operators. |
| **`actRedPeriodicCsiProcessing`** | `MRBTS/NRBTS` | Activation of Reduced Periodic CSI Processing | 1 | 0 (false), 1 (true) | This parameter enables reduced periodic CSI processing.  When activated, reduced periodic CSI processing functionality shall be enabled in FR1 TDD and FR1 FDD cells with: - NRCELL-actHighSpeedCell set |
| **`actRedPeriodicSrsProcessing`** | `MRBTS/NRBTS` | Activate reduced periodic SRS processing | 1 | 0 (false), 1 (true) | This parameter activates/deactivates reduced periodic SRS processing.  When activated, reduced periodic SRS processing can be enabled in FR1 TDD cells having: - NRCELL.actDlSrsBm equal to TRUE or NRCE |
| **`actRedirect`** | `MRBTS/NRBTS` | Activate RRC Connection Release with redirection | - | 0 (false), 1 (true) | This parameter activates/deactivates RRC Connection Release with redirection |
| **`actReleaseRsrpZero`** | `MRBTS/NRBTS` | Activate release RSRP zero | - | 0 (false), 1 (true) | This parameter activates/deactivates special handling of A2 Measurement report for redirection with RSRP value 0 for the "PCell": UE context release request to AMF with cause value "user-inactivity" a |
| **`actReportedRxScalingFactor`** | `MRBTS/NRBTS` | Activate reported Rx scaling factor | - | 0 (false), 1 (true) | This parameter activates/deactivates the usage of rxScalingFactor reported from ASiR Radio. |
| **`actRfspIndex`** | `MRBTS/NRBTS` | Activate RFSP index | - | 0 (false), 1 (true) | This parameter activates/deactivates RAT/Frequency Selection Priority (RFSP) index |
| **`actRohc`** | `MRBTS/NRBTS` | Activate robust header compression | - | 0 (false), 1 (true) | This parameter activates/deactivates robust header compression for SA option 2 only. |
| **`actRrcDuringRlf`** | `MRBTS/NRBTS` | Activation of RRC procedures during RLF | - | 0 (false), 1 (true) | This parameter activates/deactivates RRC Reconfiguration procedure during Radio Link Failure. Note: If this parameter is set to false, preventing RRC Reconfiguration procedure during Radio Link Failur |
| **`actRrcInactState`** | `MRBTS/NRBTS` | Activate RRC Inactive state transitions under same gNB (SA mode) | - | 0:none;
1:intra-gNB | This parameter activates/deactivates the RRC Inactive state transitions under same gNB (SA mode). |
| **`actRrcInactStateRedCap`** | `MRBTS/NRBTS` | Activate RRC inactive state transitions under same gNB (SA mode) for RedCap | - | 0 (false), 1 (true) | This parameter activates/deactivates the RedCap UEs transitions from the RRC_CONNECTED state to the RRC_INACTIVE state under the same gNB (SA mode) |
| **`actRrcReleasePreference`** | `MRBTS/NRBTS` | Activate UE Assistance Information to report preference on the RRC state | - | 0 (false), 1 (true) | This parameter activates/deactivates UE Assistance Information to report preference on the RRC state in a capable 5G-UE |
| **`actRtwpMeasurement`** | `MRBTS/NRBTS` | Activate NR RTWP measurement | - | 0 (false), 1 (true) | This parameter activates/deactivates the NR RTWP measurement. |
| **`actSACallProcessingDU`** | `MRBTS/NRBTS` | Activate state transition and call processing (Option 2) for DU | - | 0 (false), 1 (true) | This parameter activates/deactivates RRC state transition and call processing for the gNB-DU |
| **`actSCellReleaseBadSCellRlq`** | `MRBTS/NRBTS` | Activate SCell release on bad SCell radio link quality | - | 0:disabled;
1:enabled_Fr1 | This parameter activates/deactivates the SCell release on bad SCell radio link quality (RLQ). When this is activated, the gNB immediately releases SCells that are deactivated due to bad SCell RLQ or r |
| **`actSCellReleaseForInactiveSCell`** | `MRBTS/NRBTS` | Activate SCell release for inactive SCells | - | 0:disabled;
1:timer_based_Fr1 | This parameter activates/deactivates the release for inactive SCells after no data activity for longer than the SCell inactivity release timer (NRCELL.sCellInactivityReleaseTimer). Note: Currently, th |
| **`actSCellSwapFr1`** | `MRBTS/NRBTS` | Activate SCell swap for FR1 CA | - | 0:disabled;
1:a6BasedSa | This parameter activates/deactivates SCell swap functionality for NR FR1 carrier aggregation.  Supported functionality: a6BasedSa: A6 measurement based SCell swap for SA users |
| **`actSPID`** | `MRBTS/NRBTS` | Activate SPID | - | 0 (false), 1 (true) | This parameter activates/deactivates the subscriber profile ID (SPID) for RAT/frequency priority |
| **`actSSBBoostInmMIMOMuting`** | `MRBTS/NRBTS` | Activate SSB boost in mMIMO TX power saving | - | 0 (false), 1 (true) | This parameter activates/deactivates SSB power boosting in massive MIMO muting. |
| **`actSaHoDeltaMvInterOp`** | `MRBTS/NRBTS` | Activate enhanced HO delta configuration for multi-vendor inter-operability testing for SA | - | 0 (false), 1 (true) | This parameter activates/deactivates enhancements to HO delta configuration for multi-vendor inter-operability testing for SA deployment. |
| **`actSaIntraFreqAnrDrxProf`** | `MRBTS/NRBTS` | Activate special DRX profile for intra-frequency ANR for SA | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the special DRX profile for intra-frequency ANR for SA.  Note: This parameter is frozen; it can only be set to TRUE. |
| **`actSaUeBasedAnrEutra`** | `MRBTS/NRBTS` | Activate ANR for SA with resolution of unknown E-UTRA cells | - | 0 (false), 1 (true) | This parameter activates/deactivates ANR for SA with resolution of unknown E-UTRA Inter-RAT cells (ECGI report).  Note: A separate activation parameter is used to enable automatic removal of unused EU |
| **`actSaUeBasedAnrNr`** | `MRBTS/NRBTS` | Activate ANR for SA with resolution of unknown cells | - | 0 (false), 1 (true) | This parameter activates/deactivates ANR for 5G SA with resolution of unknown cells (NR-reportCGI).  Note: A separate activation parameter is used to enable automatic removal of unused NR neighbor rel |
| **`actSaUeBasedInterFreqAnrNr`** | `MRBTS/NRBTS` | Activate ANR for SA with resolution of unknown cells based on inter frequency UE measurements | - | 0 (false), 1 (true) | This parameter activates/deactivates ANR for SA with resolution of unknown cells based on inter frequency UE measurements (NR-reportCGI).  Note: A separate activation parameter is used to enable autom |
| **`actScheUePooling`** | `MRBTS/NRBTS` | Activate scheduled UE per TTI pooling | - | 0 (false), 1 (true) | This parameter activates/deactivates scheduled UE per TTI pooling. |
| **`actSchedFairnessUlOlc`** | `MRBTS/NRBTS` | Activate scheduling fairness enhancement in L2 UL overload control | - | 0 (false), 1 (true) | This parameter activates/deactivates scheduling fairness enhancement in L2 UL overload control |
| **`actSecDataUsageRep`** | `MRBTS/NRBTS` | Activate secondary data usage report | - | 0 (false), 1 (true) | This parameter activates/deactivates secondary data usage report service.  The secondary data usage report service consists in event and periodical reporting. If this service is activated then event r |
| **`actSegUeCapUl`** | `MRBTS/NRBTS` | Activate segmentation of UE capability information in UL | - | 0 (false), 1 (true) | This parameter activates/deactivates segmentation of UE capability information in UL |
| **`actSepNrX2uPdcpDataSplitIp`** | `MRBTS/NRBTS` | Activate separate IP address for NSA3x NR X2-U PDCP data split traffic | - | 0 (false), 1 (true) | This parameter activates/deactivates the support of separate local IP addresses for NSA3x NR X2-U PDCP data split traffic and X2-U PDCP data forwarding traffic.  If equal to TRUE, separate local IP ad |
| **`actSeparatePduRelForGtpuError`** | `MRBTS/NRBTS` | Activate separate PDU session release due to GTP error | - | 0 (false), 1 (true) | This parameter activates / deactivates the PDU session release instead of UE context release due to NG-U GTP error. |
| **`actSeparatePduRelForRlcError`** | `MRBTS/NRBTS` | Activate separate PDU session release due to RLC error | - | 0 (false), 1 (true) | This parameter activates/deactivates the PDU session release instead of UE context release due to RLC error. |
| **`actServiceAwarePDCPConfig`** | `MRBTS/NRBTS` | Activate service aware PDCP configuration | - | 0 (false), 1 (true) | This parameter activates/deactivates service-aware PDCP configuration per DRB profile, including PDCP discard timer for uplink, and out-of-order delivery for downlink and uplink. |
| **`actSliceAwareAdmissionCtrl`** | `MRBTS/NRBTS` | Activate slice aware admission control | - | 0 (false), 1 (true) | This parameter activates/deactivates the slice aware admission control in the gNB. |
| **`actSliceAwareScheduler`** | `MRBTS/NRBTS` | Activate slice aware scheduler in DL | - | 0 (false), 1 (true) | This parameter activates/deactivates the slice aware scheduler in downlink in the gNB. |
| **`actSliceAwareSchedulerUlAndEnh`** | `MRBTS/NRBTS` | Activate slice aware scheduler in UL and enhancements | - | 0 (false), 1 (true) | This parameter activates/deactivates the slice aware scheduler in uplink in the gNB. This parameter also activates/deactivates the enhanced Slice Volume Control (SVC) algorithm and mixed resource grou |
| **`actSliceNumExt`** | `MRBTS/NRBTS` | Activate slice number extension | - | 0 (false), 1 (true) | This parameter activates/deactivates extension of number of slices. |
| **`actSliceSwitchToDefault`** | `MRBTS/NRBTS` | Activate PDU session setup for a non-configured slice | - | 0 (false), 1 (true) | This parameter activates/deactivates the possibility to accept a PDU session setup even if the related slice is not configured in the gNB by fallback to a default slice instead of rejecting the PDU se |
| **`actSlowPrbPooling`** | `MRBTS/NRBTS` | Activate slow PRB pooling | - | 0 (false), 1 (true) | This parameter activates/deactivates slow PRB pooling. |
| **`actSlowPrbPoolingFddFr1Enh`** | `MRBTS/NRBTS` | Activate slow PRB pooling enhancements in FDD FR1 | - | 0 (false), 1 (true) | This parameter activates/deactivates slow PRB pooling enhancements in FDD FR1 |
| **`actSmtcCentering`** | `MRBTS/NRBTS` | Activate SMTC centering | - | 0 (false), 1 (true) | This parameter activates/deactivates SMTC centering while configuring A3/A5 measurements in asynchronous networks |
| **`actSpatialStreamPooling`** | `MRBTS/NRBTS` | Activate spatial stream pooling | - | 0 (false), 1 (true) | This parameter activates/deactivates spatial stream pooling. |
| **`actSpidBasedSlicingNSA`** | `MRBTS/NRBTS` | Activate SPID based network slicing for NSA | - | 0 (false), 1 (true) | This parameter activates/deactivates the Subscriber Profile ID (SPID) based network slicing for NSA in the gNB. |
| **`actSpidRfspInactTimers`** | `MRBTS/NRBTS` | Activate SPID or RFSP based inactivity detection for UE | - | 0 (false), 1 (true) | This parameter activates/deactivates the SPID or RFSP based UE inactivity handling feature for UE |
| **`actSplitNrEutraUeCapa`** | `MRBTS/NRBTS` | Activate split of UE capability enquiry message for NR and E-UTRA | - | 0 (false), 1 (true) | This parameter activates/deactivates the possibility to split the request of UE Capability for NR and E-UTRA. If this parameter is enabled, NR is requested during ICS and EUTRA (if needed) after ICS.  |
| **`actSubscriberTraceReport`** | `MRBTS/NRBTS` | Activate subscriber trace report | - | 0 (false), 1 (true) | This parameter activates/deactivates subscriber trace report at gNB level. |
| **`actSwitchRlmConfig`** | `MRBTS/NRBTS` | Activate switch radio link monitoring configuration | - | 0 (false), 1 (true) | This parameter activates/deactivates the releasing and adding back of the RadioLinkMonitoringConfig IE, when source configuration includes failureDetectionResources in the RadioLinkMonitoringConfig me |
| **`actTddCsiImRm`** | `MRBTS/NRBTS` | Activate TDD CSI-IM rate matching | - | 0 (false), 1 (true) | This parameter activates/deactivates TDD CSI-IM rate matching. |
| **`actTddCsiRsOpt`** | `MRBTS/NRBTS` | Activate TDD CSI-RS optimization | - | 0 (false), 1 (true) | This parameter activates/deactivates the CSI-RS allocation optimization for FR1 TDD. This parameter indicates whether sub-band TRS will be enabled. |
| **`actTddPrePooling`** | `MRBTS/NRBTS` | Activate TDD pre-pooling | - | 0 (false), 1 (true) | This parameter activates/deactivates TDD pre-pooling. It shall be equal to TRUE for certain baseband configurations with: - at least one NRCELL instance allocated on an ABIL board with NRCELL.cellTech |
| **`actTdraFallback`** | `MRBTS/NRBTS` | Activate time domain resource allocation fallback | - | 0 (false), 1 (true) | This parameter activates/deactivates time domain resource (TDRA) allocation fallback.  When it is equal to TRUE, the use of dedicated PUSCH TDRA list is abandoned supporting UEs with older SW versions |
| **`actThpDist`** | `MRBTS/NRBTS` | Activate reporting of DL PDCP and UL RLC throughput distribution PM counters | - | 0 (false), 1 (true) | This parameter activates/deactivates reporting of DL PDCP and UL RLC throughput PM counters. This parameter controls both PMQAP and Non PMQAP throughput distribution PM counters |
| **`actTimeAlignExtension`** | `MRBTS/NRBTS` | Activate the time alignment extensions | - | 0 (false), 1 (true) | This parameter activates/deactivates the time alignment extensions |
| **`actTraceOvlProt`** | `MRBTS/NRBTS` | Activate trace overload protection | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the overload protection mechanism due to debug trace streaming. More precisely, if this parameter is equal to TRUE, this activates the mechanism to automatically s |
| **`actTransPhaseUlPrbNonRandom`** | `MRBTS/NRBTS` | Activate non-random PRB allocation for transient phase UEs | - | 0 (false), 1 (true) | This parameter activates/deactivates the allocation of PRBs to a transient phase UE (UE undergoing an RRC reconfiguration) at the start of the UE's dedicated bandwidth part (BWP). When this parameter  |
| **`actTrsSepaNSARanSharing`** | `MRBTS/NRBTS` | Activate transport separation for NSA RAN sharing | - | 0 (false), 1 (true) | This parameter activates/deactivates 5G transport separation for NSA RAN sharing.  If its value is equal to TRUE, different S1-U IP addresses can be configured in one system module/gNB-CU for each ope |
| **`actTrsSepaSARanSharing`** | `MRBTS/NRBTS` | Activate transport separation for SA RAN sharing | - | 0 (false), 1 (true) | This parameter activates/deactivates 5G transport separation for SA RAN sharing.  If its value is equal to TRUE, different Xn-U, Xn-C, NG-C, NG-U and Xg-U IP addresses can be configured in one system  |
| **`actUPIPSupportForPreferred`** | `MRBTS/NRBTS` | Activate user plane integrity protection for user plane integrity protection set to 'Preferred' | - | 0 (false), 1 (true) | This parameter activates/deactivates the user plane integrity protection when the User Plane Security Enforcement information is provided by the SMF to the NG-RAN with user plane security policies for |
| **`actUacAuto`** | `MRBTS/NRBTS` | Activate automatic unified access control | - | 0 (false), 1 (true) | This parameter activates/deactivates automatic unified access control. When activated, access attempts may be barred for certain access categories and access identities during high load or overload. |
| **`actUacBarPerPlmn`** | `MRBTS/NRBTS` | Activate UAC barring per PLMN | - | 0 (false), 1 (true) | This parameter activates/deactivates UAC barring per PLMN. When activated, it causes the broadcast of uac-BarringPerPLMN-List and individualPLMNList for uac-AccessCategory1-SelectionAssistanceInfo in  |
| **`actUeCapaEnquiryHoCa`** | `MRBTS/NRBTS` | Activate UE capability enquiry after Xn based handover | - | 0 (false), 1 (true) | This parameter activates/deactivates triggering of the UE capability enquiry procedure for the purpose of carrier aggregation after incoming Xn based inter-gNB handover for SA mode, if band combinatio |
| **`actUeDeltaConfigOptimize`** | `MRBTS/NRBTS` | Activate UE delta config optimize | - | 0 (false), 1 (true) | This parameter activates/deactivates UE delta configuration optimization. |
| **`actUeInitRlf`** | `MRBTS/NRBTS` | Activate UE initiated RLF | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the UE initiated RLF feature |
| **`actUlAmbr`** | `MRBTS/NRBTS` | Activate UL UE AMBR limitation | - | 0:disabled;
1:SA | This parameter activates/deactivates the UL UE AMBR limitation for SA non-GBR DRBs. |
| **`actUlCAUe`** | `MRBTS/NRBTS` | Activate UL CA UE count | 1 | 0 (false), 1 (true) | This parameter activates/deactivates the method for the calculation of UL CA UE PM counters.  If equal to TRUE, the number of CA UEs in the current cell configured as a SCell, which have x number of c |
| **`actUlCaAwareIMMSteering`** | `MRBTS/NRBTS` | Activate UL CA aware idle mode mobility steering | - | 0 (false), 1 (true) | This parameter activates/deactivates UL CA aware IMM steering. |
| **`actUnlimitedDataRateDl`** | `MRBTS/NRBTS` | Activate unlimited data rate in downlink | - | 0 (false), 1 (true) | This parameter activates/deactivates unlimited data rate in downlink. When set to TRUE, this deactivates the restriction on the maximum data rate in downlink supported by the UE calculated as defined  |
| **`actUnsupportedIEsHandling`** | `MRBTS/NRBTS` | Activate unsupported IEs handling | - | 0 (false), 1 (true) | This parameter activates/deactivates unsupported IEs handling |
| **`actUnsupportedIEsHandling23R4`** | `MRBTS/NRBTS` | Activate unsupported IEs handling in release 23R4 | - | 0 (false), 1 (true) | This parameter activates/deactivates unsupported IEs handling in release 23R4 |
| **`actUplaneIntegrityProtection`** | `MRBTS/NRBTS` | Activate user plane integrity protection | - | 0:deactivated;
1:SA | This parameter activates/deactivates user plane integrity protection for SA mode DRBs |
| **`actUseCauseToIdentifySNInit`** | `MRBTS/NRBTS` | Activate use cause to identify SN initiated | - | 0 (false), 1 (true) | This parameter activates/deactivates the identification of whether the SgNB Modification Request is received due to SN initiated reason or due to MN initiated reasons. This parameter is ignored if bot |
| **`actUserPreemption`** | `MRBTS/NRBTS` | Activate UE context preemption | - | 0 (false), 1 (true) | This parameter activates/deactivates UE context preemption. Updating this parameter might provoke reset of cells under this gNB-- gNB takes decision of reset necessity. |
| **`actVoFallBackLteB1MeaBaRedir`** | `MRBTS/NRBTS` | Activate voice fallback to LTE for B1 meas-based redirection | - | 0 (false), 1 (true) | This parameter activates/deactivates the voice fallback to LTE for B1 measurement-based redirection |
| **`actVoNRPrioDuringHOPrep`** | `MRBTS/NRBTS` | Activate VoNR prioritization during handover preparation | - | 0:disabled;
1:voNRPriorDuringXnHOPrep | This parameter activates/deactivates VoNR prioritization during handover preparation |
| **`actVoiceFallbackDuringHOPrep`** | `MRBTS/NRBTS` | Activate voice fallback to LTE during handover preparation | - | 0:disabled;
1:voiceFallbackDuringXnHOPrep | This parameter activates/deactivates voice fallback to LTE via call setup prioritization during handover preparation |
| **`actVonrPmCount`** | `MRBTS/NRBTS` | Activate VoNR counters | - | 0 (false), 1 (true) | This parameter activates/deactivates the VoNR related PM counters |
| **`actX2ConfigTransfer`** | `MRBTS/NRBTS` | Activate X2 configuration transfer | - | 0 (false), 1 (true) | This parameter activates/deactivates X2 configuration transfer |
| **`actXnSecCapNewMode`** | `MRBTS/NRBTS` | Activate XnAP UE security capabilities new mode | - | 0 (false), 1 (true) | This parameter activates/deactivates the new mode of gNB encoding/decoding XnAP UE security capabilities (introduced by 3GPP CR R3-214322). If the new mode is activated, these capabilities start from  |
| **`activityNotificationLevelSA`** | `MRBTS/NRBTS` | Stand Alone Activity Notification Level | 2 | 0:drb;
1:pdu-session;
2:ue | This parameter indicates the activity notification level for SA and NR-DC-SN UE. Regardless its value, in NR-DC SN gNB, the XNAP Activity Notification procedure concerns data traffic activity for the  |
| **`allowSlowPrbPoolingStatNdmSrs`** | `MRBTS/NRBTS` | Allow slow static NDM-SRS PRB pooling | - | 0 (false), 1 (true) | This parameter indicates if slow static NDM-SRS PRB pooling is allowed or not. If NRBTS.actBbPoolTddFr1 is equal to TRUE, more NR cells can be deployed in the half board of BBMOD or SMOD, if there are |
| **`amfPlannedRemovalTimer`** | `MRBTS/NRBTS` | AMF planned removal timer | - | 0...80, step 1 s | This timer indicates the time period (delay) used when the timer approach for GUAMI removal is employed. This timer is optionally started when a NGAP: AMF Status Indication Message is received from th |
| **`applyPriorityAccess`** | `MRBTS/NRBTS` | Apply priority access | - | 0:none;
1:HPA;
2:MPS;
3:HPA+MPS;
4:MCS;
5:MCS+HPA;
6:MCS+MPS;
7:MCS+HPA+MPS | This parameter indicates which priority access calls (High Priority Access, Multimedia Priority Service or Mission Critical Service) may use the dedicated radio resource pools defined by NRCELL-numOfR |
| **`b1RedirSupervisionTimer`** | `MRBTS/NRBTS` | B1 redirection supervision timer | 1000 | 100...10000, step 100 ms | This parameter indicates the time to wait for B1 measurement report from redirection to E-UTRAN.   After voice fallback or emergency fallback is triggered for redirection to a E-UTRAN carrier, a timer |
| **`beamSetInstalled`** | `MRBTS/NRBTS` | Beam set installed | - | 0...4000 characters | This parameter indicates the list of BSR packages installed in the gNB.  It contains the list of BSR package names that are downloaded and available for use in the BTS. |
| **`blockingState`** | `MRBTS/NRBTS` | Blocking state | - | 0:Blocked;
1:Unblocked;
2:Blocking;
3:Unblocking | This parameter indicates the blocking state of the New Radio BTS |
| **`bopNumPdcpSduDiscard`** | `MRBTS/NRBTS` | Discard initial number of dropped PDCP SDUs | 5 | 1...50, step 1 | This parameter indicates the initial number of PDCP SDUs packets discarded in the event of a buffer overflow threat. |
| **`bopNumRlcSduDiscard`** | `MRBTS/NRBTS` | Discard initial number of dropped RLC SDUs | 5 | 1...50, step 1 | This parameter indicates the initial number of RLC SDUs packets discarded in the event of a buffer overflow threat. |
| **`bopThNonCriticalTraffic`** | `MRBTS/NRBTS` | Bop threshold for noncritical traffic | 90 | 50...90, step 1 % | This parameter indicates the threshold which the buffer will start to be protected by limiting incoming traffic. |
| **`cPlaneDscp`** | `MRBTS/NRBTS` | Control plane DSCP | 46 | 0...63, step 1 | This parameter defines the differentiated services code point (DSCP) value assigned to the gNB-CU and gNB-DU Control Plane traffic for all interfaces including F1-C, NG-C, X2-C and Xn-C. DSCP marking  |
| **`caBackoffTimerUeOh`** | `MRBTS/NRBTS` | CA configuration backoff timer for UE overheating | 60 | 0...300, step 1 s | This parameter indicates the time during which the gNB does not attempt CA after releasing all of the SCells for a UE and at least one SCell was inactive due to UE overheating.  If this parameter is s |
| **`caConfigurationSupport`** | `MRBTS/NRBTS` | CA configuration support | - | 0:none;
1:2CCDL_2CCUL;
2:4CCDL_2CCUL;
3:8CCDL_4CC UL | This parameter indicates the specific maximum CA configuration support that is activated in the gNB. In particular, this parameter limits the maximum number of carrier components in UL and DL that can |
| **`caConfigurationSupportFr2SA`** | `MRBTS/NRBTS` | CA configuration support for FR2 SA | - | 0:none;
1:2CCDL_2CCUL;
2:4CCDL_2CCUL;
3:8CCDL_4CCUL | This parameter indicates the specific maximum CA configuration support that is activated in the gNB. In particular, this parameter limits the maximum number of carrier components in UL and DL that can |
| **`caDlDataBundlingInterval`** | `MRBTS/NRBTS` | CA DL data bundling interval | 1 | 1...5, step 1 ms | This parameter indicates the DL data bundling interval at RLC entity when carrier aggregation is configured (NRBTS.actCaDlDataBundling is equal to TRUE) |
| **`caHighPowerBc`** | `MRBTS/NRBTS` | UL CA BC power limit rule | - | 0:disabled;
1:enabled;
2:p-NR-FR not signaled | This parameter indicates the power limit rule for uplink inter-band carrier aggregation band combinations. The possible values are: - 'disabled': PPowerClass, CA is defined by maximum UE power specifi |
| **`cbtsFlowControlProf`** | `MRBTS/NRBTS` | Profile of Classical BTS flow control parameters | - | - | Profile for the internal F1 flow control parameters. This is applicable to: - SCG F1-U of EN-DC Split Bearer - SCG F1-U of SN Terminated Inter-gNB NR-DC Split Bearer - MCG F1-U of MN Terminated Intra- |
| **`dddsPeriod`** | `MRBTS/NRBTS` | Periodicity of F1-U Downlink Data Delivery Status Indication message | 5 | 5...50, step 5 ms | This parameter defines the periodicity of F1-U Downlink Data Delivery Status Indication message. This is applicable to: - SCG F1-U of EN-DC Split Bearer - SCG F1-U of SN Terminated Inter-gNB NR-DC Spl |
| **`flowControlReactionDelay`** | `MRBTS/NRBTS` | Flow control reaction delay | 5 | 5...30, step 1 ms | The parameter defines the reaction time/delay of the flow control algorithm |
| **`maxRlcQueueingDelay`** | `MRBTS/NRBTS` | Max RLC Queuing Delay | 20 | 6...30, step 1 ms | This parameter defines the value of max RLC queuing delay to be used for flow control algorithm in internal F1. This is applicable to: - SCG F1-U for EN-DC Split Bearer - MCG F1-U (MN side) and SCG F1 |
| **`maxTransferDelay`** | `MRBTS/NRBTS` | Max Transfer Delay | 20 | 1...100, step 1 ms | This parameter defines the value of max queuing delay include to be used for flow control algorithm in internal F1. This is applicable to: - SCG F1-U of EN-DC Split Bearer - SCG F1-U of SN Terminated  |
| **`minThFlowCtrl`** | `MRBTS/NRBTS` | Minimum throughput for flow control | 1 | 1...100, step 1 Mbit/s | This parameter defines the value of minimum throughput to be used for flow control algorithm in internal F1. This is applicable to: - SCG F1-U of EN-DC Split Bearer - SCG F1-U of SN Terminated Inter-g |
| **`cipherPrefL`** | `MRBTS/NRBTS` | Ciphering algorithm parameters | - | - | This parameter indicates the list of supported AS ciphering algorithms. Each algorithm is identified by the parameter name, and the assigned value determines the algorithm preference |
| **`nea0`** | `MRBTS/NRBTS` | Null ciphering algorithm | 1 | 0...9, step 1 | This parameter indicates the preference for the Null ciphering algorithm. A lower value represents a lower preference and 0 does not admit the algorithm. |
| **`nea1_128`** | `MRBTS/NRBTS` | SNOW 3G-based algorithm | 3 | 0...9, step 1 | This parameter indicates the preference for the SNOW 3G-based algorithm for ciphering. A lower value represents a lower preference and 0 does not admit the algorithm. |
| **`nea2_128`** | `MRBTS/NRBTS` | AES-based algorithm | 4 | 0...9, step 1 | This parameter indicates the preference for the AES-based algorithm for ciphering. A lower value represents a lower preference and 0 does not admit the algorithm. |
| **`nea3_128`** | `MRBTS/NRBTS` | ZUC-based algorithm | 2 | 0...9, step 1 | This parameter indicates the preference for the ZUC-based algorithm for ciphering. A lower value represents a lower preference and 0 does not admit the algorithm. |
| **`cpueLoadBalancing`** | `MRBTS/NRBTS` | CPUE load balancing | - | - | This structure configures the load balancing parameters for CPUE |
| **`cpueOverrideResiliencyThreshold`** | `MRBTS/NRBTS` | Override resiliency threshold at CPUE | - | 0 (false), 1 (true) | This parameter defines an override flag to allow for new UE context allocation to happen even after CPUE resiliency threshold has been reached |
| **`csiMeasGapOverlap`** | `MRBTS/NRBTS` | CSI resource overlap with measurement gaps | - | 0:overlapChecked;
1:overlapNotCheckedNsa;
2:overlapNotCheckedSa;
3:overlapNotCheckedNsaSa | This parameter indicates whether overlap between CSI resources and measurement gaps is checked. The gNB shall accept the measurement gap setup with or without checking for CSI resources overlap based  |
| **`cuOvlHa`** | `MRBTS/NRBTS` | C-plane overload handling | - | - | This parameter gathers parameters for 5G C-plane counter measures handling |
| **`ovlBeamSwitchRej`** | `MRBTS/NRBTS` | Reject beam switch due to overload | - | 0:disabled;
1:enabled | This parameter enables/disables the counter measure of rejecting beam switch or port switch for NSA / NR-DC-SN UEs and non-emergency and non-priority access SA UEs during overload. |
| **`ovlNsaA4TimerDiscard`** | `MRBTS/NRBTS` | Discard A4 timer expiry for NSA due to overload | - | 0:disabled;
1:enabled | This parameter enables/disables the counter measure of discarding A4 timer expiry for NSA during overload |
| **`ovlNsaAddRej`** | `MRBTS/NRBTS` | Reject NSA addition blocking due to overload | - | 0:disabled;
1:enabled | This parameter enables/disables the counter measure of rejecting SgNB Addition Request messages from MeNB or SNode Addition Request from MN gNB during overload. |
| **`ovlNsaErabRej`** | `MRBTS/NRBTS` | Reject NSA E-RAB addition blocking due to overload | - | 0:disabled;
1:enabled | This parameter enables/disables the counter measure of rejecting SgNB Modification Request messages from MeNB for E-RAB additions during overload |
| **`ovlNsaHoRej`** | `MRBTS/NRBTS` | Reject NSA mobility blocking due to overload | - | 0:disabled;
1:enabled | This parameter enables/disables the countermeasure of rejecting intra/inter MeNB mobility and filtering overloaded local cells from Intra-gNB PSCell handover candidate list during overload. |
| **`ovlNsaLteHoRej`** | `MRBTS/NRBTS` | Reject NSA intra/inter MeNB mobility blocking due to overload | - | 0:disabled;
1:enabled | This parameter enables/disables the counter measure of rejecting intra/inter MeNB mobility during overload |
| **`ovlNsaMeasDiscard`** | `MRBTS/NRBTS` | Discard measurements for NSA due to overload | - | 0:disabled;
1:enabled | This parameter enables/disables the counter measure of discarding measurements for NSA during overload |
| **`ovlSNInitModRej`** | `MRBTS/NRBTS` | Reject SN initiated modification due to overload | - | 0:disabled;
1:enabled | This parameter enables/disables the counter measure of rejecting SNode Modification Required from secondary node (SN) during overload. |
| **`ovlSaA4TimerDiscard`** | `MRBTS/NRBTS` | Discard A4 timer expiry for SA due to overload | - | 0:disabled;
1:enabled | This parameter enables/disables the counter measure of discarding A4 timer expiry for SA during overload |
| **`ovlSaHoRej`** | `MRBTS/NRBTS` | Reject incoming HO due to overload | - | 0:disabled;
1:enabled | This parameter enables/disables the countermeasure of rejecting incoming handover and filtering overloaded local cells from handover candidate list for non-emergency and non-priority access UEs during |
| **`ovlSaMeasDiscard`** | `MRBTS/NRBTS` | Discard measurements for SA due to overload | - | 0:disabled;
1:enabled | This parameter enables/disables the counter measure of discarding measurements for SA during overload |
| **`ovlSaPduRej`** | `MRBTS/NRBTS` | Reject PDU session resource setup for SA due to overload | - | 0:disabled;
1:enabled | This parameter enables/disables the counter measure of rejecting PDU Session Resource Setup and RRC Resume for non-emergency and non-priority access SA UEs during overload. |
| **`ovlSaRrcRej`** | `MRBTS/NRBTS` | Reject RRC connection request for SA due to overload | - | 0:disabled;
1:enabled | This parameter enables/disables the counter measure of rejecting of non-emergency and non-priority access RRC Connection Request and RRC Resume Request1 messages from UE during overload. |
| **`cuUeIdToLinkMappingUpdateDelay`** | `MRBTS/NRBTS` | CU UE ID to link mapping update delay | 50 | 1:1ms;
50:50ms;
100:100ms;
200:200ms;
500:500ms;
1000:1000ms;
2000:2000ms;
65535:never | This parameter indicates how often the gNB-CU UE ID to link mapping should be updated in the SDL database. The gNB-CU entity, responsible for storing this information, shall wait this specified time a |
| **`deactEnhPrbPoolAlgoUlMuMimo`** | `MRBTS/NRBTS` | Deactivate enhanced PRB pooling UL MU-MIMo | - | 0 (false), 1 (true) | This parameter activates/deactivates the usage of enhanced PRB pooling algorithm introduced in UL for optimal PRB distribution between cells when UL MU-MIMO is enabled. The introduced enhancement incl |
| **`deltaRsrpFromBestCell`** | `MRBTS/NRBTS` | Delta RSRP from best cell | - | -40...0, step 1 | This parameter indicates the maximum allowed offset (delta, unit: dB) in RSRP value of FR1 cell to be selected for SgNB addition.  The FR1 cell is allowed to be selected for initial access during the  |
| **`deltaRsrqFromBestCell`** | `MRBTS/NRBTS` | Delta RSRQ from best cell | - | -40...0, step 1 | This parameter indicates the maximum allowed offset (delta, unit: dB) in RSRQ value of FR1 cell to be selected for SgNB addition.  The FR1 cell is allowed to be selected for initial access during the  |
| **`discoveredE2Plane`** | `MRBTS/NRBTS` | Discovered E2 Plane IP configuration | - | - | This parameter indicates the list of distinguished names representing the gNB E2 node IP addresses. |
| **`ipV4AddressDN1`** | `MRBTS/NRBTS` | IPv4 address 1 distinguished name | - | 7...400 characters | This parameter indicates the distinguished name of the IPADDRESSV4 instance representing the primary IPv4 address of the gNB-CU-CP E2 node. Example: MRBTS-1/NRBTS1/TNLSVC-1/TNL-1/IPNO1/IPIF-1/IPADDRES |
| **`ipV6AddressDN1`** | `MRBTS/NRBTS` | IPv6 address 1 distinguished name | - | 7...400 characters | This parameter indicates the distinguished name of the IPADDRESSV6 instance representing the primary IPv6 address of the gNB-CU-CP E2 node. Example: MRBTS-1/NRBTS1/TNLSVC-1/TNL-1/IPNO1/IPIF-1/IPADDRES |
| **`dlAmbrMonitorPeriod`** | `MRBTS/NRBTS` | Monitoring period for DL AMBR | 100 | 100...1000, step 100 ms | This parameter defines the monitoring period for non-GBR DRBs to update the DL UE AMBR limit. |
| **`dlAmbrSampInterval`** | `MRBTS/NRBTS` | Sampling interval for DL AMBR | 1000 | 500...2000, step 500 ms | This parameter defines the frequency of averaging for the incoming DL data rate for the non-GBR DRBs to update the DL UE AMBR limit. |
| **`dlAmbrZeroRateMonitorDuration`** | `MRBTS/NRBTS` | Zero rate monitoring duration for DL AMBR | 500 | 0...1000, step 100 ms | This parameter defines the duration of monitoring the zero input data rate to reduce the DL AMBR for the non-GBR DRBs. |
| **`drbInactivityTimerSA`** | `MRBTS/NRBTS` | Stand alone UE DRB inactivity timer | 10 | 0...604800, step 1 s | This timer indicates the time period for the indication of the DRB inactivity in both DL and UL directions for SA UE. If this parameter is equal to 0, then this timer is off. Note: NRBTS.drbRrcInactIn |
| **`drbInactivityTimerSA5qi1`** | `MRBTS/NRBTS` | Stand alone UE 5QI1 DRB inactivity timer | 45 | 0...7200, step 1 s | This parameter indicates the time period for the indication of the DRB inactivity in both DL and UL directions for 5QI1 DRB of SA UE and taken into account only when NRBTS.activityNotificationLevelSA  |
| **`drbInactivityTimerSA5qi5`** | `MRBTS/NRBTS` | Stand alone UE 5QI5 DRB inactivity timer | 45 | 0...7200, step 1 s | This parameter indicates the time period for the indication of the DRB inactivity in both DL and UL directions for 5QI5 DRB of SA UE and taken into account only when NRBTS.activityNotificationLevelSA  |
| **`drbInactivityTimerSARedCap`** | `MRBTS/NRBTS` | Stand alone UE DRB inactivity timer for RedCap | 10 | 0...7200, step 1 s | This timer indicates the time period for the indication of the DRB inactivity in both DL and UL directions for RedCap SA UEs.  It is recommended to use a value lower than drbInactivityTimerSA for the  |
| **`drbRrcInactInactivityTimerSA`** | `MRBTS/NRBTS` | RRC Inactive UE DRB inactivity timer for SA | 5 | 0...7200, step 1 s | This timer defines the time period for the indication of the DRB inactivity in both DL and UL directions for RRC Inactive capable SA UEs. If this parameter is equal to 0, then this timer is off. |
| **`drbRrcInactInactivityTimerSARedCap`** | `MRBTS/NRBTS` | RRC inactive UE DRB inactivity timer for RedCap SA | 5 | 0...7200, step 1 s | This timer indicates the time period for the indication of the DRB inactivity in both DL and UL directions for RRC inactive capable RedCap SA UEs.  It is recommended to use a value lower than drbRrcIn |
| **`drxDefaultPaging`** | `MRBTS/NRBTS` | Default DRX paging cycle value for the gNB | 128 | 32:v32;
64:v64;
128:v128;
256:v256 | This parameter indicates the default value for the DRX paging cycle to be shared with AMF and the UE.  Value v32 corresponds to 32 radio frames, v64 to 64 radio frames, v128 to 128 radio frames and v2 |
| **`duOvlHa`** | `MRBTS/NRBTS` | DU overload handling | - | - | This parameter gathers parameters for DU side countermeasures handling. |
| **`delayRrcOvlCountermeasures`** | `MRBTS/NRBTS` | Delay RRC overload countermeasures | 300 | 0...1000, step 50 ms | This parameter indicates a delay for the application of gNB-DU RRC overload countermeasures. |
