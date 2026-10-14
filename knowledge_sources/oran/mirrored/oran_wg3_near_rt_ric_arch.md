---
topic_key: oran_wg3_near_rt_ric_arch
title: O-RAN WG3 Near-Real-Time RAN Intelligent Controller (Near-RT RIC) Architecture
source_vendor: o_ran
doc_type: specification
technology: o_ran
category: o_ran
keywords: near-rt ric, wg3, xapp, ric architecture, e2 node, database sdl, message bus, conflict mitigation, telemetry
summary: Salinan spesifikasi resmi O-RAN WG3 (O-RAN.WG3.TS.RICARCH-R005-v08.00) dari repositori GSMA/oran Open-Telco Corpus.
---

ervice also enables the service consumer to be queried or notified of deleting an existing E2 subscription.<br>(NOTE) |
|                             | E2 Indication service                       | This service enables the service consumer to receive subscribed E2 information associated with an E2 subscription.                                                                                                                                                                                                                                              |
|                             | E2 Control service                          | This service enables the service consumer to access RIC service "CONTROL" [2] with the Near-RT RIC platform.                                                                                                                                                                                                                                                    |
|                             | E2 Guidance service                         | This service enables the service consumer to acquire E2 guidance information from the Near-RT RIC platform to avoid conflicts described in clause 6.2.3.                                                                                                                                                                                                        |
|                             | E2 Query service                            | This service enables the service consumer to access RIC service "QUERY" [2] with the Near-RT RIC platform.                                                                                                                                                                                                                                                      |
| Management related services | xApp Registration service                   | This service enables service consumer to register/deregister itself with the Near-RT RIC platform.                                                                                                                                                                                                                                                              |
| SDL services                | SDL Information service                     | This service enables the service consumer to store and retrieve data while hiding details such as type and location of database, management operations of database layer such as high availability, scaling, load-balancing.<br>This service supports defined data structures used to provide E2 Node related information.                                      |
| Enablement services         | Enabl Registration service                  | This service enables service consumer to register its service.                                                                                                                                                                                                                                                                                                  |
|                             | Enabl Discovery service                     | This service enables service consumer to discover services registered by the Near-RT RIC platform and the xApps.                                                                                                                                                                                                                                                |
|                             | Enabl Event service                         | This service enables the service consumer to create/delete subscriptions to Near-RT RIC API related events. It also enables notifications of the subscribed Near-RT RIC API related events.                                                                                                                                                                     |
| AI/ML workflow services     | Data Pipelining service                     | This service enables the service consumer to ingest and prepare data for AI/ML model training and/or inference with the Near-RT RIC platform.                                                                                                                                                                                                                   |
|                             | AI/ML Model Management and Exposure service | This service enables the service consumer to store and, retrieve AI/ML models with the Near-RT RIC platform for inference and/or training, The service also supports exposure of shared AI/ML models.                                                                                                                                                           |
|                             | AI/ML Training service                      | This service enables the service consumer to train AI/ML models with the Near-RT RIC platform.                                                                                                                                                                                                                                                                  |

| Service Category | Service Name            | Description                                                                                         |
|------------------|-------------------------|-----------------------------------------------------------------------------------------------------|
|                  | AI/ML Inference service | This service enables the service consumer to perform AI/ML inference with the Near-RT RIC platform. |

NOTE: Support for E2 interface Global Procedures (E2 SETUP, RIC Service Update, etc.) is described in clause 9.5.8 as use cases of SDL services.

### 6A.2.2 A1 related services

#### 6A.2.2.1 A1 EI service

The A1 EI service supports the following operations in Table 6A.2.2.1-1.

**Table 6A.2.2.1-1: List of A1 EI service operations**

| Service Name  | Service Operations        | Operation Semantic | Known Consumer(s) | Reference |
|---------------|---------------------------|--------------------|-------------------|-----------|
| A1 EI service | A1 EI query               | Request/Response   | xApp              | 9.2.3.1   |
|               | A1 EI subscription setup  | Request/Response   | xApp              | 9.2.3.2   |
|               | A1 EI subscription update | Request/Response   | xApp              | 9.2.3.3   |
|               | A1 EI subscription delete | Request/Response   | xApp              | 9.2.3.4   |
|               | A1 EI delivery            | Notify             | xApp              | 9.2.3.5   |

### 6A.2.3 E2 related services

#### 6A.2.3.1 E2 Subscription service

The E2 Subscription service supports the following operations in Table 6A.2.3.1-1.

**Table 6A.2.3.1-1: List of E2 Subscription service operations**

| Service Name            | Service Operations                  | Operation Semantic | Known Consumer(s) | Reference |
|-------------------------|-------------------------------------|--------------------|-------------------|-----------|
| E2 Subscription service | E2 Subscription                     | Request/Response   | xApp              | 9.3.2.1   |
|                         | E2 Subscription Delete              | Request/Response   | xApp              | 9.3.2.2   |
|                         | E2 Subscription Delete Query        | Request/Response   | xApp              | 9.3.2.2A  |
|                         | E2 Subscription Delete Notification | Notify             | xApp              | 9.3.2.2A  |
|                         | E2 Subscription Audit               | Request/Response   | xApp              | 9.3.2.5   |
|                         | E2 Subscription Modification        | Request/Response   | xApp              | 9.3.2.7   |

#### 6A.2.3.2 E2 Indication service

The E2 Indication service supports the following operations in Table 6A.2.3.2-1.

**Table 6A.2.3.2-1: List of E2 Indication service operations**

| Service Name          | Service Operations | Operation Semantic | Known Consumer(s) | Reference |
|-----------------------|--------------------|--------------------|-------------------|-----------|
| E2 Indication service | E2 Indication      | Notify             | xApp              | 9.3.2.3   |

#### 6A.2.3.3 E2 Control service

The E2 Control service supports the following operations in Table 6A.2.3.3-1.

**Table 6A.2.3.3-1: List of E2 Control service operations**

| Service Name       | Service Operations | Operation Semantic | Known Consumer(s) | Reference |
|--------------------|--------------------|--------------------|-------------------|-----------|
| E2 Control service | E2 Control         | Request/Response   | xApp              | 9.3.2.4   |

#### 6A.2.3.4 E2 Guidance service

The E2 Guidance service supports the following operations in Table 6A.2.3.4-1.

**Table 6A.2.3.4-1: List of E2 Guidance service operations**

| Service Name        | Service Operations       | Operation Semantic | Known Consumer(s) | Reference |
|---------------------|--------------------------|--------------------|-------------------|-----------|
| E2 Guidance service | E2 Guidance              | Request/Response   | xApp              | 9.3.3.1   |
|                     | E2 Guidance Modification | Notify             | xApp              | 9.3.3.5   |

#### 6A.2.3.5 E2 Query service

The E2 Query service supports the following operations in Table 6A.2.3.5-1.

**Table 6A.2.3.5-1: List of E2 Query service operations**

| Service Name     | Service Operations | Operation Semantic | Known Consumer(s) | Reference |
|------------------|--------------------|--------------------|-------------------|-----------|
| E2 Query service | E2 Query           | Request/Response   | xApp              | 9.3.2.6   |

### 6A.2.4 Management related services

#### 6A.2.4.1 xApp Registration service

The xApp Registration service supports the following operations in Table 6A.2.4.1-1.

**Table 6A.2.4.1-1: List of xApp Registration service operations**

| Service Name              | Service Operations  | Operation Semantic | Known Consumer(s) | Reference |
|---------------------------|---------------------|--------------------|-------------------|-----------|
| xApp Registration service | xApp Registration   | Request/Response   | xApp              | 9.4.1     |
|                           | xApp Deregistration | Request/Response   | xApp              | 9.4.2     |

### 6A.2.5 SDL services

#### 6A.2.5.1 SDL Information service

The SDL Information service supports the following operations in Table 6A.2.5.1-1.

**Table 6A.2.5.1-1: List of SDL Information service operations**

| Service Name            | Service Operations            | Operation Semantic | Known Consumer(s) | Reference    |
|-------------------------|-------------------------------|--------------------|-------------------|--------------|
| SDL Information service | SDL Information Fetch         | Request/Response   | xApp              | 9.5.3        |
|                         | SDL Subscription Information  | Request/Response   | xApp              | 9.5.4, 9.5.7 |
|                         | SDL Information Update Notify | Notify             | xApp              | 9.5.4        |
|                         | SDL Information Push          | Notify             | xApp              | 9.5.7        |
|                         | SDL Information Store         | Request/Response   | xApp              | 9.5.5        |
|                         | SDL Information Modify        | Request/Response   | xApp              | 9.5.6        |

### 6A.2.6 Enablement services

#### 6A.2.6.1 Enabl Registration service

The Enabl Registration service supports the following operations in Table 6A.2.6.1-1.

**Table 6A.2.6.1-1: List of Enabl Registration service operations**

| Service Name               | Service Operations      | Operation Semantic | Known Consumer(s) | Reference |
|----------------------------|-------------------------|--------------------|-------------------|-----------|
| Enabl Registration service | API Registration        | Request/Response   | xApp              | 9.6.3.1   |
|                            | API Registration Update | Request/Response   | xApp              | 9.6.3.2   |
|                            | API Deregistration      | Request/Response   | xApp              | 9.6.3.3   |

#### 6A.2.6.2 Enabl Discovery service

The Enabl Discovery service supports the following operations in Table 6A.2.6.2-1.

**Table 6A.2.6.2-1: List of Enabl Discovery service operations**

| Service Name            | Service Operations | Operation Semantic | Known Consumer(s) | Reference |
|-------------------------|--------------------|--------------------|-------------------|-----------|
| Enabl Discovery service | API Discovery      | Request/Response   | xApp              | 9.6.1     |

#### 6A.2.6.3 Enabl Events service

The Enabl Events service supports the following operations in Table 6A.2.6.3-1.

**Table 6A.2.6.3-1: List of Enabl Events service operations**

| Service Name         | Service Operations            | Operation Semantic | Known Consumer(s) | Reference |
|----------------------|-------------------------------|--------------------|-------------------|-----------|
| Enabl Events service | API Event Subscription        | Request/Response   | xApp              | 9.6.2.1   |
|                      | API Event Subscription Delete | Request/Response   | xApp              | 9.6.2.2   |
|                      | API Event Notification        | Notify             | xApp              | 9.6.2.3   |

### 6A.2.7 AI/ML services

#### 6A.2.7.1 Data Pipelining service

The Data Pipelining service supports the following operations in Table 6A.2.7.1-1.

| <b>Table 6A.2.7.1-1:<br/>List of Data<br/>Pipelining<br/>service<br/>operationsService<br/>Name</b> | <b>Service Operations</b>       | <b>Operation<br/>Semantic</b> | <b>Known<br/>Consumer(s)</b> | <b>Reference</b> |
|-----------------------------------------------------------------------------------------------------|---------------------------------|-------------------------------|------------------------------|------------------|
| Data Pipelining service                                                                             | Data Pipelining Job Setup       | Request/Response              | xApp                         | 9.7.1.1          |
|                                                                                                     | Data Pipelining Job Update      | Request/Response              | xApp                         | 9.7.1.2          |
|                                                                                                     | Data Pipelining Job Delete      | Request/Response              | xApp                         | 9.7.1.3          |
|                                                                                                     | Data Pipelining Job Query       | Request/Response              | xApp                         | 9.7.1.4          |
|                                                                                                     | Data Pipelining Request         | Request/Response              | xApp                         | 9.7.1.5          |
|                                                                                                     | Data Pipelining Result Delivery | Notify                        | xApp                         | 9.7.1.5          |

#### 6A.2.7.2 Training service

The Training service supports the following operations in Table 6A.2.7.2-1.

**Table 6A.2.7.2-1: List of Training service operations**

| <b>Service Name</b> | <b>Service Operations</b> | <b>Operation<br/>Semantic</b> | <b>Known<br/>Consumer(s)</b> | <b>Reference</b> |
|---------------------|---------------------------|-------------------------------|------------------------------|------------------|
| Training Service    | Training Job Setup        | Request/Response              | xApp                         | 9.7.2.1          |
|                     | Training Job Delete       | Request/Response              | xApp                         | 9.7.2.2          |
|                     | Training Job Query        | Request/Response              | xApp                         | 9.7.2.3          |
|                     | Training Request          | Request/Response              | xApp                         | 9.7.2.4          |
|                     | Training Result Delivery  | Notify                        | xApp                         | 9.7.2.4          |

#### 6A.2.7.3 Inference service

The Inference service supports the following operations in Table 6A.2.7.3-1.

**Table 6A.2.7.3-1: List of Inference service operations**

| <b>Service Name</b> | <b>Service Operations</b> | <b>Operation<br/>Semantic</b> | <b>Known<br/>Consumer(s)</b> | <b>Reference</b> |
|---------------------|---------------------------|-------------------------------|------------------------------|------------------|
| Inference Service   | Inference Job Setup       | Request/Response              | xApp                         | 9.7.3.1          |
|                     | Inference Job Update      | Request/Response              | xApp                         | 9.7.3.2          |
|                     | Inference Job Delete      | Request/Response              | xApp                         | 9.7.3.3          |
|                     | Inference Job Query       | Request/Response              | xApp                         | 9.7.3.4          |
|                     | Inference Request         | Request/Response              | xApp                         | 9.7.3.5          |
|                     | Inference Result Delivery | Notify                        | xApp                         | 9.7.3.5          |

#### 6A.2.7.4 Model Management and Exposure service

| Service Name                          | Service Operations | Operation Semantic | Known Consumer(s) | Reference |
|---------------------------------------|--------------------|--------------------|-------------------|-----------|
| Model Management and Exposure Service | Model Store        | Request/Response   | xApp              | 9.7.4.1   |
|                                       | Stored Model Query | Request/Response   | xApp              | 9.7.4.2   |
|                                       | Model Retrieve     | Request/Response   | xApp              | 9.7.4.3   |
|                                       | Model Delete       | Request/Response   | xApp              | 9.7.4.4   |

## 6A.3 Services provided by xApps

### 6A.3.1 Overview

An overview of the services that may be provided by the xApps is shown in Table 6A.3.1-1:

**Table 6A.3.1-1: Services provided by the xApps**

| Service Category                                                      | Service Name                           | Description                                                                                                                                                                                                                                                           |
|-----------------------------------------------------------------------|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A1 related services                                                   | A1 Policy service                      | This service enables the service consumer to create/update/delete/query an A1 policy object [8] for the xApp, and to be notified of the status of the A1 policy object. It also enables the service consumer to query the xApp about the supported A1 policy type(s). |
| E2 related services                                                   | E2 Conflict Mitigation Support service | The service enables the service consumer to obtain processing and information support from xApps for conflict mitigation. This service also enables the service consumer to obtain a negotiated conflict avoidance agreement from xApps.                              |
| Management related services (NOTE)                                    | xApp Configuration service             | This service enables the service consumer to configure the xApp.                                                                                                                                                                                                      |
|                                                                       | xApp PM service                        | This service enables the service consumer to collect PM related information from the xApp.                                                                                                                                                                            |
|                                                                       | xApp FM service                        | This service enables the service consumer to collect faults and events information from the xApp.                                                                                                                                                                     |
| SDL services                                                          | xApp data sharing service              | The service enables the service consumer to collect specific data shared by the xApp.                                                                                                                                                                                 |
| NOTE: Trace related service is not specified in the present document. |                                        |                                                                                                                                                                                                                                                                       |

### 6A.3.2 A1 related services

#### 6A.3.2.1 A1 Policy service

The A1 Policy service supports the following operations in Table 6A.3.2.1-1.

**Table 6A.3.2.1-1: List of A1 Policy service operations**

| Service Name      | Service Operations      | Operation Semantic | Known Consumer(s)    | Reference |
|-------------------|-------------------------|--------------------|----------------------|-----------|
| A1 Policy service | A1 Policy Setup         | Request/Response   | Near-RT RIC platform | 9.2.2.1   |
|                   | A1 Policy Update        | Request/Response   | Near-RT RIC platform | 9.2.2.2   |
|                   | A1 Policy Delete        | Request/Response   | Near-RT RIC platform | 9.2.2.3   |
|                   | A1 Policy Query         | Request/Response   | Near-RT RIC platform | 9.2.2.4   |
|                   | A1 Policy Status Update | Notify             | Near-RT RIC platform | 9.2.2.5   |

### 6A.3.3 E2 related services

#### 6A.3.3.1 E2 Conflict Mitigation Support service

**Table 6A.3.3.1-1: List of E2 Conflict mitigation support service operations**

| Service Name                           | Service Operations                           | Operation Semantic | Known Consumer(s)          | Reference |
|----------------------------------------|----------------------------------------------|--------------------|----------------------------|-----------|
| E2 Conflict Mitigation Support Service | E2 Conflict Mitigation Processing            | Request/Response   | Near-RT RIC platform       | 9.3.3.6.1 |
|                                        | E2 Conflict Mitigation Information           | Request/Response   | Near-RT RIC platform       | 9.3.3.6.1 |
|                                        | E2 Conflict Avoidance Negotiation            | Request/Response   | Near-RT RIC platform       | 9.3.3.6.2 |
|                                        | E2 Conflict Avoidance Negotiation Indication | Notify             | xApp, Near-RT RIC platform | 9.3.3.6.2 |

### 6A.3.4 Management related services

#### 6A.3.4.1 xApp Configuration service

```
void
```

#### 6A.3.4.3 xApp PM service

```
void
```

#### 6A.3.4.4 xApp FM service

```
void
```

### 6A.3.5 SDL services

#### 6A.3.5.1 xApp data sharing service

The xApp data sharing service supports the following operations in Table 6A.3.5.1-1.

**Table 6A.3.5.1-1: List of xApp Data sharing service operations**

| Service Name              | Service Operations                   | Operation Semantic | Known Consumer(s)          | Reference |
|---------------------------|--------------------------------------|--------------------|----------------------------|-----------|
| xApp Data Sharing service | xApp Shared Data Fetch               | Request/Response   | Near-RT RIC platform, xApp | 9.5.7A    |
|                           | xApp Shared Data Subscription        | Request/Response   | Near-RT RIC platform, xApp | 9.5.7B.1  |
|                           | xApp Shared Data Subscription Delete | Request/Response   | Near-RT RIC platform, xApp | 9.5.7B.2  |
|                           | xApp Shared Data Push                | Notify             | Near-RT RIC platform, xApp | 9.5.7B.1  |

### 6A.3.6 Enablement services

Void.

# 7 Near-RT RIC APIs

## 7.1 Overall Description

### 7.1.1 Introduction

The Near-RT RIC APIs are a collection of well-defined interfaces providing Near-RT RIC platform and xApp services. These APIs need to explicitly define the possible types of information flows and data models. The Near-RT RIC APIs are essential to host 3rd party xApps in an inter-operable way on different Near-RT RIC platforms.

The Near-RT RIC APIs consist of the following:

- A1 related APIs: APIs to access A1 related services;
- E2 related APIs: APIs to access E2 related services;
- Management APIs: APIs to access management related services;
- SDL APIs: APIs to access Shared Data Layer related services;
- Enablement APIs: APIs to access enablement services;
- AI/ML workflow APIs: APIs to access AI/ML workflow services.

### 7.1.2 Near-RT RIC API approaches

Near-RT RIC APIs may be implemented using two approaches:

- **Network API approach:** Each relevant Near-RT RIC endpoint exposes a network endpoint and specifies a particular data encoding protocol and a network transport protocol that should be used to communicate with it. A different network API may be specified for each Near-RT RIC API reflecting a trade-off between different service requirements.
- **SDK approach:** The Near-RT RIC vendor provides an SDK (software development kit). This SDK is a software library which handles all connection management and exposes a simple API for the xApp to interact with the Near-RT RIC. The interface between the SDK library embedded in the xApp and the Near-RT RIC Platform may be either vendor proprietary or aligned to the specified Network API.

Both approaches use similar methodologies of interaction with Near-RT RIC as defined in clauses 6A and 9. Furthermore, the detailed messages and IEs for each Near-RT RIC API that the xApp will use largely stay the same in the two approaches.

These two approaches are presented in figure 7.1.2-1 for the Network API approach and figure 7.1.2-2 for the SDK approach.

Both approaches assume that the Near-RT RIC platform provides appropriate support services. These services, labelled “Network API support” and “SDK support” respectively in figures 7.1.2-1 and 7.1.2-2, may be integrated into other platform services (i.e., A1 Termination may provide the support services for A1 related APIs) or implemented as independent services.

```
@startuml
skin rose
card Near-RT-RIC {

    node xApp2 as "xApp"
    node xApp1 as "xApp"

    frame Platform {
        agent Netsup as "Network API support"
        node Serv1
        node Serv2
        node Serv3
    }

}

xApp1 -- Netsup: "Network APIs"
xApp2 -- Netsup: "Network APIs"
Netsup -- Serv1
Netsup -- Serv2
Netsup -- Serv3
@enduml
```

![UML diagram showing the Network API approach. The Near-RT-RIC contains two xApp nodes. The Platform contains a 'Network API support' node and three service nodes: Serv1, Serv2, and Serv3. Red lines connect the xApp nodes to the 'Network API support' node, labeled 'Network APIs'. Another red line connects the 'Network API support' node to each of the service nodes (Serv1, Serv2, Serv3).](392a79ccd95e682ccd08f35ab2e64144_img.jpg)

```

graph TD
    subgraph Near-RT-RIC
        xApp1[xApp]
        xApp2[xApp]
        subgraph Platform
            Netsup[Network API support]
            Serv1[Serv1]
            Serv2[Serv2]
            Serv3[Serv3]
        end
    end
    xApp1 -- "Network APIs" --- Netsup
    xApp2 -- "Network APIs" --- Netsup
    Netsup --- Serv1
    Netsup --- Serv2
    Netsup --- Serv3

```

UML diagram showing the Network API approach. The Near-RT-RIC contains two xApp nodes. The Platform contains a 'Network API support' node and three service nodes: Serv1, Serv2, and Serv3. Red lines connect the xApp nodes to the 'Network API support' node, labeled 'Network APIs'. Another red line connects the 'Network API support' node to each of the service nodes (Serv1, Serv2, Serv3).

**Figure 7.1.2-1: Near-RT RIC platform supporting RIC APIs using Network API approach**

```
@startuml
skin rose
card Near-RT-RIC {

    frame xApp2 {
```

```

collections Logic2 as "Business Logic "
agent SDK2 as "SDK library"
}
frame xApp1 {
  collections Logic1 as "Business Logic "
  agent SDK1 as "SDK library"
}

frame Platform {
  agent SDKsup as "SDK support"
  node Serv1
  node Serv2
  node Serv3
}
}

Logic1 -- SDK1: SDK APIs
Logic2 -- SDK2: SDK APIs
SDK1 -- SDKsup: "Not specified"
SDK2 -- SDKsup: "Not specified"
SDKsup -- Serv1
SDKsup -- Serv2
SDKsup -- Serv3
@enduml

```

![Diagram of Near-RT RIC architecture showing xApp1 and xApp2 connected to a Platform via SDK support.](2ae3eae1bd80a90f192f568ae246a9a6_img.jpg)

The diagram illustrates the Near-RT RIC architecture. At the top, a box labeled **Near-RT-RIC** contains two sub-boxes, **xApp1** and **xApp2**. Each xApp contains a **Business Logic** block connected to an **SDK library** block via a line labeled **SDK APIs**. Below the xApps is a **Platform** box. Inside the Platform, there is an **SDK support** block connected to three server blocks: **Serv1**, **Serv2**, and **Serv3**. Lines labeled **Not specified** connect the **SDK library** blocks from both xApp1 and xApp2 to the **SDK support** block in the Platform. The **SDK support** block is then connected to the three server blocks (Serv1, Serv2, Serv3).

Diagram of Near-RT RIC architecture showing xApp1 and xApp2 connected to a Platform via SDK support.

Figure 7.1.2-2: Near-RT RIC platform supporting RIC APIs using SDK approach

### 7.1.3 Network API approach

A Network API is defined in terms of a protocol stack including the definition of the following:

- An application layer protocol used to carry a set of messages which normally contain multiple Information Elements (IEs);
- A data encoding protocol (ASN.1, Protobuf, JSON, etc.);
- A network transport protocol (SCTP, HTTPS, gRPC, etc.);
- Associated security and encryption methods.

For the Network API approach for Near-RT RIC APIs, it is expected that each case listed in clause 7.1.1 may require a unique protocol stack definition which offers an optimal solution balancing the trade-offs between service requirements, Near-RT RIC platform complexity and xApp implementation overheads.

Furthermore, each Network API will require a unique endpoint that the API consumer will need to discover using a combination of configuration and use of the Enablement APIs (also see clause 6A.2.6).

Open O-RAN specified Network APIs for each case listed in clause 7.1.1 are defined in terms of the corresponding protocol stack.

### 7.1.4 SDK approach

An SDK (Software Development Kit) is defined as a set of software tools/libraries provided by platform vendors which helps developers in building applications on the platform. An SDK simplifies application development by:

- Providing simple APIs to trigger commonly used functionality;
- Handling routine management tasks “under the hood”;
- Providing tools for debugging, building, testing applications.

For the SDK approach for Near-RT RIC APIs, it is expected that a given Near-RT RIC vendor offers an SDK library that provides a language specific implementation of each case listed in clause 7.1.1. This provides a common interface to interact with all the Near-RT RIC endpoints as well as other xApps.

The Near-RT RIC SDK library functionality would include:

- Discovery of relevant endpoints for and connection to Near-RT RIC platform services and other xApps.
- Handles all connection management of the xApp with all relevant Near-RT RIC platform endpoints as well as other xApps. This includes:
  - Authentication;
  - Registration;
  - Encryption/Decryption (if required);
  - Failovers if any endpoint crashes.
- Presents a simple API as function definitions for sending/receiving messages;
- Provides tools for xApp debugging, building and testing.

These services would be provided by the SDK library and so would not be exposed to the business logic within an xApp.

Open O-RAN specified SDK APIs for each case listed in clause 7.1.1 would need to be defined for each supported programming language.

The actual protocol stack implemented by the SDK library and used to communicate with the SDK support service in the Near-RT RIC platform may be either based on the Network APIs or left not specified and so may be vendor proprietary.

### 7.1.5 Near-RT RIC API support options

The two approaches to Near-RT RIC APIs are not necessarily mutually exclusive.

For example, an xApp designed to support the Network API approach may be implemented using either an internal SDK library that provides the Network API interface or a direct implementation the Network API interface. Both of these cases are presented in figure 7.1.5-1.

```
@startuml
skin rose
card Near-RT-RIC {

    frame xApp2 {
        collections Logic2 as "Business Logic "
        agent IF2 as "Network API client"
    }
    frame xApp1 {
        collections Logic1 as "Business Logic "
        agent SDK1 as "SDK library \ninincluding Network API client"
    }
    frame Platform {
        agent Netsup as "Network API support"
        node Serv1
        node Serv2
        node Serv3
    }
}

Logic1 -- SDK1: SDK APIs
Logic2 -- IF2 #line.dashed
SDK1 -- Netsup: "Network APIs"
IF2 -- Netsup: "Network APIs"
Netsup -- Serv1
Netsup -- Serv2
Netsup -- Serv3
@enduml
```

![Diagram of Near-RT RIC platform architecture showing xApp1 and xApp2 interacting with a Platform via Network APIs. xApp1 uses Business Logic connected to an SDK library, which connects to the Platform's Network API support. xApp2 uses Business Logic connected to a Network API client, which also connects to the Platform's Network API support. The Platform contains Network API support and three services: Serv1, Serv2, and Serv3.](fa01531ea2c45beeb4036005da3037a4_img.jpg)

```

graph TD
    subgraph Near-RT-RIC
        subgraph xApp1
            BL1[Business Logic] -- "SDK APIs" --> SDK1[SDK library including Network API client]
        end
        subgraph xApp2
            BL2[Business Logic] -.-> NAPI2[Network API client]
        end
        subgraph Platform
            NAPI_Support[Network API support]
            Serv1[Serv1]
            Serv2[Serv2]
            Serv3[Serv3]
            NAPI_Support --- Serv1
            NAPI_Support --- Serv2
            NAPI_Support --- Serv3
        end
        SDK1 -- "Network APIs" --> NAPI_Support
        NAPI2 -- "Network APIs" --> NAPI_Support
    end
    
```

Diagram of Near-RT RIC platform architecture showing xApp1 and xApp2 interacting with a Platform via Network APIs. xApp1 uses Business Logic connected to an SDK library, which connects to the Platform's Network API support. xApp2 uses Business Logic connected to a Network API client, which also connects to the Platform's Network API support. The Platform contains Network API support and three services: Serv1, Serv2, and Serv3.

**Figure 7.1.5-1: Near-RT RIC platform supporting RIC APIs using Network API approach with optional use of SDK APIs**

Likewise, a Near-RT RIC Platform may be designed to support both the Network API approach and the SDK approach and so xApps implemented using either approach may access platform services. Both of these cases are presented in figure 7.1.5-2.

```

@startuml
skin rose
card Near-RT-RIC {

    frame xApp2 {
        collections Logic2 as "Business Logic"
        agent SDK2 as "SDK library"
    }
    frame xApp1 {
        collections Logic1 as "Business Logic"
        agent SDK1 as "SDK library \ninclunding Network API client"
    }

    frame Platform {
        agent Netsup as "Network API support"
        agent SDKsup as "SDK support"
        node Serv1
        node Serv2
        node Serv3
    }
}
    
```

```

}
}
Logic1 -- SDK1: SDK APIs
Logic2 -- SDK2: SDK APIs
SDK1 -- Netsup: "Network APIs"
SDK2 -- SDKsup: "Not specified"
Netsup -- Serv1
Netsup -- Serv2
Netsup -- Serv3
SDKsup -- Serv1
SDKsup -- Serv2
SDKsup -- Serv3
@enduml

```

![Architecture diagram of Near-RT RIC showing two xApps (xApp1 and xApp2) connected to a Platform. xApp1 uses Business Logic connected to an SDK library with Network API client, which connects to Network API support on the Platform. xApp2 uses Business Logic connected to a standard SDK library, which connects to SDK support on the Platform. The Platform contains Network API support and SDK support, both of which connect to three servers: Serv1, Serv2, and Serv3.](00504fc688ebcf131ccbeff94dfc9939_img.jpg)

```

@startuml
package "Near-RT-RIC" {
  package "xApp1" {
    [Business Logic] as Logic1
    [SDK library\nincluding Network API client] as SDK1
    Logic1 -- SDK1 : SDK APIs
  }
  package "xApp2" {
    [Business Logic] as Logic2
    [SDK library] as SDK2
    Logic2 -- SDK2 : SDK APIs
  }
  package "Platform" {
    [Network API support] as Netsup
    [SDK support] as SDKsup
    node "Serv1"
    node "Serv2"
    node "Serv3"
    Netsup -- Serv1
    Netsup -- Serv2
    Netsup -- Serv3
    SDKsup -- Serv1
    SDKsup -- Serv2
    SDKsup -- Serv3
  }
  SDK1 -- Netsup : Network APIs
  SDK2 -- SDKsup : Not specified
}
@enduml

```

Architecture diagram of Near-RT RIC showing two xApps (xApp1 and xApp2) connected to a Platform. xApp1 uses Business Logic connected to an SDK library with Network API client, which connects to Network API support on the Platform. xApp2 uses Business Logic connected to a standard SDK library, which connects to SDK support on the Platform. The Platform contains Network API support and SDK support, both of which connect to three servers: Serv1, Serv2, and Serv3.

Figure 7.1.5-2: Near-RT RIC platform supporting both Network API and SDK approaches

7.2 Void

7.3 Void

7.4 Void

7.5 Void

7.6 Void

7.7 Void

# --- 8 External Interfaces of Near-RT RIC

## 8.1 E2 Interface

O-RAN.WG3.TS.E2GAP [2] specifies E2 interface general aspects and principles.

O-RAN.WG3.TS.E2AP [3] specifies E2 interface application protocols.

## 8.2 A1 Interface

O-RAN.WG2.TS.A1.GAP [8] specifies A1 interface general aspects and principles.

O-RAN.WG2.TS.A1AP [9] specifies A1 interface application protocols.

## 8.3 O1 Interface

An implementation of O1 interface at Near-RT RIC depends on the deployment options described in [4], i.e., when Near-RT RIC is modelled as a stand-alone Managed Element.

O-RAN.WG10.TS.O1-Interface [5] specifies O1 interface related aspects.

## 8.4 Y1 Interface

Y1 interface allows the Y1 consumers to subscribe to or request the RAN analytics information service(s) provided by Near-RT RIC [23][24].

# --- 9 Near-RT RIC API Procedures

## 9.1 General

Procedures described in this clause assume the Near-RT RIC platform contains the functionalities listed in clause 6.2. API endpoints associated with the platform functionalities may vary depending on implementation.

## 9.1A Conventions for procedure description

The following notations are used to describe the procedure elements in the present document:

- M: mandatory – the capability is required to be supported;
- O: optional – the capability may be supported or not.

## 9.2 A1 Related API Procedures

### 9.2.1 Introduction

The following procedures are described in this clause:

#### 1) Policy Management Service.

In this case the A1 Service Producer role (A1AP [9] clause 3.1) resides in the Near-RT RIC.

a) Non-RT RIC (A1 Service Consumer) originated procedures:

- Create Single Policy procedure (A1AP [9] clause 3.2.2.2.2) using **A1 Related API: A1 Policy Setup** (request, result);
- Query Single Policy procedure (A1AP [9] clause 3.2.2.3.2) using **A1 Related API: A1 Policy Query** (request, result);
- Query All Policy Identifiers procedure (A1AP [9] clause 3.2.2.3.5) using **A1 Related API: A1 Policy Query** (request, result);
- Query Policy Status procedure (A1AP [9] clause 3.2.2.3.6) using **A1 Related API: A1 Policy Query** (request, result);
- Update Single Policy procedure (A1AP [9] clause 3.2.2.4.2) using **A1 Related API: A1 Policy Update** (request, result);
- Delete Single Policy procedure (A1AP [9] clause 3.2.2.5.2) using **A1 Related API: A1 Policy Delete** (request, result);
- Query All Policy Type Identifiers procedure (A1AP [9] clause 3.2.2.7.2) using **A1 Related API: A1 Policy Query** (request, result);
- Query Single Policy Type procedure (A1AP [9] clause 3.2.2.7.3) using **A1 Related API: A1 Policy Query** (request, result).

b) Near-RT RIC (A1 Service Producer) originated procedures:

- Policy Status Update procedure (A1AP [9] clause 3.2.2.6.2) using **A1 Related API: A1 Policy Status** (status, ack).

#### 2) A1AP Enrichment Information (EI) Service

In this case the A1 Service Producer role (A1AP [9] clause 3.1) resides in the Non-RT RIC.

a) Near-RT RIC (A1 Service Consumer) originated procedures:

- Query EI Type Identifiers procedure (A1AP [9] clause 3.3.2.2.2) using **A1 Related API: A1 EI Query** (request, result);
- Query EI Type procedure (A1AP [9] clause 3.3.2.2.3) using **A1 Related API: A1 EI Query** (request, result);
- Query EI Job Identifiers procedure (A1AP [9] clause 3.3.2.2) using **A1 Related API: A1 EI Query** (request, result);

- Create EI Job procedure (A1AP [9] clause 3.3.3.3.2) using **A1 Related API: A1 EI Job Setup** (request, result);
- Query EI Job procedure (A1AP [9] clause 3.3.3.3.3) using **A1 Related API: A1 EI Query** (request, result);
- Update EI Job procedure (A1AP [9] clause 3.3.3.3.4) using **A1 Related API: A1 EI Job Update** (request, result);
- Delete EI Job procedure (A1AP [9] clause 3.3.3.3.5) using **A1 Related API: A1 EI Job Delete** (request, result);
- Query EI Job Status procedure (A1AP [9] clause 3.3.3.4.2) using **A1 Related API: A1 EI Job Status Query** (request, result).

b) Non-RT RIC (A1 Service Producer) originated procedures:

- Notify EI Job Status procedure (A1AP [9] clause 3.3.3.4.3) using **A1 Related API: A1 EI Job Status Notify** (status, ack);
- Deliver EI Job Result procedure (A1AP [9] clause 3.3.4.2.2) using **A1 Related API: A1 EI Job Result Delivery** (result, ack).

### 9.2.2 A1 Policy procedures

#### 9.2.2.1 A1 Policy Setup procedure

The purpose of A1 Policy Setup procedure in Near-RT RIC is to support the A1AP [9] Create Single Policy procedure from the Non-RT RIC and to request and activate an A1 policy enforcement toward a suitable xApp.

| Use Case Stage   | Evolution / Specification                                                                                                                                                                                                                                                                                                                                                             |
|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Goal             | The activation of a received but not activated A1 policy in Near-RT RIC.                                                                                                                                                                                              

*(Catatan: Naskah spesifikasi teknis lengkap bersambung pada rilis standar resmi 3GPP/O-RAN di Open-Telco Corpus...)*
