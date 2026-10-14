---
topic_key: 3gpp_23501_architecture_sba
title: 3GPP TS 23.501 - 5G System Architecture Reference Model & Network Functions
source_vendor: 3gpp
doc_type: specification_clause
technology: 5gc
category: 5gc
keywords: sba, amf, smf, upf, pcf, udm, ausf, nrf, nssf, nef, n1, n2, n3, n4, n6, n9, service based architecture, reference points
summary: Ekstraksi klausul teknis penting 3GPP TS 23.501 - 5G System Architecture Reference Model & Network Functions dari 3GPP TS 23.501.
---

## 4.1 General concepts

The 5G System architecture is defined to support data connectivity and services enabling deployments to use techniques such as e.g. Network Function Virtualization and Software Defined Networking. The 5G System architecture shall leverage service-based interactions between Control Plane (CP) Network Functions where identified. Some key principles and concept are to:

- Separate the User Plane (UP) functions from the Control Plane (CP) functions, allowing independent scalability, evolution and flexible deployments e.g. centralized location or distributed (remote) location.
- Modularize the function design, e.g. to enable flexible and efficient network slicing.
- Wherever applicable, define procedures (i.e. the set of interactions between network functions) as services, so that their re-use is possible.
- Enable each Network Function and its Network Function Services to interact with other NF and its Network Function Services directly or indirectly via a Service Communication Proxy if required. The architecture does not preclude the use of another intermediate function to help route Control Plane messages (e.g. like a DRA).
- Minimize dependencies between the Access Network (AN) and the Core Network (CN). The architecture is defined with a converged core network with a common AN - CN interface which integrates different Access Types e.g. 3GPP access and non-3GPP access.
- Support a unified authentication framework.
- Support "stateless" NFs, where the "compute" resource is decoupled from the "storage" resource.
- Support capability exposure.
- Support concurrent access to local and centralized services. To support low latency services and local access to data networks, UP functions can be deployed close to the Access Network.
- Support roaming with both Home routed traffic as well as Local breakout traffic in the visited PLMN.

## 4.2 Architecture reference model

### 4.2.1 General

This specification describes the architecture for the 5G System. The 5G architecture is defined as service-based and the interaction between network functions is represented in two ways.

- A service-based representation, where network functions (e.g. AMF) within the Control Plane enables other authorized network functions to access their services. This representation also includes point-to-point reference points where necessary.
- A reference point representation, shows the interaction exist between the NF services in the network functions described by point-to-point reference point (e.g. N11) between any two network functions (e.g. AMF and SMF).

Service-based interfaces are listed in clause 4.2.6. Reference points are listed in clause 4.2.7.

Network functions within the 5GC Control Plane shall only use service-based interfaces for their interactions.

NOTE 1: The interactions between NF services within one NF are not specified in this Release of the specification.

NFs and NF services can communicate directly, referred to as Direct Communication, or indirectly via the SCP, referred to as Indirect Communication. For more information on communication options, see Annex E and clauses under 6.3.1 and 7.1.2.

In addition to the architecture descriptions in clause 4, the following areas are further described in other specifications:

- NG-RAN architecture is described in TS 38.300 [27] and TS 38.401 [42].
- Security architecture is described in TS 33.501 [29] and TS 33.535 [124].
- Charging architecture is described in TS 32.240 [41].
- 5G Media streaming architecture is described in TS 26.501 [135].

NOTE 3: The NFs listed in clause 4.2.2 are described in the following clauses or in the specifications above.

### 4.2.2 Network Functions and entities

The 5G System architecture consists of the following network functions (NF):

- Authentication Server Function (AUSF).
- Access and Mobility Management Function (AMF).
- Data Network (DN), e.g. operator services, Internet access or 3rd party services.
- Unstructured Data Storage Function (UDSF).
- Network Exposure Function (NEF).
- Network Repository Function (NRF).
- Network Slice Admission Control Function (NSACF).
- Network Slice-specific and SNPN Authentication and Authorization Function (NSSAAF).
- Network Slice Selection Function (NSSF).
- Policy Control Function (PCF).
- Session Management Function (SMF).
- Unified Data Management (UDM).
- Unified Data Repository (UDR).
- User Plane Function (UPF).
- UE radio Capability Management Function (UCMF).
- Application Function (AF).
- User Equipment (UE).
- (Radio) Access Network ((R)AN).
- 5G-Equipment Identity Register (5G-EIR).
- Network Data Analytics Function (NWDAF).
- Charging Function (CHF).

- Time Sensitive Networking AF (TSN AF).
- Time Sensitive Communication and Time Synchronization Function (TSCTSF).
- Data Collection Coordination Function (DCCF).
- Analytics Data Repository Function (ADRF).
- Messaging Framework Adaptor Function (MFAF).
- Non-Seamless WLAN Offload Function (NSWOF).

NOTE: The functionalities provided by DCCF and/or ADRF can also be hosted by an NWDAF.

- Edge Application Server Discovery Function (EASDF).

The 5G System architecture also comprises the following network entities:

- Service Communication Proxy (SCP).
- Security Edge Protection Proxy (SEPP).

The functional descriptions of these Network Functions and entities are specified in clause 6.

- Non-3GPP InterWorking Function (N3IWF).
- Trusted Non-3GPP Gateway Function (TNGF).
- Wireline Access Gateway Function (W-AGF).
- Trusted WLAN Interworking Function (TWIF).

### 4.2.3 Non-roaming reference architecture

Figure 4.2.3-1 depicts the non-roaming reference architecture. Service-based interfaces are used within the Control Plane.

![Diagram of Non-Roaming 5G System Architecture showing various network functions and their interfaces.](aa9441a5971655a79987d70fc551b26a_img.jpg)

The diagram illustrates the Non-Roaming 5G System Architecture. At the top, a horizontal line represents the Service Based Interface (SBI). Above this line are several Network Functions (NFs) connected via their respective service-based interfaces: NSSF (Nnssf), NEF (Nnef), NRF (Nnrf), PCF (Npcf), UDM (Nudm), AF (Naf), and EASDF (Neasdf). Below the SBI line, other NFs are connected: NSSAAF (NnssAAF), AUSF (Nausf), AMF (Namf), SMF (Nsmf), SCP (Nscp), and NSACF (NnsacF). The User Equipment (UE) is connected to the (R)AN via the N1 interface. The (R)AN is connected to the AMF via the N2 interface and to the UPF via the N3 interface. The AMF is connected to the SMF via the N4 interface. The UPF is connected to the DN (Data Network) via the N6 interface and has a service-based interface N9. The (R)AN is also connected to the UPF via the N3 interface.

Diagram of Non-Roaming 5G System Architecture showing various network functions and their interfaces.

Figure 4.2.3-1: Non-Roaming 5G System Architecture

NOTE: If an SCP is deployed it can be used for indirect communication between NFs and NF services as described in Annex E. SCP does not expose services itself.

Figure 4.2.3-2 depicts the 5G System architecture in the non-roaming case, using the reference point representation showing how various network functions interact with each other.

![Figure 4.2.3-2: Non-Roaming 5G System Architecture in reference point representation. This diagram shows the interconnections between various 5G Network Functions (NFs). At the top, NSSAAF is connected to UDM via N59. NSSAF and AUSF are connected to AMF via N22 and N12 respectively. AUSF is also connected to UDM via N13. UDM is connected to NSACF via N80 and to AMF via N8. AMF is connected to SMF via N11 and to UPF via N4. SMF is connected to PCF via N7 and to DN via N6. PCF is connected to AF via N5. UE is connected to (R)AN via N1. (R)AN is connected to AMF via N2 and to UPF via N3. UPF is connected to DN via N6 and has interfaces N9 and N15. AMF is also connected to UDM via N10 and N81.](898fb89a50d9ec1dfb4e425c816976a7_img.jpg)

```

graph TD
    UE[UE] -- N1 --> AMF[AMF]
    (R)AN[(R)AN] -- N2 --> AMF
    (R)AN -- N3 --> UPF[UPF]
    AMF -- N4 --> UPF
    UPF -- N6 --> DN((DN))
    AMF -- N11 --> SMF[SMF]
    SMF -- N7 --> PCF[PCF]
    PCF -- N5 --> AF[AF]
    AMF -- N8 --> UDM[UDM]
    UDM -- N10 --> AMF
    UDM -- N80 --> NSACF[NSACF]
    UDM -- N13 --> AUSF[AUSF]
    AUSF -- N12 --> AMF
    NSSAF[NSSAF] -- N22 --> AMF
    NSSAAF[NSSAAF] -- N59 --> UDM
    AMF -- N14 --> UPF
    UPF -- N9 --> UPF
    AMF -- N15 --> UPF
    SMF -- N15 --> UPF
  
```

Figure 4.2.3-2: Non-Roaming 5G System Architecture in reference point representation. This diagram shows the interconnections between various 5G Network Functions (NFs). At the top, NSSAAF is connected to UDM via N59. NSSAF and AUSF are connected to AMF via N22 and N12 respectively. AUSF is also connected to UDM via N13. UDM is connected to NSACF via N80 and to AMF via N8. AMF is connected to SMF via N11 and to UPF via N4. SMF is connected to PCF via N7 and to DN via N6. PCF is connected to AF via N5. UE is connected to (R)AN via N1. (R)AN is connected to AMF via N2 and to UPF via N3. UPF is connected to DN via N6 and has interfaces N9 and N15. AMF is also connected to UDM via N10 and N81.

**Figure 4.2.3-2: Non-Roaming 5G System Architecture in reference point representation**

NOTE 1: N9, N14 are not shown in all other figures however they may also be applicable for other scenarios.

NOTE 2: For the sake of clarity of the point-to-point diagrams, the UDSF, NEF and NRF have not been depicted. However, all depicted Network Functions can interact with the UDSF, UDR, NEF and NRF as necessary.

NOTE 3: The UDM uses subscription data and authentication data and the PCF uses policy data that may be stored in UDR (refer to clause 4.2.5).

NOTE 4: For clarity, the UDR and its connections with other NFs, e.g. PCF, are not depicted in the point-to-point and service-based architecture diagrams. For more information on data storage architectures refer to clause 4.2.5.

NOTE 5: For clarity, the NWDAF(s), DCCF, MFAF and ADRF and their connections with other NFs, are not depicted in the point-to-point and service-based architecture diagrams. For more information on network data analytics architecture refer to TS 23.288 [86].

NOTE 6: For clarity, the 5G DDNMF and its connections with other NFs, e.g. UDM, PCF are not depicted in the point-to-point and service-based architecture diagrams. For more information on ProSe architecture refer to TS 23.304 [128].

NOTE 7: For clarity, the TSCTSF and its connections with other NFs, e.g. PCF, NEF, UDR are not depicted in the point-to-point and service-based architecture diagrams. For more information on TSC architecture refer to clause 4.4.8.

NOTE 8: For exposure of the QoS monitoring information as specified in clause 5.8.2.18, exposure of data collected for analytics as specified in clause 5.2.26.2 of TS 23.502 [3], and exposure of the TSC management information as specified in clause 5.8.5.14, direct interaction between UPF and NFs can be supported via the Nupf interface (see clause 4.2.16).

NOTE 9: For clarity, the EASDF and its connections with SMF is not depicted in the point-to-point and service-based architecture diagrams. For more information on edge computing architecture refer to TS 23.548 [130].

Figure 4.2.3-3 depicts the non-roaming architecture for UEs concurrently accessing two (e.g. local and central) data networks using multiple PDU Sessions, using the reference point representation. This figure shows the architecture for multiple PDU Sessions where two SMFs are selected for the two different PDU Sessions. However, each SMF may also have the capability to control both a local and a central UPF within a PDU Session.

![Diagram of 5G system architecture for multiple PDU sessions.](523ab7b925beb555f88b2e1e1336974f_img.jpg)

This diagram illustrates the 5G system architecture for multiple PDU sessions. At the top, the Network Slice Selection Function (NSSF) connects to the Network Slice Selection Assistance Information Function (NSSAAF) via the N59 interface. The AUSF connects to the NSSF via the N22 interface and to the UDM via the N13 interface. The UDM connects to the AMF via the N8 interface and to the NSACF via the N10 interface. The AMF connects to the UE via the (R)AN through the N1 and N2 interfaces. The AMF also connects to the NSACF via the N12 interface, to the UDM via the N15 interface, and to two separate SMFs via the N11 interface. The first SMF connects to the PCF via the N7 interface and to the UPF via the N4 interface. The PCF connects to the AF via the N5 interface. The second SMF connects to the UPF via the N4 interface and to the DN via the N6 interface. The UPF connects to the DN via the N6 and N9 interfaces. The (R)AN also connects to the UPF via the N3 and N4 interfaces. The UPF connects to the DN via the N6 and N9 interfaces.

Diagram of 5G system architecture for multiple PDU sessions.

**Figure 4.2.3-3: Applying Non-Roaming 5G System Architecture for multiple PDU Session in reference point representation**

Figure 4.2.3-4 depicts the non-roaming architecture in the case of concurrent access to two (e.g. local and central) data networks is provided within a single PDU Session, using the reference point representation.

![Diagram of 5G system architecture for concurrent access to two data networks within a single PDU session.](e636d7ccca0ad14c6b95201404324823_img.jpg)

This diagram illustrates the 5G system architecture for concurrent access to two data networks within a single PDU session. The architecture is similar to Figure 4.2.3-3 but with a single PDU session. The UE connects to the (R)AN via the N1 and N2 interfaces. The (R)AN connects to the AMF via the N3 and N4 interfaces. The AMF connects to the UDM via the N15 interface and to the SMF via the N11 interface. The SMF connects to the PCF via the N7 interface and to two UPFs via the N4 interface. The PCF connects to the AF via the N5 interface. The first UPF connects to the DN via the N6 and N9 interfaces. The second UPF connects to the DN via the N6 and N9 interfaces. The UDM connects to the NSACF via the N10 interface. The NSACF connects to the AMF via the N12 interface. The AUSF connects to the NSSF via the N22 interface and to the UDM via the N13 interface. The NSSF connects to the NSSAAF via the N59 interface.

Diagram of 5G system architecture for concurrent access to two data networks within a single PDU session.

**Figure 4.2.3-4: Applying Non-Roaming 5G System Architecture for concurrent access to two (e.g. local and central) data networks (single PDU Session option) in reference point representation**

Figure 4.2.3-5 depicts the non-roaming architecture for Network Exposure Function, using reference point representation.

![Diagram of Non-Roaming Architecture for Network Exposure Function in reference point representation](a3472689858b068ef469213682965325_img.jpg)

The diagram illustrates the non-roaming architecture for the Network Exposure Function (NEF). At the top, three Application Functions (AF) are shown. The left AF connects to the first NEF via an N33 interface. The middle AF connects to both the first and second NEFs via N33 interfaces. The right AF connects to the second NEF. A vertical double-headed arrow on the left is labeled 'TRUST DOMAIN', indicating the scope of the first NEF. The first NEF contains API 1 and API 2, and the second NEF contains API 3, an ellipsis, and API n. Below the first NEF, NF1 and NF2 are connected via '3GPP Interface (See Note 2)'. Below the second NEF, NFn is connected via a '3GPP Interface (See Note 2)'. An ellipsis between NF2 and NFn indicates additional network functions. A horizontal dotted line separates the AFs from the NEFs.

Diagram of Non-Roaming Architecture for Network Exposure Function in reference point representation

**Figure 4.2.3-5: Non-Roaming Architecture for Network Exposure Function in reference point representation**

NOTE 1: In Figure 4.2.3-5, Trust domain for NEF is same as Trust domain for SCEF as defined in TS 23.682 [36].

NOTE 2: In Figure 4.2.3-5, 3GPP Interface represents southbound interfaces between NEF and 5GC Network Functions e.g. N29 interface between NEF and SMF, N30 interface between NEF and PCF, etc. All southbound interfaces from NEF are not shown for the sake of simplicity.

### 4.2.4 Roaming reference architectures

Figure 4.2.4-1 depicts the 5G System roaming architecture with local breakout with service-based interfaces within the Control Plane.

![Figure 4.2.4-1: Roaming 5G System architecture- local breakout scenario in service-based interface representation. The diagram shows the architecture for a local breakout (LBO) scenario in 5G roaming. It is divided into two main parts by a vertical dashed line: VPLMN (Visited PLMN) on the left and HPLMN (Home PLMN) on the right. In the VPLMN, the UE is connected to the (R)AN, which is connected to the AMF (N1, N2). The AMF is connected to the SMF (N4) and the NSACF (Nsmf). The SMF is connected to the UPF (N3, N9), which is connected to the DN (N6). The AMF is also connected to the vSEPP (N32). The vSEPP is connected to the hSEPP. The hSEPP is connected to the AUSF (Nausf). The AUSF is connected to the UDM (Nudm). The UDM is connected to the NRF (Nnrf). The NRF is connected to the NSSAAF (Nnssaaf). The NSSAAF is connected to the NSACF (Nnsacf). The NSACF is connected to the NEF (Nnef). The NEF is connected to the PCF (Npcf). The PCF is connected to the AF (Naf). The AF is connected to the NSSSF (Nnssf). The NSSSF is connected to the AMF (Namf). In the HPLMN, the hSEPP is connected to the AUSF (Nausf). The AUSF is connected to the UDM (Nudm). The UDM is connected to the NRF (Nnrf). The NRF is connected to the NSSAAF (Nnssaaf). The NSSAAF is connected to the NSACF (Nnsacf). The NSACF is connected to the NEF (Nnef). The NEF is connected to the PCF (Npcf). The PCF is connected to the AF (Naf). The AF is connected to the NSSSF (Nnssf). The NSSSF is connected to the AMF (Namf).](e180f2b5fcbe8001554a7c0677cd3f82_img.jpg)

Figure 4.2.4-1: Roaming 5G System architecture- local breakout scenario in service-based interface representation. The diagram shows the architecture for a local breakout (LBO) scenario in 5G roaming. It is divided into two main parts by a vertical dashed line: VPLMN (Visited PLMN) on the left and HPLMN (Home PLMN) on the right. In the VPLMN, the UE is connected to the (R)AN, which is connected to the AMF (N1, N2). The AMF is connected to the SMF (N4) and the NSACF (Nsmf). The SMF is connected to the UPF (N3, N9), which is connected to the DN (N6). The AMF is also connected to the vSEPP (N32). The vSEPP is connected to the hSEPP. The hSEPP is connected to the AUSF (Nausf). The AUSF is connected to the UDM (Nudm). The UDM is connected to the NRF (Nnrf). The NRF is connected to the NSSAAF (Nnssaaf). The NSSAAF is connected to the NSACF (Nnsacf). The NSACF is connected to the NEF (Nnef). The NEF is connected to the PCF (Npcf). The PCF is connected to the AF (Naf). The AF is connected to the NSSSF (Nnssf). The NSSSF is connected to the AMF (Namf). In the HPLMN, the hSEPP is connected to the AUSF (Nausf). The AUSF is connected to the UDM (Nudm). The UDM is connected to the NRF (Nnrf). The NRF is connected to the NSSAAF (Nnssaaf). The NSSAAF is connected to the NSACF (Nnsacf). The NSACF is connected to the NEF (Nnef). The NEF is connected to the PCF (Npcf). The PCF is connected to the AF (Naf). The AF is connected to the NSSSF (Nnssf). The NSSSF is connected to the AMF (Namf).

**Figure 4.2.4-1: Roaming 5G System architecture- local breakout scenario in service-based interface representation**

NOTE 1: In the LBO architecture, the PCF in the VPLMN may interact with the AF in order to generate PCC Rules for services delivered via the VPLMN, the PCF in the VPLMN uses locally configured policies according to the roaming agreement with the HPLMN operator as input for PCC Rule generation, the PCF in VPLMN has no access to subscriber policy information from the HPLMN.

NOTE 2: An SCP can be used for indirect communication between NFs and NF services within the VPLMN, within the HPLMN, or in within both VPLMN and HPLMN. For simplicity, the SCP is not shown in the roaming architecture.

NOTE 3: For clarity, the NWDAF(s) with roaming exchange capability (RE-NWDAF) and their connections with other NFs, are not depicted in the service-based architecture diagram. For more information on network data analytics architecture refer to TS 23.288 [86].

NOTE 4: Depending on the architecture deployed, the Primary or Centralized NSACF at the VPLMN can fetch the maximum number of registered UEs or the maximum number of LBO PDU sessions to be enforced from the HPLMN Primary or Centralized NSACF as described in clause 5.15.11.3.1.

**Figure 4.2.4-2: Void**

Figure 4.2.4-3 depicts the 5G System roaming architecture in the case of home routed scenario with service-based interfaces within the Control Plane.

![Figure 4.2.4-3: Roaming 5G System architecture - home routed scenario in service-based interface representation. The diagram shows the VPLMN (Visited PLMN) on the left and the HPLMN (Home PLMN) on the right, separated by a dashed line. In the VPLMN, a UE connects to an (R)AN, which connects to an AMF via N1 and N2 interfaces. The AMF connects to an SMF via N4 and to an NSACF via N12. The SMF connects to a UPF via N3 and N4 interfaces. The UPF connects to the DN via N6 and N9 interfaces. The AMF also connects to the vSEPP via N32. The vSEPP connects to the hSEPP via N32. In the HPLMN, the hSEPP connects to the UDM via Nudm, to the NRF via Nnrf, to the NEF via Nnef, to the NSSSF via Nnssf, and to the NSACF via Nnsacf. The UDM connects to the AUSF via Nausf, which connects to the SMF via Nsmf. The SMF connects to the UPF via N4 and N9 interfaces. The UPF connects to the DN via N6 and N9 interfaces. The AUSF also connects to the PCF via Npcf and to the NSSAAF via NnssAAF. The PCF connects to the AF via Naf. The NSSAAF connects to the NSSSF via NnssAAF.](eb03559a4d92ea9ebd63ea9be663c50a_img.jpg)

Figure 4.2.4-3: Roaming 5G System architecture - home routed scenario in service-based interface representation. The diagram shows the VPLMN (Visited PLMN) on the left and the HPLMN (Home PLMN) on the right, separated by a dashed line. In the VPLMN, a UE connects to an (R)AN, which connects to an AMF via N1 and N2 interfaces. The AMF connects to an SMF via N4 and to an NSACF via N12. The SMF connects to a UPF via N3 and N4 interfaces. The UPF connects to the DN via N6 and N9 interfaces. The AMF also connects to the vSEPP via N32. The vSEPP connects to the hSEPP via N32. In the HPLMN, the hSEPP connects to the UDM via Nudm, to the NRF via Nnrf, to the NEF via Nnef, to the NSSSF via Nnssf, and to the NSACF via Nnsacf. The UDM connects to the AUSF via Nausf, which connects to the SMF via Nsmf. The SMF connects to the UPF via N4 and N9 interfaces. The UPF connects to the DN via N6 and N9 interfaces. The AUSF also connects to the PCF via Npcf and to the NSSAAF via NnssAAF. The PCF connects to the AF via Naf. The NSSAAF connects to the NSSSF via NnssAAF.

**Figure 4.2.4-3: Roaming 5G System architecture - home routed scenario in service-based interface representation**

NOTE 4: An SCP can be used for indirect communication between NFs and NF services within the VPLMN, within the HPLMN, or in within both VPLMN and HPLMN. For simplicity, the SCP is not shown in the roaming architecture.

NOTE 5: UPFs in the home routed scenario can be used also to support the IPUPS functionality (see clause 5.8.2.14).

NOTE 6: For clarity, the NWDAF(s) with roaming exchange capability (RE-NWDAF) and their connections with other NFs, are not depicted in the service-based architecture diagram. For more information on network data analytics architecture refer to TS 23.288 [86].

Figure 4.2.4-4 depicts 5G System roaming architecture in the case of local break out scenario using the reference point representation.

![Figure 4.2.4-4: Roaming 5G System architecture - local breakout scenario in reference point representation. The diagram shows the VPLMN (Visited PLMN) on the left and the HPLMN (Home PLMN) on the right, separated by a dashed line. In the VPLMN, a UE connects to an (R)AN, which connects to an AMF via N1 and N2 interfaces. The AMF connects to an SMF via N11 and to an NSSSF via N22. The SMF connects to a vPCF via N7 and to a UPF via N4 and N15 interfaces. The UPF connects to the DN via N6 and N9 interfaces. The vPCF connects to the hPCF via N24 and to an AF via N5 interfaces. The AMF also connects to the UDM via N10 and N12 interfaces, and to the AUSF via N8 interfaces. In the HPLMN, the hPCF connects to the UDM via N13. The UDM connects to the AUSF via N13. The AUSF connects to the NSSAAF via N59. The NSSAAF connects to the NSSSF via NnssAAF.](19a59d6b53059ebd27b13c98793f88e0_img.jpg)

Figure 4.2.4-4: Roaming 5G System architecture - local breakout scenario in reference point representation. The diagram shows the VPLMN (Visited PLMN) on the left and the HPLMN (Home PLMN) on the right, separated by a dashed line. In the VPLMN, a UE connects to an (R)AN, which connects to an AMF via N1 and N2 interfaces. The AMF connects to an SMF via N11 and to an NSSSF via N22. The SMF connects to a vPCF via N7 and to a UPF via N4 and N15 interfaces. The UPF connects to the DN via N6 and N9 interfaces. The vPCF connects to the hPCF via N24 and to an AF via N5 interfaces. The AMF also connects to the UDM via N10 and N12 interfaces, and to the AUSF via N8 interfaces. In the HPLMN, the hPCF connects to the UDM via N13. The UDM connects to the AUSF via N13. The AUSF connects to the NSSAAF via N59. The NSSAAF connects to the NSSSF via NnssAAF.

**Figure 4.2.4-4: Roaming 5G System architecture - local breakout scenario in reference point representation**

NOTE 7: The NRF is not depicted in reference point architecture figures. Refer to Figure 4.2.4-7 for details on NRF and NF interfaces.

NOTE 8: For the sake of clarity, SEPPs are not depicted in the roaming reference point architecture figures.

NOTE 9: For clarity, the NWDAF(s) with roaming exchange capability (RE-NWDAF) and their connections with other NFs, are not depicted in the reference point architecture figure. For more information on network data analytics architecture refer to TS 23.288 [86].

The following figure 4.2.4-6 depicts the 5G System roaming architecture in the case of home routed scenario using the reference point representation.

![Figure 4.2.4-6: Roaming 5G System architecture - Home routed scenario in reference point representation. The diagram shows the VPLMN on the left and HPLMN on the right, separated by a vertical dashed line. In VPLMN: UE connects to (R)AN (N1), (R)AN connects to AMF (N2) and UPF (N3). AMF connects to V-NSSF (N22), V-PCF (N15), V-SMF (N11). V-SMF connects to V-PCF (N38) and UPF (N4). In HPLMN: NSSAAF, AUSF, UDM, H-NSSF, H-SMF, H-PCF, AF, and UPF are shown. Cross-border connections include N31 (AMF to H-NSSF), N58 (AMF to NSSAAF), N12 (AMF to AUSF), N8 (AMF to UDM), N16 (V-SMF to H-SMF), N24 (V-PCF to H-PCF), and N9 (UPF to UPF). H-SMF connects to UDM (N10), H-PCF (N7), and UPF (N4). H-PCF connects to AF (N5). UPF connects to Data Network (N6).](5132b3a97ac70fe4765c1e07e66b72b3_img.jpg)

Figure 4.2.4-6: Roaming 5G System architecture - Home routed scenario in reference point representation. The diagram shows the VPLMN on the left and HPLMN on the right, separated by a vertical dashed line. In VPLMN: UE connects to (R)AN (N1), (R)AN connects to AMF (N2) and UPF (N3). AMF connects to V-NSSF (N22), V-PCF (N15), V-SMF (N11). V-SMF connects to V-PCF (N38) and UPF (N4). In HPLMN: NSSAAF, AUSF, UDM, H-NSSF, H-SMF, H-PCF, AF, and UPF are shown. Cross-border connections include N31 (AMF to H-NSSF), N58 (AMF to NSSAAF), N12 (AMF to AUSF), N8 (AMF to UDM), N16 (V-SMF to H-SMF), N24 (V-PCF to H-PCF), and N9 (UPF to UPF). H-SMF connects to UDM (N10), H-PCF (N7), and UPF (N4). H-PCF connects to AF (N5). UPF connects to Data Network (N6).

**Figure 4.2.4-6: Roaming 5G System architecture - Home routed scenario in reference point representation**

The N38 references point can be between V-SMFs in the same VPLMN, or between V-SMFs in different VPLMNs (to enable inter-PLMN mobility).

NOTE 10: For clarity, the NWDAF(s) with roaming exchange capability (RE-NWDAF) and their connections with other NFs, are not depicted in the reference point architecture figure. For more information on network data analytics architecture refer to TS 23.288 [86].

For the roaming scenarios described above each PLMN implements proxy functionality to secure interconnection and hide topology on the inter-PLMN interfaces.

![Figure 4.2.4-7: NRF Roaming architecture in reference point representation. The diagram shows three Network Functions (NFs) connected in a line: VPLMN NF, vNRF, and hNRF. The vNRF and hNRF are connected via an N27 interface. A vertical dashed line separates the VPLMN (left) and HPLMN (right) domains.](26d664119ad25250780f554633444e54_img.jpg)

Figure 4.2.4-7: NRF Roaming architecture in reference point representation. The diagram shows three Network Functions (NFs) connected in a line: VPLMN NF, vNRF, and hNRF. The vNRF and hNRF are connected via an N27 interface. A vertical dashed line separates the VPLMN (left) and HPLMN (right) domains.

**Figure 4.2.4-7: NRF Roaming architecture in reference point representation**

NOTE 11: For the sake of clarity, SEPPs on both sides of PLMN borders are not depicted in figure 4.2.4-7.

**Figure 4.2.4-8: Void**

Operators can deploy UPFs supporting the Inter PLMN UP Security (IPUPS) functionality at the border of their network to protect their network from invalid inter PLMN N9 traffic in home routed roaming scenarios. The UPFs supporting the IPUPS functionality in VPLMN and HPLMN are controlled by the V-SMF and the H-SMF of that PDU Session respectively. A UPF supporting the IPUPS functionality terminates GTP-U N9 tunnels. The SMF can activate the IPUPS functionality together with other UP functionality in the same UPF, or insert a separate UPF for the IPUPS functionality in the UP path (which e.g. may be dedicated to be used for IPUPS functionality). Figure 4.2.4-9 depicts the home routed roaming architecture where a UPF is inserted in the UP path for the IPUPS functionality. Figure 4.2.4-3 depicts the home routed roaming architecture where the two UPFs perform the IPUPS functionality and other UP functionality for the PDU Session.

NOTE 12: Operators are not prohibited from deploying the IPUPS functionality as a separate Network Function from the UPF, acting as a transparent proxy which can transparently read N4 and N9 interfaces. However, such deployment option is not specified and needs to take at least into account very long lasting PDU Sessions with infrequent traffic and Inter-PLMN handover.

The IPUPS functionality is specified in clause 5.8.2.14 and TS 33.501 [29].

![Figure 4.2.4-9: Roaming 5G System architecture - home routed roaming scenario in service-based interface representation employing UPF dedicated to IPUPS. The diagram is split into two domains by a vertical dashed line: VPLMN (left) and HPLMN (right). In the VPLMN, a UE is connected to an (R)AN, which is connected to an AMF. The AMF is connected to an SMF and an NSACF. The SMF is connected to a UPF, which is connected to another UPF (IPUPS). The UPF (IPUPS) is connected to the HPLMN via an N9 interface. In the HPLMN, the UPF (IPUPS) is connected to an SMF. The SMF is connected to an AUSF, which is connected to an NSSAAF. The NSSAAF is connected to a UPF, which is connected to a DN. Various service-based interfaces (N1, N2, N3, N4, N5, N6, N7, N8, N9, N10, N11, N12, N13, N14, N15, N16, N17, N18, N19, N20, N21, N22, N23, N24, N25, N26, N27, N28, N29, N30, N31, N32, N33, N34, N35, N36, N37, N38, N39, N40, N41, N42, N43, N44, N45, N46, N47, N48, N49, N50) are shown between the various Network Functions (NFs).](dd380ccd5aca1151074fede04826f1a4_img.jpg)

Figure 4.2.4-9: Roaming 5G System architecture - home routed roaming scenario in service-based interface representation employing UPF dedicated to IPUPS. The diagram is split into two domains by a vertical dashed line: VPLMN (left) and HPLMN (right). In the VPLMN, a UE is connected to an (R)AN, which is connected to an AMF. The AMF is connected to an SMF and an NSACF. The SMF is connected to a UPF, which is connected to another UPF (IPUPS). The UPF (IPUPS) is connected to the HPLMN via an N9 interface. In the HPLMN, the UPF (IPUPS) is connected to an SMF. The SMF is connected to an AUSF, which is connected to an NSSAAF. The NSSAAF is connected to a UPF, which is connected to a DN. Various service-based interfaces (N1, N2, N3, N4, N5, N6, N7, N8, N9, N10, N11, N12, N13, N14, N15, N16, N17, N18, N19, N20, N21, N22, N23, N24, N25, N26, N27, N28, N29, N30, N31, N32, N33, N34, N35, N36, N37, N38, N39, N40, N41, N42, N43, N44, N45, N46, N47, N48, N49, N50) are shown between the various Network Functions (NFs).

**Figure 4.2.4-9: Roaming 5G System architecture - home routed roaming scenario in service-based interface representation employing UPF dedicated to IPUPS**

### 4.2.5 Data Storage architectures

As depicted in Figure 4.2.5-1, the 5G System architecture allows any NF to create/read/update/delete its unstructured data in a UDSF (e.g. UE contexts). If such an NF is using UDSF is part of an NF set, then any of the NF instance within this NF set may read/update/delete the unstructured data that was created by this NF. The UDSF belongs to the same PLMN where the network function is located. CP NFs/NF Sets may share a UDSF for storing their respective unstructured data or may each have their own UDSF (e.g. a UDSF may be located close to the respective NF).

NOTE 1: Structured data in this specification refers to data for which the structure is defined in 3GPP specifications. Unstructured data refers to data for which the structure is not defined in 3GPP specifications.

NOTE 2: If a NF Set has its own UDSF, it is up to UDSF implementation and deployment that only the NF instance within the set can access the data created by another NF instance within the NF set. If a UDSF is shared between several NFs not part of the same set or is shared between several NF sets, it is up to UDSF implementation and deployment to make sure that only NFs that are authorized can access the data. For further information about Guidelines and Principles for Compute-Storage Separation see Annex C.

![Diagram of Data Storage Architecture for unstructured data from any NF. It shows a box labeled 'Any NF' connected to a box labeled 'UDSF' via a line labeled 'N18/Nudsf'.](20136850feb70fd71c7d41cdae203ebb_img.jpg)

```

graph LR
    AnyNF[Any NF] -- N18/Nudsf --> UDSF[UDSF]
  
```

Diagram of Data Storage Architecture for unstructured data from any NF. It shows a box labeled 'Any NF' connected to a box labeled 'UDSF' via a line labeled 'N18/Nudsf'.

**Figure 4.2.5-1: Data Storage Architecture for unstructured data from any NF**

NOTE 3: 3GPP will specify (possibly by referencing) the N18/Nudsf interface.

As depicted in Figure 4.2.5-2, the 5G System architecture allows the UDM, PCF and NEF to store data in the UDR, including subscription data and policy data by UDM and PCF, structured data for exposure and application data (including Packet Flow Descriptions (PFDs) for application detection, AF request information for multiple UEs) by the NEF. UDR can be deployed in each PLMN and it can serve different functions as follows:

- UDR accessed by the NEF belongs to the same PLMN where the NEF is located.
- UDR accessed by the UDM belongs to the same PLMN where the UDM is located if UDM supports a split architecture.
- UDR accessed by the PCF belongs to the same PLMN where the PCF is located.

NOTE 4: The UDR deployed in each PLMN can store application data for roaming subscribers.

![Diagram of Data Storage Architecture. It shows three boxes on the left: UDM, PCF, and NEF. UDM is connected to a central box labeled 'UDR' via an 'N35' interface. PCF is connected to the UDR via an 'N36' interface. NEF is connected to the UDR via an 'N37' interface. All three interfaces (N35, N36, N37) converge into a single connection labeled 'Nudr' which enters the UDR box. Inside the UDR box, the 'Nudr' connection leads to a 'Data Access Provider' box, which is connected to a large cylinder representing a database. The database contains four types of data: 'Subscription Data', 'Policy Data', 'Structured Data for exposure', and 'Application Data'.](1c140ee5d1a87186977da94a96bfa700_img.jpg)

```

graph LR
    UDM[UDM] -- N35 --> Nudr((Nudr))
    PCF[PCF] -- N36 --> Nudr
    NEF[NEF] -- N37 --> Nudr
    Nudr --> UDR[UDR]
    subgraph UDR
        DataAccessProvider[Data Access Provider]
        Database[(Subscription Data  
Policy Data  
Structured Data for exposure  
Application Data)]
        DataAccessProvider -.-> Database
    end
  
```

Diagram of Data Storage Architecture. It shows three boxes on the left: UDM, PCF, and NEF. UDM is connected to a central box labeled 'UDR' via an 'N35' interface. PCF is connected to the UDR via an 'N36' interface. NEF is connected to the UDR via an 'N37' interface. All three interfaces (N35, N36, N37) converge into a single connection labeled 'Nudr' which enters the UDR box. Inside the UDR box, the 'Nudr' connection leads to a 'Data Access Provider' box, which is connected to a large cylinder representing a database. The database contains four types of data: 'Subscription Data', 'Policy Data', 'Structured Data for exposure', and 'Application Data'.

**Figure 4.2.5-2: Data Storage Architecture**

NOTE 5: There can be multiple UDRs deployed in the network, each of which can accommodate different data sets or subsets, (e.g. subscription data, subscription policy data, data for exposure, application data) and/or serve different sets of NFs. Deployments where a UDR serves a single NF and stores its data, and, thus, can be integrated with this NF, can be possible.

NOTE 6: The internal structure of the UDR in figure 4.2.5-2 is shown for information only.

The Nudr interface is defined for the network functions (i.e. NF Service Consumers), such as UDM, PCF and NEF, to access a particular set of the data stored and to read, update (including add, modify), delete, and subscribe to notification of relevant data changes in the UDR.

Each NF Service Consumer accessing the UDR, via Nudr, shall be able to add, modify, update or delete only the data it is authorised to change. This authorisation shall be performed by the UDR on a per data set and NF service consumer basis and potentially on a per UE, subscription granularity.

The following data in the UDR sets exposed via Nudr to the respective NF service consumer and stored shall be standardized:

- Subscription Data,
- Policy Data,
- Structured Data for exposure,
- Application data: Packet Flow Descriptions (PFDs) for application detection and AF request information for multiple UEs, as defined in clause 5.6.7.

The service based Nudr interface defines the content and format/encoding of the 3GPP defined information elements exposed by the data sets.

In addition, it shall be possible to access operator specific data sets by the NF Service Consumers from the UDR as well as operator specific data for each data set.

NOTE 7: The content and format/encoding of operator specific data and operator specific data sets are not subject to standardization.

NOTE 8: The organization of the different data stored in the UDR is not to be standardized.

### 4.2.5a Radio Capabilities Signalling optimisation

Figure 4.2.5a-1 depicts the AMF to UCMF reference point and interface. Figure 4.2.5a-2 depicts the related interfaces in AMF and UCMF for the Radio Capabilities Signalling optimisation in the roaming architecture.

![Diagram of Radio Capability Signalling optimisation architecture showing the flow of information between UE, RAN, AMF, UCMF, NEF, and AF.](db7ae70402c81d140ae7df14b002e057_img.jpg)

```

graph TD
    UE[UE] -- N1 --> AMF[AMF]
    RAN[RAN] -- N2 --> AMF
    AMF -- N55 --> UCMF[UCMF]
    UCMF -- N56 --> NEF[NEF]
    UCMF -- N57 --> AF[AF]
    NEF -- N33 --> AF
  
```

The diagram illustrates the Radio Capability Signalling optimisation architecture. At the bottom left, a UE (User Equipment) is connected to a RAN (Radio Access Network) via the N1 interface. The RAN is connected to an AMF (Access and Management Function) via the N2 interface. The AMF is connected to a UCMF (User Context Management Function) via the N55 interface. The UCMF is connected to both a NEF (Network Exposure Function) via the N56 interface and an AF (Application Function) via the N57 interface. Finally, the NEF is connected to the AF via the N33 interface.

Diagram of Radio Capability Signalling optimisation architecture showing the flow of information between UE, RAN, AMF, UCMF, NEF, and AF.

Figure 4.2.5a-1: Radio Capability Signalling optimisation architecture

![Diagram of Roaming architecture for Radio Capability Signalling optimisation. The diagram shows a UE connected to a RAN in the VPLMN. The RAN is connected to an AMF in the HPLMN via an N2 interface. The AMF is connected to a UCMF in the HPLMN via an N1 interface. The UCMF is connected to an NEF in the VPLMN via an Nucmf interface. The NEF is connected to an AF in the VPLMN via an Nnef interface. The AF is connected to the AMF via an Naf interface. A dashed vertical line separates the VPLMN (left) and HPLMN (right).](9c1d3678db4a12d5864cb2a4def1135d_img.jpg)

```

graph TD
    subgraph VPLMN
        UE[UE] --- RAN[RAN]
        RAN --- AMF[AMF]
        AMF --- UCMF[UCMF]
        UCMF --- NEF[NEF]
        NEF --- AF[AF]
    end
    subgraph HPLMN
        AMF --- N1((N1))
        N1 --- UCMF
    end
    AF --- Naf((Naf))
    Naf --- AMF
    UCMF --- Nucmf((Nucmf))
    Nucmf --- NEF
    NEF --- Nnef((Nnef))
    Nnef --- AF
    RAN --- N2((N2))
    N2 --- AMF
  
```

Diagram of Roaming architecture for Radio Capability Signalling optimisation. The diagram shows a UE connected to a RAN in the VPLMN. The RAN is connected to an AMF in the HPLMN via an N2 interface. The AMF is connected to a UCMF in the HPLMN via an N1 interface. The UCMF is connected to an NEF in the VPLMN via an Nucmf interface. The NEF is connected to an AF in the VPLMN via an Nnef interface. The AF is connected to the AMF via an Naf interface. A dashed vertical line separates the VPLMN (left) and HPLMN (right).

NOTE: The AF in the VPLMN (i.e. the one having a relationship with the VPLMN NEF) is the one which provisions Manufacturer Assigned UE radio capability IDs in the VPLMN UCMF. RACS is a serving PLMN only feature (it requires no specific support in the roaming agreement with the UE HPLMN to operate).

**Figure 4.2.5a-2: Roaming architecture for Radio Capability Signalling optimisation**

### 4.2.6 Service-based interfaces

The 5G System Architecture contains the following service-based interfaces:

- Namf:** Service-based interface exhibited by AMF.
- Nsmf:** Service-based interface exhibited by SMF.
- Nnef:** Service-based interface exhibited by NEF.
- Npcf:** Service-based interface exhibited by PCF.
- Nudm:** Service-based interface exhibited by UDM.
- Naf:** Service-based interface exhibited by AF.
- Nnrf:** Service-based interface exhibited by NRF.
- Nnsacf:** Service-based interface exhibited by NSACF.
- NnssAAF:** Service-based interface exhibited by NSSAAF.
- Nnssf:** Service-based interface exhibited by NSSF.
- Nausf:** Service-based interface exhibited by AUSF.
- Nudr:** Service-based interface exhibited by UDR.
- Nudsf:** Service-based interface exhibited by UDSF.
- N5g-eir:** Service-based interface exhibited by 5G-EIR.
- Nnwdaf:** Service-based interface exhibited by NWDAF.
- Nchf:** Service-based interface exhibited by CHF.
- Nucmf:** Service-based interface exhibited by UCMF.
- Ndccf:** Service based interface exhibited by DCCF.
- NmfaF:** Service based interface exhibited by MFAF.
- Nadrf:** Service based interface exhibited by ADRF.

**Naanf:** Service-based interface exhibited by AANF.

NOTE 1: The Service-based interface exhibited by AANF is defined in TS 33.535 [124].

**N5g-ddnmf:** Service-based interface exhibited by 5G DDNMF.

**Nmbsmf:** Service-based interface exhibited by MB-SMF.

**Nmbssf:** Service-based interface exhibited by MBSF.

NOTE 2: The Service-based interfaces exhibited by MB-SMF and MBSF are defined in TS 23.247 [129].

**Ntctssf:** Service-based interface exhibited by TSCTSF.

**Nbsp:** Service-based interface exhibited by an SBI capable Boostrapping Server Function in GBA.

NOTE 2: The Service-based interfaces exhibited by an SBI capable Boostrapping Server Function are defined in TS 33.220 [140] and TS 33.223 [141].

**Neasdf:** Service-based interface exhibited by EASDF.

NOTE 3: The Service-based in
