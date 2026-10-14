---
topic_key: 3gpp_38214_mcs_cqi
title: 3GPP TS 38.214 - 5G NR Modulation, MCS Tables & CQI Reporting
source_vendor: 3gpp
doc_type: specification_clause
technology: 5g_nr
category: 5g_nr
keywords: mcs table, cqi table, 256qam, 64qam, code rate, spectral efficiency, csi reporting, sinr, link adaptation
summary: Ekstraksi klausul teknis penting 3GPP TS 38.214 - 5G NR Modulation, MCS Tables & CQI Reporting dari 3GPP TS 38.214.
---

## 5.1.3 Modulation order, target code rate, redundancy version and transport block size determination

To determine the modulation order, target code rate, and transport block size(s) in the physical downlink shared channel, the UE shall first

- read the 5-bit modulation and coding scheme field ( $I_{MCS}$ ) in the DCI to determine the modulation order ( $Q_m$ ) and target code rate ( $R$ ) based on the procedure defined in Clause 5.1.3.1, and
- read '*redundancy version*' field ( $rv$ ) in the DCI to determine the redundancy version.

and second

- the UE shall use the number of layers ( $v$ ), the total number of allocated PRBs before rate matching ( $n_{PRB}$ ) to determine to the transport block size based on the procedure defined in Clause 5.1.3.2.

The UE may skip decoding a transport block in an initial transmission if the effective channel code rate is higher than 0.95, where the effective channel code rate is defined as the number of downlink information bits (including CRC bits) divided by the number of physical channel bits on PDSCH.

When the UE is scheduled with multiple PDSCHs by a DCI, as described in clause 5.1.2.1, the bits of  $rv$  field and NDI field, respectively, in the DCI are one-to-one mapped to the scheduled PDSCH(s) indicated by the TDRA information field with the corresponding transport block(s) in the scheduled order, where the LSB bits of the  $rv$  field and NDI field, respectively, correspond to the last scheduled PDSCH indicated by the TDRA information field.

The UE is not expected to handle any transport blocks (TBs) in a 14 consecutive-symbol duration for normal CP (or 12 for extended CP) ending at the last symbol of the latest PDSCH transmission within an active BWP on a serving cell whenever

where, for the serving cell,

- $S$  is the set of TBs belonging to PDSCH(s) that are partially or fully contained in the consecutive-symbol duration
- for the  $i$ th TB
  - $C_i$  is the number of scheduled code blocks for as defined in [5, 38.212].
  - $L_i$  is the number of OFDM symbols assigned to the PDSCH
  - $x_i$  is the number of OFDM symbols of the PDSCH contained in the consecutive-symbol duration
  - based on the values defined in Clause 5.4.2.1 [5, TS 38.212]
    - $l$  is the starting location of RV for the  $t$ th transmission
    - $t$  is the number of scheduled code blocks for the transmission
    - $L$  is the circular buffer length
    - $t$  is the current (re)transmission for the  $i$ th TB
  - $\mu'$  corresponds to the subcarrier spacing of the BWP (across all configured BWPs of a carrier) that has the largest configured number of PRBs
    - in case there is more than one BWP corresponding to the largest configured number of PRBs,  $\mu'$  follows the BWP with the largest subcarrier spacing.
  - $\mu$  corresponds to the subcarrier spacing of the active BWP
  - $R_{LBRM} = 2/3$  as defined in Clause 5.4.2.1 [5, TS 38.212]
  - $TBS_{LBRM}$  as defined based on the parameters for unicast in Clause 5.4.2.1 [5, TS 38.212]
  - $X$  as defined for downlink max MIMO layer for unicast in Clause 5.4.2.1 [5, TS 38.212].

If the UE skips decoding, the physical layer indicates to higher layer that the transport block is not successfully decoded.

Within a cell group, a UE is not required to handle PDSCH(s) transmissions including unicast and/or multicast/broadcast in slot  $s_j$  in serving cell- $j$ , and for  $j = 0, 1, 2, \dots, J-1$ , slot  $s_j$  overlapping with any given point in time, if the following condition is not satisfied at that point in time:

where,

- $J$  is the number of configured serving cells belonging to a frequency range
- for the  $j$ -th serving cell,
  - $M$  is the number of TB(s) transmitted in slot  $s_j$ . If there are two PDSCH transmission occasions of the same TB (in time domain or in frequency domain) in the slot  $s_j$ , each transmission occasion is counted separately.
  - $T_{slot}^{\mu(j)} = 10^{-3}/2^{\mu(j)}$ , where  $\mu(j)$  is the numerology for PDSCH(s) in slot  $s_j$  of the  $j$ -th serving cell.
  - for the  $m$ -th TB,
    - $A$  is the number of bits in the transport block as defined in Clause 7.2.1 [5, TS 38.212]
    - $C$  is the total number of code blocks for the transport block defined in Clause 5.2.2 [5, TS 38.212].
    - $C_i$  is the number of scheduled code blocks for the transport block as defined in Clause 5.4.2.1 [5, TS 38.212]
- $[Mbps]$  is computed as the maximum data rate summed over all the carriers in the frequency range for any signaled band combination and feature set consistent with the configured serving cells, where the data rate value is given by the formula in Clause 4.1.2 in [13, TS 38.306], including the scaling factor  $f(i)$ .

For a  $j$ -th serving cell, if higher layer parameter *processingType2Enabled* of *PDSCH-ServingCellConfig* is configured for the serving cell and set to 'enable', or if at least one  $I_{MCS} > W$  for a PDSCH for unicast or multicast, where  $W = 28$  for MCS tables 5.1.3.1-1 and 5.1.3.1-3, and  $W = 27$  for MCS table 5.1.3.1-2, and  $W = 26$  for MCS table 5.1.3.1-4, or for a  $j$ -th serving cell where UE supports FDM-ed unicast and MBS PDSCH, the UE is not required to handle PDSCH transmissions, if the following condition is not satisfied:

where

- is the number of symbols assigned to the PDSCH(s). For a PDSCH that consists of two PDSCH transmission occasions in time domain in one slot, is the number of symbols of one transmission occasion. For FDMed unicast and MBS PDSCHs in one slot, is the total number of symbols of the unicast and MBS PDSCHs with fully or partially-overlapped in time domain.
- $M$  is the number of TB(s) in the PDSCH(s)
- where  $\mu$  is the numerology of the PDSCH(s)
- for the  $m$ -th TB,
  - $A$  is the number of bits in the transport block as defined in Clause 7.2.1 [5, TS 38.212]
  - $C$  is the total number of code blocks for the transport block defined in Clause 5.2.2 [5, TS 38.212]
  - is the number of scheduled code blocks for the transport block as defined in Clause 5.4.2.1 [5, TS 38.212]
- [Mbps] is computed as the maximum data rate for a carrier in the frequency band of the serving cell for any signaled band combination and feature set consistent with the serving cell, where the data rate value is given by the formula in Clause 4.1.2 in [13, TS 38.306], including the scaling factor  $f(i)$ .

#### 5.1.3.1 Modulation order and target code rate determination

For the PDSCH scheduled by a PDCCH with DCI format 1\_0, format 1\_1, format 1\_2, format 4\_0, format 4\_1 or format 4\_2 with CRC scrambled by C-RNTI, MCS-C-RNTI, TC-RNTI, CS-RNTI, SI-RNTI, RA-RNTI, MSG-RNTI, G-RNTI, G-CS-RNTI, MCCH-RNTI or P-RNTI, or for the PDSCH scheduled without corresponding PDCCH transmissions using the higher-layer-provided PDSCH configuration *SPS-Config*,

if the higher layer parameter *mcs-Table-r17* given by *PDSCH-Config* is set to 'qam1024', and the PDSCH is scheduled by a PDCCH with DCI format 1\_1 with CRC scrambled by C-RNTI

- the UE shall use  $I_{MCS}$  and Table 5.1.3.1-4 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif *mcs-TableDCI-1-2-r17* given by *PDSCH-Config* is set to 'qam1024', and the PDSCH is scheduled by a PDCCH with DCI format 1\_2 with CRC scrambled by C-RNTI

- the UE shall use  $I_{MCS}$  and Table 5.1.3.1-4 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif the higher layer parameter *mcs-TableDCI-1-2* given by *PDSCH-Config* is set to 'qam256', and the PDSCH is scheduled by a PDCCH with DCI format 1\_2 with CRC scrambled by C-RNTI

- the UE shall use  $I_{MCS}$  and Table 5.1.3.1-2 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif the UE is not configured with MCS-C-RNTI, the higher layer parameter *mcs-TableDCI-1-2* given by *PDSCH-Config* is set to 'qam64LowSE', and the PDSCH is scheduled by a PDCCH with DCI format 1\_2 scrambled by C-RNTI

- the UE shall use  $I_{MCS}$  and Table 5.1.3.1-3 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif the higher layer parameter *mcs-Table* given by *PDSCH-Config* is set to 'qam256', and the PDSCH is scheduled by a PDCCH with DCI format 1\_1 with CRC scrambled by C-RNTI

- the UE shall use  $I_{MCS}$  and Table 5.1.3.1-2 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif the higher layer parameter *mcs-Table* given by *pdsch-ConfigMulticast* is set to 'qam256', and the PDSCH is scheduled by a PDCCH with DCI format 4\_1 or 4\_2 with CRC scrambled by G-RNTI for multicast

- the UE shall use  $I_{MCS}$  and Table 5.1.3.1-2 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif the higher layer parameter *mcs-Table* given by *pdsch-ConfigMCCH* and *pdsch-ConfigMTCH* is set to 'qam256', and the PDSCH is scheduled by a PDCCH with DCI format 4\_0 with CRC scrambled by MCCH-RNTI or G-RNTI for broadcast

- the UE shall use  $I_{MCS}$  and Table 5.1.3.1-2 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif the higher layer parameter *mcs-Table* given by *pdsch-ConfigMulticast* is set to 'qam64LowSE', and the PDSCH is scheduled by a PDCCH with DCI format 4\_1 or 4\_2 with CRC scrambled by G-RNTI for multicast

- the UE shall use  $I_{MCS}$  and Table 5.1.3.1-3 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif the UE is not configured with MCS-C-RNTI, the higher layer parameter *mcs-Table* given by *PDSCH-Config* is set to 'qam64LowSE', and the PDSCH is scheduled by a PDCCH with a DCI format other than DCI format 1\_2 in a UE-specific search space with CRC scrambled by C-RNTI

- the UE shall use  $I_{MCS}$  and Table 5.1.3.1-3 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif the UE is configured with MCS-C-RNTI, and the PDSCH is scheduled by a PDCCH with CRC scrambled by MCS-C-RNTI

- the UE shall use  $I_{MCS}$  and Table 5.1.3.1-3 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif the UE is not configured with the higher layer parameter *mcs-Table* given by *SPS-config*, and the higher layer parameter *mcs-Table-r17* given by *PDSCH-Config* is set to 'qam1024',

- if the PDSCH is scheduled by a PDCCH with DCI format 1\_1 with CRC scrambled by CS-RNTI or
- if the PDSCH with SPS activated by DCI format 1\_1 is scheduled without corresponding PDCCH transmission using *SPS-Config*,
- the UE shall use  $I_{MCS}$  and Table 5.1.3.1-4 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif the UE is not configured with the higher layer parameter *mcs-Table* given by *SPS-config*, and the higher layer parameter *mcs-TableDCI-1-2-r17* given by *PDSCH-Config* is set to 'qam1024',

- if the PDSCH is scheduled by a PDCCH with DCI format 1\_2 with CRC scrambled by CS-RNTI or
- if the PDSCH with SPS activated by DCI format 1\_2 is scheduled without corresponding PDCCH transmission using *SPS-Config*,
- the UE shall use  $I_{MCS}$  and Table 5.1.3.1-4 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif the UE is not configured with the higher layer parameter *mcs-Table* given by *SPS-config*, and the higher layer parameter *mcs-TableDCI-1-2* given by *PDSCH-Config* is set to 'qam256',

- if the PDSCH is scheduled by a PDCCH with DCI format 1\_2 with CRC scrambled by CS-RNTI or
- if the PDSCH with SPS activated by DCI format 1\_2 is scheduled without corresponding PDCCH transmission using *SPS-Config*,

- the UE shall use  $I_{MCS}$  and Table 5.1.3.1-2 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif the UE is not configured with the higher layer parameter *mcs-Table* given by *SPS-Config*, and the higher layer parameter *mcs-Table* given by *PDSCH-Config* is set to 'qam256',

- if the PDSCH is scheduled by a PDCCH with DCI format 1\_1 with CRC scrambled by CS-RNTI or
- if the PDSCH with SPS activated by DCI format 1\_1 is scheduled without corresponding PDCCH transmission using *SPS-Config*,
  - the UE shall use  $I_{MCS}$  and Table 5.1.3.1-2 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif the UE is configured with the higher layer parameter *mcs-Table* given by *SPS-Config* set to 'qam64LowSE'

- if the PDSCH is scheduled by a PDCCH with CRC scrambled by CS-RNTI or
- if the PDSCH is scheduled without corresponding PDCCH transmission using *SPS-Config*,
  - the UE shall use  $I_{MCS}$  and Table 5.1.3.1-3 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

elseif the UE is configured with the higher layer parameter *mcs-Table* given by *SPS-Config* or *mcs-Table* of *pdsch-ConfigMulticast* in the same *CFR-ConfigMulticast* set to 'qam64LowSE'

- if the GC-PDSCH is scheduled by a GC-PDCCH with CRC scrambled by G-CS-RNTI or
- if the GC-PDSCH is scheduled without corresponding GC-PDCCH transmission using *SPS-Config*,
  - the UE shall use  $I_{MCS}$  and Table 5.1.3.1-3 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

else

- the UE shall use  $I_{MCS}$  and Table 5.1.3.1-1 to determine the modulation order ( $Q_m$ ) and Target code rate ( $R$ ) used in the physical downlink shared channel.

end

The UE is not expected to decode a PDSCH scheduled with P-RNTI, RA-RNTI, SI-RNTI and  $Q_m > 2$

For a UE configured with the higher layer parameter *repetitionScheme* set to 'fdmSchemeB', and when the UE is indicated with two TCI states in a codepoint of the DCI field '*Transmission Configuration Indication*' and DM-RS port(s) within one CDM group in the DCI field '*Antenna Port(s)*', the determined modulation order of PDSCH transmission occasion associated with the first TCI state is applied to the PDSCH transmission occasion associated with the second TCI state.

**Table 5.1.3.1-1: MCS index table 1 for PDSCH**

| <b>MCS Index</b><br>$I_{MCS}$ | <b>Modulation Order</b><br>$Q_m$ | <b>Target code Rate <math>R \times [1024]</math></b> | <b>Spectral efficiency</b> |
|-------------------------------|----------------------------------|------------------------------------------------------|----------------------------|
| <b>0</b>                      | 2                                | 120                                                  | 0.2344                     |
| <b>1</b>                      | 2                                | 157                                                  | 0.3066                     |
| <b>2</b>                      | 2                                | 193                                                  | 0.3770                     |
| <b>3</b>                      | 2                                | 251                                                  | 0.4902                     |
| <b>4</b>                      | 2                                | 308                                                  | 0.6016                     |
| <b>5</b>                      | 2                                | 379                                                  | 0.7402                     |
| <b>6</b>                      | 2                                | 449                                                  | 0.8770                     |
| <b>7</b>                      | 2                                | 526                                                  | 1.0273                     |
| <b>8</b>                      | 2                                | 602                                                  | 1.1758                     |
| <b>9</b>                      | 2                                | 679                                                  | 1.3262                     |
| <b>10</b>                     | 4                                | 340                                                  | 1.3281                     |
| <b>11</b>                     | 4                                | 378                                                  | 1.4766                     |
| <b>12</b>                     | 4                                | 434                                                  | 1.6953                     |
| <b>13</b>                     | 4                                | 490                                                  | 1.9141                     |
| <b>14</b>                     | 4                                | 553                                                  | 2.1602                     |
| <b>15</b>                     | 4                                | 616                                                  | 2.4063                     |
| <b>16</b>                     | 4                                | 658                                                  | 2.5703                     |
| <b>17</b>                     | 6                                | 438                                                  | 2.5664                     |
| <b>18</b>                     | 6                                | 466                                                  | 2.7305                     |
| <b>19</b>                     | 6                                | 517                                                  | 3.0293                     |
| <b>20</b>                     | 6                                | 567                                                  | 3.3223                     |
| <b>21</b>                     | 6                                | 616                                                  | 3.6094                     |
| <b>22</b>                     | 6                                | 666                                                  | 3.9023                     |
| <b>23</b>                     | 6                                | 719                                                  | 4.2129                     |
| <b>24</b>                     | 6                                | 772                                                  | 4.5234                     |
| <b>25</b>                     | 6                                | 822                                                  | 4.8164                     |
| <b>26</b>                     | 6                                | 873                                                  | 5.1152                     |
| <b>27</b>                     | 6                                | 910                                                  | 5.3320                     |
| <b>28</b>                     | 6                                | 948                                                  | 5.5547                     |
| <b>29</b>                     | 2                                | reserved                                             |                            |
| <b>30</b>                     | 4                                | reserved                                             |                            |
| <b>31</b>                     | 6                                | reserved                                             |                            |

**Table 5.1.3.1-2: MCS index table 2 for PDSCH**

| <b>MCS Index</b><br>$I_{MCS}$ | <b>Modulation Order</b><br>$Q_m$ | <b>Target code Rate <math>R \times [1024]</math></b> | <b>Spectral efficiency</b> |
|-------------------------------|----------------------------------|------------------------------------------------------|----------------------------|
| 0                             | 2                                | 120                                                  | 0.2344                     |
| 1                             | 2                                | 193                                                  | 0.3770                     |
| 2                             | 2                                | 308                                                  | 0.6016                     |
| 3                             | 2                                | 449                                                  | 0.8770                     |
| 4                             | 2                                | 602                                                  | 1.1758                     |
| 5                             | 4                                | 378                                                  | 1.4766                     |
| 6                             | 4                                | 434                                                  | 1.6953                     |
| 7                             | 4                                | 490                                                  | 1.9141                     |
| 8                             | 4                                | 553                                                  | 2.1602                     |
| 9                             | 4                                | 616                                                  | 2.4063                     |
| 10                            | 4                                | 658                                                  | 2.5703                     |
| 11                            | 6                                | 466                                                  | 2.7305                     |
| 12                            | 6                                | 517                                                  | 3.0293                     |
| 13                            | 6                                | 567                                                  | 3.3223                     |
| 14                            | 6                                | 616                                                  | 3.6094                     |
| 15                            | 6                                | 666                                                  | 3.9023                     |
| 16                            | 6                                | 719                                                  | 4.2129                     |
| 17                            | 6                                | 772                                                  | 4.5234                     |
| 18                            | 6                                | 822                                                  | 4.8164                     |
| 19                            | 6                                | 873                                                  | 5.1152                     |
| 20                            | 8                                | 682.5                                                | 5.3320                     |
| 21                            | 8                                | 711                                                  | 5.5547                     |
| 22                            | 8                                | 754                                                  | 5.8906                     |
| 23                            | 8                                | 797                                                  | 6.2266                     |
| 24                            | 8                                | 841                                                  | 6.5703                     |
| 25                            | 8                                | 885                                                  | 6.9141                     |
| 26                            | 8                                | 916.5                                                | 7.1602                     |
| 27                            | 8                                | 948                                                  | 7.4063                     |
| 28                            | 2                                | reserved                                             |                            |
| 29                            | 4                                | reserved                                             |                            |
| 30                            | 6                                | reserved                                             |                            |
| 31                            | 8                                | reserved                                             |                            |

**Table 5.1.3.1-3: MCS index table 3 for PDSCH**

| <b>MCS Index</b><br>$I_{MCS}$ | <b>Modulation Order</b><br>$Q_m$ | <b>Target code Rate <math>R \times [1024]</math></b> | <b>Spectral efficiency</b> |
|-------------------------------|----------------------------------|------------------------------------------------------|----------------------------|
| <b>0</b>                      | 2                                | 30                                                   | 0.0586                     |
| <b>1</b>                      | 2                                | 40                                                   | 0.0781                     |
| <b>2</b>                      | 2                                | 50                                                   | 0.0977                     |
| <b>3</b>                      | 2                                | 64                                                   | 0.1250                     |
| <b>4</b>                      | 2                                | 78                                                   | 0.1523                     |
| <b>5</b>                      | 2                                | 99                                                   | 0.1934                     |
| <b>6</b>                      | 2                                | 120                                                  | 0.2344                     |
| <b>7</b>                      | 2                                | 157                                                  | 0.3066                     |
| <b>8</b>                      | 2                                | 193                                                  | 0.3770                     |
| <b>9</b>                      | 2                                | 251                                                  | 0.4902                     |
| <b>10</b>                     | 2                                | 308                                                  | 0.6016                     |
| <b>11</b>                     | 2                                | 379                                                  | 0.7402                     |
| <b>12</b>                     | 2                                | 449                                                  | 0.8770                     |
| <b>13</b>                     | 2                                | 526                                                  | 1.0273                     |
| <b>14</b>                     | 2                                | 602                                                  | 1.1758                     |
| <b>15</b>                     | 4                                | 340                                                  | 1.3281                     |
| <b>16</b>                     | 4                                | 378                                                  | 1.4766                     |
| <b>17</b>                     | 4                                | 434                                                  | 1.6953                     |
| <b>18</b>                     | 4                                | 490                                                  | 1.9141                     |
| <b>19</b>                     | 4                                | 553                                                  | 2.1602                     |
| <b>20</b>                     | 4                                | 616                                                  | 2.4063                     |
| <b>21</b>                     | 6                                | 438                                                  | 2.5664                     |
| <b>22</b>                     | 6                                | 466                                                  | 2.7305                     |
| <b>23</b>                     | 6                                | 517                                                  | 3.0293                     |
| <b>24</b>                     | 6                                | 567                                                  | 3.3223                     |
| <b>25</b>                     | 6                                | 616                                                  | 3.6094                     |
| <b>26</b>                     | 6                                | 666                                                  | 3.9023                     |
| <b>27</b>                     | 6                                | 719                                                  | 4.2129                     |
| <b>28</b>                     | 6                                | 772                                                  | 4.5234                     |
| <b>29</b>                     | 2                                | reserved                                             |                            |
| <b>30</b>                     | 4                                | reserved                                             |                            |
| <b>31</b>                     | 6                                | reserved                                             |                            |

**Table 5.1.3.1-4: MCS index table 4 for PDSCH**

| <b>MCS Index</b><br>$I_{MCS}$ | <b>Modulation Order</b><br>$Q_m$ | <b>Target code Rate <math>R \times [1024]</math></b> | <b>Spectral efficiency</b> |
|-------------------------------|----------------------------------|------------------------------------------------------|----------------------------|
| <b>0</b>                      | <b>2</b>                         | 120                                                  | 0.2344                     |
| <b>1</b>                      | <b>2</b>                         | 193                                                  | 0.3770                     |
| <b>2</b>                      | <b>2</b>                         | 449                                                  | 0.8770                     |
| <b>3</b>                      | <b>4</b>                         | 378                                                  | 1.4766                     |
| <b>4</b>                      | <b>4</b>                         | 490                                                  | 1.9141                     |
| <b>5</b>                      | <b>4</b>                         | 616                                                  | 2.4063                     |
| <b>6</b>                      | <b>6</b>                         | 466                                                  | 2.7305                     |
| <b>7</b>                      | <b>6</b>                         | 517                                                  | 3.0293                     |
| <b>8</b>                      | <b>6</b>                         | 567                                                  | 3.3223                     |
| <b>9</b>                      | <b>6</b>                         | 616                                                  | 3.6094                     |
| <b>10</b>                     | <b>6</b>                         | 666                                                  | 3.9023                     |
| <b>11</b>                     | <b>6</b>                         | 719                                                  | 4.2129                     |
| <b>12</b>                     | <b>6</b>                         | 772                                                  | 4.5234                     |
| <b>13</b>                     | <b>6</b>                         | 822                                                  | 4.8164                     |
| <b>14</b>                     | <b>6</b>                         | 873                                                  | 5.1152                     |
| <b>15</b>                     | <b>8</b>                         | 682.5                                                | 5.3320                     |
| <b>16</b>                     | <b>8</b>                         | 711                                                  | 5.5547                     |
| <b>17</b>                     | <b>8</b>                         | 754                                                  | 5.8906                     |
| <b>18</b>                     | <b>8</b>                         | 797                                                  | 6.2266                     |
| <b>19</b>                     | <b>8</b>                         | 841                                                  | 6.5703                     |
| <b>20</b>                     | <b>8</b>                         | 885                                                  | 6.9141                     |
| <b>21</b>                     | <b>8</b>                         | 916.5                                                | 7.1602                     |
| <b>22</b>                     | <b>8</b>                         | 948                                                  | 7.4063                     |
| <b>23</b>                     | <b>10</b>                        | 805.5                                                | 7.8662                     |
| <b>24</b>                     | <b>10</b>                        | 853                                                  | 8.3301                     |
| <b>25</b>                     | <b>10</b>                        | 900.5                                                | 8.7939                     |
| <b>26</b>                     | <b>10</b>                        | 948                                                  | 9.2578                     |
| <b>27</b>                     | <b>2</b>                         | reserved                                             |                            |
| <b>28</b>                     | <b>4</b>                         | reserved                                             |                            |
| <b>29</b>                     | <b>6</b>                         | reserved                                             |                            |
| <b>30</b>                     | <b>8</b>                         | reserved                                             |                            |
| <b>31</b>                     | <b>10</b>                        | reserved                                             |                            |

#### 5.1.3.2 Transport block size determination

In case the higher layer parameter *maxNrofCodeWordsScheduledByDCI* in *PDSCH-config* indicates that two codeword transmission is enabled, then one of the two transport blocks is disabled by DCI format 1\_1 if  $I_{MCS} = 26$  and if  $rv_{id} = 1$  for the corresponding transport block. In case the higher layer parameter *maxNrofCodeWordsScheduledByDCI* in *pdsch-ConfigMulticast* indicates that two codeword transmission is enabled, then one of the two transport blocks is disabled by DCI format 4\_2 if  $I_{MCS} = 26$  and if  $rv_{id} = 1$  for the corresponding transport block. When the UE is configured with higher layer parameter *pdsch-TimeDomainAllocationListForMultiPDSCH*, either the first or the second transport block of all scheduled PDSCHs is disabled by the DCI format 1\_1 if  $I_{MCS} = 26$  and if  $rv_{id} = 2$  for the corresponding transport block of all scheduled PDSCHs. If both transport blocks are enabled, transport block 1 and 2 are mapped to codeword 0 and 1 respectively. If only one transport block is enabled, then the enabled transport block is always mapped to the first codeword.

For the PDSCH assigned by a PDCCH with DCI format 1\_0, 1\_1, 4\_0, 4\_1, 4\_2 or 1\_2 with CRC scrambled by C-RNTI, MCS-C-RNTI, TC-RNTI, CS-RNTI, G-RNTI, G-CS-RNTI, MCCH-RNTI or SI-RNTI, if Table 5.1.3.1-2 is used and , else if Table 5.1.3.1-4 is used and or a table other than Table 5.1.3.1-2 and Table 5.1.3.1-4 is used and , the UE shall, except if the transport block is disabled in DCI format 1\_1, first determine the TBS as specified below:

1) The UE shall first determine the number of REs ( $N_{RE}$ ) within the slot.

- A UE first determines the number of REs allocated for PDSCH within a PRB ( $N_{sc}^{RB}$ ) by , where  $N_{sc}^{RB}$  is the number of subcarriers in a physical resource block,  $N_{symb}^{PDSCH}$  is the number of symbols of the PDSCH allocation within the slot,  $N_{symb}^{DMRS}$  is the number of REs for DM-RS per PRB in the scheduled duration including the overhead of the DM-RS CDM groups without data, as indicated by DCI format 1\_1 or format 1\_2 or as described for format 1\_0 in Clause 5.1.6.2, and  $x_{Overhead}$  is the overhead configured by higher layer parameter *xOverhead* in *PDSCH-ServingCellConfig*. If the *xOverhead* in *PDSCH-ServingCellConfig* is not configured (a value from 6, 12, or

18), the is set to 0. If the PDSCH is scheduled by PDCCH with a CRC scrambled by SI-RNTI, RA-RNTI, MSGB-RNTI or P-RNTI, is assumed to be 0. If the PDSCH is scheduled by PDCCH with a CRC scrambled by G-RNTI for multicast or G-CS-RNTI or PDSCH without PDCCH is activated by PDCCH with a CRC scrambled by G-CS-RNTI, is the overhead configured by higher layer parameter *xOverhead-Multicast* in *pdsch-ConfigMulticast*. If the *xOverhead-Multicast* in *pdsch-ConfigMulticast* is not configured, the is set to 0. If the PDSCH is scheduled by PDCCH with a CRC scrambled by G-RNTI for broadcast or MCCH-RNTI, is the overhead configured by higher layer parameter *xOverhead* in *pdsch-ConfigBroadcast*. If the *xOverhead* in *pdsch-ConfigBroadcast* is not configured, the is set to 0.

- A UE determines the total number of REs allocated for PDSCH () by  $N_{RE} = \min(156, N'_{RE}) \cdot n_{PRB}$ , where  $n_{PRB}$  is the total number of allocated PRBs for the UE.

2) Unquantized intermediate variable ( $N_{info}$ ) is obtained by .

If

Use step 3 as the next step of the TBS determination

else

Use step 4 as the next step of the TBS determination

end if

3) When , TBS is determined as follows

- quantized intermediate number of information bits , where .
- use Table 5.1.3.2-1 find the closest TBS that is not less than .

**Table 5.1.3.2-1: TBS for**

| Index | TBS | Index | TBS  | Index | TBS  | Index | TBS  |
|-------|-----|-------|------|-------|------|-------|------|
| 1     | 24  | 31    | 336  | 61    | 1288 | 91    | 3624 |
| 2     | 32  | 32    | 352  | 62    | 1320 | 92    | 3752 |
| 3     | 40  | 33    | 368  | 63    | 1352 | 93    | 3824 |
| 4     | 48  | 34    | 384  | 64    | 1416 |       |      |
| 5     | 56  | 35    | 408  | 65    | 1480 |       |      |
| 6     | 64  | 36    | 432  | 66    | 1544 |       |      |
| 7     | 72  | 37    | 456  | 67    | 1608 |       |      |
| 8     | 80  | 38    | 480  | 68    | 1672 |       |      |
| 9     | 88  | 39    | 504  | 69    | 1736 |       |      |
| 10    | 96  | 40    | 528  | 70    | 1800 |       |      |
| 11    | 104 | 41    | 552  | 71    | 1864 |       |      |
| 12    | 112 | 42    | 576  | 72    | 1928 |       |      |
| 13    | 120 | 43    | 608  | 73    | 2024 |       |      |
| 14    | 128 | 44    | 640  | 74    | 2088 |       |      |
| 15    | 136 | 45    | 672  | 75    | 2152 |       |      |
| 16    | 144 | 46    | 704  | 76    | 2216 |       |      |
| 17    | 152 | 47    | 736  | 77    | 2280 |       |      |
| 18    | 160 | 48    | 768  | 78    | 2408 |       |      |
| 19    | 168 | 49    | 808  | 79    | 2472 |       |      |
| 20    | 176 | 50    | 848  | 80    | 2536 |       |      |
| 21    | 184 | 51    | 888  | 81    | 2600 |       |      |
| 22    | 192 | 52    | 928  | 82    | 2664 |       |      |
| 23    | 208 | 53    | 984  | 83    | 2728 |       |      |
| 24    | 224 | 54    | 1032 | 84    | 2792 |       |      |
| 25    | 240 | 55    | 1064 | 85    | 2856 |       |      |
| 26    | 256 | 56    | 1128 | 86    | 2976 |       |      |
| 27    | 272 | 57    | 1160 | 87    | 3104 |       |      |
| 28    | 288 | 58    | 1192 | 88    | 3240 |       |      |
| 29    | 304 | 59    | 1224 | 89    | 3368 |       |      |
| 30    | 320 | 60    | 1256 | 90    | 3496 |       |      |

4) When , TBS is determined as follows.

- $$N'_{info} = \max \left( 3840, 2^n \times \text{round} \left( \frac{N_{info} - 24}{2^n} \right) \right), \text{ where}$$
- quantized intermediate number of information bits and ties in the round function are broken towards the next largest integer.
  - if
    - , where
    - else
    - if
    - , where
    - else
    - end if
  - end if
  - else if Table 5.1.3.1-2 is used and ,
    - the TBS is assumed to be as determined from the DCI transported in the latest PDCCH for the same transport block using . If there is no PDCCH for the same transport block using , and if the initial PDSCH for the same transport block is semi-persistently scheduled, the TBS shall be determined from the most recent semi-persistent scheduling assignment PDCCH.
  - else if Table 5.1.3.1-4 is used and ,
    - the TBS is assumed to be as determined from the DCI transported in the latest PDCCH for the same transport block using . If there is no PDCCH for the same transport block using , and if the initial PDSCH for the same transport block is semi-persistently scheduled, the TBS shall be determined from the most recent semi-persistent scheduling assignment PDCCH.
  - else
    - the TBS is assumed to be as determined from the DCI transported in the latest PDCCH for the same transport block using . If there is no PDCCH for the same transport block using, and if the initial PDSCH for the same transport block is semi-persistently scheduled, the TBS shall be determined from the most recent semi-persistent scheduling assignment PDCCH.

The UE is not expected to receive a PDSCH assigned by a PDCCH with CRC scrambled by SI-RNTI with a TBS exceeding 2976 bits.

For a UE configured with the higher layer parameter *repetitionScheme* set to 'fdmSchemeB' and indicated with two TCI states in a codepoint of the DCI field '*Transmission Configuration Indication*' and DM-RS port(s) within one CDM group in the DCI field '*Antenna Port(s)*', the TBS determination follows the steps 1-4 with the following modification in

step 1: a UE determines the total number of REs allocated for PDSCH () by  $N_{RE} = \min(156, N'_{RE}) \cdot n_{PRB}$ , where  $n_{PRB}$  is the total number of allocated PRBs corresponding to the first TCI state, and the determined TBS of PDSCH transmission occasion associated with the first TCI state is also applied to the PDSCH transmission occasion associated with the second TCI state. For a UE configured with the higher layer parameter *repetitionScheme* set to 'tdmSchemeA' and indicated with two TCI states in a codepoint of the DCI field '*Transmission Configuration Indication*' and DM-RS port(s) within one CDM group in the DCI field '*Antenna Port(s)*', the TBS determination follows the steps 1-4 with the following modification in step 1: a UE determines the number of REs allocated for PDSCH within a PRB () by , where is the number of symbols of the PDSCH allocation within the slot corresponding to the first TCI state, and the determined TBS of PDSCH transmission occasion associated with the first TCI state is also applied to the PDSCH transmission occasion associated with the second TCI state.

For the PDSCH assigned by a PDCCH with DCI format 1\_0 with CRC scrambled by P-RNTI, or RA-RNTI, MsgB-RNTI, TBS determination follows the steps 1-4 with the following modification in step 2: a scaling

$N_{info} = S \cdot N_{RE} \cdot R \cdot Q_m \cdot v$  is applied in the calculation of  $N_{info}$ , where the scaling factor is determined based on the *TB scaling* field in the DCI as in Table 5.1.3.2-2.

**Table 5.1.3.2-2: Scaling factor of  $N_{info}

*(Catatan: Rincian tabel bersambung pada rilis spesifikasi resmi...)*
