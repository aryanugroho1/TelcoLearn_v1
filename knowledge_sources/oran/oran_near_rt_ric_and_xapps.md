---
topic_key: oran_near_rt_ric_and_xapps
title: O-RAN Near-RT RIC Architecture, E2 Interface (E2AP/E2SM) & xApp Development
source_vendor: o_ran
doc_type: architecture
technology: o_ran
category: o_ran
keywords: o-ran, oran, near-rt ric, ric, e2, e2ap, e2sm-kpm, e2sm-rc, xapp, xapps, ricxappframe, docker, kubernetes, a1 interface, rmr
summary: Arsitektur mendalam O-RAN Near-RT RIC (WG3), antarmuka E2AP dan model layanan E2SM-KPM / E2SM-RC, serta panduan praktis pembangunan xApp berbasis Python ricxappframe dan Docker.
---

### 1. ARSITEKTUR O-RAN NEAR-RT RIC (O-RAN ALLIANCE WG3)

**Near-RT RIC (Near-Real-Time RAN Intelligent Controller)** adalah platform perangkat lunak cloud-native mikroservis yang beroperasi pada siklus waktu kontrol loop menengah (**10 ms hingga 1000 ms**).

* **Fungsi Utama:**
  * Menjalankan aplikasi kecerdasan buatan pihak ketiga (**xApps**).
  * Mengoptimalkan alokasi spektrum, radio resource management (RRM), mobilitas handover cerdas, dan load balancing lintas base station.
* **Antarmuka Utama:**
  1. **Antarmuka E2 (E2AP):** Menghubungkan Near-RT RIC ke **E2 Nodes** (O-CU-CP, O-CU-UP, O-DU, dan O-eNB). Protokol transport menggunakan SCTP (*Stream Control Transmission Protocol*).
  2. **Antarmuka A1:** Menghubungkan Non-RT RIC (di dalam Service Management and Orchestration / SMO) ke Near-RT RIC. Mengirimkan panduan kebijakan (*policy guidance*), intent declarative, dan model ML ter-update (siklus waktu > 1 detik).
  3. **Antarmuka O1:** Antarmuka OAM berbasis NETCONF/YANG untuk konfigurasi platform, fault management, dan telemetri logging.

---

### 2. E2 SERVICE MODELS (E2SM)

Protokol E2AP membungkus pesan layanan spesifik yang disebut **E2SM**:

1. **E2SM-KPM (Key Performance Measurement):**
   * Menyediakan pengumpulan metrik radio secara periodik atau berdasarkan ambang batas (*event-triggered threshold*).
   * Metrik yang diekstraksi: *PRB Utilization per QoS Flow (5QI)*, *Active UE count*, *Packet Delay (UL/DL)*, dan *Average Throughput*.
2. **E2SM-RC (RAN Control):**
   * Memungkinkan xApp memberikan instruksi kendali langsung ke node radio:
     * *Radio Bearer Control:* Menyesuaikan prioritas alokasi scheduling.
     * *Connected Mode Mobility:* Memicu perintah Handover ke target cell tertentu.
     * *Carrier Aggregation Control:* Mengaktifkan atau menonaktifkan SCell sekunder.

---

### 3. PANDUAN PRAKTIS MEMBANGUN xAPP DENGAN PYTHON (ricxappframe)

Dalam ekosistem O-RAN Software Community (O-RAN SC), xApp dibangun menggunakan kerangka kerja `ricxappframe` dan berkomunikasi melalui protokol antrian pesan **RMR (RIC Message Router)**:

#### A. Kode Python Skeleton xApp (`main.py`):
```python
from ricxappframe.xapp_frame import RMRXapp, rmr
import json

def kpm_callback(self, summary, sbuf):
    """Callback saat menerima laporan metrik E2SM-KPM dari E2 Node"""
    payload = json.loads(summary[rmr.RMR_MS_PAYLOAD])
    ue_count = payload.get("active_ue_count", 0)
    prb_usage = payload.get("dl_prb_utilization", 0.0)
    
    # Logika Cerdas / Anomali Detection
    if prb_usage > 85.0:
        self.logger.warn(f"High Traffic Congestion Detected! Active UEs: {ue_count}, PRB: {prb_usage}%")
        # Trigger E2SM-RC Control Message to offload traffic...
        
    self.rmr_free(sbuf)

def default_handler(self, summary, sbuf):
    self.logger.info("Received unhandled message type: {}".format(summary[rmr.RMR_MS_MSG_TYPE]))
    self.rmr_free(sbuf)

if __name__ == "__main__":
    # Inisialisasi xApp dengan RMR port 4560
    xapp = RMRXapp(default_handler=default_handler, rmr_port=4560, post_init=None)
    xapp.register_callback(handler=kpm_callback, message_type=12050) # Tipe 12050 = KPM Indication
    xapp.run()
```

#### B. Kontainerisasi Docker (`Dockerfile`):
```dockerfile
FROM nexus3.o-ran-sc.org:10002/o-ran-sc/bldr-ubuntu20-c-go:2.0.0 as builder
RUN apt-get update && apt-get install -y python3-pip cmake librmr-dev
WORKDIR /app
COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY . .
ENV RMR_SEED_RT=/app/routes.rt
CMD ["python3", "main.py"]
```
* **Helm Deployment:** xApp yang telah di-build ke Docker image diorkestrasi di atas klaster Kubernetes / O-Cloud menggunakan Helm Chart yang di-manage oleh *xApp Manager (appmgr)*.
