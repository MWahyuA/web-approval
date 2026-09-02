# 🏛️ Puspenkom BKN - UI/UX Design Guide

> **Sistem Informasi Pendaftaran Penilaian Kompetensi**
> Pusat Penilaian Kompetensi (Puspenkom) — Badan Kepegawaian Negara (BKN)

---

## 📋 Daftar Isi

1. [Brand Identity](#-brand-identity)
2. [Design System](#-design-system)
3. [Layout Structure](#-layout-structure)
4. [Component Library](#-component-library)
5. [User Interface Layouts](#-user-interface-layouts)
6. [Responsive Design](#-responsive-design)
7. [Accessibility Guidelines](#-accessibility-guidelines)
8. [Animation & Interaction](#-animation--interaction)

---

## 🎨 Brand Identity

### Nama Aplikasi

**Puspenkom BKN** — Platform digital pendaftaran penilaian kompetensi ASN secara online & paperless

### Logo & Typography

- **Primary Font**: Inter (Modern, Clean, Readable)
  - Headings: Inter Bold (700)
  - Body: Inter Regular (400)
  - Captions: Inter Medium (500)
- **Secondary Font**: Plus Jakarta Sans (untuk aksen)
- **Logo**: Kombinasi ikon BKN dengan elemen digital/shield yang merepresentasikan kompetensi & keamanan

### Color Palette

#### Primary Colors

```css
--primary-gradient: linear-gradient(135deg, #269DD8 0%, #DF2463 100%); /* Main CTA Gradient */
--primary-blue: #269DD8;        /* Base gradient start color */
--primary-pink: #DF2463;        /* Base gradient end color */
--primary-gradient-hover: linear-gradient(135deg, #1C7DAE 0%, #B91C51 100%); /* Hover state */
--primary-blue-light: #E9F5FB;  /* Subtle blue background */
--primary-pink-light: #FCE9EF;  /* Subtle pink background */
```

#### Secondary Colors

```css
--secondary-gold: #D97706;      /* Aksen pemerintah / highlight */
--secondary-teal: #0D9488;      /* Complementary accent */
--secondary-indigo: #4F46E5;    /* Interactive elements */
```

#### Neutral Colors

```css
--neutral-50: #F8FAFC;    /* Page background */
--neutral-100: #F1F5F9;   /* Card background */
--neutral-200: #E2E8F0;   /* Borders */
--neutral-300: #CBD5E1;   /* Disabled borders */
--neutral-400: #94A3B8;   /* Placeholder text */
--neutral-500: #64748B;   /* Secondary text */
--neutral-600: #475569;   /* Body text */
--neutral-700: #334155;   /* Heading text */
--neutral-800: #1E293B;   /* Dark text */
--neutral-900: #0F172A;   /* Primary text */
```

#### Semantic Colors

```css
--success: #16A34A;        /* Diterima, TTD berhasil */
--success-light: #DCFCE7;  /* Success background */
--warning: #D97706;        /* Menunggu verifikasi */
--warning-light: #FEF3C7;  /* Warning background */
--error: #DC2626;          /* Ditolak, error */
--error-light: #FEE2E2;    /* Error background */
--info: #2563EB;           /* Informasi umum */
--info-light: #DBEAFE;     /* Info background */
```

#### Status Colors (Surat Lifecycle)

```css
--status-draft: #94A3B8;           /* Draft */
--status-waiting: #D97706;         /* Menunggu TTD / Verifikasi */
--status-signed: #2563EB;          /* Sudah ditandatangani */
--status-approved: #16A34A;        /* Diterima */
--status-rejected: #DC2626;        /* Ditolak */
```

### Spacing System

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 96px;
```

### Border Radius

```css
--radius-sm: 4px;      /* Buttons kecil, badges */
--radius-md: 8px;      /* Cards, inputs */
--radius-lg: 12px;     /* Modals, panels */
--radius-xl: 16px;     /* Hero sections, large cards */
--radius-2xl: 24px;    /* Feature sections */
--radius-full: 9999px; /* Pills, avatars, circular */
```

### Shadows

```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-focus: 0 0 0 3px rgba(30, 64, 175, 0.15);
```

---

## 🎯 Design System

### Typography Scale

```css
/* Headings */
.heading-1 { font-size: 48px; line-height: 56px; font-weight: 700; letter-spacing: -0.02em; }
.heading-2 { font-size: 36px; line-height: 44px; font-weight: 700; letter-spacing: -0.01em; }
.heading-3 { font-size: 28px; line-height: 36px; font-weight: 600; }
.heading-4 { font-size: 24px; line-height: 32px; font-weight: 600; }
.heading-5 { font-size: 20px; line-height: 28px; font-weight: 600; }
.heading-6 { font-size: 18px; line-height: 24px; font-weight: 600; }

/* Body Text */
.body-large { font-size: 18px; line-height: 28px; font-weight: 400; }
.body-base  { font-size: 16px; line-height: 24px; font-weight: 400; }
.body-small { font-size: 14px; line-height: 20px; font-weight: 400; }
.body-xs    { font-size: 12px; line-height: 16px; font-weight: 400; }

/* Labels */
.label-large { font-size: 14px; line-height: 20px; font-weight: 500; text-transform: none; }
.label-base  { font-size: 12px; line-height: 16px; font-weight: 500; text-transform: none; }
.label-small { font-size: 11px; line-height: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }

/* Overline / Kicker */
.overline { font-size: 12px; line-height: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
```

### Button Styles

#### Primary Button

```css
.btn-primary {
  background: var(--primary-gradient);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: var(--primary-gradient-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn-primary:active {
  transform: translateY(0);
}
.btn-primary:disabled {
  background: var(--neutral-300);
  color: var(--neutral-500);
  cursor: not-allowed;
  transform: none;
}
```

#### Secondary Button

```css
.btn-secondary {
  background: white;
  color: var(--primary-blue);
  border: 2px solid var(--primary-blue);
  padding: 10px 22px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  background: var(--primary-blue-50);
}
```

#### Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: var(--neutral-600);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  border: none;
  font-weight: 500;
  cursor: pointer;
}
.btn-ghost:hover {
  background: var(--neutral-100);
  color: var(--neutral-900);
}
```

#### Danger Button

```css
.btn-danger {
  background: var(--error);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 600;
  border: none;
}
.btn-danger:hover {
  background: #B91C1C;
}
```

#### Success Button (TTD Digital)

```css
.btn-success {
  background: var(--success);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 600;
  border: none;
}
.btn-success:hover {
  background: #15803D;
}
```

### Button Sizes

```css
.btn-sm { padding: 8px 16px; font-size: 13px; }
.btn-md { padding: 12px 24px; font-size: 14px; }
.btn-lg { padding: 16px 32px; font-size: 16px; }
```

### Form Elements

#### Input Field

```css
.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--neutral-900);
  background: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.input-field::placeholder {
  color: var(--neutral-400);
}
.input-field:focus {
  border-color: var(--primary-blue);
  outline: none;
  box-shadow: var(--shadow-focus);
}
.input-field.error {
  border-color: var(--error);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}
```

#### Select Dropdown

```css
.select-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
  background: white;
  font-size: 14px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* chevron-down icon */
  background-repeat: no-repeat;
  background-position: right 12px center;
}
```

#### Textarea

```css
.textarea-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: inherit;
  min-height: 100px;
  resize: vertical;
}
```

#### Form Label

```css
.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--neutral-700);
  margin-bottom: 6px;
}
.form-label .required {
  color: var(--error);
  margin-left: 2px;
}
```

### Card Component

```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover {
  box-shadow: var(--shadow-md);
}
.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Badge / Status Label

```css
/* Status Badges */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
}

.badge-draft       { background: var(--neutral-100); color: var(--neutral-600); }
.badge-waiting     { background: var(--warning-light); color: #92400E; }
.badge-signed      { background: var(--info-light); color: #1E40AF; }
.badge-approved    { background: var(--success-light); color: #166534; }
.badge-rejected    { background: var(--error-light); color: #991B1B; }
```

### Table Component

```css
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.table th {
  background: var(--neutral-50);
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--neutral-500);
  text-align: left;
  border-bottom: 1px solid var(--neutral-200);
}
.table td {
  padding: 12px 16px;
  font-size: 14px;
  color: var(--neutral-700);
  border-bottom: 1px solid var(--neutral-100);
}
.table tr:last-child td {
  border-bottom: none;
}
.table tr:hover td {
  background: var(--neutral-50);
}
```

---

## 📐 Layout Structure

### Grid System

- **Desktop**: 12-column grid, max-width 1280px, margin auto
- **Tablet**: 8-column grid, max-width 768px
- **Mobile**: 4-column grid, max-width 100%, padding 16px
- **Gutter**: 24px (desktop), 16px (tablet/mobile)

### Sidebar Layout (Dashboard)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo] Puspenkom BKN                 🔔[3] [Nama User ▼]       │
├──────────────┬───────────────────────────────────────────────────┤
│              │                                                   │
│  [Sidebar]   │   [Content Area]                                 │
│              │                                                   │
│  Dashboard   │   Breadcrumb: Dashboard > Event > Detail         │
│  Katalog PenKom │   ┌─────────────────────────────────────────┐   │
│  Kelola Staff│   │                                         │   │
│  Surat       │   │         Main Content                    │   │
│  Laporan     │   │                                         │   │
│  Profil      │   │                                         │   │
│              │   └─────────────────────────────────────────┘   │
│              │                                                   │
├──────────────┴───────────────────────────────────────────────────┤
│ [Footer] © 2026 Puspenkom BKN                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Sidebar Specifications:**

- Width: 260px (expanded), 72px (collapsed)
- Background: var(--neutral-900) atau white
- Active item: highlight with primary-blue-light bg + primary-blue text
- Hover: subtle background change
- Icons: 20px, lucide-react

### Header Navigation

```
┌──────────────────────────────────────────────────────────────────┐
│ [🏛️ Logo] Puspenkom BKN            🔔[3] [Nama User] [Avatar▼]│
└──────────────────────────────────────────────────────────────────┘
```

**Specifications:**

- Height: 64px
- Background: White with bottom border
- Sticky on scroll
- Logo height: 36px
- Shadow: var(--shadow-xs) on scroll

### Footer

```
┌──────────────────────────────────────────────────────────────────┐
│ © 2026 Pusat Penilaian Kompetensi (Puspenkom)                   │
│ Badan Kepegawaian Negara (BKN)                                  │
│ [Bantuan] [Kebijakan Privasi] [Syarat & Ketentuan]             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Library

### 1. Event Card

```
┌─────────────────────────────────────┐
│  ┌─────────┐                        │
│  │🟢 Aktif │                        │
│  └─────────┘                        │
│                                      │
│  Penilaian Kompetensi Manajerial    │
│  📍 Jakarta                         │
│  📅 1 - 5 Sep 2026                  │
│  🕐 08:00 WIB                       │
│  💰 Rp 500.000 / peserta            │
│                                      │
│  Sisa Kuota: 45/100                 │
│  [████████████░░░░░] 55%            │
│                                      │
│  [Lihat Detail] [Daftarkan Peserta] │
└─────────────────────────────────────┘
```

**Specifications:**

- Card width: 380px (desktop), 100% (mobile)
- Padding: 24px
- Border radius: 12px
- Border: 1px solid var(--neutral-200)
- Hover: lift + shadow

### 2. Surat Status Card

```
┌─────────────────────────────────────────────────────┐
│ 📄 SURAT/INST-001/PKM/VIII/2026                    │
│                                                      │
│ Event: Penilaian Kompetensi Manajerial              │
│ Instansi: Kemenkumham                               │
│ Jumlah Peserta: 12 orang                            │
│ Tanggal Generate: 28 Agu 2026                       │
│                                                      │
│ Status: 🟡 Menunggu TTD Kepala Instansi             │
│                                                      │
│ Progress:                                            │
│ ●━━━━━━━━●━━━━━━━━━○━━━━━━━━━○━━━━━━━━━○           │
│ Generate  TTD       Verifikasi TTD       Diterima   │
│ Surat     Kep.Inst  Puspenkom  Kep.Push             │
│                                                      │
│ [Preview Surat] [Lihat Detail]                      │
└─────────────────────────────────────────────────────┘
```

### 3. Peserta Table Row

```
┌─────────────────────────────────────────────────────────────┐
│ NIP         │ Nama            │ Jabatan      │ Sesi    │Aksi│
│─────────────┼─────────────────┼──────────────┼─────────┼────│
│ 19850612... │ Budi Santoso    │ Analis SDM   │ 1 Sep   │[✏️]│
│ 19900415... │ Siti Rahayu     │ Perencana    │ 2 Sep   │[✏️]│
│ 19880320... │ Ahmad Yani      │ Auditor      │ Belum   │[✏️]│
└─────────────────────────────────────────────────────────────┘
```

### 4. Progress Stepper (Multi-step)

```
┌─────────────────────────────────────────────────────────────┐
│ ●━━━━━━━━━●━━━━━━━━━●━━━━━━━━━○━━━━━━━━━○                 │
│ 1. Pilih    2. Daftar   3. Atur     4. Generate            │
│    Event       Peserta     Jadwal      Surat               │
│ ✓ Selesai   ✓ Selesai   ● Aktif     ○ Belum               │
└─────────────────────────────────────────────────────────────┘
```

### 5. Upload Area (Excel / Dokumen)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │                                                    │     │
│  │       📤 Drag & drop file Excel di sini           │     │
│  │       atau klik untuk browse                       │     │
│  │                                                    │     │
│  │       Format: .xlsx, .xls (Maks 5MB)             │     │
│  │       📥 Download Template Excel                  │     │
│  │                                                    │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  ✓ data_peserta.xlsx (124 KB) — 12 baris valid     [✕]     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 6. Notification Item

```
┌─────────────────────────────────────────────────────────────┐
│ 🔵 Surat pengajuan baru perlu ditandatangani               │
│    SURAT/INST-001/PKM/VIII/2026 — Kemenkumham              │
│    5 menit lalu                                              │
│    [Lihat Surat]                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7. Surat Preview Card

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────┐     │
│ │              [KOP SURAT INSTANSI]                   │     │
│ │                                                     │     │
│ │  No: SURAT/INST-001/PKM/VIII/2026                  │     │
│ │  Perihal: Pengajuan Penilaian Kompetensi           │     │
│ │                                                     │     │
│ │  Yth. Kepala Puspenkom BKN                         │     │
│ │  ...                                                │     │
│ │                                                     │     │
│ │  [Tabel Daftar Peserta]                            │     │
│ │                                                     │     │
│ │  TTD Kepala Instansi    TTD Kepala Puspenkom       │     │
│ │  [✓ Signed]             [Belum]                    │     │
│ └─────────────────────────────────────────────────────┘     │
│                                                              │
│ [📥 Download PDF] [✍️ Tanda Tangan Digital] [✗ Tolak]      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🖥️ User Interface Layouts

### 1. Login Page

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────────────┐    │
│  │                      │  │                              │    │
│  │  [Ilustrasi/Brand]   │  │  🏛️ Puspenkom BKN           │    │
│  │                      │  │  Sistem Pendaftaran          │    │
│  │  Penilaian           │  │  Penilaian Kompetensi        │    │
│  │  Kompetensi ASN      │  │                              │    │
│  │  Digital & Paperless │  │  Email *                     │    │
│  │                      │  │  [________________________]  │    │
│  │                      │  │                              │    │
│  │                      │  │  Password *                  │    │
│  │                      │  │  [________________________]  │    │
│  │                      │  │                              │    │
│  │                      │  │  [Login]                     │    │
│  │                      │  │                              │    │
│  └──────────────────────┘  └──────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Dashboard Admin Puspenkom (US-01, US-08)

```
┌──────────────────────────────────────────────────────────────────┐
│ [🏛️ Logo] Puspenkom BKN             🔔[5] [Admin Puspenkom ▼]  │
├──────────┬───────────────────────────────────────────────────────┤
│          │ 📊 Dashboard Overview                                 │
│ Dashboard│                                                       │
│ Event    │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ Surat    │ │    12    │ │    8     │ │   156    │ │    3     │ │
│ Masuk    │ │Event     │ │Surat     │ │Peserta   │ │Menunggu  │ │
│ Laporan  │ │Aktif     │ │Masuk     │ │Terdaftar │ │TTD Kepala│ │
│          │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│          │                                                       │
│          │ 📋 Surat Masuk Perlu Verifikasi                      │
│          │ ┌─────────────────────────────────────────────────┐  │
│          │ │No.Surat     │Instansi   │Peserta│Status │Aksi  │  │
│          │ │─────────────┼───────────┼───────┼───────┼──────│  │
│          │ │SURAT/001    │Kemenkumham│12     │🟡Baru │[👁️]  │  │
│          │ │SURAT/002    │Kemenkes   │8      │🟡Baru │[👁️]  │  │
│          │ │SURAT/003    │Kemendikbud│15     │🔵Proses│[👁️] │  │
│          │ └─────────────────────────────────────────────────┘  │
│          │                                                       │
│          │ ⚠️ Alert                                              │
│          │ • 2 surat menunggu verifikasi lebih dari 3 hari      │
│          │ • Event "Manajerial Q4" kuota hampir penuh (90%)     │
│          │                                                       │
├──────────┴───────────────────────────────────────────────────────┤
│ [Footer]                                                         │
└──────────────────────────────────────────────────────────────────┘
```

### 3. Kelola Event (US-01)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Header]                                                         │
├──────────┬───────────────────────────────────────────────────────┤
│          │ 📅 Kelola Event Penilaian Kompetensi                 │
│ [Sidebar]│                                                       │
│          │ [+ Buat Event Baru]        🔍 [Cari event...]       │
│          │                                                       │
│          │ ┌─────────────────────────────────────────────────┐  │
│          │ │Judul        │Lokasi │Tanggal     │Kuota│Status│Aksi│
│          │ │─────────────┼───────┼────────────┼─────┼──────┼───│
│          │ │Manajerial Q3│Jakarta│1-5 Sep 2026│100  │🟢Aktif│[✏️]│
│          │ │Teknis IT    │Bandung│10-12 Sep   │50   │🟢Aktif│[✏️]│
│          │ │Sosial Kul.  │Yogya  │15-17 Sep   │80   │⚪Draft│[✏️]│
│          │ └─────────────────────────────────────────────────┘  │
│          │                                                       │
│          │ [1] [2] [3] [Next →]                                 │
├──────────┴───────────────────────────────────────────────────────┤
│ [Footer]                                                         │
└──────────────────────────────────────────────────────────────────┘
```

### 4. Form Buat Event (US-01)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Header]                                                         │
├──────────┬───────────────────────────────────────────────────────┤
│          │ ← Kembali ke Kelola Event                            │
│ [Sidebar]│                                                       │
│          │ 📝 Buat Event Baru                                   │
│          │                                                       │
│          │ ┌─────────────────────────────────────────────────┐  │
│          │ │ Judul Event *                                   │  │
│          │ │ [________________________________________]      │  │
│          │ │                                                 │  │
│          │ │ Lokasi *                                        │  │
│          │ │ [________________________________________]      │  │
│          │ │                                                 │  │
│          │ │ Tanggal Mulai *        Tanggal Selesai *       │  │
│          │ │ [DD/MM/YYYY]           [DD/MM/YYYY]            │  │
│          │ │                                                 │  │
│          │ │ Waktu Mulai *                                   │  │
│          │ │ [HH:MM]                                        │  │
│          │ │                                                 │  │
│          │ │ Harga per Peserta *                             │  │
│          │ │ Rp [________________]                           │  │
│          │ │ ℹ️ Isi 0 untuk event gratis                    │  │
│          │ │                                                 │  │
│          │ │ Kuota Maksimal per Hari *                       │  │
│          │ │ [____] peserta                                  │  │
│          │ └─────────────────────────────────────────────────┘  │
│          │                                                       │
│          │                       [Batal] [Simpan & Publikasi]   │
├──────────┴───────────────────────────────────────────────────────┤
│ [Footer]                                                         │
└──────────────────────────────────────────────────────────────────┘
```

### 5. Dashboard Admin Instansi (US-02, US-03, US-04, US-05, US-06)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Header]                              🔔[2] [Admin Instansi ▼] │
├──────────┬───────────────────────────────────────────────────────┤
│          │ 👋 Selamat Datang, Admin Kemenkumham                 │
│ Dashboard│                                                       │
│ Katalog  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ PenKom   │ │    2     │ │    24    │ │    1     │ │    1     │ │
│ Kelola   │ │Pendaf-   │ │Peserta   │ │Surat     │ │Surat     │ │
│ Staff    │ │taran     │ │Terdaftar │ │Diterima  │ │Proses    │ │
│ Surat    │ │Aktif     │ │          │ │          │ │          │ │
│ Profil   │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│          │                                                       │
│          │ 📋 Pendaftaran Aktif                                 │
│          │ ┌─────────────────────────────────────────────────┐  │
│          │ │ Penilaian Kompetensi Manajerial Q3             │  │
│          │ │ 📅 1-5 Sep 2026 · 📍 Jakarta                   │  │
│          │ │ 👥 12 peserta terdaftar                        │  │
│          │ │ Status Surat: 🟡 Menunggu TTD Kepala Instansi  │  │
│          │ │                                                 │  │
│          │ │ [Lihat Detail] [Kelola Peserta]                │  │
│          │ └─────────────────────────────────────────────────┘  │
│          │                                                       │
│          │ 🔔 Notifikasi Terbaru                                │
│          │ • Surat SURAT/001 telah ditandatangani Kepala Inst. │
│          │ • 2 peserta baru berhasil didaftarkan               │
│          │                                                       │
├──────────┴───────────────────────────────────────────────────────┤
│ [Footer]                                                         │
└──────────────────────────────────────────────────────────────────┘
```

### 6. Daftar Event Tersedia (Katalog PenKom - US-02)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Header]                                                         │
├──────────┬───────────────────────────────────────────────────────┤
│          │ 📅 Katalog PenKom                                     │
│ [Sidebar]│                                                       │
│          │ 🔍 [Cari event...] [Lokasi: Semua ▼] [Bulan: Semua ▼]│
│          │                                                       │
│          │ Menampilkan 8 event aktif                             │
│          │                                                       │
│          │ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│          │ │[Event Card]│ │[Event Card]│ │[Event Card]│        │
│          │ │Manajerial  │ │Teknis IT   │ │Sosio Kul.  │        │
│          │ │Kuota: 45   │ │Kuota: 30   │ │Kuota: 60   │        │
│          │ └────────────┘ └────────────┘ └────────────┘        │
│          │                                                       │
│          │ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│          │ │[Event Card]│ │[Event Card]│ │[Event Card]│        │
│          │ └────────────┘ └────────────┘ └────────────┘        │
│          │                                                       │
│          │ [1] [2] [Next →]                                     │
├──────────┴───────────────────────────────────────────────────────┤
│ [Footer]                                                         │
└──────────────────────────────────────────────────────────────────┘
```

### 7. Pendaftaran Peserta — Multi-step (US-03, US-04, US-05, US-06)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Header]                                                         │
├──────────┬───────────────────────────────────────────────────────┤
│          │ Pendaftaran: Penilaian Kompetensi Manajerial Q3      │
│ [Sidebar]│                                                       │
│          │ ●━━━━━━━●━━━━━━━●━━━━━━━○━━━━━━━○                   │
│          │ 1.Pilih  2.Daftar 3.Atur  4.Generate                 │
│          │  Event    Peserta  Jadwal   Surat                    │
│          │ ✓ Done  ● Aktif  ○ Belum  ○ Belum                   │
│          │                                                       │
│          │ Step 2: Daftarkan Peserta                            │
│          │                                                       │
│          │ Metode Input:                                         │
│          │ [Tab: Manual] [Tab: Upload Excel]                    │
│          │                                                       │
│          │ ┌─ Manual ─────────────────────────────────────┐     │
│          │ │ 🔍 Cari Staf (NIP / Nama)                   │     │
│          │ │ [________________________________] [+ Tambah]│     │
│          │ │                                              │     │
│          │ │ Peserta Terdaftar (12):                      │     │
│          │ │ ┌────────────────────────────────────────┐   │     │
│          │ │ │ NIP       │Nama        │Jabatan   │Aksi│   │     │
│          │ │ │───────────┼────────────┼──────────┼────│   │     │
│          │ │ │198506...  │Budi S.     │Analis SDM│[✕] │   │     │
│          │ │ │199004...  │Siti R.     │Perencana │[✕] │   │     │
│          │ │ └────────────────────────────────────────┘   │     │
│          │ └──────────────────────────────────────────────┘     │
│          │                                                       │
│          │                     [← Kembali] [Simpan & Lanjut →] │
├──────────┴───────────────────────────────────────────────────────┤
│ [Footer]                                                         │
└──────────────────────────────────────────────────────────────────┘
```

### 8. Dashboard Kepala Instansi (US-07)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Header]                           🔔[3] [Kepala Instansi ▼]   │
├──────────┬───────────────────────────────────────────────────────┤
│          │ 👋 Selamat Datang, Dr. Ir. Bambang Sutrisno          │
│ Dashboard│                                                       │
│ Surat    │ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│ Masuk    │ │    3     │ │    5     │ │    1     │             │
│ Riwayat  │ │Menunggu  │ │Sudah     │ │Ditolak   │             │
│ Profil   │ │TTD Anda  │ │Ditanda-  │ │          │             │
│          │ │          │ │tangani   │ │          │             │
│          │ └──────────┘ └──────────┘ └──────────┘             │
│          │                                                       │
│          │ 📋 Surat Menunggu Tanda Tangan Anda                  │
│          │ ┌─────────────────────────────────────────────────┐  │
│          │ │ 📄 SURAT/INST-001/PKM/VIII/2026               │  │
│          │ │ Event: Penilaian Kompetensi Manajerial Q3      │  │
│          │ │ Peserta: 12 orang                              │  │
│          │ │ Diajukan: 28 Agu 2026, 10:30 WIB              │  │
│          │ │                                                 │  │
│          │ │ [👁️ Preview Surat] [✍️ Tanda Tangan] [✗ Tolak]│  │
│          │ └─────────────────────────────────────────────────┘  │
│          │                                                       │
├──────────┴───────────────────────────────────────────────────────┤
│ [Footer]                                                         │
└──────────────────────────────────────────────────────────────────┘
```

### 9. Dashboard Kepala Puspenkom (US-09)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Header]                           🔔[2] [Kepala Puspenkom ▼]  │
├──────────┬───────────────────────────────────────────────────────┤
│          │ 📊 Dashboard Kepala Puspenkom                        │
│ Dashboard│                                                       │
│ Surat    │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│ Masuk    │ │    2     │ │   18     │ │    3     │ │   156    ││
│ Riwayat  │ │Menunggu  │ │Total     │ │Ditolak   │ │Total     ││
│ Laporan  │ │TTD Anda  │ │Diterima  │ │          │ │Peserta   ││
│          │ └──────────┘ └──────────┘ └──────────┘ └──────────┘│
│          │                                                       │
│          │ 📋 Surat Menunggu Tanda Tangan Anda                  │
│          │ ┌─────────────────────────────────────────────────┐  │
│          │ │No.Surat   │Instansi   │Peserta│Tanggal │Aksi   │  │
│          │ │───────────┼───────────┼───────┼────────┼───────│  │
│          │ │SURAT/001  │Kemenkumham│12     │28 Agu  │[✍️][✗]│  │
│          │ │SURAT/004  │Kemenkes   │8      │27 Agu  │[✍️][✗]│  │
│          │ └─────────────────────────────────────────────────┘  │
│          │                                                       │
│          │ 📊 Statistik Bulanan                                  │
│          │ ┌─────────────────────┐  ┌─────────────────────┐    │
│          │ │ [Line Chart]        │  │ [Doughnut Chart]    │    │
│          │ │ Trend Pendaftaran   │  │ Status Surat        │    │
│          │ └─────────────────────┘  └─────────────────────┘    │
│          │                                                       │
├──────────┴───────────────────────────────────────────────────────┤
│ [Footer]                                                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;    /* Small devices (phones) */
--breakpoint-md: 768px;    /* Medium devices (tablets) — minimum support */
--breakpoint-lg: 1024px;   /* Large devices (laptops) */
--breakpoint-xl: 1280px;   /* Extra large devices (desktops) */
--breakpoint-2xl: 1536px;  /* 2X large devices */
```

### Tablet Layout (768px - 1024px)

- Sidebar: collapse to icon-only (72px)
- Cards: 2-column grid
- Tables: horizontal scroll
- Forms: full-width inputs

### Desktop Layout (> 1024px)

- Sidebar: fully expanded (260px)
- Cards: 3-column grid
- Tables: full-width visible
- Forms: multi-column where appropriate

---

## ♿ Accessibility Guidelines

### WCAG 2.1 Level AA Compliance

#### Color Contrast

- Text on background: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio

#### Keyboard Navigation

- All interactive elements accessible via Tab
- Focus indicators visible (2px solid outline)
- Skip to main content link
- Logical tab order

#### Screen Reader Support

```html
<nav aria-label="Main navigation">
<main role="main">
<button aria-label="Tanda tangani surat">
<div role="alert" aria-live="polite">Surat berhasil ditandatangani</div>
```

#### Focus Management

```css
*:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-blue);
  color: white;
  padding: 8px 16px;
  z-index: 100;
}
.skip-link:focus {
  top: 0;
}
```

---

## 🎬 Animation & Interaction

### Micro-interactions

#### Button Hover

```css
.btn-primary {
  transition: all 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
}
.btn-primary:active {
  transform: translateY(0);
}
```

#### Card Hover

```css
.card-interactive {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-interactive:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

### Loading States

#### Skeleton Loader

```
┌─────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          │
│                                 │
│ ▓▓▓▓▓▓▓▓▓▓                    │
└─────────────────────────────────┘
```

#### Spinner

```css
.spinner {
  border: 3px solid var(--neutral-200);
  border-top: 3px solid var(--primary-blue);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Toast Notifications

```css
.toast {
  position: fixed;
  top: 80px;
  right: 24px;
  min-width: 320px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 16px 20px;
  animation: slideInRight 0.3s ease-out;
  z-index: 1100;
}
.toast.success { border-left: 4px solid var(--success); }
.toast.error   { border-left: 4px solid var(--error); }
.toast.warning { border-left: 4px solid var(--warning); }
.toast.info    { border-left: 4px solid var(--info); }
```

### Page Transitions

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in { animation: fadeIn 0.3s ease-out; }
```

### Modal (Konfirmasi TTD Digital)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │ ✍️ Konfirmasi Tanda Tangan Digital           [✕] │     │
│  ├───────────────────────────────────────────────────┤     │
│  │                                                   │     │
│  │ Anda akan menandatangani surat:                  │     │
│  │ SURAT/INST-001/PKM/VIII/2026                     │     │
│  │                                                   │     │
│  │ Tanda tangan digital akan tersemat sebagai:      │     │
│  │ Nama: Dr. Ir. Bambang Sutrisno                   │     │
│  │ Jabatan: Kepala Instansi                         │     │
│  │ Waktu: 28 Agustus 2026, 14:30 WIB               │     │
│  │                                                   │     │
│  │ ⚠️ Tindakan ini tidak dapat dibatalkan.          │     │
│  │                                                   │     │
│  │                  [Batal] [Ya, Tanda Tangani]      │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Specifications:**

- Overlay: rgba(0, 0, 0, 0.5)
- Modal max-width: 480px
- Padding: 24px
- Border-radius: 16px
- Close on overlay click or ESC key
- Focus trap within modal

---

## 🎨 Design Tokens (CSS Variables) — Summary

```css
:root {
  /* Colors */
  --color-primary-gradient: linear-gradient(135deg, #269DD8 0%, #DF2463 100%);
  --color-primary-blue: #269DD8;
  --color-primary-pink: #DF2463;
  --color-primary-gradient-hover: linear-gradient(135deg, #1C7DAE 0%, #B91C51 100%);
  --color-secondary: #D97706;
  --color-success: #16A34A;
  --color-warning: #D97706;
  --color-error: #DC2626;
  --color-info: #2563EB;

  /* Neutral */
  --color-neutral-50: #F8FAFC;
  --color-neutral-100: #F1F5F9;
  --color-neutral-200: #E2E8F0;
  --color-neutral-400: #94A3B8;
  --color-neutral-600: #475569;
  --color-neutral-900: #0F172A;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Typography */
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 28px;
  --font-size-4xl: 36px;
  --font-size-5xl: 48px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;

  /* Z-index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-toast: 1100;
}
```

---

## 📝 Best Practices

### Performance

- Lazy load images (`loading="lazy"`)
- Code splitting per route
- Cache static assets
- Minimize bundle size
- SSR/SSG via Astro for initial load

### SEO

- Semantic HTML structure
- Meta tags per page
- Proper heading hierarchy (single H1)
- Structured data (JSON-LD)

### User Experience

- Clear error messages with solutions
- Inline form validation
- Auto-save draft (pendaftaran)
- Breadcrumb navigation
- Confirmation dialogs for destructive actions
- Loading states for all async operations
- Empty states with clear CTAs

---

## ✅ Design Checklist

### Before Launch

- [ ] All colors meet WCAG AA contrast requirements
- [ ] All interactive elements keyboard accessible
- [ ] All forms have proper labels and validation
- [ ] Responsive on desktop and tablet (min 768px)
- [ ] Loading states for all async operations
- [ ] Error states with helpful messages
- [ ] Empty states with clear CTAs
- [ ] Success confirmations for TTD & submit actions
- [ ] Consistent spacing and typography
- [ ] Browser testing (Chrome, Firefox, Edge)
- [ ] Performance testing (Lighthouse score > 90)

---

**© 2026 Pusat Penilaian Kompetensi (Puspenkom)**
**Badan Kepegawaian Negara (BKN)**

---

**Version:** 1.0
**Last Updated:** 28 Agustus 2026
**Status:** ✅ Ready for Development
