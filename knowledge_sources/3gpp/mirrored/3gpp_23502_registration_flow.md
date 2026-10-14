---
topic_key: 3gpp_23502_registration_flow
title: 3GPP TS 23.502 - 5G Registration Management Procedures (Initial Registration Flow)
source_vendor: 3gpp
doc_type: specification_clause
technology: 5gc
category: 5gc
keywords: initial registration, 23.502, registration request, amf, ausf, udm, smf, authentication vector, nas security, pcf
summary: Ekstraksi klausul teknis penting 3GPP TS 23.502 - 5G Registration Management Procedures (Initial Registration Flow) dari 3GPP TS 23.502.
---

## 4.2 Connection, Registration and Mobility Management procedures

### 4.2.1 General

The Connection Management is used to establish and release the Control Plane signalling connection between the UE and the AMF. The Registration Management is used to register or deregister a UE/user with the 5GS and establish the user context in the 5GS. The Mobility Management functions are used to keep track of the current location of a UE. The procedures in clause 4.2 provides Connection, Registration and Mobility Management functionality.

### 4.2.2 Registration Management procedures

#### 4.2.2.1 General

The Registration and Deregistration procedures in clause 4.2.2 provides the required functionality to register or deregister a UE/user with the 5GS. Additional functionality to support Registration Management for non-3GPP access is defined in clause 4.12. Additional functionality to support Registration Management for specific services such as SMS over NAS is defined in clause 4.13.

#### 4.2.2.2 Registration procedures

##### 4.2.2.2.1 General

A UE needs to register with the network to get authorized to receive services, to enable mobility tracking and to enable reachability. The UE initiates the Registration procedure using one of the following Registration types:

- Initial Registration to the 5GS;
- Mobility Registration Update upon changing to a new Tracking Area (TA) outside the UE's Registration Area in both CM-CONNECTED and CM-IDLE state, or when the UE needs to update its capabilities or protocol parameters that are negotiated in Registration procedure with or without changing to a new TA, or a change in the UE's Preferred Network Behaviour that would create an incompatibility with the Supported Network Behaviour provided by the serving AMF, or when the UE intends to retrieve LADN Information, or with NR satellite access upon changing to a suitable cell indicating multiple TAs for the RPLMN all of which are outside the UE's Registration Area in both CM-CONNECTED and CM-IDLE state, or when the Multi-USIM UE needs a new 5G-GUTI assignment, or when the UE needs to indicate or returns from an Unavailability Period (see clause 5.4.1.4 of TS 23.501 [2]), or when the UE using a RAN that provides discontinuous coverage (e.g. for satellite access with discontinuous coverage) is about to leave the satellite network coverage as described in clause 5.4.13.1 of TS 23.501 [2], or when the UE has informed the network it is unreachable and now returns to coverage using either satellite or terrestrial access as described in clause 5.4.1.4 of TS 23.501 [2]; or
- Periodic Registration Update (due to a predefined time period of inactivity); or
- Emergency Registration; or
- Disaster Roaming Initial Registration, as specified in clause 5.40 of TS 23.501 [2]; or
- Disaster Roaming Mobility Registration Update, as specified in clause 5.40 of TS 23.501 [2]; or
- SNPN Onboarding Registration allows the UE to access an ON-SNPN for the purpose of provisioning the UE with SO-SNPN credentials to enable SO-SNPN access. SNPN Onboarding Registration is only applicable for registration with ON-SNPN i.e. when the UE uses PLMN credentials for accessing an ONN the UE initiates an Initial Registration. The SNPN Onboarding Registration is specified in clause 4.2.2.2.4.

NOTE 1: With NR satellite access, more than one TAC can be indicated to a UE for each PLMN in any cell.

The General Registration call flow in clause 4.2.2.2.2 applies on all these Registration procedures, but the periodic registration need not include all parameters that are used in other registration cases.

The following are the cleartext IEs, as defined in TS 24.501 [25] that can be sent by the UE in the Registration Request message if the UE has no NAS security context:

- Registration type;
- SUCI or 5G-GUTI or PEI;
- Security parameters;
- additional GUTI;
- 4G Tracking Area Update;
- the indication that the UE is moving from EPS;
- PLMN with Disaster Condition;
- if the UE is registering with an SNPN, the NID of the SNPN that assigned the 5G-GUTI.

NOTE 2: The NID is provided when the 5G-GUTI is assigned by another SNPN than the selected SNPN.

Aspects related to dual registration in 3GPP and non-3GPP access are described in clause 4.12. The general Registration call flow in clause 4.2.2.2.2 is also used for the case of registration in 3GPP access when the UE is already registered in a non-3GPP access and vice versa. Registration in 3GPP access when the UE is already registered in a non-3GPP access scenario may require an AMF change, as further detailed in clause 4.12.8.

The general Registration call flow in clause 4.2.2.2.2 is also used by UEs in limited service state (see TS 23.122 [22]) registering for emergency services only (referred to as Emergency Registration), see clause 5.16.4 of TS 23.501 [2].

During the initial registration the PEI is obtained from the UE. If the PEI is needed (e.g. for EIR check), the AMF shall retrieve the PEI when it establishes the NAS security context with a Security Mode Command during initial registration. The AMF operator may check the PEI with an EIR. If the PEI was retrieved by the AMF (either from the UE or another AMF), AMF shall provide it to the UDM using Nudm\_UECM\_Registration in order to ensure that the UDM always has the latest PEI available e.g. for reporting event Change of SUPI-PEI association. The AMF passes the PEI to the UDM, to the SMF and the PCF. The UDM may store this data in UDR by Nudr\_SDM\_Update.

NOTE 3: The use of NSI ID in the 5GC is optional and depends on the deployment choices of the operator.

During the registration the Home Network (or Credentials Holder in case of access to an SNPN) can provide Steering of Roaming information to the UE via the AMF (i.e. a list of preferred PLMN/access technology combinations and/or Credentials Holder controlled prioritized lists of preferred SNPNs and GINs and/or Credentials Holder controlled prioritized lists of preferred SNPNs and GINs for accessing Localized Services or HPLMN/Credentials Holder indication that 'no change of the above list(s) stored in the UE is needed'). The Home Network can include an indication for the UE to send an acknowledgement of the reception of this information. Details regarding the handling of Steering of Roaming information including how this information is managed between the AMF and the UE are defined in TS 23.122 [22].

The AMF determines Access Type and RAT Type as defined in clause 5.3.2.3 of TS 23.501 [2].

##### 4.2.2.2.2 General Registration

![Sequence diagram of 5G registration process between UE, (R)AN, New AMF, Old AMF, PCF, SMF, AUSF, and UDM.](aa81b9b80bd1e3d723922b3a033564a2_img.jpg)

```

sequenceDiagram
    participant UE
    participant RAN as (R)AN
    participant NewAMF as New AMF
    participant OldAMF as Old AMF
    participant PCF
    participant SMF
    participant AUSF
    participant UDM

    Note right of NewAMF: EIR
    Note right of SMF: N3IWF/TNGF-W-AGF

    UE->>RAN: 1. Registration Request
    Note left of NewAMF: 2. AMF selection
    RAN->>NewAMF: 3. Registration Request
    NewAMF->>OldAMF: 4 Namf_Communication_UEContextTransfer
    OldAMF-->>NewAMF: 5 Namf_Communication_UEContextTransfer response
    NewAMF-->>UE: 6. Identity Request
    UE-->>NewAMF: 7. Identity Response
    Note left of NewAMF: 8. AUSF selection
    Note right of OldAMF: EIR
    Note left of NewAMF: 9. Authentication/Security
    Note right of NewAMF: 10. Namf_Communication_RegistrationStatusUpdate
    NewAMF-->>UE: 11. Identity Request/Response
    NewAMF->>OldAMF: 12. N5g-eir_EquipmentIdentityCheck_Get
    Note left of NewAMF: 13. UDM selection
    NewAMF->>UDM: 14a. Nudm_UECM_Registration
    NewAMF-->>UDM: 14b. Nudm_SDM_Get
    NewAMF-->>UDM: 14c. Nudm_SDM_Subscribe
    Note left of NewAMF: 15. PCF selection
    NewAMF-->>UDM: 14d. Nudm_UECM_DeregistrationNotification
    NewAMF-->>UDM: 14e. Nudm_SDM_Unsubscribe
    NewAMF->>PCF: 16. AM Policy Association Establishment/Modification
    NewAMF-->>SMF: 17. Nsmf_PDUSession_UpdateSMContext / Nsmf_PDUSession_ReleaseSMContext
    Note right of SMF: N3IWF/TNGF-W-AGF
    NewAMF->>OldAMF: 18. UE Context Modification Request
    OldAMF-->>NewAMF: 19. UE Context Modification Response
    OldAMF->>UDM: 19a. Nudm_UECM_Registration
    OldAMF-->>UDM: 19b. Nudm_UECM_DeregistrationNotify
    OldAMF-->>UDM: 19c. Nudm_SDM_Unsubscribe
    NewAMF->>UE: 21. Registration Accept
    NewAMF-->>PCF: 21b. UE Policy Association Establishment
    UE-->>NewAMF: 22. Registration Complete
    NewAMF-->>UDM: 23. Nudm_SDM_Info
    NewAMF->>RAN: 23a. N2 message
    NewAMF-->>UDM: 24. Nudm_UECM_Update
    Note left of NewAMF: 25. Network Slice-Specific Authentication and Authorization
  
```

Sequence diagram of 5G registration process between UE, (R)AN, New AMF, Old AMF, PCF, SMF, AUSF, and UDM.

###### Figure 4.2.2.2.2-1: Registration procedure

1. UE to (R)AN: AN message (AN parameters, Registration Request (Registration type, SUCI or 5G-GUTI or PEI, [last visited TAI (if available)], Security parameters, [Requested NSSAI], [Mapping Of Requested NSSAI], [Default Configured NSSAI Indication], [UE Radio Capability Update], [UE MM Core Network Capability], [PDU Session status], [List Of PDU Sessions To Be Activated], [Follow-on request], [MICO Indication], [Requested Active Time], [Requested DRX parameters for E-UTRA and NR], [Requested DRX parameters for NB-IoT], [extended idle mode DRX parameters], [LADN DNN(s) or Indicator Of Requesting LADN Information], [NAS message container], [Support for restriction of use of Enhanced Coverage], [Preferred Network Behaviour], [UE paging probability information], [Paging Subgrouping Support Indication], [UE Policy Container (the list of PSIs, indication of UE support for ANDSP, the operating system identifier, Indication of URSP Provisioning Support in EPS, UE capability of reporting URSP rule enforcement to network, UE capability of supporting VPLMN-specific URSP rules)] and [UE Radio Capability ID], [Release Request indication], [Paging Restriction Information], PEI, [PLMN with Disaster Condition], [Requested Periodic Update time], [Unavailability Period Duration], [Start of Unavailability Period], [Unavailability Type])).

NOTE 1: The UE Policy Container and its usage is defined in TS 23.503 [20].

In the case of NG-RAN, the AN parameters include e.g. 5G-S-TMSI or GUAMI, the Selected PLMN ID (or PLMN ID and NID, see clause 5.30 of TS 23.501 [2]) and NSSAI information, the AN parameters also include Establishment cause. The Establishment cause provides the reason for requesting the establishment of an RRC connection. Whether and how the UE includes the NSSAI information as part of the AN parameters is dependent on the value of the Access Stratum Connection Establishment NSSAI Inclusion Mode parameter, as specified in clause 5.15.9 of TS 23.501 [2].

The AN parameters shall also include an IAB-Indication if the UE is an IAB-node accessing 5GS.

The AN parameters shall also include a MBSR Indication if the UE is part of an MBSR node accessing 5GS attempting MBSR operation in the PLMN as specified in clause 5.35A.1 of TS 23.501 [2].

The Registration type indicates if the UE wants to perform an Initial Registration (i.e. the UE is in RM-DEREGISTERED state), a Mobility Registration Update (i.e. the UE is in RM-REGISTERED state and initiates a Registration procedure due to mobility or due to the UE needs to update its capabilities or protocol parameters, or to request a change of the set of network slices it is allowed to use), a Periodic Registration Update (i.e. the UE is in RM-REGISTERED state and initiates a Registration procedure due to the Periodic Registration Update timer expiry, see clause 4.2.2.2.1), an Emergency Registration (i.e. the UE is in limited service state), a Disaster Roaming Initial Registration, or a Disaster Roaming Mobility Registration Update.

When the UE is using E-UTRA, the UE indicates its support of CIoT 5GS Optimisations, which is relevant for the AMF selection, in the RRC connection establishment signalling associated with the Registration Request.

When the UE is performing an Initial Registration or a Disaster Roaming Registration the UE shall indicate its UE identity in the Registration Request message as follows, listed in decreasing order of preference in the case of registration with a PLMN:

- i) a 5G-GUTI mapped from an EPS GUTI, if the UE has a valid EPS GUTI.
- ii) a native 5G-GUTI assigned by the PLMN to which the UE is attempting to register, if available;
- iii) a native 5G-GUTI assigned by an equivalent PLMN to the PLMN to which the UE is attempting to register, if available;
- iv) a native 5G-GUTI assigned by any other PLMN, if available; or

NOTE 2: This can also be a 5G-GUTIs assigned via another access type.

- v) Otherwise, the UE shall include its SUCI in the Registration Request as defined in TS 33.501 [15].

If the UE is registering with an SNPN, when the UE is performing an Initial Registration the UE shall indicate its UE identity in the Registration Request message as follows, listed in decreasing order of preference:

- i) a native 5G-GUTI assigned by the same SNPN to which the UE is attempting to register, if available;
- ii) a native 5G-GUTI assigned by an equivalent SNPN to the SNPN to which the UE is attempting to register along with the NID of the SNPN that assigned the 5G-GUTI, if available;

- iii) a native 5G-GUTI assigned by any other SNPN along with the NID of the SNPN that assigned the 5G-GUTI, if available; or
- iv) Otherwise, the UE shall include its SUCI in the Registration Request as defined in TS 33.501 [15].

When the UE performing an Initial Registration has both a valid EPS GUTI and a native 5G-GUTI, the UE shall also indicate the native 5G-GUTI as Additional GUTI. If more than one native 5G-GUTIs are available, the UE shall select the 5G-GUTI in decreasing order of preference among items (ii)-(iv) in the list above.

The NAS message container shall be included if the UE is sending a Registration Request message as an Initial NAS message and the UE has a valid 5G NAS security context and the UE needs to send non-cleartext IEs, see clause 4.4.6 of TS 24.501 [25]. If the UE does not need to send non-cleartext IEs, the UE shall send a Registration Request message without including the NAS message container.

If the UE does not have a valid 5G NAS security context, the UE shall send the Registration Request message without including the NAS message container. The UE shall include the entire Registration Request message (i.e. containing cleartext IEs and non-cleartext IEs) in the NAS message container that is sent as part of the Security Mode Complete message in step 9b.

When the UE is performing an Initial Registration (i.e. the UE is in RM-DEREGISTERED state) with a native 5G-GUTI then the UE shall indicate the related GUAMI information in the AN parameters. When the UE is performing an Initial Registration with its SUCI, the UE shall not indicate any GUAMI information in the AN parameters.

When the UE is performing an Initial Registration or a Mobility Registration and if CIoT 5GS Optimisations are supported the UE shall indicate its Preferred Network Behaviour (see clause 5.3.1.2 of TS 23.501 [2]). If S1 mode is supported the UE's EPC Preferred Network Behaviour is included in the S1 UE network capabilities in the Registration Request message, see clause 8.2.6.1 of TS 24.501 [25].

For an Emergency Registration, the SUCI shall be included if the UE does not have a valid 5G-GUTI available; the PEI shall be included when the UE has no SUPI and no valid 5G-GUTI. In other cases, the 5G-GUTI is included and it indicates the last serving AMF.

The UE may provide the UE's usage setting based on its configuration as defined in clause 5.16.3.7 of TS 23.501 [2]. The UE provides Requested NSSAI (as described in clause 5.15.5.2.1 of TS 23.501 [2] and if the UE supports the subscription-based restrictions to simultaneous registration of network slices, also taking into account the NSSRG Information constraints as described in clause 5.15.12 of TS 23.501 [2] and in the case of Initial Registration or Mobility Registration Update, the UE includes the Mapping Of Requested NSSAI (if available), which is the mapping of each S-NSSAI of the Requested NSSAI to the HPLMN S-NSSAIs, to ensure that the network is able to verify whether the S-NSSAI(s) in the Requested NSSAI are permitted based on the Subscribed S-NSSAIs. In the case of inter PLMN mobility, if the serving PLMN S-NSSAI(s) corresponding to the established PDU Session(s) are not present in the UE, the associated HPLMN S-NSSAI(s) associated with the established PDU Session(s) shall be provided in the Mapping Of Requested NSSAI as described in clause 5.15.5.2.1 TS 23.501 [2]. If the UE supports reconnection to the network due to RAN timing synchronization status change as described in TS 23.501 [2], the UE indicates the support of this capability to the network. If the UE supports UE configuration of network-controlled Slice Usage Policy and the UE stores Slice Usage Policy, the UE shall include an on demand S-NSSAI in the Requested NSSAI only when applications in the UE require data transmission by a PDU session associated with the on demand S-NSSAI as described in clause 5.15.15 of TS 23.501 [2].

The UE includes the Default Configured NSSAI Indication if the UE is using a Default Configured NSSAI, as defined in TS 23.501 [2].

The UE may include UE paging probability information if it supports the assignment of WUS Assistance Information or AMF PEIPS Assistance Information from the AMF (see TS 23.501 [2]).

The UE may include Paging Subgrouping Support Indication as defined in TS 23.501 [2].

In the case of Mobility Registration Update, the UE includes in the List Of PDU Sessions To Be Activated the PDU Sessions for which there are pending uplink data. When the UE includes the List Of PDU Sessions To Be Activated, the UE shall indicate PDU Sessions only associated with the access the Registration Request is related to. As defined in TS 24.501 [25] the UE shall include always-on PDU Sessions which are accepted by the network in the List Of PDU Sessions To Be Activated even if there are no pending uplink data for those PDU Sessions.

NOTE 3: A PDU Session corresponding to a LADN is not included in the List Of PDU Sessions To Be Activated when the UE is outside the area of availability of the LADN.

The UE MM Core Network Capability is provided by the UE and handled by AMF as defined in clause 5.4.4a of TS 23.501 [2]. The UE includes in the UE MM Core Network Capability an indication if it supports Request Type flag "handover" for PDN connectivity request during the attach procedure as defined in clause 5.17.2.3.1 of TS 23.501 [2]. If the UE supports 'Strictly Periodic Registration Timer Indication', the UE indicates its capability of 'Strictly Periodic Registration Timer Indication' in the MICO Indication. If the UE supports CAG, the UE indicates its capability of "CAG supported" in the UE MM Core Network Capability. If the UE operating two or more USIMs, supports and intends to use one or more Multi-USIM feature(s), the UE indicates one or more Multi-USIM specific features described in clause 5.38 of TS 23.501 [2] in the UE MM Core Network Capability. If the UE supports equivalent SNPNs, the UE indicates its capability of "equivalent SNPNs" in the UE MM Core Network Capability. If the UE supports Unavailability Period, the UE indicates its capability of "Unavailability Period Support" in the UE MM Core Network Capability. If the UE supports LADN per DNN and S-NSSAI, the UE indicates its support of LADN per DNN and S-NSSAI in the UE MM Core Network Capability. If the UE supports the Network Slice Replacement feature, the UE indicates support for Network Slice Replacement feature as described in clause 5.15.19 of TS 23.501 [2]. If the UE supports UE configuration of network-controlled Slice Usage Policy, the UE indicates its capability of "UE Configuration of network-controlled Slice Usage Policy" in the UE MM Core Network Capability as described in clause 5.15.15 of TS 23.501 [2].

The UE may provide either the LADN DNN(s) or an Indication Of Requesting LADN Information as described in clause 5.6.5 of TS 23.501 [2].

If available, the last visited TAI shall be included in order to help the AMF produce Registration Area for the UE.

NOTE 4: With NR satellite access, the last visited TAI is determined as specified in clause 5.4.11.6 of TS 23.501 [2].

The Security parameters are used for Authentication and integrity protection, see TS 33.501 [15]. Requested NSSAI indicates the Network Slice Selection Assistance Information (as defined in clause 5.15 of TS 23.501 [2]). The PDU Session status indicates the previously established PDU Sessions in the UE. When the UE is connected to the two AMFs belonging to different PLMN via 3GPP access and non-3GPP access then the PDU Session status indicates the established PDU Session of the current PLMN in the UE.

The Follow-on request is included when the UE has pending uplink signalling and the UE doesn't include List Of PDU Sessions To Be Activated, or the Registration type indicates the UE wants to perform an Emergency Registration. In Initial Registration and Mobility Registration Update, UE provides the UE Requested DRX parameters, as defined in clause 5.4.5 of TS 23.501 [2]. The UE may provide the extended idle mode DRX parameters as defined in clause 5.31.7.2 of TS 23.501 [2] to request extended idle mode DRX.

The UE provides UE Radio Capability Update indication as described in TS 23.501 [2].

The UE includes the MICO Indication and optionally a Requested Active Time value and Requested Periodic Update time value if the UE wants to use MICO Mode with Active Time.

For a UE using NR satellite access that provides discontinuous coverage, the UE may include an Unavailability Type, an Unavailability Period Duration and/or Start of Unavailability Period as described in clause 5.4.13.1 of TS 23.501 [2].

The UE may indicate its Service Gap Control Capability in the UE MM Core Network Capability, see clause 5.31.16 of TS 23.501 [2].

For a UE with a running Service Gap timer in the UE, the UE shall not set Follow-on Request indication or Uplink data status in the Registration Request message (see clause 5.31.16 of TS 23.501 [2]), except for network access for regulatory prioritized services like Emergency services or exception reporting.

If UE supports RACS and has been assigned UE Radio Capability ID(s), the UE shall indicate a UE Radio Capability ID as defined in clause 5.4.4.1a of TS 23.501 [2] as non-cleartext IE.

The PEI may be retrieved in initial registration from the UE as described in clause 4.2.2.2.1.

If a UE supports the subscription-based restrictions to simultaneous registration of network slices feature, it includes the NSSRG handling support indication in the UE 5GMM Core Network Capability according to clause 5.15.12 of TS 23.501 [2]. The AMF stores whether the UE supports this feature in the UE context.

If a UE supports the temporary available network slices feature, it includes the indication of support for temporary available network slices in the UE 5GMM Network Capability according to clause 5.15.16 of TS 23.501 [2].

When a Multi-USIM UE wants to enter CM-IDLE state immediately e.g. after having performed mobility or periodic registration, it includes the Release Request indication and optionally provides Paging Restriction Information.

When the UE is performing a Disaster Roaming Registration, the UE may indicate the PLMN with Disaster Condition for the cases as defined in TS 24.501 [25].

If the UE and network have indicated support Unavailability Period and an event is triggered in the UE that would make the UE unavailable for a certain period of time, the UE indicates Unavailability Period by including Unavailability Period Duration and/or Start of Unavailability Period as described in clause 5.4.1.4 of TS 23.501 [2].

2. If a 5G-S-TMSI or GUAMI is not included or the 5G-S-TMSI or GUAMI does not indicate a valid AMF the (R)AN, based on (R)AT and Requested NSSAI, if available, selects an AMF

The (R)AN selects an AMF as described in clause 6.3.5 of TS 23.501 [2]. If UE is in CM-CONNECTED state, the (R)AN can forward the Registration Request message to the AMF based on the N2 connection of the UE.

If the (R)AN cannot select an appropriate AMF, it forwards the Registration Request to an AMF which has been configured, in (R)AN, to perform AMF selection.

3. (R)AN to new AMF: N2 message (N2 parameters, Registration Request (as described in step 1) and [LTE-M Indication].

When NG-RAN is used, the N2 parameters include the Selected PLMN ID (or PLMN ID and NID, see clause 5.30 of TS 23.501 [2]), Location Information and Cell Identity related to the cell in which the UE is camping, UE Context Request which indicates that a UE context including security information needs to be setup at the NG-RAN.

When NG-RAN is used, the N2 parameters shall also include the Establishment cause and IAB-Indication or MBSR Indication if the indication is received in AN parameters in step 1.

Mapping Of Requested NSSAI is provided only if available.

If the Registration type indicated by the UE is Periodic Registration Update, then steps 4 to 19 may be omitted.

When the Establishment cause is associated with priority services (e.g. MPS, MCS), the AMF includes a Message Priority header to indicate priority information. Other NFs relay the priority information by including the Message Priority header in service-based interfaces, as specified in TS 29.500 [17].

The RAT Type the UE is using is determined (see clause 4.2.2.2.1) and based on it the AMF determines whether the UE is performing Inter-RAT mobility to or from NB-IoT. If the AMF receives the LTE M indication, then it considers that the RAT Type is LTE-M and stores the LTE-M Indication in UE Context.

If a UE includes a Preferred Network Behaviour, this defines the Network Behaviour the UE supports and is expecting to be available in the network as defined in clause 5.31.2 of TS 23.501 [2].

If the UE has included the Preferred Network Behaviour and what the UE indicated it supports in Preferred Network Behaviour is incompatible with the network support, the AMF shall reject the Registration Request with an appropriate cause value (e.g. one that avoids retries on this PLMN).

If there is a Service Gap timer running in the UE Context in AMF for the UE and Follow-on Request indication or Uplink data status is included in the Registration Request message, the AMF shall ignore the Follow-on Request indication and Uplink data status and not perform any of the actions related to the status.

If the UE has included a UE Radio Capability ID in step 1 and the AMF supports RACS, the AMF stores the Radio Capability ID in UE context.

For NR satellite access, the AMF may verify the UE location and determine whether the PLMN is allowed to operate at the UE location, as described in clause 5.4.11.4 of TS 23.501 [2]. If the UE receives a Registration Reject message with cause value indicating that the PLMN is not allowed to operate at the present UE location, the UE shall attempt to select a PLMN as specified in TS 23.122 [22].

For a Disaster Roaming Registration, based on the ULI (including Cell ID) received from the NG-RAN, the PLMN with Disaster Condition derived from the UE's 5G-GUTI, derived from the UE's SUCI or indicated by the UE and the local configuration, the AMF determines if Disaster Roaming service can be provided. If the current location is not subject to Disaster Roaming service or the Disaster Roaming service is not provided to the PLMN with Disaster Condition derived from the UE's 5G-GUTI, derived from the UE's SUCI or indicated by UE, then the AMF should reject the Registration Request indicating a suitable Cause value.

4. [Conditional] new AMF to old AMF: Namf\_Communication\_UEContextTransfer (complete Registration Request) or new AMF to UDSF: Nudsf\_Unstructured Data Management\_Query().

The new AMF determines the old AMF using the UE's 5G-GUTI. If the new AMF received an NID in the Registration request, it determines that the 5G-GUTI was assigned by an SNPN and determines the old AMF using the 5G-GUTI and NID of the SNPN.

(With UDSF Deployment): If the UE's 5G-GUTI was included in the Registration Request and the serving AMF has changed since last Registration procedure, new AMF and old AMF are in the same AMF Set and UDSF is deployed, the new AMF retrieves the stored UE's SUPI and UE context directly from the UDSF using Nudsf\_UnstructuredDataManagement\_Query service operation or they can share stored UE context via implementation specific means if UDSF is not deployed. This includes also event subscription information by each NF consumer for the given UE. In this case, the new AMF uses integrity protected complete Registration request NAS message to perform and verify integrity protection.

(Without UDSF Deployment): If the UE's 5G-GUTI was included in the Registration Request and the serving AMF has changed since last Registration procedure, the new AMF may invoke the Namf\_Communication\_UEContextTransfer service operation on the old AMF including the complete Registration Request NAS message, which may be integrity protected, as well as the Access Type, to request the UE's SUPI and UE Context. See clause 5.2.2.2.2 for details of this service operation. In this case, the old AMF uses either 5G-GUTI and the integrity protected complete Registration request NAS message, or the SUPI and an indication that the UE is validated from the new AMF, to verify integrity protection if the context transfer service operation invocation corresponds to the UE requested. The old AMF also transfers the event subscriptions information by each NF consumer, for the UE, to the new AMF. If the old AMF has not yet reported a non-zero MO Exception Data Counter to the (H-)SMF, the Context Response also includes the MO Exception Data Counter.

If the old AMF has PDU Sessions for another access type (different from the Access Type indicated in this step) and if the old AMF determines that there is no possibility for relocating the N2 interface to the new AMF, the old AMF returns UE's SUPI and indicates that the Registration Request has been validated for integrity protection, but does not include the rest of the UE context.

For inter PLMN mobility, UE Context information includes HPLMN S-NSSAIs corresponding to the Allowed NSSAI for each Access Type and Partially Allowed NSSAI, without Allowed NSSAI and Partially Allowed NSSAI of old PLMN.

NOTE 5: The new AMF Sets the indication that the UE is validated according to step 9a, if the new AMF has performed successful UE authentication after previous integrity check failure in the old AMF.

NOTE 6: The NF consumers do not need to subscribe for the events once again with the new AMF after the UE is successfully registered with the new AMF.

If the new AMF has already received UE contexts from the old AMF during handover procedure, then step 4,5 and 10 shall be skipped.

For an Emergency Registration, if the UE identifies itself with a 5G-GUTI that is not known to the AMF, steps 4 and 5 are skipped and the AMF immediately requests the SUPI from the UE. If the UE identifies itself with PEI, the SUPI request shall be skipped. Allowing Emergency Registration without a user identity is dependent on local regulations.

5. [Conditional] old AMF to new AMF: Response to Namf\_Communication\_UEContextTransfer (SUPI, UE Context in AMF (as per Table 5.2.2.2.2-1)) or UDSF to new AMF: Nudsf\_Unstructured Data Management\_Query(). The old AMF may start an implementation specific (guard) timer for the UE context.

If the UDSF was queried in step 4, the UDSF responds to the new AMF for the Nudsf\_Unstructured Data Management\_Query invocation with the related contexts including established PDU Sessions, the old AMF includes SMF information DNN, S-NSSAI(s) and PDU Session ID, active NGAP UE-TNLA bindings to

N3IWF/TNGF/W-AGF, the old AMF includes information about the NGAP UE-TNLA bindings. If the Old AMF was queried in step 4, Old AMF responds to the new AMF for the Namf\_Communication\_UEContextTransfer invocation by including the UE's SUPI and UE Context.

If old AMF holds information about established PDU Session(s) and it is not an Initial Registration, the old AMF includes SMF information, DNN(s), S-NSSAI(s) and PDU Session ID(s).

If old AMF holds UE context established via N3IWF, W-AGF or TNGF, the old AMF includes the CM state via N3IWF, W-AGF or TNGF. If the UE is in CM-CONNECTED state via N3IWF, W-AGF or TNGF, the old AMF includes information about the NGAP UE-TNLA bindings.

If old AMF fails the integrity check of the Registration Request NAS message, the old AMF shall indicate the integrity check failure. If the new AMF is configured to allow emergency services for unauthenticated UE, the new AMF behaves as follows:

- If the UE has only an emergency PDU Session, the AMF either skips the authentication and security procedure or accepts that the authentication may fail and continues the Mobility Registration Update procedure; or
- If the UE has both emergency and non emergency PDU Sessions and authentication fails, the AMF continues the Mobility Registration Update procedure and deactivates all the non-emergency PDU Sessions as specified in clause 4.3.4.2.

NOTE 7: The new AMF can determine if a PDU Session is used for emergency service by checking whether the DNN matches the emergency DNN.

If old AMF holds information about AM Policy Association and the information about UE Policy Association (i.e. the Policy Control Request Trigger for updating UE Policy as defined in TS 23.503 [20]), the old AMF includes the information about the AM Policy Association, the UE Policy Association and PCF ID. In the roaming case, V-PCF ID and H-PCF ID are included.

If old AMF was a consumer of UE related NWDAF services, the old AMF includes information about active analytics subscriptions, i.e. the Subscription Correlation ID, NWDAF identifier (i.e. Instance ID or Set ID), Analytics ID(s) and associated Analytics specific data in the Namf\_Communication\_UEContextTransfer response. Usage of the analytics information by the new AMF is specified in TS 23.288 [50].

During inter PLMN mobility, the handling of the UE Radio Capability ID in the new AMF is as defined in TS 23.501 [2].

NOTE 8: When new AMF uses UDSF for context retrieval, interactions between old AMF, new AMF and UDSF due to UE signalling on old AMF at the same time is implementation issue.

###### 6. [Conditional] new AMF to UE: Identity Request ().

If the SUCI is not provided by the UE nor retrieved from the old AMF the Identity Request procedure is initiated by AMF sending an Identity Request message to the UE requesting the SUCI.

###### 7. [Conditional] UE to new AMF: Identity Response ().

The UE responds with an Identity Response message including the SUCI. The UE derives the SUCI by using the provisioned public key of the HPLMN, as specified in TS 33.501 [15].

###### 8. The AMF may decide to initiate UE authentication by invoking an AUSF. In that case, the AMF selects an AUSF based on SUPI or SUCI, as described in clause 6.3.4 of TS 23.501 [2].

If the AMF is configured to support Emergency Registration for unauthenticated SUPIs and the UE indicated Registration type Emergency Registration, the AMF skips the authentication or the AMF accepts that the authentication may fail and continues the Registration procedure.

###### 9a. If authentication is required, the AMF requests it from the AUSF; if Tracing Requirements about the UE are available at the AMF, the AMF provides Tracing Requirements in its request to AUSF. For a Disaster Roaming Registration, the AMF may provide the indication of Disaster Roaming service in its request to AUSF. Upon request from the AMF, the AUSF shall execute authentication of the UE. The authentication is performed as described in TS 33.501 [15]. The AUSF selects a UDM as described in clause 6.3.8 of TS 23.501 [2] and gets the authentication data from UDM.

The AUSF may provide the indication of Disaster Roaming service to UDM if the indication is received from AMF. For a Disaster Roaming Registration, the AUSF executes authentication of the UE based on the local policy and/or local configuration as specified in clause 5.40.4 of TS 23.501 [2] and in TS 33.501 [15].

Once the UE has been authenticated the AUSF provides relevant security related information to the AMF. If the AMF provided a SUCI to AUSF, the AUSF shall return the SUPI to AMF only after the authentication is successful.

After successful authentication in new AMF, which is triggered by the integrity check failure in old AMF at step 5, the new AMF invokes step 4 above again and indicates that the UE is validated (i.e. through the reason parameter as specified in clause 5.2.2.2.2).

- 9b If NAS security context does not exist, the NAS security initiation is performed as described in TS 33.501 [15]. If the UE had no NAS security context in step 1, the UE includes the full Registration Request message as defined in TS 24.501 [25].

The AMF decides if the Registration Request needs to be rerouted as described in clause 4.2.2.2.3, where the initial AMF refers to the AMF.

- 9c. The AMF initiates NGAP procedure to provide the 5G-AN with security context as specified in TS 38.413 [10] if the 5G-AN had requested for UE Context. Also, if the AMF decides that EPS fallback is supported (e.g. based on UE capability to support Request Type flag "handover" for PDN connectivity request during the attach procedure as defined in clause 5.17.2.3.1 of TS 23.501 [2], subscription data and local policy), the AMF shall send an indication "Redirection for EPS fallback for voice is possible" towards 5G-AN as specified in TS 38.413 [10]. Otherwise, the AMF indicates "Redirection for EPS fallback for voice is not possible". In addition, if Tracing Requirements about the UE are available at the AMF, the AMF provides the 5G-AN with Tracing Requirements in the NGAP procedure.

- 9d. The 5G-AN stores the security context and acknowledges to the AMF. The 5G-AN uses the security context to protect the messages exchanged with the UE as described in TS 33.501 [15].

10. [Conditional] new AMF to old AMF: Namf\_Communication\_RegistrationStatusUpdate (PDU Session ID(s) to be released e.g. due to slice not supported).

If the AMF has changed the new AMF informs the old AMF that the registration of the UE in the new AMF is completed by invoking the Namf\_Communication\_RegistrationStatusUpdate service operation.

If the authentication/security procedure fails, then the Registration shall be rejected and the new AMF invokes the Namf\_Communication\_RegistrationStatusUpdate service operation with a reject indication towards the old AMF. The old AMF continues as if the UE context transfer service operation was never received.

The new AMF determines the PDU Session(s) that cannot be supported in the new Registration Area in the cases below:

- If one or more of the S-NSSAIs used in the old Registration Area cannot be served in the target Registration Area.
- When continuity of the PDU Session(s) cannot be supported between networks (e.g. SNPN-SNPN mobility, inter-PLMN mobility where no HR agreement exists).

If any of the cases is met, the new AMF invokes the Namf\_Communication\_RegistrationStatusUpdate service operation including the rejected PDU Session ID towards the old AMF. Then the new AMF modifies the PDU Session Status correspondingly. The old AMF informs the corresponding SMF(s) to locally release the UE's SM context by invoking the Nsmf\_PDUSession\_ReleaseSMContext service operation.

If new AMF received in the UE context transfer in step 5 the information about the AM Policy Association and the UE Policy Association and decides, based on local policies, not to use the PCF(s) identified by the PCF ID(s) for the AM Policy Association and the UE Policy Association, then it will inform the old AMF that the AM Policy Association and the UE Policy Association in the UE context is not used any longer and then the PCF selection is performed in step 15.

If the new AMF received in the UE context transfer in step 5 the information about UE related analytics subscription(s), the new AMF may take over the analytics subscription(s) from the old AMF. Otherwise, if the new AMF instead determines to create new analytics subscription(s), it informs the old AMF about the analytics

subscriptions (identified by their Subscription Correlation ID) that are not needed any longer and the old AMF may now unsubscribe those NWDAF analytics subscriptions for the UE according to TS 23.288 [50].

###### 11. [Conditional] new AMF to UE: Identity Request/Response (PEI).

If the PEI was not provided by the UE nor retrieved from the old AMF the Identity Request procedure is initiated by AMF sending an Identity Request message to the UE to retrieve the PEI. The PEI shall be transferred encrypted unless the UE performs Emergency Registration and cannot be authenticated.

For an Emergency Registration, the UE may have included the PEI in the Registration Request. If so, the PEI retrieval is skipped.

If the UE supports RACS as indicated in UE MM Core Network Capability, the AMF shall use the PEI of the UE to obtain the IMEI/TAC for the purpose of RACS operation.

###### 12. Optionally the new AMF initiates ME identity check by invoking the N5g-eir\_EquipmentIdentityCheck\_Get service operation (see clause 5.2.4.2.2).

The PEI check is performed as described in clause 4.7.

For an Emergency Registration, if the PEI is blocked, operator policies determine whether the Emergency Registration procedure continues or is stopped.

###### 13. If step 14 is to be performed, the new AMF, based on the SUPI, selects a UDM, then UDM may select a UDR instance. See clause 6.3.9 of TS 23.501 [2].

The AMF selects a UDM as described in clause 6.3.8 of TS 23.501 [2].

###### 14a-c. If the AMF has changed since the last Registration procedure, if UE Registration type is Initial Registration or Emergency Registration, or if the UE provides a SUPI which does not refer to a valid context in the AMF, or if the UE registers to the same AMF it has already registered to a non-3GPP access (i.e. the UE is registered over a non-3GPP access and initiates this Registration procedure to add a 3GPP access), the new AMF registers with the UDM using Nudm\_UECM\_Registration for the access to be registered (and subscribes to be notified when the UDM deregisters this AMF). The UDM based on the "Registration Type" in the Nudm\_UECM\_Registration request, can act on SoR information according to TS 23.122 [22]. In this case, if the AMF does not have event exposure subscription information for this UE, the AMF indicates it to UDM. Then, if the UDM has existing applicable event exposure subscriptions for events detected in AMF for this UE or for any of the groups this UE belongs to (possibly retrieved from UDR), UDM invokes the Namf\_EventExposure\_Subscribe service for recreating the event exposure subscriptions.

The AMF provides the "Homogenous Support of IMS Voice over PS Sessions" indication (see clause 5.16.3.3 of TS 23.501 [2]) to the UDM. The "Homogenous Support of IMS Voice over PS Sessions" indication shall not be included unless the AMF has completed its evaluation of the support of "IMS Voice over PS Session" as specified in clause 5.16.3.2 of TS 23.501 [2].

During initial Registration, if the AMF and UE supports SRVCC from NG-RAN to UTRAN the AMF provides UDM with the UE SRVCC capability.

If the AMF determines that only the UE SRVCC capability has changed, the AMF sends UE SRVCC capability to the UDM.

NOTE 9: At this step, it is possible that the AMF does not have all the information needed to determine the setting of the IMS Voice over PS Session Supported indication for this UE (see clause 5.16.3.2 of TS 23.501 [2]). Hence the AMF can send the "Homogenous Support of IMS Voice over PS Sessions" later on in this procedure.

After AMF has successfully completed the Nudm\_UECM\_Registration operation and if the AMF does not have subscription data for the UE, the AMF retrieves the Access and Mobility Subscription data, SMF Selection Subscription data, UE context in SMF data and LCS mobile origination using Nudm\_SDM\_Get. If the AMF already has subscription data for the UE but the SoR Update Indicator in the UE context requires the AMF to retrieve SoR information depending on the NAS Registration Type ("Initial Registration" or "Emergency Registration") (see Annex C of TS 23.122 [22]), the AMF retrieves the Steering of Roaming information using Nudm\_SDM\_Get. This requires that UDM may retriev

*(Catatan: Rincian tabel bersambung pada rilis spesifikasi resmi...)*
