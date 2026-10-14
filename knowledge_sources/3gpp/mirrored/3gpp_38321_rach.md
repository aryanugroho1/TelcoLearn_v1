---
topic_key: 3gpp_38321_rach
title: 3GPP TS 38.321 - 5G NR Random Access Procedure (RACH CBRA & CFRA)
source_vendor: 3gpp
doc_type: specification_clause
technology: 5g_nr
category: 5g_nr
keywords: rach, random access, preamble, msg1, rar, msg2, msg3, msg4, contention resolution, cbra, cfra, 2-step rach
summary: Ekstraksi klausul teknis penting 3GPP TS 38.321 - 5G NR Random Access Procedure (RACH CBRA & CFRA) dari 3GPP TS 38.321.
---

## 5.1 Random Access procedure

#### 5.1.1 Random Access procedure initialization

The Random Access procedure described in this clause is initiated by a PDCCH order, by the MAC entity itself, or by RRC for the events in accordance with TS 38.300 [2]. There is only one Random Access procedure ongoing at any point in time in a MAC entity. The Random Access procedure on an SCell shall only be initiated by a PDCCH order with *ra-PreambleIndex* different from 0b000000.

NOTE 1: If a new Random Access procedure is triggered while another is already ongoing in the MAC entity, it is up to UE implementation whether to continue with the ongoing procedure or start with the new procedure (e.g. for SI request).

NOTE 2: If there was an ongoing Random Access procedure that is triggered by a PDCCH order while the UE receives another PDCCH order indicating the same Random Access Preamble, PRACH mask index and uplink carrier, the Random Access procedure is considered as the same Random Access procedure as the ongoing one and not initialized again.

When a Random Access procedure is initiated, UE selects a set of Random Access resources as specified in clause 5.1.1b and initialises the following parameters for the Random Access procedure according to the values configured by RRC for the selected set of Random Access resources:

- *prach-ConfigurationIndex*: the available set of PRACH occasions for the transmission of the Random Access Preamble for Msg1. These are also applicable to the MSGA PRACH if the PRACH occasions are shared between 2-step and 4-step RA types;
- *prach-ConfigurationPeriodScaling-IAB*: the scaling factor defined in TS 38.211 [8] and applicable to IAB-MTs, extending the periodicity of the PRACH occasions baseline configuration indicated by *prach-ConfigurationIndex*;
- *prach-ConfigurationFrameOffset-IAB*: the frame offset defined in TS 38.211 [8] and applicable to IAB-MTs, altering the ROs frame defined in the baseline configuration indicated by *prach-ConfigurationIndex*;
- *prach-ConfigurationSOffset-IAB*: the subframe/slot offset defined in TS 38.211 [8] and applicable to IAB-MTs, altering the ROs subframe or slot defined in the baseline configuration indicated by *prach-ConfigurationIndex*;
- *msgA-PRACH-ConfigurationIndex*: the available set of PRACH occasions for the transmission of the Random Access Preamble for MSGA in 2-step RA type;
- *preambleReceivedTargetPower*: initial Random Access Preamble power for 4-step RA type;
- *msgA-PreambleReceivedTargetPower*: initial Random Access Preamble power for 2-step RA type;
- *rsrp-ThresholdSSB*: an RSRP threshold for the selection of the SSB for 4-step RA type. If the Random Access procedure is initiated for beam failure recovery, *rsrp-ThresholdSSB* used for the selection of the SSB within *candidateBeamRSList* refers to *rsrp-ThresholdSSB* in *BeamFailureRecoveryConfig* IE;
- *rsrp-ThresholdCSI-RS*: an RSRP threshold for the selection of CSI-RS for 4-step RA type. If the Random Access procedure is initiated for beam failure recovery, *rsrp-ThresholdCSI-RS* is equal to *rsrp-ThresholdSSB* in *BeamFailureRecoveryConfig* IE;

- *msgA-RSRP-ThresholdSSB*: an RSRP threshold for the selection of the SSB for 2-step RA type;
- *rsrp-ThresholdSSB-SUL*: an RSRP threshold for the selection between the NUL carrier and the SUL carrier;
- *msgA-RSRP-Threshold*: an RSRP threshold for selection between 2-step RA type and 4-step RA type when both 2-step and 4-step RA type Random Access Resources are configured in the UL BWP;
- *rsrp-ThresholdMsg3*: an RSRP threshold for Msg3 repetition (see clause 5.1.1b);
- *FeatureCombination*: feature or a combination of features associated with a set of Random Access resources;
- *featurePriorities*: priorities for features, such as RedCap, Slicing, etc. (see clause 5.1.1d);
- *msgA-TransMax*: The maximum number of MSGA transmissions when both 4-step and 2-step RA type Random Access Resources are configured;
- *candidateBeamRSList*: a list of reference signals (CSI-RS and/or SSB) identifying the candidate beams for recovery and the associated Random Access parameters;
- *recoverySearchSpaceId*: the search space identity for monitoring the response of the beam failure recovery request;
- *powerRampingStep*: the power-ramping factor;
- *msgA-PreamblePowerRampingStep*: the power ramping factor for MSGA preamble;
- *powerRampingStepHighPriority*: the power-ramping factor in case of prioritized Random Access procedure;
- *scalingFactorBI*: a scaling factor for prioritized Random Access procedure;
- *ra-PreambleIndex*: Random Access Preamble;
- *ra-ssb-OccasionMaskIndex*: defines PRACH occasion(s) associated with an SSB in which the MAC entity may transmit a Random Access Preamble (see clause 7.4);
- *msgA-SSB-SharedRO-MaskIndex*: Indicates the subset of 4-step RA type PRACH occasions shared with 2-step RA type PRACH occasions for each SSB. If 2-step RA type PRACH occasions are shared with 4-step RA type PRACH occasions and *msgA-SSB-SharedRO-MaskIndex* is not configured, then all 4-step RA type PRACH occasions are available for 2-step RA type (see clause 7.4);
- *ssb-SharedRO-MaskIndex*: defines PRACH occasions, on which preambles are allocated for a feature or a combination of features, associated with an SSB in which the MAC entity may transmit a Random Access Preamble (see clause 7.4);
- *ra-OccasionList*: defines PRACH occasion(s) associated with a CSI-RS in which the MAC entity may transmit a Random Access Preamble;
- *ra-PreambleStartIndex*: the starting index of Random Access Preamble(s) for on-demand SI request;
- *startPreambleForThisPartition*: the first preamble associated with the set of Random Access Resources applicable to the Random Access procedure;
- *preambleTransMax*: the maximum number of Random Access Preamble transmission;
- *ssb-perRACH-OccasionAndCB-PreamblesPerSSB*: defines the number of SSBs mapped to each PRACH occasion for 4-step RA type and the number of contention-based Random Access Preambles mapped to each SSB;
- *msgA-CB-PreamblesPerSSB-PerSharedRO*: defines the number of contention-based Random Access Preambles for 2-step RA type mapped to each SSB when the PRACH occasions are shared between 2-step and 4-step RA types;
- *msgA-SSB-PerRACH-OccasionAndCB-PreamblesPerSSB*: defines the number of SSBs mapped to each PRACH occasion for 2-step RA type and the number of contention-based Random Access Preambles mapped to each SSB;

- *numberOfPreamblesPerSSB-ForThisPartition*: defines the number of consecutive preambles for a feature or a combination of features mapped to each SSB;
- *msgA-PUSCH-ResourceGroupA*: defines MSGA PUSCH resources that the UE shall use when performing MSGA transmission using Random Access Preambles group A;
- *msgA-PUSCH-ResourceGroupB*: defines MSGA PUSCH resources that the UE shall use when performing MSGA transmission using Random Access Preambles group B;
- *msgA-PUSCH-Resource-Index*: identifies the index of the PUSCH resource used for MSGA in case of contention-free Random Access with 2-step RA type;
- if *groupBconfigured* is configured, then Random Access Preambles group B is configured for 4-step RA type.
  - Amongst the contention-based Random Access Preambles associated with an SSB (as defined in TS 38.213 [6]), the first *numberOfRA-PreamblesGroupA* included in *groupBconfigured* Random Access Preambles belong to Random Access Preambles group A. The remaining Random Access Preambles associated with the SSB belong to Random Access Preambles group B (if configured).
- if *groupB-ConfiguredTwoStepRA* is configured, then Random Access Preambles group B is configured for 2-step RA type.
  - Amongst the contention-based Random Access Preambles for 2-step RA type associated with an SSB (as defined in TS 38.213 [6]), the first *numberOfRA-PreamblesGroupA* included in *GroupB-ConfiguredTwoStepRA* Random Access Preambles belong to Random Access Preambles group A. The remaining Random Access Preambles associated with the SSB belong to Random Access Preambles group B (if configured).

NOTE 3: If Random Access Preambles group B is supported by the cell Random Access Preambles group B is included for each SSB.

- if Random Access Preambles group B is configured for 4-step RA type:
  - *ra-Msg3SizeGroupA*: the threshold to determine the groups of Random Access Preambles for 4-step RA type;
  - *msg3-DeltaPreamble*:  $\Delta_{PREAMBLE\_Msg3}$  in TS 38.213 [6];
  - *messagePowerOffsetGroupB*: the power offset for preamble selection included in *groupBconfigured*;
  - *numberOfRA-PreamblesGroupA*: defines the number of Random Access Preambles in Random Access Preamble group A for each SSB included in *groupBconfigured*.
- if Random Access Preambles group B is configured for 2-step RA type:
  - *msgA-DeltaPreamble*:  $\Delta_{MsgA\_PUSCH}$  in TS 38.213 [6];
  - *messagePowerOffsetGroupB*: the power offset for preamble selection included in *GroupB-ConfiguredTwoStepRA*;
  - *numberOfRA-PreamblesGroupA*: defines the number of Random Access Preambles in Random Access Preamble group A for each SSB included in *GroupB-ConfiguredTwoStepRA*;
  - *ra-MsgA-SizeGroupA*: the threshold to determine the groups of Random Access Preambles for 2-step RA type.
- the set of Random Access Preambles and/or PRACH occasions for SI request, if any;
- the set of Random Access Preambles and/or PRACH occasions for beam failure recovery request, if any;
- the set of Random Access Preambles and/or PRACH occasions for reconfiguration with sync, if any;
- *ra-ResponseWindow*: the time window to monitor RA response(s) (SpCell only);
- *ra-ContentionResolutionTimer*: the Contention Resolution Timer (SpCell only);
- *msgB-ResponseWindow*: the time window to monitor RA response(s) for 2-step RA type (SpCell only).

In addition, the following information for related Serving Cell is assumed to be available for UEs:

- if Random Access Preambles group B is configured:
  - if the Serving Cell for the Random Access procedure is configured with supplementary uplink as specified in TS 38.331 [5], and SUL carrier is selected for performing Random Access Procedure:
    - $P_{CMAX,fc}$  of the SUL carrier as specified in TS 38.101-1 [14], TS 38.101-2 [15], and TS 38.101-3 [16].
  - else:
    - $P_{CMAX,fc}$  of the NUL carrier as specified in TS 38.101-1 [14], TS 38.101-2 [15], and TS 38.101-3 [16].

The following UE variables are used for the Random Access procedure:

- *PREAMBLE\_INDEX*;
- *PREAMBLE\_TRANSMISSION\_COUNTER*;
- *PREAMBLE\_POWER\_RAMPING\_COUNTER*;
- *PREAMBLE\_POWER\_RAMPING\_STEP*;
- *PREAMBLE\_RECEIVED\_TARGET\_POWER*;
- *PREAMBLE\_BACKOFF*;
- *PCMAX*;
- *SCALING\_FACTOR\_BI*;
- *TEMPORARY\_C-RNTI*;
- *RA\_TYPE*;
- *POWER\_OFFSET\_2STEP\_RA*;
- *MSG4\_PREAMBLE\_POWER\_RAMPING\_STEP*.

When the Random Access procedure is initiated on a Serving Cell, the MAC entity shall:

- 1> flush the Msg3 buffer;
- 1> flush the MSGA buffer;
- 1> set the *PREAMBLE\_TRANSMISSION\_COUNTER* to 1;
- 1> set the *PREAMBLE\_POWER\_RAMPING\_COUNTER* to 1;
- 1> set the *PREAMBLE\_BACKOFF* to 0 ms;
- 1> set *POWER\_OFFSET\_2STEP\_RA* to 0 dB;
- 1> if the carrier to use for the Random Access procedure is explicitly signalled:
  - 2> select the signalled carrier for performing Random Access procedure;
  - 2> set the *PCMAX* to  $P_{CMAX,fc}$  of the signalled carrier.
- 1> else if the carrier to use for the Random Access procedure is not explicitly signalled; and
- 1> if the Serving Cell for the Random Access procedure is configured with supplementary uplink as specified in TS 38.331 [5]; and
- 1> if the RSRP of the downlink pathloss reference is less than *rsrp-ThresholdSSB-SUL*:
  - 2> select the SUL carrier for performing Random Access procedure;
  - 2> set the *PCMAX* to  $P_{CMAX,fc}$  of the SUL carrier.

- 1> else:
    - 2> select the NUL carrier for performing Random Access procedure;
    - 2> set the *PCMAX* to *P<sub>CMAX,fc</sub>* of the NUL carrier.
- NOTE 4: Void.
- 1> perform the BWP operation as specified in clause 5.15;
  - 1> select the set of Random Access resources applicable to the current Random Access procedure according to clause 5.1.1b;
  - 1> if the Random Access procedure is initiated by PDCCH order and if the *ra-PreambleIndex* explicitly provided by PDCCH is not 0b000000; or
  - 1> if the Random Access procedure was initiated for SI request (as specified in TS 38.331 [5]) and the Random Access Resources for SI request have been explicitly provided by RRC; or
  - 1> if the Random Access procedure was initiated for SpCell beam failure recovery (as specified in clause 5.17) and if the contention-free Random Access Resources for beam failure recovery request for 4-step RA type have been explicitly provided by RRC for the BWP selected for Random Access procedure; or
  - 1> if the Random Access procedure was initiated for reconfiguration with sync and if the contention-free Random Access Resources for 4-step RA type have been explicitly provided in *rach-ConfigDedicated* for the BWP selected for Random Access procedure:
    - 2> set the *RA\_TYPE* to *4-stepRA*.
  - 1> else if the BWP selected for Random Access procedure is configured with both 2-step and 4-step RA type Random Access Resources within the selected set of Random Access resources (as specified in clause 5.1.1b) and the RSRP of the downlink pathloss reference is above *msgA-RSRP-Threshold*; or
  - 1> if the BWP selected for Random Access procedure is only configured with 2-step RA type Random Access resources within the selected set of Random Access resources according to clause 5.1.1b; or
  - 1> if the Random Access procedure was initiated for reconfiguration with sync and if the contention-free Random Access Resources for 2-step RA type have been explicitly provided in *rach-ConfigDedicated* for the BWP selected for Random Access procedure:
    - 2> set the *RA\_TYPE* to *2-stepRA*.
  - 1> else:
    - 2> set the *RA\_TYPE* to *4-stepRA*.
  - 1> perform initialization of variables specific to Random Access type as specified in clause 5.1.1a;
  - 1> if *RA\_TYPE* is set to *2-stepRA*:
    - 2> perform the Random Access Resource selection procedure for 2-step RA type (see clause 5.1.2a).
  - 1> else:
    - 2> perform the Random Access Resource selection procedure (see clause 5.1.2).

### 5.1.1a Initialization of variables specific to Random Access type

The MAC entity shall:

- 1> if *RA\_TYPE* is set to *2-stepRA*:
  - 2> set *PREAMBLE\_POWER\_RAMPING\_STEP* to *msgA-PreamblePowerRampingStep*;
  - 2> set *SCALING\_FACTOR\_BI* to 1;

- 2> apply *preambleTransMax* included in the *RACH-ConfigGenericTwoStepRA*;
- 2> if the Random Access procedure was initiated for reconfiguration with sync or for SCG activation; and
- 2> if *cfra-TwoStep* is configured for the selected carrier:
  - 3> if *msgA-TransMax* is configured in the *cfra-TwoStep*:
    - 4> apply *msgA-TransMax* configured in the *cfra-TwoStep*.
- 2> else if *msgA-TransMax* is included in the *RACH-ConfigCommonTwoStepRA*:
  - 3> apply *msgA-TransMax* included in the *RACH-ConfigCommonTwoStepRA*.
- 2> if the Random Access procedure was initiated for SpCell beam failure recovery (as specified in clause 5.17); and
- 2> if *beamFailureRecoveryConfig* is configured for the active UL BWP of the selected carrier; and
- 2> if *ra-PrioritizationTwoStep* is configured in the *beamFailureRecoveryConfig*:
  - 3> set *PREAMBLE\_POWER\_RAMPING\_STEP* to the *powerRampingStepHighPriority* included in the *ra-PrioritizationTwoStep* in *beamFailureRecoveryConfig*;
  - 3> if *scalingFactorBI* is configured in the *ra-PrioritizationTwoStep* in *beamFailureRecoveryConfig*:
    - 4> set *SCALING\_FACTOR\_BI* to the *scalingFactorBI*.
- 2> else if the Random Access procedure was initiated for reconfiguration with sync or for SCG activation; and
- 2> if *rach-ConfigDedicated* is configured for the selected carrier; and
- 2> if *ra-PrioritizationTwoStep* is configured in the *rach-ConfigDedicated*:
  - 3> set *PREAMBLE\_POWER\_RAMPING\_STEP* to the *powerRampingStepHighPriority* included in the *ra-PrioritizationTwoStep* in *rach-ConfigDedicated*;
  - 3> if *scalingFactorBI* is configured in *ra-PrioritizationTwoStep* in the *rach-ConfigDedicated*:
    - 4> set *SCALING\_FACTOR\_BI* to the *scalingFactorBI*.
- 2> else if both *ra-PrioritizationForSlicingTwoStep* for a *NSAG-ID* and *ra-PrioritizationForAccessIdentityTwoStep* are configured for the selected carrier; and
- 2> if the MAC entity is provided by upper layers with both this *NSAG-ID* and Access Identity 1 or 2; and
- 2> if for at least one of these Access Identities the corresponding bit in the *ra-PrioritizationForAI* is set to *one*:
  - 3> if *enableRA-PrioritizationForSlicing* is set to *true*:
    - 4> if *powerRampingStepHighPriority* is configured in the *ra-PrioritizationForSlicingTwoStep* for this *NSAG-ID*:
      - 5> set *PREAMBLE\_POWER\_RAMPING\_STEP* to the *powerRampingStepHighPriority*.
    - 4> if *scalingFactorBI* is configured in the *ra-PrioritizationForSlicingTwoStep* for this *NSAG-ID*:
      - 5> set *SCALING\_FACTOR\_BI* to the *scalingFactorBI*.
  - 3> else if *enableRA-PrioritizationForSlicing* is set to *false*:
    - 4> if *powerRampingStepHighPriority* is configured in the *ra-PrioritizationForAccessIdentityTwoStep*:
      - 5> set *PREAMBLE\_POWER\_RAMPING\_STEP* to the *powerRampingStepHighPriority*.
    - 4> if *scalingFactorBI* is configured in the *ra-PrioritizationForAccessIdentityTwoStep*:
      - 5> set *SCALING\_FACTOR\_BI* to the *scalingFactorBI*.

- 2> else if *ra-PrioritizationForSlicingTwoStep* for a *NSAG-ID* is configured for the selected carrier; and
- 2> if the MAC entity is provided by upper layers with this *NSAG-ID*:
  - 3> if *powerRampingStepHighPriority* is configured in the *ra-PrioritizationForSlicingTwoStep* for this *NSAG-ID*:
    - 4> set *PREAMBLE\_POWER\_RAMPING\_STEP* to the *powerRampingStepHighPriority*.
  - 3> if *scalingFactorBI* is configured in the *ra-PrioritizationForSlicingTwoStep* for this *NSAG-ID*:
    - 4> set *SCALING\_FACTOR\_BI* to the *scalingFactorBI*.
- 2> else if *ra-PrioritizationForAccessIdentityTwoStep* is configured for the selected carrier; and
- 2> if the MAC entity is provided by upper layers with Access Identity 1 or 2; and
- 2> if for at least one of these Access Identities the corresponding bit in the *ra-PrioritizationForAI* is set to *one*:
  - 3> if *powerRampingStepHighPriority* is configured in the *ra-PrioritizationForAccessIdentityTwoStep*:
    - 4> set *PREAMBLE\_POWER\_RAMPING\_STEP* to the *powerRampingStepHighPriority*.
  - 3> if *scalingFactorBI* is configured in the *ra-PrioritizationForAccessIdentityTwoStep*:
    - 4> set *SCALING\_FACTOR\_BI* to the *scalingFactorBI*.
- 2> set *MSG\_A\_PREAMBLE\_POWER\_RAMPING\_STEP* to *PREAMBLE\_POWER\_RAMPING\_STEP*.
- 1> else (i.e. *RA\_TYPE* is set to *4-stepRA*):
  - 2> set *PREAMBLE\_POWER\_RAMPING\_STEP* to *powerRampingStep*;
  - 2> set *SCALING\_FACTOR\_BI* to 1;
  - 2> set *preambleTransMax* to *preambleTransMax* included in the *RACH-ConfigGeneric*;
  - 2> if the Random Access procedure was initiated for SpCell beam failure recovery (as specified in clause 5.17); and
  - 2> if *beamFailureRecoveryConfig* is configured for the active UL BWP of the selected carrier:
    - 3> start the *beamFailureRecoveryTimer*, if configured;
    - 3> apply the parameters *powerRampingStep*, *preambleReceivedTargetPower*, and *preambleTransMax* configured in the *beamFailureRecoveryConfig*.
  - 2> if the Random Access procedure was initiated for beam failure recovery (as specified in clause 5.17); and
  - 2> if *beamFailureRecoveryConfig* is configured for the active UL BWP of the selected carrier; and
  - 2> if *ra-Prioritization* is configured in the *beamFailureRecoveryConfig*:
    - 3> set *PREAMBLE\_POWER\_RAMPING\_STEP* to the *powerRampingStepHighPriority* included in the *ra-Prioritization* in *beamFailureRecoveryConfig*;
    - 3> if *scalingFactorBI* is configured in *ra-Prioritization* in the *beamFailureRecoveryConfig*:
      - 4> set *SCALING\_FACTOR\_BI* to the *scalingFactorBI*.
  - 2> else if the Random Access procedure was initiated for reconfiguration with sync or for SCG activation; and
  - 2> if *rach-ConfigDedicated* is configured for the selected carrier; and
  - 2> if *ra-Prioritization* is configured in the *rach-ConfigDedicated*:
    - 3> set *PREAMBLE\_POWER\_RAMPING\_STEP* to the *powerRampingStepHighPriority* included in the *ra-Prioritization* in *rach-ConfigDedicated*;

- 3> if *scalingFactorBI* is configured in *ra-Prioritization* in the *rach-ConfigDedicated*:
  - 4> set *SCALING\_FACTOR\_BI* to the *scalingFactorBI*.
- 2> else if both *ra-PrioritizationForSlicing* for a *NSAG-ID* and *ra-PrioritizationForAccessIdentity* are configured for the selected carrier; and
- 2> if the MAC entity is provided by upper layers with both this *NSAG-ID* and Access Identity 1 or 2; and
- 2> if for at least one of these Access Identities the corresponding bit in the *ra-PrioritizationForAI* is set to *one*:
  - 3> if *enableRA-PrioritizationForSlicing* is set to *true*:
    - 4> if *powerRampingStepHighPriority* is configured in the *ra-PrioritizationForSlicing* for this *NSAG-ID*:
      - 5> set *PREAMBLE\_POWER\_RAMPING\_STEP* to the *powerRampingStepHighPriority*.
    - 4> if *scalingFactorBI* is configured in the *ra-PrioritizationForSlicing* for this *NSAG-ID*:
      - 5> set *SCALING\_FACTOR\_BI* to the *scalingFactorBI*.
  - 3> else if *enableRA-PrioritizationForSlicing* is set to *false*:
    - 4> if *powerRampingStepHighPriority* is configured in the *ra-PrioritizationForAccessIdentity*:
      - 5> set *PREAMBLE\_POWER\_RAMPING\_STEP* to the *powerRampingStepHighPriority*.
    - 4> if *scalingFactorBI* is configured in the *ra-PrioritizationForAccessIdentity*:
      - 5> set *SCALING\_FACTOR\_BI* to the *scalingFactorBI*.
- 2> else if *ra-PrioritizationForSlicing* for a *NSAG-ID* is configured for the selected carrier; and
- 2> if the MAC entity is provided by upper layers with this *NSAG-ID*:
  - 3> if *powerRampingStepHighPriority* is configured in the *ra-PrioritizationForSlicing* for this *NSAG-ID*:
    - 4> set *PREAMBLE\_POWER\_RAMPING\_STEP* to the *powerRampingStepHighPriority*.
  - 3> if *scalingFactorBI* is configured in the *ra-PrioritizationForSlicing* for this *NSAG-ID*:
    - 4> set *SCALING\_FACTOR\_BI* to the *scalingFactorBI*.
- 2> else if *ra-PrioritizationForAccessIdentity* is configured for the selected carrier; and
- 2> if the MAC entity is provided by upper layers with Access Identity 1 or 2; and
- 2> if for at least one of these Access Identities the corresponding bit in the *ra-PrioritizationForAI* is set to *one*:
  - 3> if *powerRampingStepHighPriority* is configured in the *ra-PrioritizationForAccessIdentity*:
    - 4> set *PREAMBLE\_POWER\_RAMPING\_STEP* to the *powerRampingStepHighPriority*.
  - 3> if *scalingFactorBI* is configured in the *ra-PrioritizationForAccessIdentity*:
    - 4> set *SCALING\_FACTOR\_BI* to the *scalingFactorBI*.
- 2> if *RA\_TYPE* is switched from *2-stepRA* to *4-stepRA* during this Random Access procedure:
  - 3> set *POWER\_OFFSET\_2STEP\_RA* to  $(PREAMBLE\_POWER\_RAMPING\_COUNTER - 1) \times (MSGA\_PREAMBLE\_POWER\_RAMPING\_STEP - PREAMBLE\_POWER\_RAMPING\_STEP)$ .

NOTE: If *enableRA-PrioritizationForSlicing* is not configured in *BWP-UplinkCommon* and if both the provided *NSAG-ID* and the provided Access Identity whose corresponding bit in the *ra-PrioritizationForAI* is set to *one* are configured with *ra-Prioritization* either in *RACH-ConfigCommon* or *RACH-ConfigCommonTwoStepRA*, it is up to UE implementation how to determine the values of *PREAMBLE\_POWER\_RAMPING\_STEP* and *SCALING\_FACTOR\_BI*.

### 5.1.1b Selection of the set of Random Access resources for the Random Access procedure

The MAC entity shall:

- 1> if the BWP selected for Random Access procedure is configured with both set(s) of Random Access resources with *msg3-Repetitions* set to *true* and set(s) of Random Access resources without *msg3-Repetitions* set to *true* and the RSRP of the downlink pathloss reference is less than *rsrp-ThresholdMsg3*; or
- 1> if the BWP selected for Random Access procedure is only configured with the set(s) of Random Access resources with *msg3-Repetitions* set to *true*:
  - 2> assume Msg3 repetition is applicable for the current Random Access procedure.
- 1> else:
  - 2> assume Msg3 repetition is not applicable for the current Random Access procedure.

NOTE 1: Void.

- 1> if neither contention-free Random Access Resources nor Random Access Resources for SI request have been provided for this Random Access procedure and one or more of the features including RedCap and/or Slicing and/or SDT and/or MSG3 repetition is applicable for this Random Access procedure:

NOTE 2: The applicability of SDT is determined by MAC entity according to clause 5.27. The applicability of *NSAG-ID* is determined by upper layers when the Random Access procedure is initiated. The applicability of RedCap is also determined by upper layers when Random Access procedure is initiated and it is applicable to the Random Access procedures initiated by PDCCH orders and any Random Access procedure initiated by the MAC entity.

- 2> if none of the sets of Random Access resources are available for any feature applicable to the current Random Access procedure (as specified in clause 5.1.1c):
  - 3> select the set(s) of Random Access resources that are not associated with any feature indication (as specified in clause 5.1.1c) for this Random Access procedure.
- 2> else if there is one set of Random Access resources available which can be used for indicating all features triggering this Random Access procedure:
  - 3> select this set of Random Access resources for this Random Access procedure.
- 2> else (i.e. there are one or more sets of Random Access resources available that are configured with indication(s) for a subset of all features triggering this Random Access procedure):
  - 3> select a set of Random Access resources from the available set(s) of Random Access resources based on the priority order indicated by upper layers as specified in clause 5.1.1d for this Random Access Procedure.
- 1> else if contention-free Random Access Resources have been provided for this Random Access procedure and RedCap is applicable for the current Random Access procedure and there is one set of Random Access resources available that is only configured with RedCap indication:
  - 2> select this set of Random Access resources for this Random Access procedure.
- 1> else:
  - 2> select the set of Random Access resources that are not associated with any feature indication (as specified in clause 5.1.1c) for the current Random Access procedure.

### 5.1.1c Availability of the set of Random Access resources

The MAC entity shall for each set of configured Random Access resources for 4-step RA type and for each set of configured Random Access resources for 2-step RA type:

- 1> if *redCap* is set to *true* for a set of Random Access resources:

- 2> consider the set of Random Access resources as not available for a Random Access procedure for which RedCap is not applicable.
- 1> if *smallData* is set to *true* for a set of Random Access resources:
  - 2> consider the set of Random Access resources as not available for the Random Access procedure which is not triggered for RA-SDT.
- 1> if *NSAG-List* is configured for a set of Random Access resources:
  - 2> consider the set of Random Access resources as not available for the Random Access procedure unless it is triggered for any one of the *NSAG-ID(s)* in the *NSAG-List*.
- 1> if *msg3-Repetitions* is set to *true* for a set of Random Access resources:
  - 2> consider the set of Random Access resources as not available for the Random Access procedure if Msg3 repetition is not applicable.
- 1> if a set of Random Access resources is not configured with *FeatureCombination*:
  - 2> consider the set of Random Access resources to not associated with any feature.

### 5.1.1d Selection of the set of Random Access resources based on feature prioritization

The MAC entity shall:

- 1> among the available sets of Random Access resources for this Random Access procedure (as specified in clause 5.1.1c), identify those configured with a feature which has the highest priority assigned in *featurePriorities* among all the features applicable to this Random Access procedure as specified in TS 38.331 [5].
- 1> if a single set of Random Access resources is identified:
  - 2> select this set of Random Access resources.
- 1> else if more than one set of Random Access resources is identified:
  - 2> repeat the procedure taking as an input the identified sets of Random Access resources and the feature applicable to the current Random Access procedure with the highest priority assigned in *featurePriorities* among all the features applicable to this Random Access procedure, except the features considered already.
- 1> else (i.e. no set of Random Access resources is identified):
  - 2> repeat the procedure taking as an input the previous identified available sets of Random Access resources and the feature applicable to the current Random Access procedure with the highest priority assigned in *featurePriorities* among all the features applicable to this Random Access procedure, except the features considered already.

### 5.1.2 Random Access Resource selection

If the selected *RA\_TYPE* is set to *4-stepRA*, the MAC entity shall:

- 1> if the Random Access procedure was initiated for SpCell beam failure recovery (as specified in clause 5.17); and
- 1> if the *beamFailureRecoveryTimer* (in clause 5.17) is either running or not configured; and
- 1> if the contention-free Random Access Resources for beam failure recovery request associated with any of the SSBs and/or CSI-RSs have been explicitly provided by RRC; and
- 1> if at least one of the SSBs with SS-RSRP above *rsrp-ThresholdSSB* amongst the SSBs in *candidateBeamRSList* or the CSI-RSs with CSI-RSRP above *rsrp-ThresholdCSI-RS* amongst the CSI-RSs in *candidateBeamRSList* is available:

- 2> select an SSB with SS-RSRP above *rsrp-ThresholdSSB* amongst the SSBs in *candidateBeamRSList* or a CSI-RS with CSI-RSRP above *rsrp-ThresholdCSI-RS* amongst the CSI-RSs in *candidateBeamRSList*;
- 2> if CSI-RS is selected, and there is no *ra-PreambleIndex* associated with the selected CSI-RS:
  - 3> set the *PREAMBLE\_INDEX* to a *ra-PreambleIndex* corresponding to the SSB in *candidateBeamRSList* which is quasi-colocated with the selected CSI-RS as specified in TS 38.214 [7].
- 2> else:
  - 3> set the *PREAMBLE\_INDEX* to a *ra-PreambleIndex* corresponding to the selected SSB or CSI-RS from the set of Random Access Preambles for beam failure recovery request.
- 1> else if the *ra-PreambleIndex* has been explicitly provided by PDCCH; and
- 1> if the *ra-PreambleIndex* is not 0b0000000:
  - 2> set the *PREAMBLE\_INDEX* to the signalled *ra-PreambleIndex*;
  - 2> select the SSB signalled by PDCCH.
- 1> else if the contention-free Random Access Resources associated with SSBs have been explicitly provided in *rach-ConfigDedicated* and at least one SSB with SS-RSRP above *rsrp-ThresholdSSB* amongst the associated SSBs is available:
  - 2> select an SSB with SS-RSRP above *rsrp-ThresholdSSB* amongst the associated SSBs;
  - 2> set the *PREAMBLE\_INDEX* to a *ra-PreambleIndex* corresponding to the selected SSB.
- 1> else if the contention-free Random Access Resources associated with CSI-RSs have been explicitly provided in *rach-ConfigDedicated* and at least one CSI-RS with CSI-RSRP above *rsrp-ThresholdCSI-RS* amongst the associated CSI-RSs is available:
  - 2> select a CSI-RS with CSI-RSRP above *rsrp-ThresholdCSI-RS* amongst the associated CSI-RSs;
  - 2> set the *PREAMBLE\_INDEX* to a *ra-PreambleIndex* corresponding to the selected CSI-RS.
- 1> else if the Random Access procedure was initiated for SI request (as specified in TS 38.331 [5]); and
- 1> if the Random Access Resources for SI request have been explicitly provided by RRC:
  - 2> if at least one of the SSBs with SS-RSRP above *rsrp-ThresholdSSB* is available:
    - 3> select an SSB with SS-RSRP above *rsrp-ThresholdSSB*.
  - 2> else:
    - 3> select any SSB.
  - 2> select a Random Access Preamble corresponding to the selected SSB, from the Random Access Preamble(s) determined according to *ra-PreambleStartIndex* as specified in TS 38.331 [5];
  - 2> set the *PREAMBLE\_INDEX* to selected Random Access Preamble.
- 1> else (i.e. for the contention-based Random Access preamble selection):
  - 2> if at least one of the SSBs with SS-RSRP above *rsrp-ThresholdSSB* is available:
    - 3> select an SSB with SS-RSRP above *rsrp-ThresholdSSB*.
  - 2> else:
    - 3> select any SSB.
  - 2> if the *RA\_TYPE* is switched from *2-stepRA* to *4-stepRA*:
    - 3> if a Random Access Preambles group was selected during the current Random Access procedure:

- 4> select the same group of Random Access Preambles as was selected for the 2-step RA type.
- 3> else:
  - 4> if Random Access Preambles group B is configured; and
  - 4> if the transport block size of the MSGA payload configured in the *rach-ConfigDedicated* corresponds to the transport block size of the MSGA payload associated with Random Access Preambles group B:
    - 5> select the Random Access Preambles group B.
  - 4> else:
    - 5> select the Random Access Preambles group A.
- 2> else if Msg3 buffer is empty:
  - 3> if Random Access Preambles group B is configured:
    - 4> if the potential Msg3 size (UL data available for transmission plus MAC subheader(s) and, where required, MAC CEs) is greater than *ra-Msg3SizeGroupA* and the pathloss is less than *PCMAX* (of the Serving Cell performing the Random Access Procedure) – *preambleReceivedTargetPower* – *msg3-DeltaPreamble* – *messagePowerOffsetGroupB*; or
    - 4> if the Random Access procedure was initiated for the CCCH logical channel and the CCCH SDU size plus MAC subheader is greater than *ra-Msg3SizeGroupA*:
      - 5> select the Random Access Preambles group B.
    - 4> else:
      - 5> select the Random Access Preambles group A.
  - 3> else:
    - 4> select the Random Access Preambles group A.
- 2> else (i.e. Msg3 is being retransmitted):
  - 3> select the same group of Random Access Preambles as was used for the Random Access Preamble transmission attempt corresponding to the first transmission of Msg3.
- 2> select a Random Access Preamble randomly with equal probability from the Random Access Preambles associated with the selected SSB and the selected Random Access Preambles group;
- 2> set the *PREAMBLE\_INDEX* to the selected Random Access Preamble.
- 1> if the Random Access procedure was initiated for SI request (as specified in TS 38.331 [5]); and
- 1> if *ra-AssociationPeriodIndex* and *si-RequestPeriod* are configured:
  - 2> determine the next available PRACH occasion from the PRACH occasions corresponding to the selected SSB in the association period given by *ra-AssociationPeriodIndex* in the *si-RequestPeriod* permitted by the restrictions given by the *ra-ssb-OccasionMaskIndex* if configured (the MAC entity shall select a PRACH occasion randomly with equal probability amongst the consecutive PRACH occasions according to clause 8.1 of TS 38.213 [6] corresponding to the selected SSB).
- 1> else if an SSB is selected above:
  - 2> determine the next available PRACH occasion from the PRACH occasions corresponding to the selected SSB permitted by the restrictions given by the *ra-ssb-OccasionMaskIndex* if configured, or *ssb-SharedROMaskIndex* if configured, or indicated by PDCCH (the MAC entity shall select a PRACH occasion randomly with equal probability amongst the consecutive PRACH occasions according to clause 8.1 of TS 38.213 [6] regardless the FR2 UL gap, corresponding to the selected SSB; the MAC entity may take into account the possible occurrence of measurement gaps and MUSIM gaps when determining the next available PRACH occasion corresponding to the selected SSB).

- 1> else if a CSI-RS is selected above:
    - 2> if there is no contention-free Random Access Resource associated with the selected CSI-RS:
      - 3> determine the next available PRACH occasion from the PRACH occasions, permitted by the restrictions given by the *ra-ssb-OccasionMaskIndex* if configured, corresponding to the SSB in *candidateBeamRSList* which is quasi-colocated with the selected CSI-RS as specified in TS 38.214 [7] (the MAC entity shall select a PRACH occasion randomly with equal probability amongst the consecutive PRACH occasions according to clause 8.1 of TS 38.213 [6] regardless the FR2 UL gap, corresponding to the SSB which is quasi-colocated with the selected CSI-RS; the MAC entity may take into account the possible occurrence of measurement gaps and MUSIM gaps when determining the next available PRACH occasion corresponding to the SSB which is quasi-colocated with the selected CSI-RS).
    - 2> else:
      - 3> determine the next available PRACH occasion from the PRACH occasions in *ra-OccasionList* corresponding to the selected CSI-RS (the MAC entity shall select a PRACH occasion randomly with equal probability amongst the PRACH occasions occurring simultaneously but on different subcarriers regardless the FR2 UL gap, corresponding to the selected CSI-RS; the MAC entity may take into account the possible occurrence of measurement gaps and MUSIM gaps when determining the next available PRACH occasion corresponding to the selected CSI-RS).
  - 1> perform the Random Access Preamble transmission procedure (see clause 5.1.3).
- NOTE 1: When the UE determines if there is an SSB with SS-RSRP above *rsrp-ThresholdSSB* or a CSI-RS with CSI-RSRP above *rsrp-ThresholdCSI-RS*, the UE uses the latest unfiltered L1-RSRP measurement.
- NOTE 2: Void.
- NOTE 3: If a RedCap UE in RRC\_IDLE or RRC\_INACTIVE mode is configured with a BWP indicated by *initialDownlinkBWP-RedCap* which is not associated with any SSB, SS-RSRP measurement is performed based on the SSB associated with the BWP indicated by *initialDownlinkBWP*. If a RedCap UE in RRC\_INACTIVE mode is configured with SDT and with a BWP indicated by *initialDownlinkBWP-RedCap* which is associated with NCD-SSB, SS-RSRP measurement can also be performed based on this NCD-SSB during SDT.
- NOTE 4: If a RedCap UE in RRC\_IDLE or RRC\_INACTIVE mode is configured with a BWP indicated by *initialDownlinkBWP-RedCap* which is not associated with any SSB for RACH, it is up to the UE implementation to perform a new RSRP measurements before Msg1/MsgA retransmission.

## 5.1.2a Random Access Resource selection for 2-step RA type

If the selected *RA\_TYPE* is set to *2-stepRA*, the MAC entity shall:

- 1> if the contention-free 2-step RA type Resources associated with SSBs have been explicitly provided in *rach-ConfigDedicated* and at least one SSB with SS-RSRP above *msgA-RSRP-ThresholdSSB* amongst the associated SSBs is available:
  - 2> select an SSB with SS-RSRP above *msgA-RSRP-ThresholdSSB* amongst the associated SSBs;
  - 2> set the *PREAMBLE\_INDEX* to a *ra-PreambleIndex* corresponding to the selected SSB.
- 1> else (i.e. for the contention-based Random Access Preamble selection):
  - 2> if at least one of the SSBs with SS-RSRP above *msgA-RSRP-ThresholdSSB* is available:
    - 3> select an SSB with SS-RSRP above *msgA-RSRP-ThresholdSSB*.
  - 2> else:
    - 3> select any SSB.

- 2> if contention-free Random Access Resources for 2-step RA type have not been configured and if Random Access Preambles group has not yet been selected during the current Random Access procedure:
  - 3> if Random Access Preambles group B for 2-step RA type is configured:
    - 4> if the potential MSGA payload size (UL data available for transmission plus MAC subheader and, where required, MAC CEs) is greater than the *ra-MsgA-SizeGroupA* and the pathloss is less than *PCMAX* (of the Serving Cell performing the Random Access Procedure) – *msgA-PreambleReceivedTargetPower* – *msgA-DeltaPreamble* – *messagePowerOffsetGroupB*; or
    - 4> if the Random Access procedure was initiated for the CCCH logical channel and the CCCH SDU size plus MAC subheader is greater than *ra-MsgA-SizeGroupA*:
      - 5> select the Random Access Preambles group B.
    - 4> else:
      - 5> select the Random Access Preambles group A.
  - 3> else:
    - 4> select the Random Access Preambles group A.
- 2> else if contention-free Random Access Resources for 2-step RA type have been configured and if Random Access Preambles group has not yet been selected during the current Random Access procedure:
  - 3> if Random Access Preambles group B for 2-step RA type is configured; and
  - 3> if the transport block size of the MSGA payload configured in the *rach-ConfigDedicated* corresponds to the transport block size of the MSGA payload associated with Random Access Preambles group B:
    - 4> select the Random Access Preambles group B.
  - 3> else:
    - 4> select the Random Access Preambles group A.
- 2> else (i.e. Random Access preambles group has been selected during the current Random Access procedure):
  - 3> select the same group of Random Access Preambles as was used for the Random Access Preamble transmission attempt corresponding to the earlier transmission of MSGA.
- 2> select a Random Access Preamble randomly with equal probability from the 2-step RA type Random Access Preambles associated with the selected SSB and the selected Random Access Preambles group;
- 2> set the *PREAMBLE\_INDEX* to the selected Random Access Preamble.
- 1> determine the next available PRACH occasion from the PRACH occasions corresponding to the selected SSB permitted by the restrictions given by the *msgA-SSB-SharedRO-MaskIndex* if configured, or *ra-ssb-OccasionMaskIndex* if configured, or *ssb-SharedRO-MaskIndex* if configured (the MAC entity shall select a PRACH occasion randomly with equal probability among the consecutive PRACH occasions allocated for 2-step RA type according to clause 8.1 of TS 38.213 [6] regardless the FR2 UL gap, corresponding to the selected SSB; the MAC entity may take into account the possible occurrence of measurement gaps and MUSIM gaps when determining the next available PRACH occasion corresponding to the selected SSB);
- 1> if the Random Access Preamble was not selected by the MAC entity among the contention-based Random Access Preamble(s):
  - 2> select a PUSCH occasion from the PUSCH occasions configured in *msgA-CFRA-PUSCH* corresponding to the PRACH slot of the selected PRACH occasion, according to *msgA-PUSCH-Resource-Index* corresponding to the selected SSB;
  - 2> determine the UL grant and the associated HARQ information for the MSGA payload in the selected PUSCH occasion;
  - 2> deliver the UL grant and the associated HARQ information to the HARQ entity.

- 1> else:
  - 2> select a PUSCH occasion corresponding to the selected preamble and PRACH occasion according to clause 8.1A of TS 38.213 [6];
  - 2> determine the UL grant for the MSGA payload according to the PUSCH configuration associated with the selected Random Access Preambles group and determine the associated HARQ information;
  - 2> if the selected preamble and PRACH occasion is mapped to a valid PUSCH occasion as specified in clause 8.1A of TS 38.213 [6]:
    - 3> deliver the UL grant and the associated HARQ information to the HARQ entity.
- 1> perform the MSGA transmission procedure (see clause 5.1.3a).

NOTE 1: To determine if there is an SSB with *SS-RSRP* above *msgA-RSRP-ThresholdSSB*, the UE uses the latest unfiltered *L1-RSRP* measurement.

NOTE 2: If a RedCap UE in RRC\_IDLE or RRC\_INACTIVE mode is configured with a BWP indicated by *initialDownlinkBWP-RedCap* which is not associated with any SSB, SS-RSRP measurement is performed based on the SSB associated with the BWP indicated by *initialDownlinkBWP*. If a RedCap UE in RRC\_INACTIVE mode is configured with SDT and with a BWP indicated by *initialDownlinkBWP-RedCap* which is associated with NCD-SSB, SS-RSRP measurement can also be performed based on this NCD-SSB during SDT.

NOTE 3: If a RedCap UE in RRC\_IDLE or RRC\_INACTIVE mode is configured with a BWP indicated by *initialDownlinkBWP-RedCap* which is not associated with any SSB for RACH, it is up to the UE implementation to perform a new RSRP measurements before Msg1/MsgA retransmission.

### 5.1.3 Random Access Preamble transmission

The MAC entity shall, for each Random Access Preamble:

- 1> if *PREAMBLE\_TRANSMISSION\_COUNTER* is greater than one; and
- 1> if the notification of suspending power ramping counter has not been received from lower layers; and
- 1> if LBT failure indication was not received from lower layers for the last Random Access Preamble transmission; and
- 1> if SSB or CSI-RS selected i

*(Catatan: Rincian tabel bersambung pada rilis spesifikasi resmi...)*
