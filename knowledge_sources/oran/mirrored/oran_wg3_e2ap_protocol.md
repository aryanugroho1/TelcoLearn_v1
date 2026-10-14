---
topic_key: oran_wg3_e2ap_protocol
title: O-RAN WG3 E2 Application Protocol (E2AP) Specification
source_vendor: o_ran
doc_type: specification
technology: o_ran
category: o_ran
keywords: e2ap, wg3, e2 subscription, e2 indication, e2 control, e2 setup, ric service update, e2sm, kpm, rc
summary: Salinan spesifikasi resmi O-RAN WG3 (O-RAN.WG3.TS.E2AP-R004-v07.00) dari repositori GSMA/oran Open-Telco Corpus.
---

# 4 General

## 4.1 Procedure specification principles

The principle for specifying the procedure logic is to specify the functional behaviour of the terminating node exactly and completely. Any rule that specifies the behaviour of the originating node shall be possible to be verified with information that is visible within the system.

The following specification principles have been applied for the procedure text in clause 8:

- The procedure text discriminates between:
  - 1) Functionality which "shall" be executed.
 

The procedure text indicates that the receiving node "shall" perform a certain function Y under a certain condition. If the receiving node supports procedure X but cannot perform functionality Y requested in the REQUEST message of a Class 1 EP, the receiving node shall respond with the message used to report unsuccessful outcome for this procedure, containing an appropriate cause value.
  - 2) Functionality which "shall, if supported" be executed.
 

The procedure text indicates that the receiving node "shall, if supported," perform a certain function Y under a certain condition. If the receiving node supports procedure X, but does not support functionality Y, the receiving node shall proceed with the execution of the EP, possibly informing the requesting node about the nonsupported functionality.
- Any required inclusion of an optional IE in a response message is explicitly indicated in the procedure text. If the procedure text does not explicitly indicate that an optional IE shall be included in a response message, the optional IE shall not be included. For requirements on including Criticality Diagnostics IE, see clause 10.

## 4.2 Forwards and backwards compatibility

The forwards and backwards compatibility of the protocol is assured by mechanism where all current and future messages, and IEs or groups of related IEs, include ID and criticality fields that are coded in a standard format that will not be changed in the future. These parts can always be decoded regardless of the standard version.

## 4.3 Specification notations

For the purposes of the present document, the following notations apply:

|                |                                                                                                                                                                                                                                                                              |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Procedure      | When referring to an Elementary Procedure (EP) in the present document the Procedure Name is written with the first letters in each word in upper case characters followed by the word "procedure", e.g. Handover Preparation procedure.                                     |
| Message        | When referring to a message in the present document the MESSAGE NAME is written with all letters in upper case characters followed by the word "message", e.g. HANDOVER REQUEST message.                                                                                     |
| IE             | When referring to an Information Element (IE) in the present document the <i>Information Element Name</i> is written with the first letters in each word in upper case characters and all letters in Italic font followed by the abbreviation "IE", e.g. <i>E-RAB ID</i> IE. |
| Value of an IE | When referring to the value of an Information Element (IE) in the present document the "Value" is written as it is specified in the present document enclosed by quotation marks, e.g. "Value".                                                                              |

# --- 5 E2AP Services

## 5.1 E2AP procedure modules

The E2 interface E2AP procedures are divided into two modules as follows:

1. RIC Functional Procedures;
2. Global Procedures.

The RIC functional procedures module contains procedures used to pass application specific messages between Near-RT RIC applications and a target RAN Function in an E2 node as specified in O-RAN WG3.TS.E2GAP [2].

The Global Procedures module contains procedures that are not directly related to a specific application.

## 5.2 Parallel transactions

Parallel transactions, that is, multiple ongoing E2AP procedures related to the same Application and E2 node, are supported.

# --- 6 Services expected from signalling transport

The signalling connection shall provide in sequence delivery of E2AP messages. E2AP shall be notified if the signalling connection breaks.

# --- 7 Functions of E2AP

The functions of E2AP are described in O-RAN WG3.TS.E2GAP [2].

# --- 8 E2AP procedures

## 8.1 Elementary procedures

In the Tables 8.1-1 and 8.1-2, all EPs are divided into Class 1 and Class 2 EPs.

Table 8.1-1: Class 1 Elementary Procedures

| Initiated by           | Elementary Procedure                   | Initiating Message                     | Successful Outcome Response message      | Unsuccessful Outcome Response message  |
|------------------------|----------------------------------------|----------------------------------------|------------------------------------------|----------------------------------------|
| Near-RT RIC            | RIC Subscription                       | RIC SUBSCRIPTION REQUEST               | RIC SUBSCRIPTION RESPONSE                | RIC SUBSCRIPTION FAILURE               |
| Near-RT RIC            | RIC Subscription Delete                | RIC SUBSCRIPTION DELETE REQUEST        | RIC SUBSCRIPTION DELETE RESPONSE         | RIC SUBSCRIPTION DELETE FAILURE        |
| Near-RT RIC            | RIC Subscription Modification          | RIC SUBSCRIPTION MODIFICATION REQUEST  | RIC SUBSCRIPTION MODIFICATION RESPONSE   | RIC SUBSCRIPTION MODIFICATION FAILURE  |
| E2 Node                | RIC Subscription Modification Required | RIC SUBSCRIPTION MODIFICATION REQUIRED | RIC SUBSCRIPTION MODIFICATION CONFIRM    | RIC SUBSCRIPTION MODIFICATION REFUSE   |
| Near-RT RIC            | RIC Subscription State Control         | RIC SUBSCRIPTION STATE CONTROL REQUEST | RIC SUBSCRIPTION STATE CONTROL RESPONSE  | RIC SUBSCRIPTION STATE CONTROL FAILURE |
| Near-RT RIC            | RIC Subscription Audit                 | RIC SUBSCRIPTION AUDIT REQUEST         | RIC SUBSCRIPTION AUDIT RESPONSE          | RIC SUBSCRIPTION AUDIT FAILURE         |
| E2 Node                | RIC Assistance                         | RIC ASSISTANCE REQUEST                 | RIC ASSISTANCE RESPONSE                  | RIC ASSISTANCE FAILURE                 |
| Near-RT RIC            | RIC Control                            | RIC CONTROL REQUEST                    | RIC CONTROL ACKNOWLEDGE                  | RIC CONTROL FAILURE                    |
| Near-RT RIC            | RIC Query                              | RIC QUERY REQUEST                      | RIC QUERY RESPONSE                       | RIC QUERY FAILURE                      |
| Near-RT RIC            | RIC Service Load Status                | RIC SERVICE LOAD STATUS REQUEST        | RIC SERVICE LOAD STATUS RESPONSE         | RIC SERVICE LOAD STATUS FAILURE        |
| E2 Node                | E2 Setup                               | E2 SETUP REQUEST                       | E2 SETUP RESPONSE                        | E2 SETUP FAILURE                       |
| E2 Node                | RIC Service Update                     | RIC SERVICE UPDATE                     | RIC SERVICE UPDATE ACKNOWLEDGE           | RIC SERVICE UPDATE FAILURE             |
| E2 Node                | E2 Node Configuration Update           | E2 NODE CONFIGURATION UPDATE           | E2 NODE CONFIGURATION UPDATE ACKNOWLEDGE | E2 NODE CONFIGURATION UPDATE FAILURE   |
| Near-RT RIC            | E2 Connection Update                   | E2 CONNECTION UPDATE                   | E2 CONNECTION UPDATE ACKNOWLEDGE         | E2 CONNECTION UPDATE FAILURE           |
| Near-RT RIC or E2 Node | Reset                                  | RESET REQUEST                          | RESET RESPONSE                           |                                        |
| Near-RT RIC or E2 Node | E2 Removal                             | E2 REMOVAL REQUEST                     | E2 REMOVAL RESPONSE                      | E2 REMOVAL FAILURE                     |

**Table 8.1-2: Class 2 Elementary Procedures**

| Initiated by           | Elementary Procedure             | Initiating Message               |
|------------------------|----------------------------------|----------------------------------|
| Near-RT RIC            | RIC Assistance Indication        | RIC ASSISTANCE INDICATION        |
| E2 Node                | RIC Assistance Halt              | RIC ASSISTANCE HALT              |
| E2 Node                | RIC Indication                   | RIC INDICATION                   |
| Near-RT RIC            | RIC Service Query                | RIC SERVICE QUERY                |
| E2 Node                | RIC Subscription Delete Required | RIC SUBSCRIPTION DELETE REQUIRED |
| E2 Node                | RIC Service Load Update          | RIC SERVICE LOAD UPDATE          |
| E2 Node or Near-RT RIC | Error Indication                 | ERROR INDICATION                 |

## 8.2 RIC Functional procedures

### 8.2.1 RIC Subscription procedure

#### 8.2.1.1 General

This procedure is used to establish RIC Subscriptions on E2 Node consisting of an event trigger and a sequence of RIC Service Actions.

This procedure shall be initiated by the Near-RT RIC.

This procedure uses RIC Service signalling.

#### 8.2.1.2 Successful operation

![Sequence diagram showing the RIC Subscription procedure, successful operation. The diagram shows two instances of 'Near-RT RIC' and two instances of 'E2 Node'. A message 'RIC SUBSCRIPTION REQUEST' is sent from the top 'Near-RT RIC' to the top 'E2 Node'. A message 'RIC SUBSCRIPTION RESPONSE' is sent from the top 'E2 Node' to the bottom 'Near-RT RIC'.](a46604d3bdae30b813025088d10b722c_img.jpg)

```

sequenceDiagram
    participant N1 as Near-RT RIC
    participant E1 as E2 Node
    participant N2 as Near-RT RIC
    participant E2 as E2 Node
    N1->>E1: RIC SUBSCRIPTION REQUEST
    E1-->>N2: RIC SUBSCRIPTION RESPONSE
  
```

Sequence diagram showing the RIC Subscription procedure, successful operation. The diagram shows two instances of 'Near-RT RIC' and two instances of 'E2 Node'. A message 'RIC SUBSCRIPTION REQUEST' is sent from the top 'Near-RT RIC' to the top 'E2 Node'. A message 'RIC SUBSCRIPTION RESPONSE' is sent from the top 'E2 Node' to the bottom 'Near-RT RIC'.

**Figure 8.2.1.2-1: RIC Subscription procedure, successful operation**

The Near-RT RIC initiates the procedure by sending a RIC SUBSCRIPTION REQUEST message, which shall contain a unique *RIC Request ID* IE, assigned by the Near-RT RIC, to the E2 Node.

When the Near-RT RIC sends the RIC SUBSCRIPTION REQUEST message, it shall start the timer  $T_{RICEVENTcreate}$ .

At reception of the RIC SUBSCRIPTION REQUEST message the E2 Node shall:

- Determine the target RAN Function using the information in the *RAN Function ID* IE and configure the requested event trigger using information in the *RIC Subscription Details* IE.

- If one or more Report, Insert and/or Policy RIC Service Actions are included in the *RIC Subscription Details* IE then the target RAN Function shall validate the event trigger and requested action sequence and, if accepted, store the required *RIC Request ID*, *RIC Event Trigger Definition* IE and sequence of RIC Service Actions.
- If optional *RIC Subscription Start Time* IE is present and has expired, then the E2 Node shall ignore the optional *RIC Subscription Start Time* IE.

If the requested trigger and at least one required RIC Service Action are accepted by the E2 Node, the E2 Node shall reserve for each admitted RIC Service Action the necessary resources and send the RIC SUBSCRIPTION RESPONSE message back to the Near-RT RIC.

The E2 Node shall include in the response message the RIC Service Actions for which resources have been prepared at the E2 Node in the *RIC Actions Admitted List* IE.

The E2 Node shall include the RIC Service Actions that have not been admitted in the *RIC Actions Not Admitted List* IE with an appropriate cause value.

Upon reception of the RIC SUBSCRIPTION RESPONSE message the Near-RT RIC shall stop timer  $T_{RICEVENTcreate}$  and terminate the RIC Subscription procedure.

If more than one RIC Service Actions has been accepted by the E2 Node then, at each occurrence of the common Event Trigger, the sequence of RIC Service Actions shall be executed according to the following considerations:

- If optional *RIC Action Execution Order* IE is not present or is present and set to 0 ("Any order"), then the specific RIC Service Action in the sequence of RIC Service Actions may be executed in any order irrespective of the execution order of the other RIC Service Actions.
- If optional *RIC Action Execution Order* IE is present and set to a value greater than 0, then the specific RIC Service Action shall be executed in order according to the *RIC Action Execution Order* IE.
- If two or more RIC Service Actions have the same value for the optional *RIC Action Execution Order* IE then these RIC Service Actions shall be executed in parallel.

If the optional *RIC Subscription Start Time* IE is present, the E2 Node shall only enable the event trigger from the indicated start time.

If the optional *RIC Subscription End Time* IE is present, the E2 Node shall disable the event trigger when the indicated end time has expired.

##### **Interactions with RIC Subscription Delete Required procedure:**

If the optional *RIC Subscription End Time* IE is present and the indicated end time has expired, the E2 Node may send the RIC SUBSCRIPTION DELETE REQUIRED message to the Near-RT RIC with an appropriate cause value.

##### **Interactions with RIC Subscription Delete procedure:**

If the optional *RIC Subscription End Time* IE is present, the Near-RT RIC may initiate an RIC Subscription Delete procedure when the expected *RIC Subscription End Time* has expired.

#### 8.2.1.3 Unsuccessful operation

![Sequence diagram showing the unsuccessful RIC Subscription procedure. A Near-RT RIC sends a RIC SUBSCRIPTION REQUEST to an E2 Node. The E2 Node responds with a RIC SUBSCRIPTION FAILURE message back to the Near-RT RIC.](423a557532703319d8c5524560cb5fbe_img.jpg)

```

sequenceDiagram
    participant Near-RT RIC
    participant E2 Node
    Near-RT RIC->>E2 Node: RIC SUBSCRIPTION REQUEST
    E2 Node->>Near-RT RIC: RIC SUBSCRIPTION FAILURE

```

Sequence diagram showing the unsuccessful RIC Subscription procedure. A Near-RT RIC sends a RIC SUBSCRIPTION REQUEST to an E2 Node. The E2 Node responds with a RIC SUBSCRIPTION FAILURE message back to the Near-RT RIC.

**Figure 8.2.1.3-1: RIC Subscription procedure, unsuccessful operation**

If a failure occurs during the RIC Subscription procedure the E2 Node shall send the RIC SUBSCRIPTION FAILURE message to the Near-RT RIC containing an appropriate cause value.

If the E2 Node admits none of the requested RIC Service Actions, or detects an issue with the requested sequence of RIC Service Actions, or in the optional *RIC Subsequent Action* IE definitions, the E2 Node shall send the RIC SUBSCRIPTION FAILURE message to the Near-RT RIC containing an appropriate cause value.

If the RIC Subscription procedure contains an invalid optional *RIC Subscription Start Time* IE and/or *RIC Subscription End Time* IE, the E2 Node shall send the RIC SUBSCRIPTION FAILURE message to the Near-RT RIC containing an appropriate cause value.

Upon reception of the RIC SUBSCRIPTION FAILURE message the Near-RT RIC shall stop the timer  $T_{\text{RICcreate}}$  and terminate the RIC Subscription procedure.

##### Interactions with RIC Subscription Delete procedure:

If there is no response from the E2 Node to the RIC SUBSCRIPTION REQUEST message before timer  $T_{\text{RICcreate}}$  expires in the Near-RT RIC, the Near-RT RIC shall initiate the RIC Subscription Delete procedure containing *RIC Request ID* IE that was previously assigned by the Near-RT RIC to cancel the RIC Subscription towards the E2 Node. The Near-RT RIC shall ignore any RIC SUBSCRIPTION RESPONSE or RIC SUBSCRIPTION FAILURE message containing *RIC Request ID* IE that was previously assigned by the Near-RT RIC received after the initiation of the RIC Subscription Delete procedure and release any resources related to the concerned E2 Node.

#### 8.2.1.4 Abnormal conditions

### 8.2.2 RIC Subscription Delete procedure

#### 8.2.2.1 General

This procedure is used to delete RIC Subscriptions on E2 Node.

This procedure shall be initiated by the Near-RT RIC.

This procedure uses RIC Service signalling.

#### 8.2.2.2 Successful operation

![Sequence diagram for successful RIC Subscription Delete procedure](63061e2677d6286caee26e8886bc5d08_img.jpg)

```

sequenceDiagram
    participant Near-RT RIC
    participant E2 Node
    Near-RT RIC->>E2 Node: RIC SUBSCRIPTION DELETE REQUEST
    E2 Node->>Near-RT RIC: RIC SUBSCRIPTION DELETE RESPONSE
  
```

The diagram illustrates the successful operation of the RIC Subscription Delete procedure. It shows the Near-RT RIC sending a 'RIC SUBSCRIPTION DELETE REQUEST' message to the E2 Node, and the E2 Node responding with a 'RIC SUBSCRIPTION DELETE RESPONSE' message.

Sequence diagram for successful RIC Subscription Delete procedure

**Figure 8.2.2.2-1: RIC Subscription Delete procedure, successful operation**

The Near-RT RIC initiates the procedure by sending a RIC SUBSCRIPTION DELETE REQUEST message, containing *RIC Request ID* IE that was previously assigned by the Near-RT RIC during a successful RIC Subscription procedure, to the E2 Node.

When the Near-RT RIC sends the RIC SUBSCRIPTION DELETE REQUEST message, it shall start timer  $T_{\text{RICEVENTdelete}}$ .

At reception of the RIC SUBSCRIPTION DELETE REQUEST message the E2 Node shall delete the indicated RIC Subscription and release the corresponding necessary resources.

The E2 Node shall send the RIC SUBSCRIPTION DELETE RESPONSE message back to the Near-RT RIC.

Upon reception of the RIC SUBSCRIPTION DELETE RESPONSE message the Near-RT RIC shall stop timer  $T_{\text{RICEVENTdelete}}$ , release any necessary resources associated with that RIC Subscription and terminate the RIC Subscription Delete procedure.

#### 8.2.2.3 Unsuccessful operation

![Sequence diagram for unsuccessful RIC Subscription Delete procedure](68d6201add786997d64525e3d9686a83_img.jpg)

```

sequenceDiagram
    participant Near-RT RIC
    participant E2 Node
    Near-RT RIC->>E2 Node: RIC SUBSCRIPTION DELETE REQUEST
    E2 Node->>Near-RT RIC: RIC SUBSCRIPTION DELETE FAILURE
  
```

The diagram illustrates the unsuccessful operation of the RIC Subscription Delete procedure. It shows the Near-RT RIC sending a 'RIC SUBSCRIPTION DELETE REQUEST' message to the E2 Node, and the E2 Node responding with a 'RIC SUBSCRIPTION DELETE FAILURE' message.

Sequence diagram for unsuccessful RIC Subscription Delete procedure

**Figure 8.2.2.3-1: RIC Subscription Delete procedure, unsuccessful operation**

If a failure occurs during the RIC Subscription Delete procedure, the E2 Node shall send the RIC SUBSCRIPTION DELETE FAILURE message to the Near-RT RIC containing an appropriate cause value.

If the *RIC Request ID* IE included in the RIC SUBSCRIPTION DELETE REQUEST message is unknown, the E2 Node shall send the RIC SUBSCRIPTION DELETE FAILURE message to the Near-RT RIC containing an appropriate cause value

Upon reception of the RIC SUBSCRIPTION DELETE FAILURE message the Near-RT RIC shall stop timer  $T_{\text{RICEVENTdelete}}$  and terminate the RIC Subscription Delete procedure.

#### 8.2.2.4 Abnormal conditions

If the E2 Node receives a RIC SUBSCRIPTION DELETE REQUEST message contains an unknown *RAN Function ID* IE, the E2 Node shall send the RIC SUBSCRIPTION DELETE FAILURE message to the Near-RT RIC containing an appropriate cause value.

### 8.2.2A RIC Subscription Delete Required procedure

#### 8.2.2A.1 General

This procedure is used to enable the E2 Node to request deletion of the existing RIC Subscriptions in the E2 Node previously created for the Near-RT RIC.

This procedure shall be initiated by the E2 Node.

This procedure uses RIC Service signalling.

#### 8.2.2A.2 Successful operation

![Sequence diagram showing the RIC Subscription Delete Required procedure. The E2 Node sends a 'RIC SUBSCRIPTION DELETE REQUIRED' message to the Near-RT RIC. The Near-RT RIC then initiates the 'RIC Subscription Delete procedure' back towards the E2 Node.](a62d44a3d5bd1b617b68abec7cccbb13_img.jpg)

```

sequenceDiagram
    participant E2 as E2 Node
    participant Near-RT as Near-RT RIC
    E2->>Near-RT: RIC SUBSCRIPTION DELETE REQUIRED
    Note over Near-RT: RIC Subscription Delete procedure
    Near-RT-->>E2: 
  
```

Sequence diagram showing the RIC Subscription Delete Required procedure. The E2 Node sends a 'RIC SUBSCRIPTION DELETE REQUIRED' message to the Near-RT RIC. The Near-RT RIC then initiates the 'RIC Subscription Delete procedure' back towards the E2 Node.

**Figure 8.2.2A.2-1: RIC Subscription Delete Required procedure, successful operation**

The E2 Node initiates the procedure by sending a RIC SUBSCRIPTION DELETE REQUIRED message, containing *RIC Request ID* IE that was previously assigned by the Near-RT RIC during a successful RIC Subscription procedure, to the Near-RT RIC.

The message shall contain an appropriate cause value for each RIC Subscription requesting to remove.

At reception of the RIC SUBSCRIPTION DELETE REQUIRED message, for each RIC Subscription associated with the included *RIC Request ID* IE and *RAN Function ID* IE, the Near-RT RIC may initiate the RIC Subscription Delete procedure toward the E2 Node.

#### 8.2.2A.3 Abnormal conditions

If the Near-RT RIC receives a RIC SUBSCRIPTION DELETE REQUIRED message which contains an unknown *RIC Request ID* IE and *RAN Function ID* IE, the Near-RT RIC shall ignore the message.

### 8.2.2B RIC Subscription Audit procedure

#### 8.2.2B.1 General

This procedure is used to audit the list of establish RIC Subscriptions on E2 Node.

This procedure shall be initiated by the Near-RT RIC.

This procedure uses RIC Service signalling.

#### 8.2.2B.2 Successful operation

![Sequence diagram showing the RIC Subscription Audit procedure. A Near-RT RIC sends a RIC SUBSCRIPTION AUDIT REQUEST to an E2 Node, and the E2 Node responds with a RIC SUBSCRIPTION AUDIT RESPONSE.](4d74c95402ccff1aee1004335fb98f94_img.jpg)

```

sequenceDiagram
    participant N1 as Near-RT RIC
    participant E1 as E2 Node
    participant N2 as Near-RT RIC
    participant E2 as E2 Node
    N1-->>E1: RIC SUBSCRIPTION AUDIT REQUEST
    E1-->>N2: RIC SUBSCRIPTION AUDIT RESPONSE
  
```

Sequence diagram showing the RIC Subscription Audit procedure. A Near-RT RIC sends a RIC SUBSCRIPTION AUDIT REQUEST to an E2 Node, and the E2 Node responds with a RIC SUBSCRIPTION AUDIT RESPONSE.

**Figure 8.2.2B.2-1: RIC Subscription Audit procedure, successful operation**

The Near-RT RIC initiates the procedure by sending a RIC SUBSCRIPTION AUDIT REQUEST message which shall contain a unique *RIC Request ID* IE, assigned by the Near-RT RIC to identify the procedure, and may contain the *RIC Subscription Audit List* IE with each item containing a *RIC Request ID* IE, that was previously assigned by the Near-RT RIC during a successful RIC Subscription procedure, to the E2 Node.

When the Near-RT RIC sends the RIC SUBSCRIPTION AUDIT REQUEST message, it shall start the timer  $T_{\text{RICEVENTcreate}}$ .

At reception of the RIC SUBSCRIPTION AUDIT REQUEST message the E2 Node shall:

- If the *RIC Subscription Audit List* IE is present and contains at least one RIC Subscription, identified by the *RIC Request ID* IE, that is recognized by the E2 Node, then the E2 Node shall record the confirmed RIC Subscriptions in the *RIC Subscription Confirmed List* IE.
- If the *RIC Subscription Audit List* IE is present and contains at least one RIC Subscription, identified by the *RIC Request ID* IE, that is not known to the E2 Node, then the E2 Node shall record the unknown RIC Subscriptions in the *RIC Subscription Unknown List* IE.
- If the *RIC Subscription Audit List* IE is present and if the *RIC Subscription Audit Flag* IE is not present and the E2 Node holds at least one established RIC Subscription that is not included in the *RIC Subscription Audit List* IE, then the E2 Node shall record the missing RIC Subscriptions in the *RIC Subscription Missing List* IE.
- If the *RIC Subscription Audit List* IE is present and if the *RIC Subscription Audit Flag* IE is present and the *Listed Records Only* IE is present and set to TRUE, then the E2 Node shall only respond with respect to the RIC Subscriptions in the *RIC Subscription Audit List* IE.

- If the *RIC Subscription Audit List IE* is not present, then the E2 Node shall record all established RIC Subscriptions in the *RIC Subscription Missing List IE*.

After processing the RIC SUBSCRIPTION AUDIT REQUEST message, if the E2 Node has at least one item in *RIC Subscription Confirmed List IE*, *RIC Subscription Unknown List IE* or *RIC Subscription Missing List IE*, the E2 Node shall send the RIC SUBSCRIPTION AUDIT RESPONSE message back to the Near-RT RIC.

The E2 Node shall include in the response message the confirmed RIC Subscriptions in the *RIC Subscription Confirmed List IE*.

The E2 Node shall include in the response message the not known RIC Subscriptions in the *RIC Subscription Unknown List IE*.

The E2 Node shall include in the response message the missing RIC Subscriptions in the *RIC Subscription Missing List IE*.

Upon reception of the RIC SUBSCRIPTION AUDIT RESPONSE message the Near-RT RIC shall stop timer T<sub>RICEVENTcreate</sub> and terminate the RIC Subscription Audit procedure.

#### 8.2.2B.3 Unsuccessful operation

![Sequence diagram showing the unsuccessful RIC Subscription Audit procedure. A Near-RT RIC sends a RIC SUBSCRIPTION AUDIT REQUEST to an E2 Node. The E2 Node responds with a RIC SUBSCRIPTION AUDIT FAILURE message.](a8cff121ed47c877b9b6e30c21d09225_img.jpg)

```

sequenceDiagram
    participant Near-RT RIC
    participant E2 Node
    Near-RT RIC->>E2 Node: RIC SUBSCRIPTION AUDIT REQUEST
    E2 Node-->>Near-RT RIC: RIC SUBSCRIPTION AUDIT FAILURE

```

Sequence diagram showing the unsuccessful RIC Subscription Audit procedure. A Near-RT RIC sends a RIC SUBSCRIPTION AUDIT REQUEST to an E2 Node. The E2 Node responds with a RIC SUBSCRIPTION AUDIT FAILURE message.

**Figure 8.2.2B.3-1: RIC Subscription Audit procedure, unsuccessful operation**

If a failure occurs during the RIC Subscription Audit procedure the E2 Node shall send the RIC SUBSCRIPTION AUDIT FAILURE message to the Near-RT RIC containing an appropriate cause value.

If the E2 Node after processing the RIC SUBSCRIPTION AUDIT REQUEST message, the E2 Node does not have at least one item in *RIC Subscription Confirmed List IE*, *RIC Subscription Unknown List IE* or *RIC Subscription Missing List IE*, the E2 Node shall send the RIC SUBSCRIPTION AUDIT FAILURE message to the Near-RT RIC containing an appropriate cause value.

Upon reception of the RIC SUBSCRIPTION AUDIT FAILURE message the Near-RT RIC shall stop the timer T<sub>RICEVENTcreate</sub> and terminate the RIC Subscription procedure.

#### 8.2.2B.4 Abnormal conditions

If the E2 Node receives a RIC SUBSCRIPTION AUDIT REQUEST message which contains an unknown *RAN Function ID IE*, the E2 Node shall send the RIC SUBSCRIPTION AUDIT FAILURE message to the Near-RT RIC containing an appropriate cause value.

### 8.2.3 RIC Indication procedure

#### 8.2.3.1 General

The purpose of the RIC Indication procedure is to transfer Report and/or Insert RIC Service Action associated with a RIC Subscription procedure.

This procedure shall be initiated by the E2 Node.

This procedure uses RIC Service signalling.

#### 8.2.3.2 Successful operation

![Diagram illustrating the RIC Indication procedure, successful operation. It shows two rows of boxes. The top row contains 'Near-RT RIC' and 'E2 Node'. The bottom row contains 'Near-RT RIC' and 'E2 Node'. A red arrow labeled 'RIC INDICATION' points from the 'E2 Node' box in the top row to the 'Near-RT RIC' box in the bottom row. Dashed lines connect the 'Near-RT RIC' boxes and the 'E2 Node' boxes vertically.](58d512af60456c43a2714b54d865ecec_img.jpg)

Diagram illustrating the RIC Indication procedure, successful operation. It shows two rows of boxes. The top row contains 'Near-RT RIC' and 'E2 Node'. The bottom row contains 'Near-RT RIC' and 'E2 Node'. A red arrow labeled 'RIC INDICATION' points from the 'E2 Node' box in the top row to the 'Near-RT RIC' box in the bottom row. Dashed lines connect the 'Near-RT RIC' boxes and the 'E2 Node' boxes vertically.

**Figure 8.2.3.2-1: RIC Indication procedure, successful operation**

An E2 Node initiates the procedure by sending RIC INDICATION message to the Near-RT RIC containing the *RIC Request ID* IE, that was previously assigned by the Near-RT RIC during a successful RIC Subscription procedure.

If the RIC Indication message is in response to an Insert RIC Service Action, then the E2 Node shall provide the *RIC Call Process ID* IE within the RIC INDICATION message, and the E2 Node shall start the associated *RIC Time to Wait* timer, and wait for the corresponding response from the Near-RT RIC.

Near-RT RIC may use the *RIC Call Process ID* IE in a subsequent RIC Control procedure.

If an *RIC Subsequent Action* IE was associated to the RIC Service Action then, after successful transmission of the RIC INDICATION message, the originating E2 Node shall progress accordingly:

- If the *RIC Subsequent Action Type* IE was set to Continue or Halt, and the associated *RIC Time to Wait* timer has not expired, and a RIC CONTROL REQUEST message is received with the same *RIC Call Process ID* IE, then the associated procedure shall process the RIC CONTROL REQUEST and continue to execute any remaining actions in the sequence of RIC Actions defined in the RIC Subscription procedure.
- If the *RIC Subsequent Action Type* IE was set to Continue and the associated *RIC Time to Wait* timer has expired, then the E2 Node shall continue to execute any remaining RIC Service Actions in the sequence of RIC Service Actions defined in the RIC Subscription procedure.
- If the *RIC Subsequent Action Type* IE was set to Halt and the associated *RIC Time to Wait* timer has expired, then the E2 Node shall abort further processing of the associated procedure in the E2 node. In this case, any remaining or ongoing parallel RIC Service Actions in the sequence of RIC Actions defined in the RIC Subscription procedure shall also be aborted.

#### 8.2.3.3 Unsuccessful operation

Not applicable.

#### 8.2.3.4 Abnormal conditions

Not applicable.

### 8.2.4 RIC Control procedure

#### 8.2.4.1 General

The purpose of the RIC Control procedure is to initiate or resume a specific functionality in the E2 Node.

This procedure shall be initiated by the Near-RT RIC.

This procedure uses RIC Service signalling.

#### 8.2.4.2 Successful operation

![Sequence diagram showing the RIC Control procedure, successful operation. The diagram illustrates the interaction between a Near-RT RIC and an E2 Node. The Near-RT RIC sends a RIC CONTROL REQUEST message to the E2 Node. The E2 Node responds with a RIC CONTROL ACKNOWLEDGE message. The diagram shows two instances of each entity, with the top instance representing the initial state and the bottom instance representing the state after the procedure.](7eb2577b5e262b911d748cd6229145ad_img.jpg)

```

sequenceDiagram
    participant NRT_RIC as Near-RT RIC
    participant E2_Node as E2 Node
    NRT_RIC->>E2_Node: RIC CONTROL REQUEST
    E2_Node-->>NRT_RIC: RIC CONTROL ACKNOWLEDGE
  
```

Sequence diagram showing the RIC Control procedure, successful operation. The diagram illustrates the interaction between a Near-RT RIC and an E2 Node. The Near-RT RIC sends a RIC CONTROL REQUEST message to the E2 Node. The E2 Node responds with a RIC CONTROL ACKNOWLEDGE message. The diagram shows two instances of each entity, with the top instance representing the initial state and the bottom instance representing the state after the procedure.

**Figure 8.2.4.2-1: RIC Control procedure, successful operation**

The Near-RT RIC initiates the procedure by sending a RIC CONTROL REQUEST message containing a unique *RIC Request ID* IE, assigned by the Near-RT RIC.

When the Near-RT RIC sends the RIC CONTROL REQUEST message and the optional *RIC Control Ack Request* IE has been set to "Ack", or is not present, the Near-RT RIC, it shall start the timer  $T_{RICcontrol}$ .

At reception of the RIC CONTROL REQUEST message the E2 Node shall:

- Determine the target RAN Function using the information in the *RAN Function ID* IE and initiate the requested RIC Control procedure action using information in the *RIC Control Message* IE.
- If the *RIC Call Process ID* IE is included in the RIC CONTROL REQUEST message, the E2 Node shall use this IE to identify a specific call process that was indicated in the RIC INDICATION message.
- If the RIC CONTROL REQUEST message contains the optional *RIC Control Ack Request* IE set to "Ack", or if the optional *RIC Control Ack Request* IE is not present, and the E2 Node has successfully processed the requested RIC Control procedure action, then the E2 Node shall respond with the RIC CONTROL ACKNOWLEDGE message.
- If the RIC CONTROL REQUEST message contains the optional *RIC Control Ack Request* IE set to "NoAck" and the E2 Node has successfully processed the requested RIC Control procedure action, then the E2 Node shall not send the RIC CONTROL ACKNOWLEDGE message.

Upon reception of the RIC CONTROL ACKNOWLEDGE message, the Near-RT RIC shall stop timer  $T_{RICcontrol}$  and terminate the RIC Control procedure.

The Near-RT RIC may use the information contained in the optional *RIC Control Outcome* IE to determine subsequent actions.

#### 8.2.4.3 Unsuccessful operation

![Sequence diagram showing the RIC Control procedure, unsuccessful operation. A Near-RT RIC sends a RIC CONTROL REQUEST to an E2 Node. The E2 Node responds with a RIC CONTROL FAILURE message back to the Near-RT RIC.](205052185cb5539c5fd3a9ea1f2aab08_img.jpg)

```

sequenceDiagram
    participant Near-RT RIC
    participant E2 Node
    Near-RT RIC->>E2 Node: RIC CONTROL REQUEST
    E2 Node->>Near-RT RIC: RIC CONTROL FAILURE

```

Sequence diagram showing the RIC Control procedure, unsuccessful operation. A Near-RT RIC sends a RIC CONTROL REQUEST to an E2 Node. The E2 Node responds with a RIC CONTROL FAILURE message back to the Near-RT RIC.

**Figure 8.2.4.3-1: RIC Control procedure, unsuccessful operation**

If the RIC CONTROL REQUEST message contains an invalid *RIC Call Process ID* IE, then the E2 Node shall respond with the RIC CONTROL FAILURE message with an appropriate cause value.

If the RIC CONTROL REQUEST message contains the optional *RIC Call Process ID* IE for which the associated *RIC Time to Wait* timer had expired, then the E2 Node shall respond with the RIC CONTROL FAILURE message with an appropriate cause value.

If the E2 Node fails to execute the requested RIC Control procedure E2SM specific action, then the E2 Node shall respond with the RIC CONTROL FAILURE message with an appropriate cause value.

If the E2 Node detects an encoding or functional error in the E2SM specific IEs contained in the RIC CONTROL REQUEST message, then the E2 Node shall respond with the RIC CONTROL FAILURE message with an appropriate cause value.

If the E2 Node receives a RIC CONTROL REQUEST message which contains an unknown *RAN Function ID* IE the E2 Node shall respond with the RIC CONTROL FAILURE message containing an appropriate cause value.

If the E2 Node does not support the specific RIC Control procedure action, then the E2 Node shall respond with the RIC CONTROL FAILURE message containing an appropriate cause value.

Upon reception of the RIC CONTROL FAILURE message the Near-RT RIC shall stop timer  $T_{RICcontrol}$ , if running, and terminate the RIC Control procedure.

The Near-RT RIC may use the information contained in the *Cause* IE and optional *RIC Control Outcome* IE to determine subsequent actions.

#### 8.2.4.4 Abnormal conditions

Upon reception of the ERROR INDICATION message including the *RIC Request ID* IE associated to the RIC CONTROL REQUEST message, the Near-RT RIC shall stop timer  $T_{RICcontrol}$ , if running, and terminate the RIC Control procedure.

If timer  $T_{RICcontrol}$  was set when sending the RIC CONTROL REQUEST message and there was no response from the E2 node before the timer expiry, the Near-RT RIC shall send an ERROR INDICATION with the appropriate value for the *Cause* IE.

### 8.2.5 RIC Subscription Modification procedure

#### 8.2.5.1 General

The purpose of the RIC Subscription Modification procedure is to modify an existing RIC subscription on an E2 node, in terms of its event trigger definition and/or the sequence of actions.

This procedure shall be initiated by the Near-RT RIC.

This procedure uses RIC Service signalling.

#### 8.2.5.2 Successful operation

![Sequence diagram showing the RIC Subscription Modification procedure. A Near-RT RIC sends a RIC SUBSCRIPTION MODIFICATION REQUEST to an E2 Node. The E2 Node responds with a RIC SUBSCRIPTION MODIFICATION RESPONSE.](0c6499c0eff2c7167c61e7089eb6468d_img.jpg)

```

sequenceDiagram
    participant Near-RT RIC
    participant E2 Node
    Note over Near-RT RIC, E2 Node: RIC SUBSCRIPTION MODIFICATION REQUEST
    Note over E2 Node, Near-RT RIC: RIC SUBSCRIPTION MODIFICATION RESPONSE
  
```

Sequence diagram showing the RIC Subscription Modification procedure. A Near-RT RIC sends a RIC SUBSCRIPTION MODIFICATION REQUEST to an E2 Node. The E2 Node responds with a RIC SUBSCRIPTION MODIFICATION RESPONSE.

**Figure 8.2.5.2-1: RIC Subscription Modification procedure, successful operation**

The Near-RT RIC initiates this procedure by sending the RIC SUBSCRIPTION MODIFICATION REQUEST message to the E2 node, containing the *RIC Request ID* IE to uniquely identify the existing RIC Subscription in the E2 node.

When the Near-RT RIC sends the RIC SUBSCRIPTION MODIFICATION REQUEST message, it shall start timer  $T_{\text{RICEVENTmodify}}$ .

Upon reception of the RIC SUBSCRIPTION MODIFICATION REQUEST message, the E2 node shall determine the existing RIC Subscription and the target RAN Function from the *RIC Request ID* IE and the *RAN Function ID* IE, respectively.

If the *RIC Event Trigger Definition to be Modified* IE is included, then the E2 node shall validate and modify the event trigger defined for the existing RIC subscription based on the contents of the IE.

If the *RIC Actions to be Removed List* IE is included, then for every *RIC Action ID* IE included in the list, the E2 node shall delete the requested action and release the corresponding necessary resources.

If the *RIC Actions to be Modified List* IE is included, then for every *RIC Action ID* IE included in the list for which there exists a corresponding *RIC Action Definition* IE and/or *RIC Subsequent Action* IE, the E2 node shall modify the existing behaviour for the action with the requested modification in the respective IEs and modify the corresponding necessary resources.

If the *RIC Actions to be Modified List* IE is included, then for every *RIC Action ID* IE included in the list for which there exists a *RIC Action Execution Order* IE, the E2 node shall replace the current execution order for the action in the sequence of actions with the new execution order for the action in the sequence, as given in the *RIC Action Execution Order* IE.

If the *RIC Actions to be Added List* IE is included, then the E2 node shall validate and add the requested actions to the existing sequence of RIC Actions in order of the *RIC Action Execution Order* IE and reserve the necessary resources for the new actions.

The E2 node shall send the RIC SUBSCRIPTION MODIFICATION RESPONSE message back to the Near-RT RIC when one of the following cases is successfully executed:

- If the *RIC Event Trigger Definition to be Modified* IE is present in the RIC SUBSCRIPTION MODIFICATION REQUEST message and if the requested modification for the event trigger definition was successfully performed by the E2 node, or
- If the *RIC Event Trigger Definition to be Modified* IE is not present (i.e., no modification to the event trigger definition was requested) in the RIC SUBSCRIPTION MODIFICATION REQUEST message and if at least one of the requested actions to be added or modified or removed as requested by the Near-RT RIC in *RIC Actions To Be*

*Added List IE* or *RIC Actions to be Modified List IE* or *RIC Actions to be Removed List IE*, respectively, in the RIC SUBSCRIPTION MODIFICATION REQUEST message, was successfully performed by the E2 node.

The E2 node shall report the result of all the requested modifications to the sequence of actions, if any, back to the Near-RT RIC in the RIC SUBSCRIPTION MODIFICATION RESPONSE message as follows:

- A list of actions requested to be removed, indexed by the *RIC Action ID IE*, which are successfully removed by the E2 node, shall be included in the *RIC Actions Removed List IE*.
- A list of actions requested to be removed, indexed by the *RIC Action ID IE*, which failed to get removed from the sequence by the E2 node, shall be included in the *RIC Actions Failed to be Removed List IE*, with appropriate cause values.
- A list of actions requested to be modified, indexed by the *RIC Action ID IE*, which are successfully modified by the E2 node, shall be included in the *RIC Actions Modified List IE*.
- A list of actions requested to be modified, indexed by the *RIC Action ID IE*, which failed to get modified by the E2 node, shall be included in the *RIC Actions Failed to be Modified List IE* with appropriate cause values.
- A list of actions requested to be added, indexed by the *RIC Action ID IE*, which are successfully added by the E2 node, shall be included in the *RIC Actions Added List IE*.
- A list of actions requested to be added, indexed by the *RIC Action ID IE*, which failed to get added to the sequence by the E2 node, shall be included in the *RIC Actions Failed to be Added List IE* with appropriate cause values.

If, for a given *RIC Action ID IE* in the *RIC Actions to be Modified List IE*, more than one modification to the RIC Service Action is requested in the form of *RIC Action Definition IE* and/or *RIC Action Execution Order IE* and/or *RIC Subsequent Action IE*, then the E2 node shall report that the requested action modification is successfully performed and shall include the action in the *RIC Actions Modified List IE*, if and only if, all the requested modifications to the action are successfully performed by the E2 node.

If one of the requested modifications to the RIC Service Action is not successfully performed by the E2 node, then the E2 node shall include the RIC Service Action in the *RIC Actions Failed to be Modified List IE*, along with an appropriate cause, to indicate failure for the requested modification to the RIC Service Action.

If, for a given *RIC Action ID IE* in the *RIC Actions to be Added IE*, either the action type in the *RIC Action Type IE* or the action definition in the *RIC Action Definition IE* or the action execution order in the *RIC Action Execution Order IE* or the subsequent action, if included, in the *RIC Subsequent Action IE* is not successfully processed by the E2 node, then the E2 node shall include the action in the *RIC Actions Failed to be Added List IE* with an appropriate cause, indicating failure to add the requested action to the existing sequence of actions.

If, after processing the RIC Subscription Modification procedure, more than one RIC Service Action remains accepted by the E2 Node then, at each occurrence of the common Event Trigger, the sequence of RIC Service Actions shall be executed according to the considerations defined in clause 8.2.1.2.

Upon reception of the RIC SUBSCRIPTION MODIFICATION RESPONSE message, the Near-RT RIC shall stop timer  $T_{\text{RICEVENTmodify}}$  and terminate the RIC Subscription Modification procedure.

#### 8.2.5.3 Unsuccessful operation

![Sequence diagram showing the unsuccessful RIC Subscription Modification procedure. A Near-RT RIC sends a RIC SUBSCRIPTION MODIFICATION REQUEST to an E2 Node. The E2 Node responds with a RIC SUBSCRIPTION MODIFICATION FAILURE message back to the Near-RT RIC.](3750156e1187696fb7e

*(Catatan: Naskah spesifikasi teknis lengkap bersambung pada rilis standar resmi 3GPP/O-RAN di Open-Telco Corpus...)*
