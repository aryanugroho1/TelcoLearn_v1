---
topic_key: oran_wg1_oad_architecture
title: O-RAN WG1 Architecture Description (OAD) (SMO, Non-RT RIC, Near-RT RIC, O-CU, O-DU, O-RU)
source_vendor: o_ran
doc_type: specification
technology: o_ran
category: o_ran
keywords: o-ran architecture, oad, wg1, smo, non-rt ric, near-rt ric, o-cu, o-du, o-ru, a1 interface, o1 interface, e2 interface, open fronthaul, 7.2x
summary: Salinan spesifikasi resmi O-RAN WG1 (O-RAN.WG1.TS.OAD-R005-v16.00) dari repositori GSMA/oran Open-Telco Corpus.
---

# 1 Scope

This Technical Specification has been produced by the O-RAN ALLIANCE.

The present document

- specifies: the overall architecture of O-RAN.
- describes: the O-RAN architecture elements and relevant interfaces that connect them.

# 2 References

## 2.1 Normative references

References are either specific (identified by date of publication and/or edition number or version number) or non-specific. For specific references, only the cited version applies. For non-specific references, the latest version of the referenced document (including any amendments) applies. In the case of a reference to a 3GPP document, a non-specific reference implicitly refers to the latest version of that document in Release 18, or the latest 3GPP release prior to Release 18 that includes that document.

NOTE: While any hyperlinks included in this clause were valid at the time of publication, O-RAN cannot guarantee their long-term validity.

The following referenced documents are necessary for the application of the present document.

- [1] 3GPP TS 23.501: "System Architecture for the 5G System (5GS); Stage 2".
- [2] 3GPP TS 28.622: "Generic Network Resource Model (NRM); Stage 2".
- [3] 3GPP TS 32.101: "Technical Specification Group Services and System Aspects; Telecommunication management; Principles and high level requirements".
- [4] 3GPP TS 36.401: "Evolved Universal Terrestrial Radio Access Network (E-UTRAN); Architecture Description".
- [5] 3GPP TS 36.413: "Evolved Universal Terrestrial Radio Access Network (E-UTRAN); S1 Application Protocol (S1AP)".
- [6] 3GPP TS 36.420: "Evolved Universal Terrestrial Radio Access Network (E-UTRAN); X2 general aspects and principles".
- [7] 3GPP TS 36.423: "LTE; Evolved Universal Terrestrial Radio Access Network (E-UTRAN); X2 Application Protocol (X2AP)".
- [8] 3GPP TS 38.300 "NR; NR and NG-RAN Overall Description; Stage 2".
- [9] 3GPP TS 38.331: "5G; NR; Radio Resource Control (RRC); Protocol specification".
- [10] 3GPP TS 38.401: "NG-RAN; Architecture description".
- [11] 3GPP TS 38.413: "5G; NG-RAN; NG Application Protocol (NGAP)".
- [12] 3GPP TS 38.420: "NG-RAN; Xn general aspects and principles".
- [13] 3GPP TS 38.423: "5G; NG-RAN; Xn Application Protocol (XnAP)".
- [14] 3GPP TS 38.460: "NG-RAN; E1 general aspects and principles".
- [15] 3GPP TS 38.463: "5G; NG-RAN; E1 Application Protocol (E1AP)".
- [16] 3GPP TS 38.470: "NG-RAN; F1 general aspects and principles".
- [17] 3GPP TS 38.473: "5G; NG-RAN; F1 Application Protocol (F1AP)".
- [18] O-RAN.WG2.TS.A1GAP: "O-RAN A1 interface: General Aspects and Principles" ("A1GAP").

- [19] O-RAN.WG4.TS.CUS.0: "O-RAN Control, User and Synchronization Plane Specification" ("Open FH CUS-Plane").
- [20] O-RAN.WG4.CTI-TCP.0: "O-RAN Cooperative Transport Interface; Transport Control Plane Specification" ("CTI Control").
- [21] O-RAN.WG4.CTI-TMP.0: "O-RAN Cooperative Transport Interface; Transport Management Plane Specification" ("CTI Management").
- [22] O-RAN.WG3.TS.E2GAP: "O-RAN E2 General Aspects and Principles (E2GAP)".
- [23] O-RAN.WG7.IPC-HRD-Opt8.0: "O-RAN Hardware Reference Design Specification for Indoor Picocell (FR1) with Split Architecture Option 8".
- [24] O-RAN.WG4.TS.MP-0: "O-RAN Management Plane Specification" ("Open FH M-Plane").
- [25] O-RAN.WG3.TS.E2SM: "O-RAN E2 Service Model (E2SM)".
- [26] O-RAN.WG3.TS.RICARCH: "O-RAN Near-RT RIC Architecture".
- [27] O-RAN.WG2.TS.Non-RT-RIC-ARCH: "O-RAN Non-RT RIC: Architecture".
- [28] O-RAN.WG6.O-Cloud Notification API: "O-RAN O-Cloud Notification API Specification for Event Consumers".
- [29] O-RAN.WG6.AAL-GAnP: "O-RAN Acceleration Abstraction Layer General Aspects and Principles" ("AALGAP").
- [30] O-RAN.WG10.TS.Information Model and Data Models: "O-RAN Information Model and Data Models Specification & YANG Models".
- [31] O-RAN.WG10.TS.O1-Interface: "O-RAN O1 Interface Specification" ("OAM Interface").
- [32] O-RAN.WG11.TS.SecTestSpecs.0: "O-RAN Security Test Specifications".
- [33] O-RAN.WG6.TS.O2-GA&P: "O-RAN O2 Interface General Aspects and Principles" ("O2GAP").
- [34] O-RAN.WG10.TS.OAM-Architecture: "O-RAN Operations and Maintenance Architecture" ("OAM Architecture").
- [35] O-RAN.WG2.TS.R1GAP: "O-RAN R1 Interface: General Aspects and Principles" ("R1GAP").
- [36] O-RAN.WG11.TS.SecProtSpec.0: "O-RAN Security Protocols Specifications".
- [37] O-RAN.WG11.TS.SRCS.0: "O-RAN Security Requirements and Control Specifications".
- [38] O-RAN.WG1.TS.Use-Cases-Detailed-Specification: "O-RAN Use Cases Detailed Specification".
- [39] O-RAN.WG3.TS.Y1GAP: "O-RAN Y1 interface: General Aspects and Principles" ("Y1GAP").
- [40] O-RAN.WG5.TS.D2GAP: "O-RAN D2 Interface: General Aspects and Principles" ("D2GAP").
- [41] 3GPP TS 37.340: "Evolved Universal Terrestrial Radio Access (E-UTRA) and NR; Multi-connectivity; Overall Description; Stage-2".
- [42] O-RAN.WG1.TS.SMOARCH: "SMO Architecture".

## 2.2 Informative references

References are either specific (identified by date of publication and/or edition number or version number) or non-specific. For specific references, only the cited version applies. For non-specific references, the latest version of the referenced document (including any amendments) applies. In the case of a reference to a 3GPP document, a non-specific reference implicitly refers to the latest version of that document in Release 18, or the latest 3GPP release prior to Release 18 that includes that document.

NOTE: While any hyperlinks included in this clause were valid at the time of publication, O-RAN cannot guarantee their long-term validity.

The following referenced documents are not necessary for the application of the present document, but they assist the user with regard to a particular subject area.

- [i.1] 3GPP TR 21.905: "Vocabulary for 3GPP Specifications".
- [i.2] 3GPP TR 38.801: "Study on new radio access technology: Radio access architecture and interfaces (Release 14)".
- [i.3] O-RAN.WG6.CADS: "O-RAN Cloud Architecture and Deployment Scenarios for O-RAN Virtualized RAN".
- [i.4] O-RAN.WG11.TR.Threat-Modeling.0: "O-RAN Security Threat Modeling and Risk Assessment".
- [i.5] O-RAN White Paper: "O-RAN: Towards an Open and Smart RAN", October 2018 ("O-RAN Whitepaper").
- [i.6] Rose, S., Borchert, O., Mitchell, S., and Connelly, S., NIST SP 800-207: "Zero-Trust Architecture", U.S. NIST, August 2020, <https://csrc.nist.gov/publications/detail/sp/800-207/final>.
- [i.7] Zero Trust Maturity Model, US DHS CISA, April 2023.

# --- 3 Definition of terms, symbols and abbreviations

## 3.1 Terms

For the purposes of the present document, the terms given in 3GPP TR 21.905 [i.1] and the following apply:

**E2 Node:** A logical node terminating E2 interface.

**Managed Element:** The definition of a Managed Element (ME) is given in 3GPP TS 28.622 [2], clause 4.3.3.

**Managed Function:** The definition of a Managed Function (MF) is given in 3GPP TS 28.622 [2], clause 4.3.4.

**Near-Real-Time RAN Intelligent Controller:** An O-RAN Network Function (NF) comprised of the Near-RT RIC platform and Near-RT RIC Applications (xApps).

**Near-RT RIC APIs:** A set of service-based interfaces that can be produced and consumed by the Near-RT RIC Platform and xApps.

NOTE: Please refer to Near-RT RIC Architecture [26] for more information.

**Near-RT RIC platform:** Platform supporting A1, E2, Y1 and O1 interfaces and providing a set of services via Near-RT RIC APIs needed for xApp functionality.

**Non-Real-Time RAN Intelligent Controller:** A functionality within Service Management and Orchestration (SMO) comprised of the Non-RT RIC Framework and the Non-RT RIC Applications (rApps) that manages the content carried across the A1 interface.

NOTE: Please refer to Non-RT RIC: Architecture [27] for more information.

**Non-RT RIC Framework:** A functionality within the Non-RT RIC that logically terminates the A1 interface and provides support for rApps, including the R1 services through the R1 interface.

**NMS:** A Network Management System for the O-RU as specified in Open FH M-Plane [24] to support legacy Open Fronthaul M-Plane deployments (prior to version 5 of Open FH M-Plane [24]).

**O-Cloud:** Cloud platform that provides O-RAN standardized interfaces, hosting O-RAN defined software components.

NOTE: Please refer to Cloud Architecture and Deployment Scenarios for O-RAN Virtualized RAN [i.3] for more information.

**O-eNB:** An O-RAN eNB as specified in 3GPP TS 36.401 [4] or O-RAN ng-eNB as specified in 3GPP TS 38.300 [8].

NOTE: Please refer to clause 5.3.7 for more information.

**O-RAN Central Unit – Control Plane:** A logical node hosting the RRC and the control plane part of the PDCP protocol.

NOTE: Please refer to clause 5.3.3 for more information.

**O-RAN Central Unit – User Plane:** A logical node hosting the user plane part of the PDCP protocol and the SDAP protocol.

NOTE: Please refer to clause 5.3.4 for more information.

**O-RAN Distributed Unit:** A logical node hosting RLC/MAC/High-PHY layers based on a lower layer functional split.

NOTE: Please refer to clause 5.3.5 for more information.

**O-RAN Network Function:** A network function with O-RAN defined behaviors and interfaces, which can also inherit and/or extend defined behaviors and interfaces of a Network Function defined in 3GPP TS 23.501 [1].

**O-RAN node:** Same as an O-RAN NF.

**O-RAN Radio Unit:** A logical node hosting Low-PHY layer and RF processing based on a lower layer functional split. This is similar to 3GPP's "TRP" or "RRH" but more specific in including the Low-PHY layer (FFT/iFFT, PRACH extraction).

NOTE: Please refer to clause 5.3.6 for more information.

**O1:** Interface used by the SMO framework, as specified in clause 5.3.1, for operation and management of O-RAN NFs as specified in OAM Interface [31].

**O2:** Interface between SMO framework as specified in clause 5.3.1 and the O-Cloud.

NOTE: Please refer to O2GAP [33] for more information.

**Open Fronthaul M-Plane:** Management interface controlling the O-RU, generally driven from the O-DU but in the case of the hybrid topology also driven from the SMO.

NOTE: Please refer to Open FH M-Plane [24] for more details.

**PCell O-DU:** O-DU where SpCell (Special Cell as defined in 3GPP TS 37.340 [41]) is configured for a particular UE for supporting inter O-DU carrier aggregation.

**rApp:** Modular application that consumes and/or produces non real time management and automation services.

**R1:** A service-based interface between the rApps and the R1 Termination via which R1 services can be produced and consumed.

NOTE: Please refer to R1GAP [35] for more information.

**R1 Services:** The SMOS capabilities available for consumption by rApps, and the capabilities produced by rApps, that are accessible via the R1 interface.

**SCell O-DU:** O-DU where SCell (Secondary Cell as defined in 3GPP TS 37.340 [41]) is configured for a particular UE for supporting inter O-DU carrier aggregation.

**SMO:** A Service Management and Orchestration framework (SMO framework).

NOTE: Please refer to clause 5.3.1 for more details.

**SMO External Interface:** The interface between the SMO and an SMO External System.

**SMO External System:** A data source outside the O-RAN domain that provides data to the SMO.

**SMO Functions (SMOFs):** Internal SMO entities which provide one or more SMO Services.

NOTE: An SMO Function exposes standardized interfaces which enable interoperability between SMO Functions.

**SMO Service (SMOS):** Standardized cohesive set of management, orchestration and automation capabilities offered by an SMO Function.

**xApp:** An application consuming and/or producing Near-RT RIC services via the Near-RT RIC API to provide value added control of, or guidance to the E2 Nodes.

**Y1:** An interface over which RAN analytics services are exposed by the Near-RT RIC to be consumed by Y1 consumers.

**Y1 consumers:** A role played by entities within or outside of the PLMN trust domain that consumes the Y1 services produced by the Near-RT RIC.

## 3.2 Symbols

Void

## 3.3 Abbreviations

For the purposes of the present document, the abbreviations given in 3GPP TR 21.905 [i.1] and the following apply:

|         |                                                         |
|---------|---------------------------------------------------------|
| 4G      | 4th Generation of mobile communications                 |
| 5G      | 5th Generation of mobile communications                 |
| 3GPP    | 3rd Generation Partnership Project                      |
| 5GC     | 5G Core                                                 |
| 5GS     | 5G System                                               |
| AAL     | Accelerator Abstraction Layer                           |
| API     | Application Programming Interface                       |
| AI      | Artificial Intelligence                                 |
| AMF     | Access and Mobility Functions                           |
| CA      | Carrier Aggregation                                     |
| CM      | Configuration Management                                |
| CMTS    | Cable Modem Termination System                          |
| CP      | Control Plane                                           |
| CSP     | Communications Service Provider                         |
| CTI     | Cooperative Transport Interface                         |
| CUS     | Control User Synchronization                            |
| DC      | Dual Connectivity                                       |
| DOCSIS  | Data Over Cable Service Interface Specification         |
| DM      | Data Model                                              |
| DME     | Data Management and Exposure                            |
| DTLS    | Datagram Transport Layer Security                       |
| E-UTRA  | Evolved Universal Terrestrial Radio Access              |
| E-UTRAN | Evolved Universal Terrestrial Radio Access Network      |
| EN-DC   | E-UTRAN New Radio – Dual Connectivity                   |
| eNB     | evolved Node B                                          |
| EPC     | Evolved Packet Core                                     |
| FCAPS   | Fault, Configuration, Accounting, Performance, Security |
| FFT     | Fast Fourier Transform                                  |
| FHGW    | Fronthaul Gateway                                       |
| FHM     | Fronthaul Multiplexer                                   |
| FM      | Fault Management                                        |
| gNB     | next generation Node B                                  |

|             |                                                |
|-------------|------------------------------------------------|
| gNB-CU      | gNB Central Unit                               |
| gNB-DU      | gNB Distributed Unit                           |
| GUAMI       | Globally Unique AMF Identifier                 |
| GUMMEI      | Globally Unique MME Identifier                 |
| HARQ        | Hybrid Automatic Repeat Request                |
| ID          | Identifier                                     |
| iFFT        | inverse Fast Fourier Transform                 |
| IM          | Information Model                              |
| IPSec       | Internet Protocol Security                     |
| LLS         | Lower Layer Split                              |
| LTE         | Long Term Evolution                            |
| MAC         | Media Access Control                           |
| ME          | Managed Element                                |
| MeNB        | Master eNB                                     |
| MF          | Managed Function                               |
| ML          | Machine Learning                               |
| MME         | Mobility Management Entity                     |
| Near-RT RIC | Near-Real-Time RAN Intelligent Controller      |
| NETCONF     | Network Configuration Protocol                 |
| NF          | Network Function                               |
| NG          | Next Generation                                |
| NG-RAN      | Next Generation RAN                            |
| NGAP        | Next Generation Application Protocol           |
| NIST        | National Institute of Standards and Technology |
| NMS         | Network Management System                      |
| Non-RT RIC  | Non-Real-Time RAN Intelligent Controller       |
| NR          | 5G New Radio                                   |
| O-Cloud     | O-RAN Cloud                                    |
| O-CU-CP     | O-RAN Central Unit – Control Plane.            |
| O-CU-UP     | O-RAN Central Unit – User Plane                |
| O-DU        | O-RAN Distributed Unit                         |
| O-eNB       | O-RAN eNB                                      |
| O-RU        | O-RAN Radio Unit                               |
| OAM         | Operations, Administration and Maintenance     |
| OLT         | Optical Line Terminal                          |
| ONU         | Optical Network Unit                           |
| Open FH     | Open Fronthaul                                 |
| PDCP        | Packet Data Convergence Protocol               |

|       |                                               |
|-------|-----------------------------------------------|
| PHY   | Physical layer                                |
| PKI   | Public Key Infrastructure                     |
| PKIX  | Public Key Infrastructure (X.509)             |
| PM    | Performance Management                        |
| PNF   | Physical Network Function                     |
| PON   | Passive Optical Network                       |
| PRACH | Physical Random Access Channel                |
| PTP   | Precision Time Protocol                       |
| RAN   | Radio Access Network                          |
| rApp  | Non-RT RIC Application                        |
| RIC   | RAN Intelligent Controller                    |
| RF    | Radio Frequency                               |
| RLC   | Radio Link Control                            |
| RRC   | Radio Resource Control                        |
| RRH   | Remote Radio Head                             |
| RRU   | Remote Radio Unit                             |
| RT    | Real Time                                     |
| RU    | Radio Unit                                    |
| SBA   | Service Based Architecture                    |
| SBOM  | Software Bill of Materials                    |
| SDAP  | Service Data Adaptation Protocol              |
| SME   | Service Management and Exposure               |
| SMO   | Service Management and Orchestration          |
| SMOF  | Service Management and Orchestration Function |
| SMOS  | Service Management and Orchestration Service  |
| SRB   | Signalling Radio Bearer                       |
| SSHv2 | Secure Shell 2.0                              |
| TLS   | Transport Layer Security                      |
| TN    | Transport Node                                |
| TR    | Technical Report                              |
| TRP   | Transmission and Reception Point              |
| TS    | Technical Specification                       |
| TU    | Transport Unit                                |
| UE    | User Equipment                                |
| UL    | Up Link                                       |
| UP    | User Plane                                    |
| UPF   | User Plane Function                           |
| WG    | Working Group                                 |

|      |                         |
|------|-------------------------|
| xApp | Near-RT RIC Application |
| X2AP | X2 Application Protocol |
| XnAP | Xn Application Protocol |
| ZTA  | Zero Trust Architecture |

# 4 General O-RAN architecture principles

This clause contains the general O-RAN architecture principles as described below.

- The O-RAN architecture, interface specifications, and terminology shall be consistent with 3GPP architecture, interface specifications, and terminology with additions to accommodate O-RAN specific features.
- This document represents the O-RAN architecture at the time of its publication and may evolve as deemed appropriate by the O-RAN ALLIANCE.
- The O-RAN architecture includes a logical representation of a Radio Access Network (RAN) which extends the 3GPP specified RAN and consists of logical NFs or logical nodes (as per 3GPP TS 38.300 [8] and TR 21.905 [i.1]).

NOTE: Therefore, the terms O-RAN NFs as well as O-RAN nodes are used interchangeably to refer to some of the logical O-RAN entities, according to the context used in that particular statement. In any case, they always refer to a logical entity and not to a physical or cloudified instantiation of an O-RAN NF or an O-RAN node.

# 5 O-RAN architecture

## 5.1 Overall architecture of O-RAN

Figure 5.1-1 below provides a high-level view of the O-RAN architecture. It shows that the interfaces – A1, O1, Open Fronthaul M-plane and O2 – connecting SMO (Service Management and Orchestration) framework to O-RAN Network Functions and to O-Cloud. As depicted in this figure, the O-Cloud includes the O-Cloud Notification interface as specified in O-Cloud Notification API Specification for Event Consumers [28] is available for the relevant O-RAN Network Functions (i.e., Near-RT RIC, O-CU-CP, O-CU-UP and O-DU) to receive O-Cloud related notifications.

Figure 5.1-1 below also illustrates that the O-RAN Network Functions can be hosted on the O-Cloud or on customized hardware.

All O-RAN NFs, except O-RU, are managed via the O1 interface to an authorized SMO framework.

The O1 interface exposes management services for the O-RAN NFs that are managed individually or together, as specified in OAM Architecture[34].

The Open Fronthaul M-plane interface, between SMO and O-RU, supports the O-RU management in hybrid mode, as specified in Open FH M-Plane [24].

O-RAN NFs instantiated on the O-Cloud may utilize the APIs exposed by the Accelerator Abstraction Layer (AAL) defined in AALGAP [29].

The Near-RT RIC O-RAN NF in figure below provides RAN analytics information services via the Y1 service interface as specified in Y1GAP [39]. These services can be consumed by Y1 consumers after mutual authentication and authorization by subscribing to or requesting the RAN analytics information via the Y1 service interface. Y1 consumers role can be played by entities which are within an PLMN trusted domain. Y1 consumers outside the PLMN trusted domain may use Y1 services in a secure manner via an exposure function, e.g., as in 3GPP TS 23.501 [1], clause 5.20. The framework for mutual authentication and authorization between Y1 consumers and the Near-RT RIC is not supported in the present document.

![High Level Architecture of O-RAN diagram showing Service Management and Orchestration framework, Non-RT RIC, Near-RT RIC, O-RAN Network Functions, O-Cloud, O-RU, Y1 consumers, and 5GC with various interfaces like O2, A1, O1, Open Fronthaul M-Plane, O-Cloud Notification, and NG.](eefe19c5e14dc4d6c316b7f7fbb7d7d7_img.jpg)

The diagram illustrates the high-level architecture of O-RAN. At the top is the **Service Management and Orchestration framework** (SMO), which contains the **Non-RT RIC**. An **External system providing enrichment data to the SMO** is connected to the SMO. Below the SMO is the **Near-RT RIC**, which is part of the **O-RAN Network Functions**. The Near-RT RIC connects to the **O-Cloud** via the **O-Cloud Notification** interface. The O-Cloud is connected to the **O-RU**. The O-RU connects to the **5GC** via the **NG** interface. The O-RU also connects to the **Open Fronthaul M-Plane**, which is connected to the **Near-RT RIC**. The Near-RT RIC connects to the **Y1 consumers** via the **Y1** interface. The O-RAN defined interfaces are labeled as **O2** (between SMO and Near-RT RIC), **A1** (between SMO and Near-RT RIC), and **O1** (between SMO and O-RAN Network Functions). A legend indicates that purple lines represent O-RAN Defined Interfaces, orange lines represent 3GPP Defined Interfaces, and black lines represent Interfaces out of scope for O-RAN.

High Level Architecture of O-RAN diagram showing Service Management and Orchestration framework, Non-RT RIC, Near-RT RIC, O-RAN Network Functions, O-Cloud, O-RU, Y1 consumers, and 5GC with various interfaces like O2, A1, O1, Open Fronthaul M-Plane, O-Cloud Notification, and NG.

**Figure 5.1-1: High Level Architecture of O-RAN**

Within the logical architecture of O-RAN, as shown in Figure 5.1-2 below, the radio side includes Near-RT RIC, O-CU-CP, O-CU-UP, O-DU, and O-RU O-RAN NFs. The E2 interface connects O-eNB to Near-RT RIC. Although not shown in this figure, the O-eNB does support O-DU and O-RU O-RAN NFs with an Open Fronthaul interface between them. The Near-RT RIC, in the figure below, supports the Y1 service interface towards Y1 consumers. Y1 consumers, unlike the other network elements shown in this figure, does not denote a logical O-RAN function.

As stated earlier, the management side includes SMO Framework containing a Non-RT-RIC function. The O-Cloud, on the other hand, is a cloud computing platform comprising a collection of physical infrastructure nodes that meet O-RAN requirements to host the relevant O-RAN NFs (such as Near-RT RIC, O-CU-CP, O-CU-UP, and O-DU etc.), the supporting software components (such as Operating System, Virtual Machine Monitor, Container Runtime, etc.) and the appropriate management and orchestration functions. The virtualization of O-RU is not supported in the present document.

As shown in this figure, the O-RU provides the Open Fronthaul M-Plane interface to authorized O-DU in hierarchical mode, or to authorized O-DU and SMO in hybrid mode as specified in Open FH M-Plane [24] and OAM Architecture [34].

NOTE: The LLS (O-DU to O-RU interface) specified in clauses 5.3.5 and 5.3.6 (Split Option 7-2x) is the Open Fronthaul interface described in the Open FH CUS-Plane [19]. Other LLS options specified in 3GPP TR 38.801 [i.2] may be considered for reference designs when the relevant interfaces are described in specifications created by related open industry initiatives (e.g., the Small Cell Forum for Split Option 6) or in O-RAN white-box hardware specifications (e.g., Split Option 8).

As shown in Figure 5.1-2, O-DU provides D2 interface to connect with peer O-DU for supporting inter O-DU carrier aggregation. The D2 interface includes D2-u and D2-c services.

![Figure 5.1-2: Logical Architecture of O-RAN. This diagram shows the logical architecture of O-RAN. At the top is the Service Management and Orchestration framework, which contains the Non-Real Time RIC. Below it is the Near-Real Time RIC. To the left is the O-eNB. To the right are the O-CU-CP and O-CU-UP. Below the O-CU-CP and O-CU-UP is the O-DU. Below the O-DU is the O-RU. At the bottom is the O-Cloud. Interfaces are shown between these components: O1, O2, A1, Y1, E2, X2-c, X2-u, NG-u, Xn-c, NG-c, F1-c, F1-u, D2, Open FH M-Plane, and Open FH CUS-Plane. A legend indicates that solid lines represent 3GPP interfaces and green lines represent O-RAN interfaces.](4ee27dbf5ef12e7b58b0ef0937bc5a5e_img.jpg)

Figure 5.1-2: Logical Architecture of O-RAN. This diagram shows the logical architecture of O-RAN. At the top is the Service Management and Orchestration framework, which contains the Non-Real Time RIC. Below it is the Near-Real Time RIC. To the left is the O-eNB. To the right are the O-CU-CP and O-CU-UP. Below the O-CU-CP and O-CU-UP is the O-DU. Below the O-DU is the O-RU. At the bottom is the O-Cloud. Interfaces are shown between these components: O1, O2, A1, Y1, E2, X2-c, X2-u, NG-u, Xn-c, NG-c, F1-c, F1-u, D2, Open FH M-Plane, and Open FH CUS-Plane. A legend indicates that solid lines represent 3GPP interfaces and green lines represent O-RAN interfaces.

Figure 5.1-2: Logical Architecture of O-RAN

The following figure shows the Uu interface between UE and O-RAN NFs as well as between UE and O-eNB. As shown in Figure 5.1-3 below, the dotted box denotes all the O-RAN NFs required to support the Uu interface for NR. The O-eNB, on the other hand, terminates the Uu interface for LTE. Please refer to clause 5.4.17 for more details.

![Figure 5.1-3: Uu interface for O-RAN Network Functions and O-eNB. This diagram shows the Uu interface for O-RAN Network Functions and O-eNB. It includes the Service Management and Orchestration framework, Non-Real Time RIC, Near-RT RIC, O-eNB, O-CU-CP, O-CU-UP, O-DU, O-RU, and O-Cloud. A dotted box encloses the O-CU-CP, O-CU-UP, O-DU, and O-RU, indicating they are required to support the Uu interface for NR. The O-eNB is shown outside the dotted box, terminating the Uu interface for LTE. Interfaces shown include O1, O2, A1, Y1, E2, X2-c, X2-u, NG-u, Xn-c, NG-c, F1-c, F1-u, D2, Open FH M-Plane, and Open FH CUS-Plane. A legend indicates that solid lines represent 3GPP interfaces and green lines represent O-RAN interfaces.](a26e142d3df5bef41a84a9dd099d7825_img.jpg)

Figure 5.1-3: Uu interface for O-RAN Network Functions and O-eNB. This diagram shows the Uu interface for O-RAN Network Functions and O-eNB. It includes the Service Management and Orchestration framework, Non-Real Time RIC, Near-RT RIC, O-eNB, O-CU-CP, O-CU-UP, O-DU, O-RU, and O-Cloud. A dotted box encloses the O-CU-CP, O-CU-UP, O-DU, and O-RU, indicating they are required to support the Uu interface for NR. The O-eNB is shown outside the dotted box, terminating the Uu interface for LTE. Interfaces shown include O1, O2, A1, Y1, E2, X2-c, X2-u, NG-u, Xn-c, NG-c, F1-c, F1-u, D2, Open FH M-Plane, and Open FH CUS-Plane. A legend indicates that solid lines represent 3GPP interfaces and green lines represent O-RAN interfaces.

Figure 5.1-3: Uu interface for O-RAN Network Functions and O-eNB

## 5.2 O-RAN control loops

The O-RAN architecture supports at least the following control loops involving different O-RAN functionalities:

- Non-RT (Non-Real Time) control loops
- Near-RT (Near-Real Time) control loops
- RT (Real Time) control loops

![Figure 5.2-1: O-RAN Control Loops diagram showing the hierarchy of control loops from Non-RT to RT across various O-RAN entities like SMO, RIC, O-eNB, O-CU-CP, O-CU-UP, O-DU, O-RU, and O-Cloud. It includes timing ranges and interface legends.](7efae06af3af43ffe5d4b956a679cf54_img.jpg)

The diagram illustrates the O-RAN control loop hierarchy. At the top is the **Service Management and Orchestration framework** (SMO), which contains the **Non-RT RIC**. Below it is the **Near-RT RIC**, which connects to **O-eNB**, **O-CU-CP**, and **O-CU-UP**. The **O-CU-CP** connects to **O-DU**, which in turn connects to **O-RU** and **O-Cloud**. The **O-CU-UP** connects to various external interfaces: X2-c, X2-u, NG-u, Xn-c, NG-c, and F1-u. The **Open FH M-Plane** and **Open FH CUS-Plane** are also shown. A legend indicates that green lines represent O-RAN interfaces and black lines represent 3GPP interfaces. Control loops are categorized by timing: Non-RT (>= ~1 s), Near-RT (>= ~10 ms < ~1 s), and RT (< ~10 ms). The **Y1 consumers** block is also shown.

Figure 5.2-1: O-RAN Control Loops diagram showing the hierarchy of control loops from Non-RT to RT across various O-RAN entities like SMO, RIC, O-eNB, O-CU-CP, O-CU-UP, O-DU, O-RU, and O-Cloud. It includes timing ranges and interface legends.

Figure 5.2-1: O-RAN Control Loops

As shown in Figure 5.2-1 above, the control loops are defined based on the controlling entity and the architecture shows the other logical entities with which the control loop host interacts.

Control loops exist at various levels and run simultaneously. Depending on the use case, they may or may not interact with each other. The use cases for the Non-RT and Near-RT control loops and the interaction between the RICs for these use cases are fully defined by O-RAN Use Cases Detailed Specification [38]. The Use Cases Detailed Specification [38] also defines relevant interaction for the O-CU-CP and O-DU control loops, responsible for call control and mobility, radio scheduling, HARQ, beamforming etc. along with slower mechanisms involving SMO management interfaces.

The timing of these control loops is use case dependent. Typical execution time for use cases involving the Non-RT control loops are 1 second or more; Near-RT control loops are in the order of 10 milliseconds or more; control loops in the E2 Nodes can operate below 10 milliseconds. (e.g., O-DU radio scheduling).

For any specific use case, however, a stable solution would require the loop time in the Non-RT RIC and/or SMO management plane processes to be significantly longer than the loop time for the same use case in the control entities stated above.

## 5.3 Description of O-RAN architecture elements

### 5.3.1 Service Management and Orchestration framework

#### 5.3.1.1 Service Management and Orchestration framework architecture principles

Service Management and Orchestration (SMO) and Service Management and Orchestration framework (SMO framework) have been used interchangeably in this document.

Service Based Architecture (SBA) introduces the roles of service producer and service consumer together with standardized service-based interfaces. These standardized service-based interfaces enable interoperability within the SMO. SBA is not

concerned with the implementation, but it defines logical functions in their service producer and consumer roles. When properly applied the SBA approach can enable the following:

- Validates produced services with consumer use cases.
- Identifies service operations with their information model defining semantic behaviour.
- Specifies the API and a data model for a syntactic interface.
- Identifies common services that can be produced by a single producer such as those that are commonly used by multiple internal consumers (e.g., authentication, authorization, service registration and discovery, data management, etc.).

A service-based SMO architecture is specified in SMO Architecture [42].

#### 5.3.1.2 SMO Services (SMOSs)

##### 5.3.1.2.1 Introduction to SMO Services

In the O-RAN architecture, SMO is responsible for RAN domain management. Following the SBA principles above, the SMO Services produced by the SMO are defined. A SMOF implementation can produce and/or consume any combinations of one or more SMOSs, provided that the SMOF complies with the O-RAN specifications of the interfaces exposing the SMOSs.

The definition of SMOFs is in general not in scope of the O-RAN specifications, as the interoperable functional behaviour of SMOFs is specified via the SMOS Producer/Consumer roles.

The SMO Services produced by the SMO include those listed below.

- RAN NF OAM SMOS
- Network Functions Orchestration (NFO) SMOS
- Federated O-Cloud Orchestration and Management (FOCOM) SMOS
- Service Management and Exposure (SME) SMOS
- Data Management and Exposure (DME) SMOS
- Topology Exposure and Inventory Management (TE&IV) SMOS
- RAN Analytics SMOS
- Service and Slice Subnet Orchestration (SO) SMOS
- Service and Slice Subnet Assurance (SA) SMOS
- AI/ML workflow (AIMLWF) SMOS
- rApp Management SMOS
- AI Related SMOS
- Software Package Onboarding SMOS
- Policy Management and Information (PMI) SMOS

A representative overview of the SMO architecture is provided in Figure 5.3.1.2.1-1 below. Descriptions of the capabilities of each SMOS, and a representation of the SMOSs in a service-based SMO architecture diagram, are provided in SMO Architecture [42]. SMO communication with other O-RAN architectural elements, with external service consumers and/or producers, and with external data consumers and/or producers, is also described in SMO Architecture [42].

![Service Management and Orchestration framework diagram showing the hierarchy of the SMO, Non-RT RIC, rApps, R1 Termination, and SMOS components with their service consumption and production relationships.](2cde062fd82833415971a8bd1a2cafab_img.jpg)

The diagram illustrates the Service Management and Orchestration (SMO) framework. At the top, a box labeled 'Service Management and Orchestration framework' contains a 'Non-RT RIC' box. Inside the 'Non-RT RIC' box, there is an 'rApps' box connected to an 'R1 Termination' box via an 'R1' interface. Below the 'Non-RT RIC' box, there is a horizontal line representing the SMO boundary. Below this line, on the left, is an 'SMOS Producer/Consumer' box. On the right, another 'SMOS Producer/Consumer' box is shown. The 'R1 Termination' box is connected to the 'SMOS Producer/Consumer' box on the right. The 'SMOS Producer/Consumer' box on the left is connected to the 'R1 Termination' box. A legend at the bottom indicates that a small circle represents 'Consumption of services' and a larger circle represents 'Production of services'.

Service Management and Orchestration framework diagram showing the hierarchy of the SMO, Non-RT RIC, rApps, R1 Termination, and SMOS components with their service consumption and production relationships.

Figure 5.3.1.2.1-1: SMO architecture overview

##### 5.3.1.2.2 Service Management and Orchestration framework in the O-RAN architecture

The SMO consumes services offered by other O-RAN architecture elements through four key southbound interfaces:

- The A1 interface, which provides A1 policy management, A1 enrichment information and A1 ML model management between SMO and the Near-RT RIC to support RAN optimization.
- The O1 interface, which provides SMO FCAPS support either directly or indirectly between the SMO and the O-RAN Network Functions.
- In the hierarchical model, SMO FCAPS support information over O1 to the O-DU which uses the Open FH M-Plane interface to manage the O-RU.
- In the hybrid model, SMO provides FCAPS support information over Open FH M-Plane interface between the SMO and the O-RU and over O1 to the O-DU which uses the Open FH M-Plane interface to manage the O-RU.
- O2 interface between the SMO and the O-Cloud to provide O-Cloud resource management and workload management.

##### 5.3.1.2.3 Non-RT RIC

The Non-RT RIC supports intelligent RAN optimization control loops through rApps with intervals greater than 1 second.

Non-RT RIC is the functionality internal to the SMO that supports intelligent RAN optimization by:

- enabling the A1-Related SMOS to provide policy-based guidance over the A1 interface
- enabling the A1-Related SMOS to provide enrichment information over the A1 interface
- enabling the A1-Related SMOS to provide ML model management over the A1 interface
- enabling RAN optimization actions through the RAN NF OAM SMOS over O1 and Open FH M-Plane interfaces, and the NFO and FOCOM SMOSs over O2 interface

The rApps can be producers and/or consumers of R1 services, as shown in Figure 5.3.1.2.1-1. For more information on R1 services and the R1 interface refer to Non-RT RIC Architecture [27].

##### **5.3.1.2.4 SMO capabilities extensions**

As a flexible extension mechanism, the SMO allows delivery of aspects of RAN management and orchestration functionality via rApps.

##### **5.3.1.2.5 Void**

### **5.3.2 Near-RT RIC**

Near-RT RIC is an O-RAN NF that enables near real-time control and optimization of services and resources of E2 Nodes via fine-grained data collection and actions over the E2 interface with control loops in the order of 10 ms-1s. The Near-RT RIC hosts one or more xApps that use E2 interface to collect near real-time information (e.g., on a UE basis or a Cell basis) and provide value added services. The Near-RT RIC control over the E2 Nodes is steered via the policies and the enrichment data provided via A1 from the Non-RT RIC. Based on the available data, the Near-RT RIC generates the RAN analytics information and exposes it via Y1 interface.

The functional enhancement provided by the Near-RT RIC and the E2 Node is subject to the capability of the E2 Node exposed over the E2 interface by means of the E2SM [25], in order to support the use cases described in Use Cases Detailed Specification [38]. The E2 service model describes the functions in the E2 Node which may be controlled by the Near-RT RIC and the related procedures. For a function exposed in the E2SM [25], the Near-RT RIC may e.g., monitor, override, or control via policies the behavior of E2 Node.

In the event of a Near-RT RIC failure, the E2 Node shall be able to provide services but there may be an impact to certain optimization capabilities that are provided by the Near-RT RIC.

The Near-RT RIC is composed of a Near-RT RIC platform and one or more xApps as specified in Near-RT RIC Architecture [26] and their capabilities are exposed as services. Both the Near-RT RIC platform and an xApp can be a service producer and/or a service consumer, and these services can be accessed via the set of Near-RT RIC APIs as illustrated in Figure 5.3.2-1.

![Service-based representation of Near-RT RIC architecture showing xApps connected to a Near-RT RIC platform via Near-RT RIC API(s).](124c6108c63173818afb8ed49521e22d_img.jpg)

The diagram illustrates the service-based representation of the Near-RT RIC architecture. At the top, three overlapping rectangular boxes represent 'xApps'. Below them is a horizontal line labeled 'Near-RT RIC API(s)'. Each xApp is connected to this API line by a vertical line that includes a small circle with a dot, representing a service interface. Below the API line, another vertical line with a similar service interface connects to a rectangular box at the bottom labeled 'Near-RT RIC platform'.

Service-based representation of Near-RT RIC architecture showing xApps connected to a Near-RT RIC platform via Near-RT RIC API(s).

**Figure 5.3.2-1: Service-based representation of Near-RT RIC as specified in Near-RT RIC Architecture [26]**

### **5.3.3 O-CU-CP**

The O-CU-CP terminates the NG-c, X2-c, Xn-c, F1-c, and E1 interfaces as well as the RRC and PDCP (for SRB) protocols towards the UE as specified in 3GPP TS 38.401 [10].

The O-CU-CP terminates E2 interface to Near-RT RIC as specified in E2GAP [22].

The O-CU-CP is managed via O1 interface by the SMO as specified in OAM Architecture [34].

The O-CU-CP terminates NG-c interface to 5GC as specified in 3GPP TS 38.300 [8].

The O-CU-CP terminates X2-c interface to O-eNB (in case O-eNB is an O-RAN eNB), eNB, or to en-gNB in EN-DC as specified in 3GPP TS 36.420 [6] and 3GPP TS 38.300 [8].

The O-CU-CP terminates Xn-c to O-CU-UP, O-eNB (in case O-eNB is an O-RAN ng-eNB), gNB, or to ng-eNB as specified in 3GPP TS 38.300 [8] and 3GPP TS 38.420 [12].

### 5.3.4 O-CU-UP

The O-CU-UP terminates the NG-u, X2-u, S1-u, Xn-u, F1-u, and E1 interfaces as well as the PDCP and SDAP protocols towards the UE as specified in 3GPP TS 38.401 [10].

The O-CU-UP terminates E2 interface to Near-RT RIC as specified in E2GAP [22].

The O-CU-UP is managed via O1 interface by the SMO as specified in OAM Architecture [34].

The O-CU-UP terminates NG-u interface to 5GC as specified in 3GPP TS 38.300 [8].

The O-CU-UP terminates X2-u interface to O-eNB (in case O-eNB is an O-RAN eNB), eNB, or to en-gNB in EN-DC as specified in 3GPP TS 36.420 [6] and 3GPP TS 38.300 [8].

The O-CU-UP terminates Xn-u to O-CU-UP, O-eNB (in case O-eNB is an O-RAN ng-eNB), gNB, or to ng-eNB as specified in 3GPP TS 38.300 [8] and 3GPP TS 38.420 [12].

### 5.3.5 O-DU

The O-DU is an O-RAN NF in the O-RAN Architecture. An O-DU, combined with one or more O-RU(s) connected to it, supports and is fully compatible with the functions of a gNB-DU as defined by 3GPP TS 38.401 [10].

The O-DU may be implemented either by virtualized or non-virtualized methods.

The O-DU terminates the E2 and the F1 interface (according to the principles described in clause 5.4.9), and the Open Fronthaul interface (also known as LLS interface as specified in Open FH CUS-Plane [19]) as well as the RLC, MAC, and High-PHY functions of the radio interface towards the UE.

The O-DU is managed via O1 interface by the SMO as specified in OAM Architecture [34].

The O-DU terminates the Open Fronthaul M-Plane interface, towards the O-RU, to support O-RU management either in hierarchical model or hybrid model, as specified in Open FH M-Plane [24].

The O-DU terminates the D2 interface as specified in D2GAP [40] towards a peer O-DU, to support the inter O-DU NR carrier aggregation across O-DUs connected to same O-CU-CP.

The O-DU may support CTI to a TN to control UL bandwidth allocation to TUs for UL LLS traffic on shared point-to-multipoint transport network (TN is a PON OLT or DOCSIS CMTS, TU is a PON ONU or DOCSIS Cable Modem). The CTI is specified in CTI Control [20] and CTI Management [21]. An informative overview of the CTI is shown in Annex A.

### 5.3.6 O-RU

The O-RU terminates the Open Fronthaul interface (also known as LLS interface as specified in Open FH CUS-Plane [19]) as well as Low-PHY functions of the radio interface towards the UE. This is deployed as a PNF.

The O-RU terminates the Open Fronthaul M-Plane interface towards the O-DU and SMO as specified in Open FH M-Plane [2

*(Catatan: Naskah spesifikasi teknis lengkap bersambung pada rilis standar resmi 3GPP/O-RAN di Open-Telco Corpus...)*
