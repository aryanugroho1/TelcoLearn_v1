---
topic_key: oran_wg4_open_fronthaul_split_7_2x
title: O-RAN WG4 Open Fronthaul Control, User and Synchronization (CUS) Plane (Split 7.2x)
source_vendor: o_ran
doc_type: specification
technology: o_ran
category: o_ran
keywords: open fronthaul, wg4, split 7.2x, cus plane, ecpri, o-du, o-ru, iq compression, synchronization, prb allocation, beamforming
summary: Salinan spesifikasi resmi O-RAN WG4 (O-RAN.WG4.TS.CUS.0-R005-v20.00) dari repositori GSMA/oran Open-Telco Corpus.
---

# 1 Scope

The present document specifies the control plane, user plane and
synchronization plane protocols used over the fronthaul interface
linking the O-DU (O-RAN Distributed Unit) with the O-RU (O-RAN Radio
Unit) with a Lower Layer Functional Split-7-2x based architecture
(explained below). The scope of the present document includes both LTE
and NR (5G). A separate document contains the O-RAN M-Plane (management
plane) specification.

In the following, "Layer 1" and "Physical Layer" are assumed to be
synonymous.

The present document contains both stage 2 and stage 3 material.

# 2 References

## 2.1 Normative references

References are either specific (identified by date of publication and/or
edition number or version number) or non‑specific. For specific
references, only the cited version applies. For non-specific references,
the latest version of the referenced document (including any amendments)
applies. In the case of a reference to a 3GPP document, a non-specific
reference implicitly refers to the latest version of that document in
Release 18, or the latest 3GPP release prior to Release 18 that includes
that document.

NOTE: While any hyperlinks included in this clause were valid at the
time of publication, O-RAN cannot guarantee their long-term validity.

The following referenced documents are necessary for the application of
the present document.

> \[1\] Void.
>
> \[2\] [eCPRI Specification
> V1.0](http://www.cpri.info/downloads/eCPRI_v_1_0_2017_08_22.pdf):
> "Common Public Radio Interface: eCPRI Interface Specification".
>
> \[3\] [IEEE Std
> 1588<sup>™</sup>-2008](https://standards.ieee.org/ieee/1588/4355/):
> "IEEE Standard for a Precision Clock Synchronization Protocol for
> Networked Measurement and Control Systems".
>
> \[4\] 3GPP TS 38.211 Release 15: "5G; NR; Physical channels and
> modulation".
>
> \[5\] Void.
>
> \[6\] Void.
>
> \[7\] O-RAN ALLIANCE O-RAN.WG4.TS.MP.0: "Management Plane
> Specification".
>
> \[8\] 3GPP TS 38.104 Release 15: "5G; NR; Base Station (BS) radio
> transmission and reception".
>
> \[9\] 3GPP TS 36.104 Release 16: "LTE; Evolved Universal Terrestrial
> Radio Access (E-UTRA); Base Station (BS) radio transmission and
> reception".
>
> \[10\] [IETF RFC 1166](https://www.rfc-editor.org/info/rfc1166):
> "Internet Numbers".
>
> \[11\] [IEEE Std
> 802.1CM™-2018](https://standards.ieee.org/ieee/802.1CM/6236/): "IEEE
> Standard for Local and metropolitan area networks --- Time‑Sensitive
> Networking for Fronthaul", 8 June 2018.
>
> \[12\] [Amendment to IEEE Std
> 802.1CM™-2018](https://standards.ieee.org/ieee/802.1CMde/7478/): "IEEE
> Standard for Local and metropolitan area networks --- Time-Sensitive
> Networking for Fronthaul - Amendment 1: Enhancements to Fronthaul
> Profiles to Support New Fronthaul Interface, Synchronization, and
> Syntonization Standards", in IEEE Std 802.1CMde™-2020, Oct. 2020.
>
> \[13\] Void
>
> \[14\] 3GPP TS 36.213: "LTE; Evolved Universal Terrestrial Radio
> Access (E-UTRA); Physical layer procedures".
>
> \[15\] [Recommendation ITU-T G.781
> (01/24)](https://www.itu.int/rec/T-REC-G.781): "Synchronization layer
> functions for frequency synchronization based on the physical layer".
>
> \[16\] [Recommendation ITU-T G.810
> (08/1996)](https://www.itu.int/rec/T-REC-G.810-199608-I/en):
> "Definitions and terminology for synchronization networks".
>
> \[17\] [Recommendation ITU-T G.8260
> (11/22)](https://www.itu.int/rec/T-REC-G.8260-202003-S/en):
> "Definitions and terminology for synchronization in packet networks".
>
> \[18\] [Recommendation ITU-T G.8261/Y.1361 (2019) Amendment 2
> (10/2020)](https://www.itu.int/rec/T-REC-G.8261-202010-I!Amd2/en):
> "Timing and synchronization aspects in packet networks".
>
> \[19\] [Recommendation ITU-T G.8262/Y.1362 (2018) Amendment 1
> (03/2020)](https://www.itu.int/rec/T-REC-G.8262-202003-I!Amd1/en):
> "Timing characteristics of synchronous equipment slave clock -
> Amendment 1".
>
> \[20\] [Recommendation ITU-T G.8262.1/Y.1362.1
> (11/22)](https://www.itu.int/rec/T-REC-G.8262.1-202211-I): "Timing
> characteristics of enhanced synchronous equipment slave clock".
>
> \[21\] [Recommendation ITU-T G.8264/Y.1364 (2017) Amendment 2
> (01/2024)](https://www.itu.int/rec/T-REC-G.8264-202401-I!Amd2/en):
> "Distribution of timing information through packet networks -
> Amendment 1".
>
> \[22\] [Recommendation ITU-T G.8271/Y.1366
> (03/2020)](https://www.itu.int/rec/T-REC-G.8271-202003-I/en): "Time
> and phase synchronization aspects of telecommunication networks".
>
> \[23\] [Recommendation ITU-T G.8271.1/Y.1366.1 (2022) Amendment 2
> (01/24)](https://www.itu.int/rec/T-REC-G.8271.1-202401-P!Amd2/en):
> "Network limits for time synchronization in packet networks with full
> timing support from the network".
>
> \[24\] [Recommendation ITU-T G.8271.2/Y.1366.2 (2021) Amendment 1
> (11/22)](https://www.itu.int/rec/T-REC-G.8271.2-202211-I!Amd1/en):
> "Network limits for time synchronization in packet networks with
> partial timing support from the network".
>
> \[25\] [Recommendation ITU-T G.8272/Y.1367 (2018) Amendment 2
> (11/22)](https://www.itu.int/rec/T-REC-G.8272-202211-I!Amd2/en):
> "Timing characteristics of primary reference time clocks".
>
> \[26\] [Recommendation ITU-T G.8272.1/Y.1367.1
> (01/24)](https://www.itu.int/rec/T-REC-G.8272.1-202401-I/en): "Timing
> characteristics of enhanced primary reference time clocks".
>
> \[27\] [Recommendation ITU-T G.8273/Y.1368
> (06/23)](https://www.itu.int/rec/T-REC-G.8273-202306-I/en): "Framework
> of phase and time clocks".
>
> \[28\] [Recommendation ITU-T G.8273.2/Y.1368.2
> (06/23)](https://www.itu.int/rec/T-REC-G.8273.2-202306-I/en): "Timing
> characteristics of telecom boundary clocks and telecom time
> synchronous clocks for use with full timing support from the network".
>
> \[29\] [Recommendation ITU-T G.8273.3/Y.1368.3
> (10/2020)](https://www.itu.int/rec/T-REC-G.8273.3-202010-I/en):
> "Timing characteristics of telecom transparent clocks for use with
> full timing support from the network".
>
> \[30\] [Recommendation ITU-T G.8275/Y.1369
> (01/24)](https://www.itu.int/rec/T-REC-G.8275-202401-I/en):
> Architecture and requirements for packet-based time and phase
> distribution.
>
> \[31\] [Recommendation ITU-T G8275.1/Y.1369.1 (2022): Amendment 1
> (01/24)](https://www.itu.int/rec/T-REC-G.8275.1-202401-I!Amd1/en):
> "Precision time protocol telecom profile for phase/time
> synchronization with full timing support from the network - Amendment
> 1".
>
> \[32\] [Recommendation ITU-T G8275.2/Y.1369.2 (2022) Amendment 1
> (01/24)](https://www.itu.int/rec/T-REC-G.8275.2-202401-I!Amd1/en):
> "Precision time protocol telecom profile for time/phase
> synchronization with partial timing support from the network -
> Amendment 1".
>
> \[33\] [IEEE Std
> 1588™-2019](https://standards.ieee.org/ieee/1588/6825/): "IEEE
> Standard for a Precision Clock Synchronization Protocol for Networked
> Measurement and Control Systems", November 2019.
>
> \[34\] [Recommendation ITU-T G.811(09/1997) Amendment 1
> (04/16)](https://www.itu.int/rec/T-REC-G.811-201604-I!Amd1/en):
> "Timing characteristics of primary reference clocks".
>
> \[35\] [Recommendation ITU-T G.8273.4/Y.1368.4 (2020) Amendment 2
> (11/22)](https://www.itu.int/rec/T-REC-G.8273.4-202211-S!Amd2/en):
> Timing characteristics of telecom boundary clocks and telecom time
> slave clocks for use with partial timing support from the network -
> Amendment 2.
>
> \[36\] [IEEE Std
> 802.1Q™-2022](https://standards.ieee.org/ieee/802.1Q/10323/):: "IEEE
> Standard for Local and metropolitan area networks --- Bridges and
> Bridged Networks".
>
> \[37\] 3GPP TS 38.133 Release 15: "5G; NR; Requirements for support of
> radio resource management".
>
> \[38\] 3GPP TS 36.133 Release 15: "LTE; Evolved Universal Terrestrial
> Radio Access (E-UTRA); Requirements for support of radio resource
> management".
>
> \[39\] [eCPRI Transport Network V1.2
> (2018-06-25)](http://www.cpri.info/downloads/Requirements_for_the_eCPRI_Transport_Network_V1_2_2018_06_25.pdf):
> "Common Public Radio Interface: Requirements for the eCPRI Transport
> Network".
>
> \[40\] 3GPP TS 36.141 Release 15: "LTE; Evolved Universal Terrestrial
> Radio Access (E-UTRA); Base Station (BS) conformance testing".
>
> \[41\] 3GPP TS 38.141-1 Release 15: "5G; NR; Base Station (BS)
> conformance testing Part 1: Conducted conformance testing".
>
> \[42\] 3GPP TS 36.211 Release 15: "LTE; Evolved Universal Terrestrial
> Radio Access (E-UTRA); Physical channels and modulation".
>
> \[43\] 3GPP TR 38.901: "5G; Study on channel model for frequencies
> from 0.5 to 100 GHz".
>
> \[44\] [IEEE Std.
> 802.2™-1985](https://ieeexplore.ieee.org/document/30705): "IEEE
> Standard for Local Area Networks - Logical Link Control".
>
> \[45\] [IEEE Std.
> 1914.3™](https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=1914-3):
> "IEEE Standard for Radio over Ethernet Encapsulations and Mappings".
>
> \[46\] [IETF RFC 2460](https://www.rfc-editor.org/info/rfc2460): "
> Internet Protocol, Version 6 (IPv6) Specification".
>
> \[47\] [IETF RFC 791](https://www.rfc-editor.org/info/rfc791):
> "Internet Protocol".
>
> \[48\] [IETF RFC 826](https://www.rfc-editor.org/info/rfc826): "An
> Ethernet Address Resolution Protocol: Or Converting Network Protocol
> Addresses to 48.bit Ethernet Address for Transmission on Ethernet
> Hardware".
>
> \[49\] [IETF RFC 768](https://www.rfc-editor.org/info/rfc768): "User
> Datagram Protocol".
>
> \[50\] [IEEE Std
> 145™-2013](https://ieeexplore.ieee.org/document/6758443): "IEEE
> Standard for Definitions of Terms for Antennas".
>
> \[51\] [IEEE Std
> 802.1X™-2020](https://ieeexplore.ieee.org/document/9018454): "IEEE
> Standard for Local and Metropolitan Area Networks - Port‑Based Network
> Access Control", February 2020.
>
> \[52\] 3GPP TS 38.323 V16.6.0 Release 16: "5G; NR; Packet Data
> Convergence Protocol (PDCP) specification".
>
> \[53\] [IEEE Std
> 802.3™-2022](https://ieeexplore.ieee.org/document/9844436): "IEEE
> Standard for Ethernet".
>
> \[54\] O-RAN.WG9.XTRP-SYN.0-v03.00: "O-RAN Synchronization
> Architecture and Solution Specification, Release 03.00".
>
> \[55\] 3GPP TS 38.211 V17.6.0 Release 17: "NR; Physical channels and
> modulation".
>
> \[56\] 3GPP TS 38.212 V17.6.0 Release 17: "NR; Multiplexing and
> channel coding".

## 2.2 Informative references

References are either specific (identified by date of publication and/or
edition number or version number) or non‑specific. For specific
references, only the cited version applies. For non-specific references,
the latest version of the referenced document (including any amendments)
applies. In the case of a reference to a 3GPP document, a non-specific
reference implicitly refers to the latest version of that document in
Release 18, or the latest 3GPP release prior to Release 18 that includes
that document.

NOTE: While any hyperlinks included in this clause were valid at the
time of publication, O-RAN cannot guarantee their long-term validity.

The following referenced documents are not necessary for the application
of the present document, but they assist the user with regard to a
particular subject area.

\[i.1\] 3GPP TS 21.905: " Digital cellular telecommunications system
(Phase 2+) (GSM); Universal Mobile Telecommunications System (UMTS);
LTE; 5G; Vocabulary for 3GPP Specifications".

\[i.2\] 3GPP TR 36.932: "LTE; Scenarios and requirements for small cell
enhancements for E-UTRA and E-UTRAN".

\[i.3\] 3GPP TS 36.331: "LTE; Evolved Universal Terrestrial Radio Access
(E-UTRA); Radio Resource Control (RRC); Protocol specification".

\[i.4\] 3GPP TR 38.801 V14.0.0: "Study on new radio access technology:
Radio access architecture and interfaces".

> \[i.5\] 3GPP TS 38.213: "NR; Physical layer procedures for control".

# 3 Definition of terms, symbols and abbreviations

## 3.1 Terms

For the purposes of the present document, the terms given in 3GPP
TR 21.905 \[i.1\] and the following apply. A term defined in the present
document takes precedence over the definition of the same term, if any,
in 3GPP TR 21.905 \[i.1\].

**Analog Beamforming:** A method where the beam is formed using analog
signals, after the digital-to-analog converter (DAC) in downlink or
before the analog-to-digital converter (ADC) in uplink, can only be
implemented in time domain

**beam:** beam (of the antenna) is a radiation pattern without
restriction to main lobe

**Cascade mode**: Mode of Shared cell which is realized by several O-RUs
cascaded in chain

NOTE: See clause 13.

**category A O-RU**: O-RU within which the DL precoding is not done

NOTE: See [Figure 4.2.1‑1](#_Ref518670890).

**category B O-RU**: O-RU within which the DL precoding is performed

NOTE: See [Figure 4.2.1‑1](#_Ref518670890)

**Control Plane (C-Plane)**: refers specifically to real-time control
between O-DU and O-RU, and should not be confused with the UE's control
plane

**Digital Beamforming:** A method where the beam is formed using digital
signals, can be implemented either in the frequency domain or in the
time domain

**extended Antenna-Carrier (eAxC)**: a data flow for a single antenna
(or spatial stream) for a single carrier in a single sector

**FHM mode**: Mode of Shared cell which is realized by FHM and several
O-RUs

NOTE: See clause 13.

**Fractional Frequency Offset (FFO)**: defined as ∆f/f_norm which is
used to describe frequency error, typically on the output of the T-TSC
filter in the O-RU

NOTE: It is the same as the Fractional Frequency Deviation defined in
Recommendation ITU-T G.810 \[16\], clause 4.5.2.

**Frequency-domain Beamforming**: A beamforming technique in which the
beam is formed before the iFFT in downlink or after the FFT in uplink.
This method is inherently digital

**fronthaul:** A logical link connecting O-DU and O-RU

NOTE: Fronthaul transports C-Plane, U-Plane, S-Plane and M-Plane
traffic.

**GPS Time:** continuous time scale (no leap seconds) defined by the GPS
Control segment. It starts at 0<sup>h</sup> UTC (midnight) of January
5th to 6th 1980

NOTE: See IEEE Std. 1588 \[3\], \[33\] Annex B for timescales.

**Hop**: physical link between two S-Plane nodes (where node can be
O-DU, switch or O-RU)

NOTE: As defined in IEEE 802.1CM \[11\], \[12\].

**Licensed Assisted Access (LAA)**: carrier aggregation with at least
one secondary cell operating in the unlicensed spectrum

**Lower Layer Split (LLS)**: logical interface between O-DU and O-RU
when using a lower layer (intra-PHY based) functional split

**Lower Layer Split Control Plane (LLS-C)**: logical interface between
O-DU and O-RU when using a lower layer functional split

**Lower Layer Split User Plane (LLS-U)**: logical interface between O-DU
and O-RU when using a lower layer functional split

**Lower Layer Split – synchronization Configuration x(1,2,3,4)
(LLS‑Cx)**: synchronization configurations defined in
Clause [11.2.2](#clock-model-and-synchronization-configuration)

**High-PHY**: those portions of the PHY layer processing on the O-DU
side of the fronthaul interface

NOTE: This includes forward error correction encode/decode, scrambling,
and modulation/demodulation

**Low-PHY**: those portions of the PHY layer processing on the O-RU side
of the fronthaul interface

NOTE: This includes FFT/iFFT, beamforming, and PRACH extraction and
filtering

**Management Plane (M-Plane)**: refers to non-real-time management
operations between the O-DU and the O-RU

**Narrowband Internet of Things (NB-IoT)**: which is a Low Power Wide
Area Network (LPWAN) radio technology standard specified in 3GPP
standards to provide extended coverage such as indoor and underground
scenarios, support of massive number of low throughput devices, low
delay sensitivity, ultra-low device cost, low device power consumption
and optimized network architecture

**O-RAN Central Unit (O-CU)**: logical node hosting PDCP, RRC, SDAP and
other control functions

**O-RAN Distributed Unit (O-DU)**: logical node hosting RLC/MAC/High-PHY
layers based on a lower layer functional split

**O-RAN Radio Unit (O-RU)**: logical node hosting Low-PHY layer and RF
processing based on a lower layer functional split

NOTE: This is similar to 3GPP defined TRP or RRH but more specific in
including the Low-PHY layer (FFT/iFFT, PRACH extraction).

**Physical Resource Block (PRB)**: group of 12 consecutive subcarriers
of an OFDM symbol

**Port-list:** Logical term which refers to M-Plane configured unique
eAxC_ID list which is a union of {representative-tx-eaxc-id,
member-tx-eaxc-id} or a union of {representative-rx-eaxc-id,
member-rx-eaxc-id}

**PRACH Symbol**: resource in the time domain having the duration of
(1/Subcarrier Spacing), following cyclic prefix (excluded) in a PRACH
occasion. Cyclic prefix and one or more of such consecutive PRACH
Symbols constitute a PRACH preamble or a NPRACH symbol group defined in
3GPP TS 36.211 \[42\] and TS 38.211 \[4\]

**Primary Reference Time Clock (PRTC)**: as defined in Recommendation
ITU-T G.8272 \[25\] and G.8272.1 \[26\]

NOTE: There are different types of PRTC defined in both Recommendation
ITU-T G.8272 and G.8272.1. Unless the specific type is indicated, a
reference to a PRTC in the present document could include any of these
types.

**processing element:** see clause 7.5 of the M-Plane specification
\[7\] for a definition of processing element

**Q\<I.F\>**: denotes a signed two's-complement I+F bit fixed point
number with I signed integer bits, and F fractional bits

**quality Level:** referred to in Recommendation ITU G.781 \[15\] as
"clock source quality level." The clock-source quality-level of a
synchronous equipment clock or stand-alone synchronization clock is
defined as the grade of clock to which it is ultimately traceable

**Resource Element (RE)**: one subcarrier of an OFDM symbol

**rx-array:** as defined in clause 12.2

**Shared cell**: The operation for the same cell by several O-RUs

NOTE: see clause 11.

**Shared O-RU:** see clause 14.1 for a definition of Shared O-RU

**Shared O-RU Host:** see clause 3.1 of the M-Plane specification \[7\]
for a definition of Shared O-RU Host

**Shared Resource Operator:** see clause 3.1 of the M-Plane
specification \[7\] for a definition of Shared Resource Operator

**signed integer:** denotes a signed two's-complement integer number

**slot**: time duration defined in [Table 7.5.2.13‑3](#tab_7_scs)

NOTE: This is applicable to both LTE and NR. Slot definition in the
present document for LTE is different from the one defined in 3GPP TS
36.211 \[42\], clause 4.

**spatial stream**: data flow on the DL associated with precoded data
(may be same as layers or different if there is expansion in the
precoding), and on UL associated with the number of outputs from the
beamforming (sometimes called "beams")

**Synchronization Plane (S-Plane)**: refers to traffic between the O-RU
or O-DU and a synchronization controller which is generally an IEEE 1588
\[3\], \[33\] grandmaster

NOTE: Grandmaster functionality may be embedded in the O-DU.

**Time-domain Beamforming**: A beamforming technique in which the beam
is formed after the iFFT in downlink or before the FFT in uplink, can be
implemented using either analog or digital methods

**Time Error** (**TE(*t*)**)-: The difference between the time indicated
by a clock or timing signal, and that indicated by a reference clock or
timing signal

NOTE: See Recommendation ITU-T G.810 \[16\], clause 4.5.13.

**TRX**: refers to the specific processing chain in an O-RU associated
with D/A or A/D converters

NOTE: Due to digital beamforming the number of TRXs may exceed the
number of spatial streams, and due to analog beamforming, the number of
TRXs may be lower than the number of antenna elements.

**tx-array:** as defined in clause 12.2

**user group:** A group of one or more layers for single UE (SU-MIMO) or
single/multiple layers for different UEs (MU-MIMO), for which the
scheduled layer (s) are using the same range of contiguous or
non-contiguous PRBs and symbols in a slot. An individual UE's PRB and
symbol allocation within a slot may span multiple user groups

NOTE: In the context of DMRS-BF, if REs in DMRS symbols associated with
the set of PUSCH symbols of a user group have differing PUSCH
allocations based on differing cdmWithoutData values and/or differing
DMRS allocations, those DMRS symbols are considered to be in said user
group.

**UQ\<I.F\>**: denotes an unsigned I+F bit fixed point number with I
unsigned integer bits and F fractional bits

**User Network Interface (UNI)**: as defined by eCPRI network
requirement specification

**User Plane (U-Plane)**: refers to IQ sample data transferred between
O-DU and O-RU

## 3.2 Symbols

For the purposes of the present document, the symbols given in 3GPP TS
38.21 \[4\] and the following apply:

∆*f* Subcarrier spacing

*µ* Subcarrier spacing configuration

## 3.3 Abbreviations

For the purposes of the present document, the abbreviations given in
3GPP TR 21.905 \[i.1\] and the following apply. An abbreviation defined
in the present document takes precedence over the definition of the same
abbreviation, if any, in 3GPP TR 21.905 \[i.1\].

ABBF Attribute-Based dynamic BeamForming

ACK ACKnowledgement

ACK/NACK ACKnowledgement and Negative ACKnowledgement

APTS Assisted Partial Timing Support

ASM Advanced Sleep Mode

BF BeamForming

BTCA Best TimeTransmitter Clock Algorithm

C/U-Plane C-Plane and U-Plane

CA Carrier Aggregation

CDM Code Division Multiplexing

CIBF Channel-Information-based BeamForming

CID Company IDentification

CoMP Coordinated Multi-Point

CRS Cell specific Reference Signal

DAC Digital Analogue Converter

DFT-s-OFDM DFT-spread OFDM

DIX Ethernet, named after DEC, Intel and Xerox

DL DownLink

DMRS DeModulation Reference Signal

DMRS-BF DMRS based BeamForming

DRS Discovery Reference Signal

DSS Dynamic Spectrum Sharing

eAxC_ID eAxC IDentifier

EEC Ethernet Equipment Clock

eEEC enhanced Ethernet Equipment Clock

eNB evolved NodeB (applies to LTE)

ePRTC enhanced Primary Reference Time Clock

ESMC Ethernet Synchronization Messaging Channel

FFO Fractional Frequency Offset

FHM FrontHaul Multiplexer

gNB next generation NodeB (applies to NR)

HARQ Hybrid Automatic Repeat request

IE Information element

iFFT inverse Fast Fourier Transformation

IpN Interference plus Noise

IQ In-phase and Quadrature-phase

ITU International Telecommunication Union

LBT Listen Before Talk

LLC Logical Link Control

MAC Media Access Control

MCOT Maximum Channel Occupancy Time

MCS Modulation Coding Scheme

MMSE Minimum Mean Square Error

MU Multi-User

MTIE Maximum Time Interval Error

MTU Maximum Transmission Unit

NACK Negative Acknowledgement

OTA Over The Air

OTDOA Observed Time Delay Of Arrival

OUI Organizationally Unique Identifier

PCP Priority Code Point

PDBF PreDefined-beam BeamForming

PDV Packet Delay Variation

PHY PHYsical layer

PLFS Physical Layer Frequency Support

PLL Phase Locked Loop

PMI Precoding Matrix Indication

PPS Pulse Per Second

PRC Primary Reference Clock

PRG Precoding Resource block Group

PRTC Primary Reference Time Clock

PTP Precision Time Protocol

PT-RS Phase Tracking Reference Signal

QL Quality Level

RB Resource Block

RE Resource Element

RLC Radio Link Control

RLC-AM RLC Acknowledged Mode

RLC-TM RLC Transparent Mode

RLC-UM RLC Unacknowledged Mode

RoE Radio over Ethernet

RX Receiver

SE Section Extension

SF SubFrame

SLA Service Level Agreement

SMO Service Management and Orchestration

SRO Shared Resource Operator

SSB Synchronization Signal Block

SSM Synchronization Status Message

ST Section Type

SyncE Synchronous Ethernet

TAE Time Alignment Error

T-BC Telecom Boundary Clock

TDEV Time DEViation

T-GM Telecom GrandMaster

TLV Type Length Value

TM Transmission Mode

TOD Time Of Day

T-TC Telecom Transparent Clock

T-TSC Telecom Synchronous Clock

TX Transmitter

UE‑TAE User Equipment Timing Advance Error

UL UpLink

URLLC Ultra Reliable Low Latency Communications

UTC Universal Time Coordinated

VLAN Virtual Local Area Network

vRAN virtualized Radio Access Network

WDBF Weight-based Dynamic BeamForming

## 3.4 Document conventions

### 3.4.1 Terminologies

In the present document, all material is considered normative except
where explicitly or implicitly labeled as informative. Labeling as
informative includes content outside of tables and figures labeled as
"NOTE", content described as "examples", and content carrying the
explicit label of "informative" such as some Annexes.

For the purposes of the present document, the following terminologies
apply.

**ignored**: Within the present document, it is sometimes stated that
certain information elements are to be "ignored" by the receiver
(generally for "reserved" fields but in some cases other fields too). In
this case, the fields shall be ignored for the purposes of processing at
the O-RAN application level, but in the case of certain packet
error-checking such as Ethernet-layer CRC or parity calculations, the
fields shall be included in the CRC or parity calculations. As well, in
the event of packet encryption, the "ignored" fields shall be encrypted
along with the other packet payload information.

### 3.4.2 Fields and bitmasks in messages

For the purposes of the present document, the following conventions
apply for the format of messages and data structures within messages.

In accordance with IETF RFC 1166 \[10\], the left most bit of an octet
is the most significant bit (msb) and the right most bit is the least
significant bit (lsb). The msb is labelled as 0 and lsb is labelled as
7. This is illustrated by a blue ribbon in tables showing the message
format. An example is depicted in [Table 3.4.2‑1](#_Ref32511476). Note
that this bit labelling convention (specifically the blue ribbon header
in some tables) for octets is different from the labelling of bits
within a field (bracketed bit numbers shown in tables).

To address specific bits within a field, the following notation is used:
"X\[k\]" represents k<sup>th</sup> bit in a field X with the convention
that bit X\[0\] is the least significant bit of field X and located in
the rightmost bit position. Where applicable, a sequence of bits in a
field X can be interpreted as an unsigned integer value $`X_{val}`$
calculated with formula:

$`X_{val} = \sum_{k = 0}^{N - 1}{X\lbrack k\rbrack 2^{k}}`$

where N is number of bits in field X.

Notation "X\[a:b\]" represents a sequence of bits in field X starting
from bit X\[a\] and ending at bit X\[b\] inclusive, where a \> b.

[Table 3.4.2‑1](#_Ref32511476) below illustrates the format of messages
and data structures using this notation.

<span id="_Ref32511476" class="anchor"></span>Table 3.4.2‑1: Example of
table presenting format of a data structure

<table style="width:98%;">
<colgroup>
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
</colgroup>
<thead>
<tr>
<th>0 (msb)</th>
<th>1</th>
<th>2</th>
<th>3</th>
<th>4</th>
<th>5</th>
<th>6</th>
<th>7 (lsb)</th>
<th># of<br />
bytes</th>
<th>octet</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="4">Y[3:0]</td>
<td colspan="4">X[11:8]</td>
<td>1</td>
<td>N</td>
</tr>
<tr>
<td colspan="8">X[7:0]</td>
<td>1</td>
<td>N+1</td>
</tr>
</tbody>
</table>

The example data structure presented in [Table 3.4.2‑1](#_Ref32511476)
is interpreted as follows:

- Field Y has 4 bits. Bits Y\[3\] to Y\[0\] of field Y are in octet N;
  Y\[3\], the most significant bit of field Y is in the most significant
  bit of octet N.

- Field X has 12 bits. Bits X\[11\] to X\[8\] of field X are in octet N;
  X\[8\] is in the least significant bit of octet N.\
  Bits X\[7\] to X\[0\] of field X are in octet N+1; X\[7\] is in the
  most significant bit of octet N+1 and X\[0\] is in the least
  significant bit of octet N+1.

This corresponds to a structure that maps every bit as presented in
[Table 3.4.2‑2](#_Ref32511545) below.

<span id="_Ref32511545" class="anchor"></span>Table 3.4.2‑2:
Interpretation of the example of table presenting format of a data
structure

<table style="width:98%;">
<colgroup>
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
</colgroup>
<thead>
<tr>
<th>0 (msb)</th>
<th>1</th>
<th>2</th>
<th>3</th>
<th>4</th>
<th>5</th>
<th>6</th>
<th>7 (lsb)</th>
<th># of<br />
bytes</th>
<th>octet</th>
</tr>
</thead>
<tbody>
<tr>
<td>Y[3]</td>
<td>Y[2]</td>
<td>Y[1]</td>
<td>Y[0]</td>
<td>X[11]</td>
<td>X[10]</td>
<td>X[9]</td>
<td>X[8]</td>
<td>1</td>
<td>N</td>
</tr>
<tr>
<td>X[7]</td>
<td>X[6]</td>
<td>X[5]</td>
<td>X[4]</td>
<td>X[3]</td>
<td>X[2]</td>
<td>X[1]</td>
<td>X[0]</td>
<td>1</td>
<td>N+1</td>
</tr>
</tbody>
</table>

## 3.5 Backward compatibility aspects

Table 3.5-1 lists the changes introduced in
O-RAN.WG4.TS.CUS.0-R005-v20.00 which are non-backwards compatible.

Table 3.5-1: Non-backward-compatible changes

| Affected specification | Description of change |
|----|----|
| O-RAN.WG4.TS.CUS.0-R005-v20.00 | IE rb shall be set to zero when IE dataDirection=0 (UL). See clause 7.5.3.2. |
| O-RAN.WG4.TS.CUS.0-R005-v20.00 | IE regularizationFactor is removed from ST 6. See clause 7.4.8. |
| O-RAN.WG4.TS.CUS.0-R005-v20.00 | When SE 21 is sent with ST 5, the value of IE ciPrbGroupSize shall be set to zero. See clause 7.7.21.2. |
| O-RAN.WG4.TS.CUS.0-R005-v20.00 | ST 9 shall contain a single SINR value per section for DFT-s-OFDM unless O-RU supports and O-DU configures multi-value SINR report in frequency. See clause 7.2.11. |
| O-RAN.WG4.TS.CUS.0-R005-v20.00 | An O-RU supporting Extended PRB Grid method shall report **filter-pass-bandwidth** per static-low-level-(rx/tx)-endpoints and **supported-filter-pass-bandwidths-(ul/dl)** per (rx/tx)-arrays. See clauses 15.2.1, 15.4.1, 15.4.2, 15.4.3. |

# 4 Architecture & requirements

## 4.1 Architectural aspects

### 4.1.1 Architectural entities

The architecture of eNB or gNB with O-DU and O-RUs is shown in [Figure
4.1.1‑1](#_Ref518670869). LLS-C and LLS-U provide C-Plane and U-Plane
over LLS interface, respectively.

In this architecture, O-DU and O-RU are defined as follows.

**O-RAN Distributed Unit (O-DU):** a logical node that includes the
eNB/gNB functions as listed in clause 4.2 split option 7-2x, excepting
those functions allocated exclusively to the O-RU. The O-DU controls the
operation of O-RUs.

**O-RAN Radio Unit (O-RU):** a logical node that includes a subset of
the eNB/gNB functions as listed in clause 4.2 split option 7-2x. The
real-time aspects of control & user plane communication with the O-RU
are controlled by the O-DU.

![](retrieval/oran/converted/WG4/O-RAN.WG4.TS.CUS.0-R005-v20.00/image2.emf)

<span id="_Ref518670869" class="anchor"></span>Figure 4.1.1‑1: eNB/gNB
architecture with O-DU and O-RUs

## 4.2 Functional split

### 4.2.1 Introduction

When considering the functional split defining a fronthaul interface
there are two competing interests:

1)  There is a benefit in keeping an O-RU as simple as possible because
    size, weight, and power draw are primary deciding considerations and
    the more complex an O-RU, the larger, heavier and more power-hungry
    the O-RU tends to be.

2)  There is a benefit in having the interface at a higher level which
    tends to reduce the interface throughput relative to a lower-level
    interface -- but the higher-level the interface, the more complex
    the O-RU tends to be.

To resolve this, O-RAN has selected a single split point, known as
"7-2x" but allows a variation, with the precoding function to be located
either "above" the interface in the O-DU or "below" the interface in the
O-RU. For the most part the interface is not affected by this decision,
but there are some impacts, namely providing the necessary information
to the O-RU to execute the precoding operation. O-RUs within which the
precoding is not done (therefore of lower complexity) are called
"Category A" O-RUs while O-RUs within which the precoding is done are
called "Category B" O-RUs. See [Figure 4.2.1‑1](#_Ref518670890) for a
depiction of this dual O-RU concept.

![](retrieval/oran/converted/WG4/O-RAN.WG4.TS.CUS.0-R005-v20.00/image3.emf)

<span id="_Ref518670890" class="anchor"></span>Figure 4.2.1‑1: Split
Point and Category A and Category B O-RAN Radio Units

The inclusion of these two O-RU categories has certain implications for
the LTE and NR functional splits in both DL and UL, which are reflected
in the following clauses. In particular, for a Category A O-RU, the
precoding shall be executed in the O-DU and any beamforming in the O-RU,
if present, would exclude the precoding calculation. For LTE precoding
schemes other than Transmit Diversity and Spatial Multiplexing with
Large Delay CDD and precoding schemes for NR, the precoding may be
included in a frequency-domain beamforming processing block within the
O-RU for a Category B O-RU (even for time-domain beamforming O-RUs). To
implement Transmit Diversity and Spatial Multiplexing with Large Delay
CDD precoding special C-Plane instructions need to be provided to the
O-RU from the O-DU; this is described in clause 7.7.3.

### 4.2.2 Split 7-2x (DL)

#### 4.2.2.1 Description

DL functional split for various physical layer channels is illustrated
in [Figure 4.2.2.1‑1](#_Ref518670908) (LTE Category A O-RUs), [Figure
4.2.2.1‑2](#_Ref518670914) (LTE Category B O-RUs), Figure 4.2.2.1‑3 (NR
Category A O-RUs), and [Figure 4.2.2.1‑4](#_Ref518670934) (NR Category B
O-RUs).

When O-DU supports Category A O-RU, O-DU shall support a total number of
precoded streams of up to 8. O-DU supporting Category A O-RU may support
more than 8 precoded streams. For LTE (e.g. LTE TM9) and NR PDSCH with
UE specific reference signals, the DL processing chain specified by 3GPP
does not include a precoding operation. The detailed precoding operation
referred to in [Figure 4.2.2.1‑1](#_Ref518670908) and [Figure
4.2.2.1‑2](#_Ref518670914) for PDSCH with UE specific reference signals
is not further described within the present document.

![](retrieval/oran/converted/WG4/O-RAN.WG4.TS.CUS.0-R005-v20.00/image4.emf)

<span id="_Ref518670908" class="anchor"></span>Figure 4.2.2.1‑1: Lower
layer DL split description, LTE, Category A O-RUs

![](retrieval/oran/converted/WG4/O-RAN.WG4.TS.CUS.0-R005-v20.00/image5.emf)

<span id="_Ref518670914" class="anchor"></span>Figure 4.2.2.1‑2: Lower
layer DL split description, LTE, Category B O-RUs

[Figure 4.2.2.1‑2](#_Ref518670914) presents DL functional split for
Category B O-RU supporting precoding including precoding with Transmit
Diversity and Spatial Multiplexing with Large Delay CDD schemes; for
Category B O-RU not supporting Transmit Diversity and Spatial
Multiplexing with Large Delay CDD schemes the channels precoded with
Transmit Diversity or Spatial Multiplexing with Large Delay CDD shall be
precoded by O-DU as presented on [Figure 4.2.2.1‑1](#_Ref518670908) and
the other channels shall be precoded on O-RU as presented on Figure
4.2.2.1-2.

Although not explicitly indicated in [Figure 4.2.2.1‑2](#_Ref518670914),
RE mapping operation is separated into two parts for precoding support
at O-RU for transmit diversity and spatial multiplexing modes in
Category B O-RU:

1)  RE mapping to frequency resources is performed at O-DU.

2)  RE mapping to antenna ports is performed at O-RU after precoding.

![](retrieval/oran/converted/WG4/O-RAN.WG4.TS.CUS.0-R005-v20.00/image6.emf)

NOTE: The above figure illustrates some of the high-level
functionalities inside the O-RU and O-DU, and does not bind the internal
design of each of the O-RU and O-DU.

Figure 4.2.2.1‑3: Lower layer DL split description, NR, Category A Radio

![](retrieval/oran/converted/WG4/O-RAN.WG4.TS.CUS.0-R005-v20.00/image7.emf)

NOTE: The above figure illustrates some of the high-level
functionalities inside the O-RU and O-DU, and does not bind the internal
design of each of the O-RU and O-DU.

<span id="_Ref518670934" class="anchor"></span>Figure 4.2.2.1‑4: Lower
layer DL split description, NR, Category B Radio

In the DL, OFDM phase compensation (clause 5.4 of \[4\]), iFFT, CP
addition, and digital beamforming functions reside in the O-RU for
Category A and Category B O-RUs. In addition, precoding with schemes
other than Transmit Diversity and Spatial Multiplexing with Large Delay
CDD reside in the Category B O‑RU. Optionally, precoding with Transmit
Diversity and Spatial Multiplexing with Large Delay CDD precoding
schemes reside in the Category B O-RU supporting these schemes. The PHY
functions including resource element mapping, precoding, layer mapping,
modulation, scrambling, rate matching and coding not handled by O-RU
reside in the O-DU.

NOTE: The option of including some PHY functionality in a radio unit was
not included in 3GPP TR 38.801 \[i.4\], clause 11.1.

#### 4.2.2.2 Benefits and justification (informative)

- Interface simplicity: Transfer of user plane data is based on Resource
  Elements / Physical Resource Blocks, which simplifies the data mapping
  and limits the required associated control messages

- Transport Bandwidth Scalability: Lower split options (such as splits
  7-1 and 8 as defined in 3GPP TR 38.801 \[i.4\], clause 11.1) scale
  based on number of antennas. In contrast, 7-2x interface scales based
  on "streams", which allows using high number of antennas without
  higher transport bandwidth. Further, sending only PRBs that contain
  user data is possible for purpose of reducing transport bandwidth

- Beamforming Support: The same interface design supports different
  beamforming techniques (frequency-domain, time-domain, hybrid) as well
  as different beamforming algorithms. Likewise, deployments using only
  time-domain beamforming are also possible with the same interface
  design.

- Interoperability: Less user specific parameters are used at split 7-2x
  (when compared to higher split options), which simplifies
  specification.

- Advanced receivers and inter-cell coordination: this option allows
  implementation of advanced receivers and coordination features, which
  are also easier to implement and less restricted when most functions
  are placed at the O-DU. For example, UL CoMP is not possible when the
  UL upper-PHY processing is in the O-RU.

- Lower O-RU complexity: Less functions at O-RU (when compared to higher
  split options) allow limiting the number of required real time
  calculations as well as required memory requirement, especially for
  Category A O-RUs.

- Future proof-ness: Placing most functions at O-DU will allow
  introduction of new features via software upgrades without inflicting
  HW changes at O-RU (e.g. specification changes due to URLLC or new
  modulation schemes).

- Interface and functions symmetry: If the same interface and split
  point is used for DL and UL, specification effort is reduced.

### 4.2.3 Split 7-2x (UL)

#### 4.2.3.1 Description

UL functional split for various physical layer channels and transmission
modes are illustrated in [Figure 4.2.3.1‑1](#_Ref518671091). Likewise,
beamforming in this context, is the function of antenna port selection
or antenna port combining.

![](retrieval/oran/converted/WG4/O-RAN.WG4.TS.CUS.0-R005-v20.00/image8.emf)

NOTE: The above figure illustrates some of the high level
functionalities inside the O-RU and O-DU, and do not bind the internal
design of each of the O-RU and O-DU.

<span id="_Ref518671091" class="anchor"></span>Figure 4.2.3.1‑1: Lower
layer UL split description for LTE and NR

In the UL, OFDM phase compensation (for all channels except PRACH when
Section Type "3" message is used) according to clause 5.4 of \[4\], FFT,
CP removal and beamforming functions reside in the O-RU. OFDM phase
compensation for non-PRACH channels regardless of Section Type also
reside in the O-RU, unless otherwise specified, e.g. refer to clause
15.3.2, 15.3.3, and 15.4.2. The rest of the PHY functions including
resource element de-mapping, equalization, de-modulation, de-scrambling,
rate de-matching and de-coding reside in the O-DU.

NOTE: The option of including some PHY functionality in a radio unit was
not included in 3GPP TR 38.801 \[i.4\], clause 11.1.

#### 4.2.3.2 Benefits and justification (informative)

The benefits applicable for Option 7-2x for DL (see clause 4.2.2.2) are
also applicable for Uplink.

## 4.3 Data flows

An overall reference of required inputs for some major functional
blocks, their granularity and input originating source is compiled in
[Table 4.3‑1](#_Ref518566236) and [Table 4.3‑2](#_Ref518566245) for DL
and UL, respectively.

<span id="_Ref518566236" class="anchor"></span>Table 4.3‑1: Required
information for each functional block (DL)

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 28%" />
<col style="width: 21%" />
</colgroup>
<thead>
<tr>
<th>Function</th>
<th>Required information</th>
<th>Example signalling granularity</th>
<th>Information source</th>
</tr>
</thead>
<tbody>
<tr>
<td>Frequency-domain beamforming</td>
<td><ul>
<li><p>Frequency-domain beamforming information</p></li>
<li><p>Number of TRXs or Beams</p></li>
</ul></td>
<td>Per RE per beam per slot</td>
<td>Scheduler (O-DU)</td>
</tr>
<tr>
<td>iFFT and CP addition</td>
<td><ul>
<li><p>FFT size</p></li>
<li><p>SC spacing</p></li>
<li><p>CP length</p></li>
</ul></td>
<td>Per TRX per slot</td>
<td>Scheduler (O-DU)</td>
</tr>
<tr>
<td>Time-domain beamforming</td>
<td><ul>
<li><p>Time-domain beamforming info</p></li>
</ul></td>
<td>Per frequency band per slot</td>
<td>Scheduler (O-DU)</td>
</tr>
<tr>
<td>Listen Before Talk (LBT)</td>
<td><ul>
<li><p>LBT parameters</p></li>
</ul></td>
<td>Per MCOT</td>
<td>Scheduler (O-DU)</td>
</tr>
</tbody>
</table>

<span id="_Ref518566245" class="anchor"></span>Table 4.3‑2: Required
Information for each functional block (UL)

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 25%" />
<col style="width: 26%" />
<col style="width: 25%" />
</colgroup>
<thead>
<tr>
<th>Function</th>
<th>Required information</th>
<th>Example signalling granularity</th>
<th>Information source</th>
</tr>
</thead>
<tbody>
<tr>
<td>Frequency-domain beamforming</td>
<td><ul>
<li><p>Frequency-domain beamforming information</p></li>
<li><p>Number of TRXs or Beams</p></li>
</ul></td>
<td>Per RE per TRX per slot</td>
<td>Scheduler (O-DU)</td>
</tr>
<tr>
<td>FFT and CP removal</td>
<td><ul>
<li><p>FFT size</p></li>
<li><p>SC spacing</p></li>
<li><p>CP length</p></li>
</ul></td>
<td>Per TRX per slot</td>
<td>Scheduler (O-DU)</td>
</tr>
<tr>
<td>Time-domain beamforming</td>
<td><ul>
<li><p>Time-domain beamforming info</p></li>
</ul></td>
<td>Per frequency band per slot</td>
<td>Scheduler (O-DU)</td>
</tr>
<tr>
<td>RRM measurements configuration</td>
<td><ul>
<li><p>Real-time trigger and commanding of RRM measurements</p></li>
</ul></td>
<td>Per layer per slot</td>
<td>DMRS-BF (O-DU)</td>
</tr>
<tr>
<td>RRM measurements</td>
<td><ul>
<li><p>RRM measurements</p></li>
</ul></td>
<td>Per layer/UE/PRB per slot</td>
<td><p>DMRS-BF (O-RU)</p>
<p>(NOTE)</p></td>
</tr>
<tr>
<td>SINR reporting</td>
<td><ul>
<li><p>SINR data</p></li>
</ul></td>
<td>Per layer per one or more RE(s) per slot</td>
<td>DMRS-BF-EQ (O-RU)</td>
</tr>
<tr>
<td colspan="4">NOTE: Some RRM measurements have a different source of
information in the O-RU than DMRS-BF.</td>
</tr>
</tbody>
</table>

In case of lower layer fronthaul based on split option 7-2x for DL and
UL, the required external data flows (excluding M-Plane) to exchange
information between O-DU and O-RU are categorized as follows. Further,
the data flow direction is shown in figure
[4.3‑1](#fig_lower_layer_fronthaul_data_flows), the data flow contents
mapping is described in [Table 4.3‑3](#_Ref518566304)**.**

- User Plane

<!-- -->

- Data Flow 1a: Flows of IQ Data in FFT frequency domain on DL

- Data Flow 1b: Flows of IQ Data in FFT frequency domain on UL

- Data Flow 1c: Flow of PRACH IQ data in FFT frequency domain

<!-- -->

- Control Plane

<!-- -->

- Data Flow 2a: Scheduling commands (DL & UL) & Beamforming commands

- Data Flow 2b: LAA LBT configuration commands and requests

- Data Flow 2c: LAA LBT status and response messages

- Data Flow 2d: UE Channel Information

- Data Flow 2e: ACK/NACK message

- Data Flow 2f: Wake‑up Ready Indication

- Data Flow 2g: RRM measurements (see clause 12.6.1.6)

- Data Flow 2h: SINR data (see clause 12.6.1.7)

<!-- -->

- Synchronization Plane

<!-- -->

- Data Flow S: Timing and Synchronization data

![](retrieval/oran/converted/WG4/O-RAN.WG4.TS.CUS.0-R005-v20.00/image9.emf)

NOTE: M-Plane flow

*(Catatan: Naskah spesifikasi teknis lengkap bersambung pada rilis standar resmi 3GPP/O-RAN di Open-Telco Corpus...)*
