---
topic_key: 3gpp_24501_cause_codes
title: 3GPP TS 24.501 - 5G NAS Cause Values (5GMM Mobility & 5GSM Session Causes)
source_vendor: 3gpp
doc_type: specification_clause
technology: 5gc
category: protocol_qa
keywords: 5gmm cause, 5gsm cause, cause #3, cause #7, cause #11, cause #12, cause #13, cause #27, cause #31, cause #26, cause #28, plmn not allowed
summary: Ekstraksi klausul teknis penting 3GPP TS 24.501 - 5G NAS Cause Values (5GMM Mobility & 5GSM Session Causes) dari 3GPP TS 24.501.
---

## Annex A (informative): Cause values for 5GS mobility management

### A.1 Causes related to UE identification

#### Cause #3 – Illegal UE

This 5GMM cause is sent to the UE when the network refuses service to the UE either because an identity of the UE is not acceptable to the network or because the UE does not pass the authentication check.

#### Cause #6 – Illegal ME

This 5GMM cause is sent to the UE if the ME used is not acceptable to the network, e.g. on the prohibited list.

#### Cause #9 – UE identity cannot be derived by the network.

This 5GMM cause is sent to the UE when the network cannot derive the UE's identity from the 5G-GUTI or 5G-S-TMSI because of e.g. no matching identity/context in the network, failure to validate the UE's identity due to integrity check failure of the received message.

#### Cause #10 – Implicitly de-registered

This 5GMM cause is sent to the UE either if the network has implicitly de-registered the UE, e.g. after the implicit de-registration timer has expired, or if the 5GMM context data related to the subscription does not exist in the AMF e.g. because of a AMF restart, or because of a registration request for mobility or registration update is routed to a new AMF.

---

### A.2 Cause related to subscription options

#### Cause #5 – PEI not accepted

This cause is sent to the UE if the network does not accept an initial registration procedure for emergency services using a PEI.

#### Cause #7 – 5GS services not allowed

This 5GMM cause is sent to the UE when it is not allowed to operate 5GS services.

#### Cause #11 – PLMN not allowed

This 5GMM cause is sent to the UE if it requests service, or if the network initiates a de-registration request, in a PLMN where the UE, by subscription or due to operator determined barring, is not allowed to operate.

This 5GMM cause can also be sent to the UE when the disaster condition is no longer being applicable in the current location of the UE.

#### Cause #12 – Tracking area not allowed

This 5GMM cause is sent to the UE if it requests service, or if the network initiates a de-registration request, in a tracking area where the HPLMN or SNPN determines that the UE, by subscription, is not allowed to operate.

NOTE 1: If 5GMM cause #12 is sent to a roaming subscriber the subscriber is denied service even if other PLMNs are available on which registration was possible.

#### Cause #13 – Roaming not allowed in this tracking area

This 5GMM cause is sent to a UE which requests service, or if the network initiates a de-registration request, in a tracking area of a PLMN or SNPN which by subscription offers roaming to that UE but not in that tracking area.

This 5GMM cause can also be sent to the UE when the disaster condition is no longer being applicable in the current location of the UE.

Cause #15 – No suitable cells in tracking area

This 5GMM cause is sent to the UE if it requests service, or if the network initiates a de-registration request, in a tracking area where the UE, by subscription, is not allowed to operate, but when it should find another allowed tracking area in the same PLMN or an equivalent PLMN or the same SNPN or an equivalent SNPN.

NOTE 2: Cause #15 and cause #12 differ in the fact that cause #12 does not trigger the UE to search for another allowed tracking area on the same PLMN or SNPN.

Cause #27 – N1 mode not allowed

This 5GMM cause is sent to the UE if it requests service, or if the network initiates a de-registration request, in a PLMN or SNPN where the UE by subscription or operator policy, is not allowed to operate in N1 mode.

Cause #31 – Redirection to EPC required

This 5GMM cause is sent to the UE if it requests service in a PLMN where the UE by operator policy, is not allowed in 5GCN and redirection to EPC is required.

Cause #36 – IAB-node operation not authorized

This 5GMM cause is sent to the UE if a UE operating as an IAB-node requests service, or if the network initiates a de-registration procedure, in a PLMN or SNPN where the UE by subscription is not authorized for IAB operation.

Cause #72 – Non-3GPP access to 5GCN not allowed

This 5GMM cause is sent to the UE if it requests accessing 5GCN over non-3GPP access in a PLMN or SNPN, where the UE by subscription, is not allowed to access 5GCN over non-3GPP access.

Cause #74 – Temporarily not authorized for this SNPN

This 5GMM cause is sent to the UE if it requests access, or if the network initiates a de-registration procedure, in a cell belonging to an SNPN for which the UE has no subscription to operate or for which the UE is not allowed to operate onboarding services.

Cause #75 – Permanently not authorized for this SNPN

This 5GMM cause is sent to the UE if it requests access, or if the network initiates a de-registration procedure, in a cell belonging to an SNPN with a globally-unique SNPN identity for which the UE either has no subscription to operate, the UE's subscription has expired or the UE is not allowed to operate onboarding services.

Cause #76 – Not authorized for this CAG or authorized for CAG cells only

This 5GMM cause is sent to the UE if the UE requests access or de-registration:

- i) in a CAG cell with a CAG-ID which is not authorized based on the UE's "allowed CAG list" for the PLMN; or
- ii) in a non-CAG cell, wherein the UE is only allowed to access 5GS via CAG cells

Cause #77 – Wireline access area not allowed

This 5GMM cause is sent to the 5G-RG or the W-AGF acting on behalf of the FN-CRG (or on behalf of the N5GC device) if the 5G-RG or the W-AGF acting on behalf of the FN-CRG (or on behalf of the N5GC device) request accessing 5GCN over a wireline access network belonging to a wireline access area, where the 5G-RG or the W-AGF acting on behalf of the FN-CRG (or on behalf of the N5GC device) are not allowed by subscription to access the 5GCN over the wireline access.

Cause #79 – UAS services not allowed

This 5GMM cause is sent to the UE to indicate that the request of UAS services is not allowed.

**Cause #80 – Disaster roaming for the determined PLMN with disaster condition not allowed**

This 5GMM cause is sent by the network in a PLMN where the UE has requested registration for disaster roaming service for the determined PLMN with disaster condition, but the AMF determines that it does not support providing disaster roaming services to the UE for the determined PLMN with disaster condition as roaming agreement for disaster roaming services with HPLMN of the UE does not exist, or the determined PLMN with disaster condition is a forbidden PLMN of the UE.

**Cause #94 – User plane positioning not authorized**

This 5GMM cause is sent to the UE if it requests the user plane positioning, where the UE by subscription is not authorized for user plane positioning.

---

## A.3 Causes related to PLMN or SNPN specific network failures and congestion/authentication failures

**Cause #20 – MAC failure**

This 5GMM cause is sent to the network if the USIM detects that the MAC in the AUTHENTICATION REQUEST message is not fresh.

**Cause #21 – Synch failure**

This 5GMM cause is sent to the network if the USIM detects that the SQN in the AUTHENTICATION REQUEST message is out of range.

**Cause #22 – Congestion**

This 5GMM cause is sent to the UE because of congestion in the network (e.g. no channel, facility busy/congested etc.).

**Cause #23 – UE security capabilities mismatch**

This 5GMM cause is sent to the network if the UE detects that the UE security capability does not match the one sent back by the network.

**Cause #24 – Security mode rejected, unspecified**

This 5GMM cause is sent to the network if the security mode command is rejected by the UE for unspecified reasons.

**Cause #26 – Non-5G authentication unacceptable**

This 5GMM cause is sent to the network in N1 mode if the "separation bit" in the AMF field of AUTN is set to 0 in the AUTHENTICATION REQUEST message (see 3GPP TS 33.501 [24]).

**Cause #28 – Restricted service area**

This 5GMM cause is sent to the UE if it requests service in a tracking area of the 3GPP access or in an area of the wireline access, which is a part of the UE's non-allowed area or is not a part of the UE's allowed area.

**Cause #43 – LADN not available**

This 5GMM cause is sent to the UE if the user-plane resources of the PDU session are not established when the UE is located outside the LADN service area.

**Cause #62 – No network slices available**

This 5GMM cause is sent by the network if there are no available network slices allowed for use by the UE.

NOTE: Network does not send this cause in REGISTRATION REJECT message if the UE does not include a requested NSSAI in the REGISTRATION REQUEST message. In that case, if the UE is not registered for onboarding services in SNPN, the network uses other causes (e.g. #13, #15, etc.) based on the subscription.

Cause #65 – Maximum number of PDU sessions reached

This 5GMM cause is used by the network to indicate that the procedure requested by the UE was rejected as the network has reached the maximum number of simultaneously active PDU sessions for the UE.

Cause #67 – Insufficient resources for specific slice and DNN

This 5GMM cause is sent by the network to indicate that the requested service cannot be provided due to insufficient resources for specific slice and DNN.

Cause #69 – Insufficient resources for specific slice

This 5GMM cause is sent by the network to indicate that the requested service cannot be provided due to insufficient resources for specific slice.

Cause #71 – ngKSI already in use

This 5GMM cause is sent to the network in N1 mode if the ngKSI value received in the AUTHENTICATION REQUEST message is already associated with one of the 5G security contexts stored in the UE.

Cause #73 – Serving network not authorized

This 5GMM cause is sent to the UE if the UE initiates registration towards a serving network and the serving network fails to be authorized by the UE's home network.

Cause #78 –PLMN not allowed to operate at the present UE location

This 5GMM cause is sent to the UE to indicate that the PLMN is not allowed to operate at the present UE location.

NOTE: This cause is only applicable for satellite NG-RAN access.

Cause #81 – Selected N3IWF is not compatible with the allowed NSSAI

This 5GMM cause is sent by the network to indicate that the requested service cannot be provided due to the selected N3IWF is not compatible with the allowed NSSAI.

Cause #82 – Selected TNGF is not compatible with the allowed NSSAI

This 5GMM cause is sent by the network to indicate that the requested service cannot be provided due to the selected TNGF is not compatible with the allowed NSSAI.

Cause #90 – Payload was not forwarded

This 5GMM cause is sent by the network to indicate that the requested service cannot be provided because payload could not be forwarded by AMF.

Cause #91 – DNN not supported or not subscribed in the slice

This 5GMM cause is sent by the network to indicate that the requested service cannot be provided because payload could not be forwarded by AMF because the DNN is not supported or not subscribed in the slice selected by the network if the UE did not indicate a slice, or the DNN is not supported or not subscribed in the slice indicated by the UE.

Cause #92 – Insufficient user-plane resources for the PDU session

This 5GMM cause is sent by the network to indicate that the requested service cannot be provided due to insufficient user-plane resources for the PDU session.

Cause #93 – Onboarding services terminated

This 5GMM cause is sent by the network if the network initiates a de-registration procedure because the onboarding services are terminated.

---

## A.4 Causes related to invalid messages

### Cause #95 – Semantically incorrect message

This 5GMM cause is used to report receipt of a message with semantically incorrect contents.

### Cause #96 – Invalid mandatory information

This cause 5GMM indicates that the equipment sending this 5GMM cause has received a message with a non-semantic mandatory IE error.

### Cause #97 – Message type non-existent or not implemented

This 5GMM cause indicates that the equipment sending this 5GMM cause has received a message with a message type it does not recognize either because this is a message not defined, or defined but not implemented by the equipment sending this 5GMM cause.

### Cause #98 – Message type not compatible with protocol state

This 5GMM cause indicates that the equipment sending this 5GMM cause has received a message not compatible with the protocol state.

### Cause #99 – Information element non-existent or not implemented

This 5GMM cause indicates that the equipment sending this 5GMM cause has received a message which includes information elements not recognized because the information element identifier is not defined or it is defined but not implemented by the equipment sending the 5GMM cause. However, the information element is not required to be present in the message in order for the equipment sending the 5GMM cause to process the message.

### Cause #100 – Conditional IE error

This 5GMM cause indicates that the equipment sending this cause has received a message with conditional IE errors.

### Cause #101 – Message not compatible with protocol state

This 5GMM cause indicates that a message has been received which is incompatible with the protocol state.

### Cause #111 – Protocol error, unspecified

This 5GMM cause is used to report a protocol error event only when no other 5GMM cause in the protocol error class applies.

---

## Annex B (informative): Cause values for 5GS session management

### B.1 Causes related to nature of request

#### Cause #8 – Operator Determined Barring

This 5GSM cause is used by the network to indicate that the requested service was rejected by the SMF due to Operator Determined Barring.

#### Cause #26 – Insufficient resources

This 5GSM cause is used by the UE or by the network to indicate that the requested service cannot be provided due to insufficient resources.

#### Cause #27 – Missing or unknown DNN

This 5GSM cause is used by the network to indicate that the requested service was rejected by the external DN because the DNN was not included although required or if the DNN could not be resolved.

#### Cause #28 – Unknown PDU session type

This 5GSM cause is used by the network to indicate that the requested service was rejected by the external DN because the requested PDU session type could not be recognised or is not allowed.

#### Cause #29 – User authentication or authorization failed

This 5GSM cause is used by the network to indicate that the requested service was rejected by the external DN due to a failed user authentication, revoked by the external DN, or rejected by 5GCN due to a failed user authentication or authorization.

#### Cause #31 – Request rejected, unspecified

This 5GSM cause is used by the network or by the UE to indicate that the requested service or operation or the request for a resource was rejected due to unspecified reasons.

#### Cause #32 – Service option not supported

This 5GSM cause is used by the network when the UE requests a service which is not supported by the PLMN.

#### Cause #33 – Requested service option not subscribed

This 5GSM cause is sent when the UE requests a service option for which it has no subscription.

#### Cause #35 – PTI already in use

This 5GSM cause is used by the network to indicate that the PTI included by the UE is already in use by another active UE requested procedure for this UE.

#### Cause #36 – Regular deactivation

This 5GSM cause is used to indicate a regular UE or network initiated release of PDU session resources.

#### Cause #37 – 5GS QoS not accepted

This 5GSM cause is used by the network if the new 5GS QoS that was indicated in the UE request cannot be accepted.

#### Cause #38 – Network failure

This 5GSM cause is used by the network to indicate that the requested service was rejected due to an error situation in the network.

**Cause #39 – Reactivation requested**

This 5GSM cause is used by the network to request a PDU session reactivation.

**Cause #41 – Semantic error in the TFT operation**

This 5GSM cause is used by the UE to indicate a semantic error in the TFT operation included in the request.

**Cause #42 – Syntactical error in the TFT operation**

This 5GSM cause is used by the UE to indicate a syntactical error in the TFT operation included in the request.

**Cause #43 – Invalid PDU session identity**

This 5GSM cause is used by the network or the UE to indicate that the PDU session identity value provided to it is not a valid value or the PDU session identified by the PDU session identity IE in the request or the command is not active.

**Cause #44 – Semantic errors in packet filter(s)**

This 5GSM cause is used by the network or the UE to indicate that the requested service was rejected due to one or more semantic errors in packet filter(s) of the QoS rule included in the request.

**Cause #45 – Syntactical error in packet filter(s)**

This 5GSM cause is used by the network or the UE to indicate that the requested service was rejected due to one or more syntactical errors in packet filter(s) of the QoS rule included in the request.

**Cause #46 – Out of LADN service area**

This 5GSM cause is used by the network to indicate the UE is out of the LADN service area.

**Cause #47 – PTI mismatch**

This 5GSM cause is used by the network or UE to indicate that the PTI provided to it does not match any PTI in use.

**Cause #50 – PDU session type IPv4 only allowed**

This 5GSM cause is used by the network to indicate that only PDU session type IPv4 is allowed for the requested IP connectivity.

**Cause #51 – PDU session type IPv6 only allowed**

This 5GSM cause is used by the network to indicate that only PDU session type IPv6 is allowed for the requested IP connectivity.

**Cause #54 – PDU session does not exist**

This 5GSM cause is used by the network at handover of a PDU session between non-3GPP access and 3GPP access, or at interworking of a PDN connection from non-3GPP access network connected to EPC or from E-UTRAN connected to EPC to a PDU session, to indicate that the network does not have any information about the requested PDU session.

**Cause #57 – PDU session type IPv4v6 only allowed**

This 5GSM cause is used by the network to indicate that only PDU session types IPv4, IPv6 or IPv4v6 are allowed for the requested IP connectivity.

**Cause #58 – PDU session type Unstructured only allowed**

This 5GSM cause is used by the network to indicate that only PDU session type Unstructured is allowed for the requested DN connectivity.

**Cause #59 – Unsupported 5QI value**

This 5GSM cause is used by the network if the 5QI indicated in the UE request cannot be supported.

Cause #61 – PDU session type Ethernet only allowed

This 5GSM cause is used by the network to indicate that only PDU session type Ethernet is allowed for the requested DN connectivity.

Cause #67 – Insufficient resources for specific slice and DNN

This 5GSM cause is by the network to indicate that the requested service cannot be provided due to insufficient resources for specific slice and DNN or maximum group data rate on a 5G VN group identified by a specific slice and DNN has been exceeded.

Cause #68 – Not supported SSC mode

This 5GSM cause is used by the network to indicate that the requested SSC mode is not supported.

Cause #69 – Insufficient resources for specific slice

This 5GSM cause is used by the network to indicate that the requested service cannot be provided due to insufficient resources for specific slice, maximum number of PDU sessions on a specific slice has been already reached, data rate on a specific slice has been exceeded, or UE-Slice-MBR has been exceeded.

Cause #70 – Missing or unknown DNN in a slice

This 5GSM cause is used by the network to indicate that the requested service was rejected by the external DN because the DNN was not included although required or if the DNN could not be resolved, in the slice.

Cause #81 – Invalid PTI value

This 5GSM cause is used by the network or UE to indicate that the PTI provided to it is invalid for the specific 5GSM message.

Cause #82 – Maximum data rate per UE for user-plane integrity protection is too low

This 5GSM cause is used by the network to indicate that the requested service cannot be provided because the maximum data rate per UE for user-plane integrity protection is too low.

Cause #83 – Semantic error in the QoS operation

This 5GSM cause is used by the network or the UE to indicate that the requested service was rejected due to a semantic error in the QoS operation included in the request.

Cause #84 – Syntactical error in the QoS operation

This 5GSM cause is used by the network or the UE to indicate that the requested service was rejected due to a syntactical error in the QoS operation included in the request.

Cause #85 – Invalid mapped EPS bearer identity

This 5GSM cause is used by the network or the UE to indicate that the mapped EPS bearer identity value provided to it is not a valid value or the mapped EPS bearer identified by the mapped EPS bearer identity does not exist.

Cause #86 – UAS services not allowed

This 5GSM cause is used by the network to indicate that the requested UAS services are not allowed.

---

## B.2 Protocol errors (e.g., unknown message)

Cause #95 – Semantically incorrect message

This 5GSM cause is used to report receipt of a message with semantically incorrect contents.

**Cause #96 – Invalid mandatory information**

This 5GSM cause indicates that the equipment sending this 5GSM cause has received a message with a non-semantical mandatory IE error.

**Cause #97 – Message type non-existent or not implemented**

This 5GSM cause indicates that the equipment sending this 5GSM cause has received a message with a message type it does not recognize either because this is a message not defined, or defined but not implemented by the equipment sending this 5GSM cause.

**Cause #98 – Message type not compatible with protocol state**

This 5GSM cause indicates that the equipment sending this 5GSM cause has received a message not compatible with the protocol state.

**Cause #99 – Information element non-existent or not implemented**

This 5GSM cause indicates that the equipment sending this 5GSM cause has received a message which includes information elements not recognized because the information element identifier is not defined or it is defined but not implemented by the equipment sending the 5GSM cause. However, the information element is not required to be present in the message in order for the equipment sending the 5GSM cause to process the message.

**Cause #100 – Conditional IE error**

This 5GSM cause indicates that the equipment sending this cause has received a message with conditional IE errors.

**Cause #101 – Message not compatible with protocol state**

This 5GSM cause indicates that a message has been received which is incompatible with the protocol state.

**Cause #111 – Protocol error, unspecified**

This 5GSM cause is used to report a protocol error event only when no other 5GSM cause in the protocol error class applies.

---
