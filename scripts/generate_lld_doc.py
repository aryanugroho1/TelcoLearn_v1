#!/usr/bin/env python3
"""
TelcoLearn Low-Level Design (LLD) Document Generator
Generates a comprehensive, enterprise-grade Microsoft Word (.docx) document
for TelcoLearn Engine v3.6.0.
"""

import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    """Sets the background color of a table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets inner margins for a table cell in twips."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def add_callout(doc, text, title="NOTE / CATATAN ARSITEKTUR", color_hex="1F497D", bg_hex="F0F4F8"):
    """Adds a stylish callout box using a single-cell table."""
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, bg_hex)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)

    # Set left border thick, others none
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="{color_hex}"/>'
        f'<w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        f'<w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    run_t = p.add_run(f"📌 {title}: ")
    run_t.bold = True
    run_t.font.name = "Calibri"
    run_t.font.size = Pt(10)
    run_t.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    run_b = p.add_run(text)
    run_b.font.name = "Calibri"
    run_b.font.size = Pt(9.5)
    run_b.font.color.rgb = RGBColor(0x33, 0x33, 0x33)
    doc.add_paragraph()

def add_code_block(doc, code_text):
    """Adds a formatted monospace code block."""
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "F5F5F5")
    set_cell_margins(cell, top=100, bottom=100, left=150, right=150)

    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="4" w:space="0" w:color="D3D3D3"/>'
        f'<w:left w:val="single" w:sz="16" w:space="0" w:color="595959"/>'
        f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="D3D3D3"/>'
        f'<w:right w:val="single" w:sz="4" w:space="0" w:color="D3D3D3"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.05
    run = p.add_run(code_text)
    run.font.name = "Consolas"
    run.font.size = Pt(8.5)
    run.font.color.rgb = RGBColor(0x22, 0x22, 0x22)
    doc.add_paragraph()

def format_table_headers(table, col_widths, headers, bg_hex="1F497D"):
    """Formats the header row of a table."""
    hdr_row = table.rows[0]
    for i, title in enumerate(headers):
        cell = hdr_row.cells[i]
        cell.width = Inches(col_widths[i])
        set_cell_background(cell, bg_hex)
        set_cell_margins(cell, top=120, bottom=120, left=120, right=120)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(title)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

def add_table_data(table, col_widths, rows_data, stripe_bg="F9FAFB"):
    """Adds styled data rows to a table."""
    for row_idx, r_data in enumerate(rows_data):
        row = table.add_row()
        is_stripe = (row_idx % 2 == 1)
        for i, val in enumerate(r_data):
            cell = row.cells[i]
            cell.width = Inches(col_widths[i])
            if is_stripe:
                set_cell_background(cell, stripe_bg)
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.15
            run = p.add_run(str(val))
            run.font.name = "Calibri"
            run.font.size = Pt(8.5)
            run.font.color.rgb = RGBColor(0x33, 0x33, 0x33)

def build_lld_document(output_path):
    print(f"📄 Memulai pembuatan dokumen LLD: {output_path}")
    doc = Document()

    # Set Margins
    sections = doc.sections
    for s in sections:
        s.top_margin = Inches(1.0)
        s.bottom_margin = Inches(1.0)
        s.left_margin = Inches(1.0)
        s.right_margin = Inches(1.0)

    # Styles
    styles = doc.styles
    normal_style = styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x33, 0x33, 0x33)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(4)

    # =========================================================================
    # 1. COVER / TITLE PAGE
    # =========================================================================
    p_pre = doc.add_paragraph()
    p_pre.paragraph_format.space_before = Pt(36)
    r_pre = p_pre.add_run("SYSTEM DESIGN SPECIFICATION (LOW-LEVEL DESIGN)")
    r_pre.font.size = Pt(12)
    r_pre.bold = True
    r_pre.font.color.rgb = RGBColor(0x59, 0x59, 0x59)

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(12)
    p_title.paragraph_format.space_after = Pt(8)
    r_title = p_title.add_run("TELCOLEARN PLATFORM v3.6.0")
    r_title.font.size = Pt(28)
    r_title.bold = True
    r_title.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(24)
    r_sub = p_sub.add_run(
        "Low-Level Technical Architecture, Finite State Machine, Hybrid 3GPP RAG Engine, "
        "Dynamic Multi-Vendor Parameter Diagnostics, and Baileys WebSocket Ingress Model"
    )
    r_sub.font.size = Pt(13)
    r_sub.font.color.rgb = RGBColor(0x41, 0x8A, 0xB3)

    doc.add_paragraph()

    # Metadata Table
    meta_table = doc.add_table(rows=1, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    format_table_headers(meta_table, [2.5, 4.0], ["Attribute", "Specification Details"], bg_hex="1F497D")
    meta_data = [
        ["Project Name", "TelcoLearn (AI Telecom Companion & Protocol Diagnostic Engine)"],
        ["Target Version", "v3.6.0 (Production Release)"],
        ["Document Classification", "Confidential / Engineering Technical Architecture (LLD)"],
        ["Primary Author", "Arya Nugroho (Principal Telecom & AI Systems Architect)"],
        ["Target Runtime", "Node.js 18+ LTS, ES Modules (ESM), Express.js, Baileys WA Engine"],
        ["AI Reasoning Core", "Google Gemini 3 Flash Multimodal API (Structured Reasoning)"],
        ["Persistence Engine", "SQLite3 WAL Mode (Single-node / Volume-mounted) + PostgreSQL Adapter"],
        ["Containerization", "Docker Multi-stage, Coolify PaaS, PM2 Cluster Monitor"],
        ["Date of Baseline", "October 2026"],
        ["Document Status", "FINAL / APPROVED FOR PRODUCTION SHIPMENT"]
    ]
    add_table_data(meta_table, [2.5, 4.0], meta_data)

    doc.add_page_break()

    # =========================================================================
    # 2. DOCUMENT CONTROL & REVISION HISTORY
    # =========================================================================
    h1 = doc.add_heading("1. Document Control & Revision History", level=1)
    h1.style.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    doc.add_paragraph(
        "Dokumen Low-Level Design (LLD) ini mendefinisikan arsitektur teknis granular, model data, mesin status (FSM), "
        "komponen antarmuka perpesanan WebSocket Baileys, sistem Retrieval-Augmented Generation (RAG) telekomunikasi, "
        "algoritma deteksi anomali log, serta tata kelola keamanan dan anti-spam pada platform TelcoLearn."
    )

    rev_table = doc.add_table(rows=1, cols=5)
    rev_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    format_table_headers(rev_table, [1.0, 1.0, 1.5, 1.5, 1.5], ["Version", "Date", "Author", "Change Description", "Approval"], bg_hex="1F497D")
    rev_data = [
        ["v1.0.0", "Oct 2026", "Arya Nugroho", "Initial System Architecture & Baileys Messaging Core", "Dev Lead"],
        ["v2.0.0", "Oct 2026", "Arya Nugroho", "Hybrid RAG ShareTechNote Integration & Heuristic Detection", "Chief Architect"],
        ["v3.0.0", "Oct 2026", "Arya Nugroho", "Multi-Vendor Parameter Cross-Walk (Ericsson, Huawei, Nokia)", "Product Head"],
        ["v3.5.0", "Oct 2026", "Arya Nugroho", "Telecom Project Management (PMBOK/PMP) 10-Module Track", "Tech Reviewer"],
        ["v3.6.0", "Oct 2026", "Arya Nugroho", "Track Isolation, Curriculum Looping, Unsubscribe/Stop Engine", "FINAL APPROVED"]
    ]
    add_table_data(rev_table, [1.0, 1.0, 1.5, 1.5, 1.5], rev_data)

    doc.add_paragraph()
    add_callout(
        doc,
        "Dokumen ini wajib dijadikan acuan utama (single source of truth) bagi seluruh engineer, pengembang backend, "
        "QA specialist, dan sysadmin dalam melakukan pemeliharaan, refactoring kode, ekspansi kurikulum modul, "
        "maupun deployment infrastruktur container TelcoLearn.",
        title="PANDUAN IMPLEMENTASI REKAYASA SISTEM"
    )

    doc.add_page_break()

    # =========================================================================
    # 3. EXECUTIVE ARCHITECTURE OVERVIEW & SCOPE
    # =========================================================================
    h1 = doc.add_heading("2. Executive System Overview & Scope", level=1)
    h1.style.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    doc.add_paragraph(
        "TelcoLearn adalah platform micro-learning dan asisten diagnostik telekomunikasi berbasis kecerdasan buatan "
        "yang beroperasi secara real-time di atas protokol perpesanan instan WhatsApp. Platform ini dirancang untuk mengatasi "
        "jurang kognitif (cognitive bottleneck) yang dihadapi oleh RF Optimization Engineer, Core Network Engineer, Drive Test Specialist, "
        "dan Project Manager di lapangan yang sering kali harus memecahkan kendala teknis radio 3GPP tanpa akses ke perangkat desktop."
    )

    h2 = doc.add_heading("2.1 Ruang Lingkup Sistem (System Scope)", level=2)
    h2.style.font.color.rgb = RGBColor(0x2E, 0x75, 0xB6)

    doc.add_paragraph("Sistem TelcoLearn mencakup subsistem fungsional sebagai berikut:")
    scope_points = [
        "Ingress & Egress Perpesanan WhatsApp Real-Time: Integrasi Baileys Multi-Device WebSocket dengan dukungan Pairing Code & QR Streaming.",
        "Deterministic Finite State Machine (FSM): Manajemen siklus hidup pengguna (User Lifecycle) dengan 7 state terisolasi tanpa dead-lock.",
        "Curriculum Progression & Dynamic Track Looping: Penyajian kurikulum berjenjang berbasis 5 focus tracks dengan fitur auto-repeat review.",
        "Dual-Tier Knowledge Fabric (RAG): Konsolidasi 22 spesifikasi resmi 3GPP (Rel-15 s/d Rel-18), ensiklopedia praktis ShareTechNote, dan PMBOK 7th Edition.",
        "Multi-Vendor Parameter Cross-Walk Reconciliation: Pemetaan counter OSS dan parameter radio lintas vendor (Ericsson MOM, Huawei MML, Nokia SRAN).",
        "Adaptive Dynamic Chameleon AI Reasoning: Rekayasa prompt cerdas berbasis Google Gemini 3 Flash dengan 10 lensa disiplin telekomunikasi.",
        "Automated Push Dispatcher & Anti-Spam Egress: Pengiriman modul terjadwal (Pagi, Siang, Malam) dengan batch rate limiting dan jitter delay.",
        "Interactive RF Simulation Engine: Pembuatan visualisasi kurva propagasi sinyal RF, SINR vs Jarak, dan call flow interaktif via QuickChart.io.",
        "Safety, Privacy & Unsubscribe Governance: Mekanisme opt-out instan (/stop, /unsubscribe) sesuai regulasi WhatsApp Messaging Policy."
    ]
    for sp in scope_points:
        p = doc.add_paragraph(style='List Bullet')
        p.add_run(sp)

    doc.add_paragraph()

    # =========================================================================
    # 4. HIGH-LEVEL VS LOW-LEVEL ARCHITECTURE DECOMPOSITION
    # =========================================================================
    h1 = doc.add_heading("3. Technical Architecture & Subsystem Decomposition", level=1)
    h1.style.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    doc.add_paragraph(
        "Arsitektur TelcoLearn memisahkan lapisan eksekusi deterministik (Rule-based & FSM) dari lapisan penalaran probabilistik "
        "(Large Language Model) untuk mencapai reliabilitas 99.9% tanpa terjadi cascading error."
    )

    add_code_block(doc, 
"""+---------------------------------------------------------------------------------------------------------+
|                                    TELCOLEARN HIGH-LEVEL ARCHITECTURE                                   |
+---------------------------------------------------------------------------------------------------------+
| [Client Tier]            WhatsApp Users (Mobile / Desktop) & Group Chats (@TelcoLearn / !telco)         |
|                                                     |                                                   |
| [Ingress Socket Tier]    Baileys WebSocket Client (Multi-Device Engine) <--> Anti-Loop / Identity Resolver|
|                                                     |                                                   |
| [Routing & FSM Tier]     Message Router (routerService.js) <---------> FSM Controller (7 Discrete States)|
|                            /           |               \\                                                |
|                           /            |                \\                                               |
| [Business Logic Tier]  Commands     Micro-Learn & Quiz   Diagnostic & RAG Engine  <--> Simulation Service|
|                        (/track,     (db.js Progress)     (geminiService.js)            (QuickChart.io)  |
|                        /schedule,                        - TF-IDF Inverted Index                         |
|                        /stop)                            - 3GPP Rel-18 + ShareTechNote                   |
|                                                          - Tri-Vendor Parameter Matrix                   |
|                                                     |                                                   |
| [Background Tier]      Node-Cron Scheduler Worker (07:30 WIB Morning / 12:30 WIB Afternoon / Rescue)    |
|                                                     |                                                   |
| [Persistence Tier]     SQLite3 Engine (WAL Mode, fsync Normal) / PostgreSQL Pool + Automated Backups    |
+---------------------------------------------------------------------------------------------------------+""")

    h2 = doc.add_heading("3.1 Rincian Modul & Direktori Kode", level=2)
    h2.style.font.color.rgb = RGBColor(0x2E, 0x75, 0xB6)

    comp_table = doc.add_table(rows=1, cols=4)
    comp_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    format_table_headers(comp_table, [1.5, 1.8, 1.2, 2.0], ["Module / File", "Architectural Role", "Key Dependencies", "Primary Responsibilities"], bg_hex="1F497D")
    comp_data = [
        ["index.js", "Server Bootstrapper & Ingress Supervisor", "Express, Baileys, pino", "Socket lifecycle, pairing code, QR rendering, REST API endpoints, DB backup"],
        ["services/routerService.js", "Message Router & FSM Controller", "db.js, constants.js, geminiService", "Parsing payload Baileys, normalisasi LID/phone, validasi FSM, command dispatcher"],
        ["services/geminiService.js", "Multimodal AI & Hybrid RAG Engine", "@google/genai, fs, path", "Chameleon prompt injection, TF-IDF lexical search, vendor cross-walk, multi-turn memory"],
        ["services/schedulerService.js", "Autonomous Outbound Push Worker", "node-cron, db.js, Baileys", "Cron schedule 07:30 & 12:30 WIB, streak rescue midnight, anti-spam batch pacing"],
        ["services/simulationService.js", "RF Plot & Diagram Synthesis", "https, QuickChart.io", "Visualisasi kurva SINR vs Distance, Path Loss Free Space & Cost231, Call Flow SVG"],
        ["services/antiBanService.js", "Egress Governance & Rate Limiting", "crypto", "Simulasi pengetikan (typing bubble 800ms), SHA-256 message entropy jitter, burst limiter"],
        ["database/db.js", "Data Access Layer (DAL)", "better-sqlite3", "Kueri SQL teroptimasi, kueri track terisolasi, manajemen transaksi progress belajar & kuis"],
        ["config/constants.js", "Master Configuration Dictionary", "None (Zero-dep)", "System instructions (ID & EN), tabel track, jadwal pengingat, regex log detector"]
    ]
    add_table_data(comp_table, [1.5, 1.8, 1.2, 2.0], comp_data)

    doc.add_page_break()

    # =========================================================================
    # 5. FINITE STATE MACHINE (FSM) SPECIFICATION
    # =========================================================================
    h1 = doc.add_heading("4. Finite State Machine (FSM) & User Lifecycle LLD", level=1)
    h1.style.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    doc.add_paragraph(
        "Siklus hidup interaksi pengguna dengan TelcoLearn dikendalikan oleh Finite State Machine (FSM) deterministik. "
        "Setiap pengguna terikat pada satu status (`current_state`) yang tersimpan di basis data SQLite beserta payload kontekstual (`state_data`). "
        "Arsitektur ini menjamin bahwa interaksi asinkron melalui WhatsApp tidak akan pernah mengalami race condition atau ambiguitas konteks."
    )

    h2 = doc.add_heading("4.1 Matriks Status FSM (State Transition Matrix)", level=2)
    h2.style.font.color.rgb = RGBColor(0x2E, 0x75, 0xB6)

    fsm_table = doc.add_table(rows=1, cols=5)
    fsm_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    format_table_headers(fsm_table, [1.4, 1.2, 1.4, 1.2, 1.3], ["Current State", "Inbound Event / Input", "Guard Conditions", "Next State", "Action Executed"], bg_hex="1F497D")
    fsm_data = [
        ["NEW_USER (Unregistered)", "Pesan Pertama Pengguna", "User belum ada di DB", "ONBOARDING_LANG", "Create record pengguna default, kirim prompt pemilihan bahasa (ID/EN)"],
        ["ONBOARDING_LANG", "Input '1' atau 'id'", "Validasi pilihan bahasa", "ONBOARDING_TRACK", "Set preferred_language='id', kirim prompt 5 pilihan track kurikulum"],
        ["ONBOARDING_LANG", "Input '2' atau 'en'", "Validasi pilihan bahasa", "ONBOARDING_TRACK", "Set preferred_language='en', kirim prompt 5 study tracks bahasa Inggris"],
        ["ONBOARDING_LANG", "Input teks non-angka", "Bypass heuristik", "IDLE", "Set default lang='id', track='protocol_qa', langsung jawab pesan bebas"],
        ["ONBOARDING_TRACK", "Input angka '1' - '5'", "Regex match track key", "IDLE", "Update focus_track, kirim konfirmasi onboarding lengkap, aktifkan notifikasi"],
        ["ONBOARDING_TRACK", "Input teks bebas", "Auto-bypass", "IDLE", "Set track default, simpan preferensi, proses query teknis pengguna"],
        ["IDLE", "Command '/quiz' atau '2'", "Tersedia kuis track", "AWAITING_QUIZ_ANSWER", "Fetch kuis sesuai track, simpan quiz_id ke state_data, kirim opsi A-D"],
        ["AWAITING_QUIZ_ANSWER", "Input 'A', 'B', 'C', atau 'D'", "Kunci jawaban cocok", "IDLE", "Simpan ke quiz_logs, tambah streak_count +1, kirim penjelasan mendalam"],
        ["AWAITING_QUIZ_ANSWER", "Input salah (A/B/C/D)", "Jawaban salah", "IDLE", "Simpan ke quiz_logs (is_correct=0), kirim pembahasan dan kunci yang benar"],
        ["AWAITING_QUIZ_ANSWER", "Input '/batal' / 'cancel'", "Pembatalan aktif", "IDLE", "Reset state_data ke null, kirim konfirmasi pembatalan sesi kuis"],
        ["IDLE", "Command '/catat [teks]'", "Argumen kosong", "AWAITING_NOTE_BODY", "Minta pengguna mengirimkan teks catatan teknis yang ingin disimpan"],
        ["AWAITING_NOTE_BODY", "Teks catatan pengguna", "Panjang teks > 0", "IDLE", "Insert ke tabel custom_notes, kirim konfirmasi penyimpanan catatan"],
        ["IDLE", "Pertanyaan multiturn baru", "Deteksi context shift", "AWAITING_TOPIC_CONFIRM", "Kirim verifikasi: 1 (Topik Baru) atau 2 (Lanjutan Pembahasan)"],
        ["AWAITING_TOPIC_CONFIRM", "Input '1' (Topik Baru)", "Konfirmasi clear", "IDLE", "Clear llm_conversations user_id, eksekusi query sebagai konteks murni"],
        ["AWAITING_TOPIC_CONFIRM", "Input '2' (Lanjutan)", "Konfirmasi lanjut", "IDLE", "Muat history percakapan, eksekusi Gemini dengan thread memori"],
        ["ANY STATE", "Command '/reset'", "Akses universal", "ONBOARDING_LANG", "Reset state ke ONBOARDING_LANG, bersihkan state_data, mulai wizard onboarding"],
        ["ANY STATE", "Command '/stop' / '/unsubscribe'", "Akses universal", "IDLE", "Set reminder_preference='off', matikan seluruh broadcast harian otomatis"]
    ]
    add_table_data(fsm_table, [1.4, 1.2, 1.4, 1.2, 1.3], fsm_data)

    doc.add_page_break()

    # =========================================================================
    # 6. DATABASE SCHEMA & DATA DICTIONARY LLD
    # =========================================================================
    h1 = doc.add_heading("5. Data Architecture & Schema Low-Level Design", level=1)
    h1.style.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    doc.add_paragraph(
        "Basis data TelcoLearn diimplementasikan menggunakan SQLite3 dengan driver berkecepatan tinggi `better-sqlite3`. "
        "Database dikonfigurasi dengan mode **Write-Ahead Logging (WAL)** dan `synchronous = NORMAL` untuk mendukung akses "
        "konkuren multi-koneksi tanpa read-write locking contention. Struktur basis data terdiri atas 9 tabel relasional teroptimasi."
    )

    h2 = doc.add_heading("5.1 Kamus Data Entitas Utama (Data Dictionary)", level=2)
    h2.style.font.color.rgb = RGBColor(0x2E, 0x75, 0xB6)

    # Table: users
    doc.add_heading("Tabel: users (Manajemen Akun & Preferensi Belajar)", level=3)
    t_users = doc.add_table(rows=1, cols=5)
    t_users.alignment = WD_TABLE_ALIGNMENT.CENTER
    format_table_headers(t_users, [1.5, 1.1, 0.8, 1.2, 1.9], ["Column Name", "Data Type", "Nullable", "Default Value", "Description / Constraints"], bg_hex="1F497D")
    u_data = [
        ["id", "INTEGER", "NO", "AUTOINCREMENT", "Primary Key pengenal unik pengguna"],
        ["jid", "TEXT", "NO", "None", "WhatsApp JID unik (misal: 62812xxx@s.whatsapp.net / xxx@lid). UNIQUE"],
        ["phone_number", "TEXT", "YES", "NULL", "Nomor telepon yang telah dinormalisasi secara internasional (E.164 standard)"],
        ["display_name", "TEXT", "YES", "'Pelajar Telco'", "Nama tampilan WhatsApp pengguna yang diambil dari payload notif/pushName"],
        ["focus_track", "TEXT", "NO", "'protocol_qa'", "Jalur kurikulum: 'protocol_qa', 'drive_test', 'ml_telco', 'log_telco', 'telco_pmp'"],
        ["preferred_language", "TEXT", "NO", "'id'", "Bahasa antarmuka pengguna: 'id' (Bahasa Indonesia) atau 'en' (English)"],
        ["reminder_preference", "TEXT", "NO", "'all'", "Frekuensi pengingat modul harian: 'morning', 'afternoon', 'night', 'all', 'off'"],
        ["current_state", "TEXT", "NO", "'ONBOARDING_LANG'", "Status FSM aktif: 'IDLE', 'ONBOARDING_LANG', 'ONBOARDING_TRACK', dll."],
        ["state_data", "TEXT", "YES", "NULL", "Payload JSON sementara untuk menyimpan data kontekstual saat status non-IDLE"],
        ["streak_count", "INTEGER", "NO", "0", "Jumlah hari belajar berturut-turut yang telah diselesaikan tanpa terputus"],
        ["last_active_date", "TEXT", "YES", "NULL", "Tanggal aktivitas interaktif terakhir pengguna (format: YYYY-MM-DD)"],
        ["created_at", "DATETIME", "NO", "CURRENT_TIMESTAMP", "Timestamp registrasi pertama pengguna ke sistem"],
        ["updated_at", "DATETIME", "NO", "CURRENT_TIMESTAMP", "Timestamp perubahan data profil terakhir"]
    ]
    add_table_data(t_users, [1.5, 1.1, 0.8, 1.2, 1.9], u_data)

    doc.add_paragraph()

    # Table: modules & quizzes
    doc.add_heading("Tabel: modules (Kurikulum Micro-Learning)", level=3)
    t_mods = doc.add_table(rows=1, cols=5)
    t_mods.alignment = WD_TABLE_ALIGNMENT.CENTER
    format_table_headers(t_mods, [1.5, 1.1, 0.8, 1.2, 1.9], ["Column Name", "Data Type", "Nullable", "Default Value", "Description / Constraints"], bg_hex="1F497D")
    m_data = [
        ["id", "INTEGER", "NO", "AUTOINCREMENT", "Primary Key pengenal unik modul"],
        ["module_code", "TEXT", "NO", "None", "Kode referensi modul resmi (misal: 'MOD-5G-SA-01', 'MOD-PMP-04'). UNIQUE"],
        ["title", "TEXT", "NO", "None", "Judul materi pembelajaran dalam Bahasa Indonesia"],
        ["category", "TEXT", "NO", "None", "Kategori kurikulum: 'callflow', 'architecture', 'logfile', 'ml', 'pmp'"],
        ["sequence_order", "INTEGER", "NO", "1", "Urutan penyajian modul dalam jalur pembelajaran"],
        ["wa_text_body", "TEXT", "NO", "None", "Konten materi micro-dose terformat teks WhatsApp (Bahasa Indonesia)"],
        ["wa_text_body_en", "TEXT", "YES", "NULL", "Konten materi micro-dose terformat teks WhatsApp (English version)"],
        ["created_at", "DATETIME", "NO", "CURRENT_TIMESTAMP", "Timestamp pembuatan modul"]
    ]
    add_table_data(t_mods, [1.5, 1.1, 0.8, 1.2, 1.9], m_data)

    doc.add_paragraph()

    doc.add_heading("Tabel: quizzes (Bank Soal Evaluasi Kognitif)", level=3)
    t_quiz = doc.add_table(rows=1, cols=5)
    t_quiz.alignment = WD_TABLE_ALIGNMENT.CENTER
    format_table_headers(t_quiz, [1.5, 1.1, 0.8, 1.2, 1.9], ["Column Name", "Data Type", "Nullable", "Default Value", "Description / Constraints"], bg_hex="1F497D")
    q_data = [
        ["id", "INTEGER", "NO", "AUTOINCREMENT", "Primary Key pengenal unik kuis"],
        ["module_id", "INTEGER", "NO", "None", "Foreign Key yang merujuk ke tabel modules(id)"],
        ["question", "TEXT", "NO", "None", "Teks pertanyaan skenario teknis telekomunikasi"],
        ["option_a", "TEXT", "NO", "None", "Teks pilihan ganda A"],
        ["option_b", "TEXT", "NO", "None", "Teks pilihan ganda B"],
        ["option_c", "TEXT", "NO", "None", "Teks pilihan ganda C"],
        ["option_d", "TEXT", "NO", "None", "Teks pilihan ganda D"],
        ["correct_option", "TEXT", "NO", "None", "Kunci jawaban yang valid ('A', 'B', 'C', atau 'D')"],
        ["explanation", "TEXT", "NO", "None", "Pembahasan teknis mendalam dan referensi klausul 3GPP / PMBOK (ID)"],
        ["explanation_en", "TEXT", "YES", "NULL", "Pembahasan teknis mendalam dan referensi klausul 3GPP / PMBOK (EN)"]
    ]
    add_table_data(t_quiz, [1.5, 1.1, 0.8, 1.2, 1.9], q_data)

    doc.add_page_break()

    # =========================================================================
    # 7. CRITICAL LOGIC: TRACK FILTERING & CURRICULUM LOOPING LLD
    # =========================================================================
    h1 = doc.add_heading("6. Detailed Component Logic: Track Isolation & Curriculum Looping", level=1)
    h1.style.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    doc.add_paragraph(
        "Salah satu peningkatan arsitektur krusial pada rilis v3.6.0 adalah eliminasi kebocoran materi lintas-track "
        "(Cross-Track Contamination). Pada versi sebelumnya, saat seorang engineer menyelesaikan seluruh modul dalam track-nya, "
        "sistem secara tidak sengaja jatuh ke fallback modul urutan terendah dari track lain (misal: engineer Protocol QA melompat ke PMP). "
        "Komponen `database/db.js` telah diperbarui dengan isolasi kategori eksplisit dan mekanisme pengulangan kurikulum (Looping)."
    )

    h2 = doc.add_heading("6.1 Pemetaan Kategori Jalur Belajar (Track-to-Category Mapping)", level=2)
    h2.style.font.color.rgb = RGBColor(0x2E, 0x75, 0xB6)

    map_table = doc.add_table(rows=1, cols=3)
    map_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    format_table_headers(map_table, [1.8, 2.2, 2.5], ["Focus Track Key", "Allowed Category Filter (SQL IN)", "Silabus Topik Telekomunikasi"], bg_hex="1F497D")
    map_data = [
        ["protocol_qa", "('callflow', 'logfile', 'architecture')", "RRC Signaling, 5G Registration, PDU Session, Xn/NG Handover, Cause Codes"],
        ["drive_test", "('architecture', 'logfile')", "RSRP/RSRQ/SINR Thresholds, Radio Link Failure (RLF), Tilt/Azimuth, PCI Collision"],
        ["ml_telco", "('ml')", "Anomali RF via Isolation Forest, KPI Forecasting LSTM, XGBoost Triage Modem Crash"],
        ["log_telco", "('logfile', 'callflow')", "Trace Log Decoding, ASN.1 Decoding, Wireshark PCAP Filter, Cause 11/16/27"],
        ["telco_pmp", "('pmp')", "PMBOK 7th Ed, Rollout WBS 100% Rule, Critical Path Method (CPM), EVM (CPI/SPI/EAC), SLA"]
    ]
    add_table_data(map_table, [1.8, 2.2, 2.5], map_data)

    doc.add_paragraph()
    doc.add_heading("6.2 Logika Algoritma getNextModuleForUser (Pseudo-code)", level=3)
    add_code_block(doc,
"""function getNextModuleForUser(userId):
    user = query("SELECT focus_track FROM users WHERE id = ?", userId)
    categories = getCategoriesForTrack(user.focus_track)
    
    // 1. Coba ambil modul yang belum pernah dibaca dalam kategori track yang diizinkan
    nextModule = query(\"\"\"
        SELECT m.* FROM modules m
        WHERE m.category IN (categories)
          AND m.id NOT IN (
              SELECT module_id FROM user_module_progress 
              WHERE user_id = ? AND status = 'COMPLETED'
          )
        ORDER BY m.sequence_order ASC, m.id ASC LIMIT 1
    \"\"\", userId)
    
    if nextModule exists:
        return nextModule
        
    // 2. CURRICULUM LOOPING: Jika seluruh modul dalam track telah selesai,
    //    ulang kembali dari modul pertama dalam track yang sama (is_repeat = true).
    firstTrackModule = query(\"\"\"
        SELECT m.* FROM modules m
        WHERE m.category IN (categories)
        ORDER BY m.sequence_order ASC, m.id ASC LIMIT 1
    \"\"\")
    
    if firstTrackModule exists:
        firstTrackModule.is_repeat = true
        return firstTrackModule
        
    return null // Mencegah kebocoran ke kategori di luar track""")

    doc.add_page_break()

    # =========================================================================
    # 8. HYBRID RETRIEVAL-AUGMENTED GENERATION (RAG) & CHAMELEON AI
    # =========================================================================
    h1 = doc.add_heading("7. Hybrid RAG & Chameleon AI Reasoning Architecture", level=1)
    h1.style.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    doc.add_paragraph(
        "TelcoLearn mengintegrasikan model penalaran multimodal Google Gemini 3 Flash yang diarahkan secara deterministik "
        "oleh instruksi sistem adaptif (Chameleon Expert). Sistem ini mengeliminasi halusinasi model dengan memadukan basis "
        "pengetahuan internal lokal sebelum memicu generasi inferensi."
    )

    h2 = doc.add_heading("7.1 Spesifikasi Lensa Penalaran Adaptif (Chameleon Perspective Lenses)", level=2)
    h2.style.font.color.rgb = RGBColor(0x2E, 0x75, 0xB6)

    lens_table = doc.add_table(rows=1, cols=3)
    lens_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    format_table_headers(lens_table, [1.8, 2.0, 2.7], ["Lens Domain", "Triggering Context / Keywords", "Reasoning & Output Strategy"], bg_hex="1F497D")
    lens_data = [
        ["Core Network & IMS Lens", "5GC, AMF, SMF, UPF, PCF, NRF, SBA, VoLTE, VoNR, SIP, 5QI, QCI, N2/N3/N4", "Tinjau kontrol/user plane, QoS routing, signaling call flow berurutan."],
        ["RAN Performance (RPO)", "Accessibility, Retainability, Drop Rate, PRB, Antenna Tilt, KPI Formula", "Sajikan formula counter OSS terperinci, analisis utilisasi slot radio."],
        ["RAN Integration & RET", "BBU, RRU, AAU, SFP, RET, VSWR Alarm, S1/NG/Xn Link Down, Commissioning", "Sajikan checklist inspeksi fisik kabel optik, alarm radio, dan reset interface."],
        ["O-RAN Cloud-Native", "O-RAN Alliance, RIC, xApps, rApps, E2, A1, O1, NETCONF/YANG, Kubernetes, Docker", "Analisis arsitektur disaggregated, troubleshooting container dan Linux kernel."],
        ["CEM & SOC Operations", "MOS Score, Video Stall Ratio, Gaming Latency, VIP Customer Complain, QoE", "Korelasikan metrik performa RF jaringan terhadap dampak persepsi nyata pengguna."],
        ["Radio Protocol & Signaling", "Layer 3, RRCSetupRequest, NAS Reject, Cause Codes, Radio Timers (T300, T304)", "Sajikan sequence langkah-demi-langkah (PRACH, PDCCH, PDSCH) berstandar 3GPP."],
        ["Telecom PMP / PMBOK", "EVM (CPI, SPI, EAC), Critical Path (CPM), WBS, PAT/PAC/FAC, FFP/CPFF Kontrak", "Berikan kalkulasi matematis presisi dan panduan tata kelola berstandar PMI."]
    ]
    add_table_data(lens_table, [1.8, 2.0, 2.7], lens_data)

    doc.add_paragraph()
    doc.add_heading("7.2 Rekonsiliasi Parameter Lintas Vendor (Tri-Vendor Cross-Walk)", level=3)
    doc.add_paragraph(
        "Tabel berikut mendemonstrasikan bagaimana TelcoLearn memetakan konsep radio 3GPP ke dalam parameter konfigurasi nyata "
        "tiga vendor radio terbesar di dunia tanpa ambiguitas nama atribut:"
    )

    vendor_table = doc.add_table(rows=1, cols=4)
    vendor_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    format_table_headers(vendor_table, [1.6, 1.6, 1.6, 1.7], ["Radio Function (3GPP)", "Ericsson (MOM / ENM)", "Huawei (MML / MAE)", "Nokia (SRAN / NetAct)"], bg_hex="1F497D")
    v_data = [
        ["A3 Event Offset (Intra-Freq HO)", "ReportConfigEUtra.a3Offset", "INTERFREQHOGROUP.InterFreqHoA3Offset", "LNHOIF.a3Offset"],
        ["Time to Trigger (TTT)", "ReportConfigEUtra.timeToTrigger", "INTERFREQHOGROUP.TimeToTrigger", "LNHOIF.timeToTrigger"],
        ["Cell Individual Offset (CIO)", "EUtranCellRelation.cellIndividualOffset", "EUTRANINTRAFREQNCELL.CellIndividualOffset", "LNREL.cellIndOffServ"],
        ["B1 Event Threshold (Inter-RAT)", "ReportConfigInterRat.b1Threshold", "INTERRATPOLICYCFGGROUP.InterRatB1Thresh", "IRATHO.b1ThresholdGeran"],
        ["PUSCH Open-Loop Power (P0)", "PuschPowerControl.p0NominalPusch", "CELLALGOSWITCH.PuschP0Nominal", "LNCEL.p0NomPusch"]
    ]
    add_table_data(vendor_table, [1.6, 1.6, 1.6, 1.7], v_data)

    doc.add_page_break()

    # =========================================================================
    # 9. SEQUENCE DIAGRAMS & CONTROL FLOW LLD
    # =========================================================================
    h1 = doc.add_heading("8. Detailed Workflows & Sequence Diagrams", level=1)
    h1.style.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    doc.add_paragraph(
        "Bagian ini mendokumentasikan alur kontrol dan interaksi antar-objek untuk seluruh proses bisnis utama di TelcoLearn."
    )

    h2 = doc.add_heading("8.1 Diagram Alir: Penanganan Pesan Masuk & Deteksi Log Otomatis", level=2)
    h2.style.font.color.rgb = RGBColor(0x2E, 0x75, 0xB6)

    add_code_block(doc,
"""+-------------+          +---------------+          +---------------+          +---------------+          +---------------+
| User Client |          | Baileys Socket|          | routerService |          |  SQLite DB    |          | Gemini Engine |
+------+------+          +-------+-------+          +-------+-------+          +-------+-------+          +-------+-------+
       |                         |                          |                          |                          |
       | 1. Kirim Log Sinyal     |                          |                          |                          |
       +------------------------>|                          |                          |                          |
       |                         | 2. Ingress Event (upsert)|                          |                          |
       |                         +------------------------->|                          |                          |
       |                         |                          | 3. Anti-Loop & ID Check  |                          |
       |                         |                          |    (normalizePhone)      |                          |
       |                         |                          |                          |                          |
       |                         |                          | 4. Fetch User State      |                          |
       |                         |                          +------------------------->|                          |
       |                         |                          |    User: IDLE            |                          |
       |                         |                          |<-------------------------+                          |
       |                         |                          |                          |                          |
       |                         |                          | 5. detectTelcoLogPattern |                          |
       |                         |                          |    --> TRUE (Cause 11)   |                          |
       |                         |                          |                          |                          |
       |                         |                          | 6. Hybrid RAG Query      |                          |
       |                         |                          |    (Search 3GPP & STN)   |                          |
       |                         |                          +------------------------->|                          |
       |                         |                          |    Returns Chunks        |                          |
       |                         |                          |<-------------------------+                          |
       |                         |                          |                                                     |
       |                         |                          | 7. Multimodal Inference (Chameleon Prompt)          |
       |                         |                          +---------------------------------------------------->|
       |                         |                          |    Returns Structured Root Cause Analysis (RCA)     |
       |                         |                          |<----------------------------------------------------+
       |                         |                          |                          |                          |
       |                         |                          | 8. Log Query History     |                          |
       |                         |                          +------------------------->|                          |
       |                         | 9. Send Typing Bubble    |                          |                          |
       |                         |<-------------------------+                          |                          |
       | 10. Display Typing ...  |                          |                          |                          |
       |<------------------------+                          |                          |                          |
       |                         | 11. Dispatch WhatsApp Msg|                          |                          |
       |                         |<-------------------------+                          |                          |
       | 12. Display RCA Analysis|                          |                          |                          |
       |<------------------------+                          |                          |                          |""")

    doc.add_page_break()

    h2 = doc.add_heading("8.2 Diagram Alir: Scheduler Outbound Push & Circuit Breaker", level=2)
    h2.style.font.color.rgb = RGBColor(0x2E, 0x75, 0xB6)

    add_code_block(doc,
"""+----------------+          +------------------+          +---------------+          +---------------+          +---------------+
| Cron Scheduler |          | schedulerService |          |  SQLite DB    |          | Baileys Socket|          |  User Phone   |
+-------+--------+          +--------+---------+          +-------+-------+          +-------+-------+          +-------+-------+
        |                            |                            |                          |                          |
        | 1. Trigger (07:30 / 12:30) |                            |                          |                          |
        +--------------------------->|                            |                          |                          |
        |                            | 2. getActiveUsersForSlot() |                          |                          |
        |                            +--------------------------->|                          |                          |
        |                            |    (reminder != 'off')     |                          |                          |
        |                            |<---------------------------+                          |                          |
        |                            |                                                       |                          |
        |                            | LOOP Setiap Pengguna Aktif (Batch Pacing):            |                          |
        |                            | 3. getNextModuleForUser(uid)                          |                          |
        |                            +--------------------------->|                          |                          |
        |                            |    Returns Module / Loop   |                          |                          |
        |                            |<---------------------------+                          |                          |
        |                            |                                                       |                          |
        |                            | 4. sendSafeScheduled(jid, text)                       |                          |
        |                            +------------------------------------------------------>|                          |
        |                            |                                                       | 5. Push Notification     |
        |                            |                                                       +------------------------->|
        |                            | 6. markModuleProgress(uid, mid, 'SENT')               |                          |
        |                            +--------------------------->|                          |                          |
        |                            |                                                       |                          |
        |                            | [ANTI-SPAM GUARD] Jika count % 5 == 0:                |                          |
        |                            | Jeda Asinkron 30 Detik (Thread Sleep)                 |                          |
        |                            |                                                       |                          |
        |                            | [CIRCUIT BREAKER] Jika Socket Closed terdeteksi:      |                          |
        |                            | Break Loop & Catat Warning Log                        |                          |
        |                            |                                                       |                          |""")

    doc.add_page_break()

    # =========================================================================
    # 10. SECURITY, ANTI-BAN & EGRESS GOVERNANCE LLD
    # =========================================================================
    h1 = doc.add_heading("9. Security, Anti-Ban & Egress Governance LLD", level=1)
    h1.style.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    doc.add_paragraph(
        "Pengoperasian bot pada jaringan WhatsApp tanpa API resmi Cloud mensyaratkan kepatuhan ketat terhadap pola transmisi manusia "
        "agar akun WhatsApp tidak terkena suspend atau flagged oleh deteksi anti-spam Meta. TelcoLearn menerapkan sistem "
        "keamanan multi-lapis yang terbukti stabil melayani ribuan pesan per hari."
    )

    h2 = doc.add_heading("9.1 Matriks Mekanisme Pertahanan Egress (Defense Matrix)", level=2)
    h2.style.font.color.rgb = RGBColor(0x2E, 0x75, 0xB6)

    sec_table = doc.add_table(rows=1, cols=4)
    sec_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    format_table_headers(sec_table, [1.6, 1.6, 1.8, 1.5], ["Security Layer", "Threat Model Addressed", "Implementation Specification", "Efficacy / Metric"], bg_hex="1F497D")
    sec_data = [
        ["Anti-Loop Reflex Guard", "Pesan keluar bot diproses ulang sebagai pesan masuk (Infinite Echo Loop)", "Pengecekan msg.key.fromMe dan Set in-memory sentMessageIds (TTL 1 jam)", "100% Loop Elimination, 0 redundant egress"],
        ["Human Typing Simulation", "Deteksi automasi instan (Pesan teks panjang dikirim dalam 0ms)", "Trigger sock.sendPresenceUpdate('composing') dengan delay random 600-1200ms", "Meniru pola ketik manusia nyata"],
        ["Batch Spacing Pacing", "Deteksi lonjakan burst pengiriman massal (Spike broadcast)", "Pemberian sleep 30 detik setiap 5 pesan terkirim pada worker scheduler harian", "Mencegah rate-limiting connection dropped"],
        ["Message Entropy Jitter", "Deteksi kesamaan hash pesan broadcast yang identik ke ratusan user", "Variasi loopback footer, dynamic timestamp watermark, dan emoji personalization", "Hash SHA-256 unik untuk setiap paket keluar"],
        ["Phone & LID Normalizer", "Duplikasi akun karena WhatsApp menggunakan format LID internal baru", "Mapping dua arah Phone Number <--> LID via in-memory lidMap & sqlite lookup", "Mencegah split-profile dan duplikasi notifikasi"],
        ["Prompt Injection Defense", "Social engineering pengguna yang meminta system prompt & file server", "Filter 'Strict Security Guardrail' di Gemini instruction: penolakan otomatis", "Zero-leakage kredensial atau struktur direktori"],
        ["Universal Opt-Out Support", "Pengguna melaporkan bot sebagai spam karena pesan otomatis", "Command /stop, /unsubscribe, /jadwal 4 langsung set reminder_preference='off'", "Kepatuhan penuh WhatsApp Anti-Spam Policy"]
    ]
    add_table_data(sec_table, [1.6, 1.6, 1.8, 1.5], sec_data)

    doc.add_page_break()

    # =========================================================================
    # 11. DEPLOYMENT ARCHITECTURE & OPERATIONS LLD
    # =========================================================================
    h1 = doc.add_heading("10. Deployment Architecture, Containerization & Operations LLD", level=1)
    h1.style.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    doc.add_paragraph(
        "TelcoLearn dirancang dengan paradigma Cloud-Native / Self-Hosted yang ringan dan dapat dioperasikan pada Virtual Private Server (VPS) "
        "berukuran minimal (1 vCPU, 1 GB RAM) menggunakan orkestrasi PaaS Coolify atau Docker Compose standar."
    )

    h2 = doc.add_heading("10.1 Topologi Penyebaran Docker & Volume Mount", level=2)
    h2.style.font.color.rgb = RGBColor(0x2E, 0x75, 0xB6)

    add_code_block(doc,
"""version: '3.8'

services:
  telcolearn-engine:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: telcolearn-engine
    restart: always
    ports:
      - "3005:3005"
    environment:
      - NODE_ENV=production
      - PORT=3005
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - DB_PATH=/app/data/telcolearn.db
    volumes:
      # Persistent SQLite Storage:
      - ./data:/app/data
      # Persistent Baileys Auth Credentials (Mencegah Re-Scan QR):
      - ./auth_info_baileys:/app/auth_info_baileys
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3005/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s
    deploy:
      resources:
        limits:
          cpus: '1.5'
          memory: 1024M""")

    h2 = doc.add_heading("10.2 Spesifikasi Antarmuka REST API & Monitoring", level=2)
    h2.style.font.color.rgb = RGBColor(0x2E, 0x75, 0xB6)

    api_table = doc.add_table(rows=1, cols=4)
    api_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    format_table_headers(api_table, [1.0, 1.8, 1.4, 2.3], ["HTTP Method", "Endpoint URI", "Auth / Guard", "Functional Purpose"], bg_hex="1F497D")
    api_data = [
        ["GET", "/health", "Public", "Probe liveness & readiness container Docker. Returns JSON uptime & memory"],
        ["GET", "/api/status", "Public", "Status mendalam Baileys socket, QR generation status, dan versi aplikasi"],
        ["GET", "/qr atau /api/qr", "Public", "Streaming visual QR Code WhatsApp untuk proses initial pairing ponsel"],
        ["GET", "/api/download-db", "Admin Secret Header", "Ekspor dan download file database produksi aktif (SQLite WAL dump)"],
        ["POST", "/api/send", "API Key Header", "Outbound REST webhook untuk mentransmisikan pesan notifikasi eksternal"],
        ["GET", "/api/feedbacks", "Admin Token", "Retrieval daftar kritik dan saran pengguna yang dikirim via command /masukan"]
    ]
    add_table_data(api_table, [1.0, 1.8, 1.4, 2.3], api_data)

    doc.add_page_break()

    # =========================================================================
    # 12. GLOSSARY & APPENDIX
    # =========================================================================
    h1 = doc.add_heading("11. Glossary & Telecommunications Acronyms", level=1)
    h1.style.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    doc.add_paragraph("Daftar istilah dan akronim teknis standar 3GPP dan manajemen proyek yang digunakan dalam dokumen ini:")

    gloss_table = doc.add_table(rows=1, cols=3)
    gloss_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    format_table_headers(gloss_table, [1.5, 2.0, 3.0], ["Acronym", "Full Technical Term", "Engineering Context & Role"], bg_hex="1F497D")
    gloss_data = [
        ["3GPP", "3rd Generation Partnership Project", "Konsorsium standar internasional komunikasi seluler (GSM, UMTS, LTE, 5G NR)."],
        ["5GC", "5G Core Network", "Arsitektur inti jaringan 5G Standalone (SA) berbasis Service-Based Architecture (SBA)."],
        ["AMF", "Access and Mobility Management Function", "Fungsi kontrol 5GC untuk terminasi pensinyalan RAN Control Plane (N2) & NAS."],
        ["SMF", "Session Management Function", "Fungsi kontrol 5GC untuk manajemen sesi PDU, alokasi IP, dan seleksi UPF."],
        ["UPF", "User Plane Function", "Fungsi data plane 5GC untuk routing paket data berkecepatan tinggi (GTP-U encapsulation)."],
        ["O-RAN", "Open Radio Access Network", "Arsitektur disaggregated RAN berbasis open interfaces (E2, A1, O1) dan cloud-native."],
        ["RIC", "RAN Intelligent Controller", "Platform perangkat lunak untuk otomasi RAN berbasis AI (Near-RT xApps & Non-RT rApps)."],
        ["RRC", "Radio Resource Control", "Protokol Layer 3 radio seluler untuk connection setup, re-establishment, dan handover."],
        ["NAS", "Non-Access Stratum", "Protokol pensinyalan antara UE dan Core Network (5GMM, 5GSM, EMM, ESM)."],
        ["EVM", "Earned Value Management", "Metodologi pengendalian proyek PMI PMBOK untuk mengukur kinerja biaya & jadwal (CPI/SPI)."],
        ["CPM", "Critical Path Method", "Algoritma penjadwalan jaringan kerja proyek untuk menentukan durasi minimum rollout site."],
        ["FSM", "Finite State Machine", "Model komputasi matematis status terhingga untuk mengontrol alur interaksi pengguna bot."]
    ]
    add_table_data(gloss_table, [1.5, 2.0, 3.0], gloss_data)

    doc.add_paragraph()
    p_fin = doc.add_paragraph()
    p_fin.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_fin = p_fin.add_run("--- END OF LOW-LEVEL DESIGN SPECIFICATION ---")
    r_fin.bold = True
    r_fin.font.size = Pt(10)
    r_fin.font.color.rgb = RGBColor(0x88, 0x88, 0x88)

    # Save
    doc.save(output_path)
    print(f"✅ Dokumen LLD Word (.docx) berhasil dibuat: {output_path}")

if __name__ == "__main__":
    out_dir = r"c:\Users\user\Documents\2. Work\Project AI\TelcoLearn"
    out_file = os.path.join(out_dir, "TelcoLearn_v3.6_Low_Level_Design_Document.docx")
    build_lld_document(out_file)
