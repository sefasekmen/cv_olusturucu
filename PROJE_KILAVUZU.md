# CV Oluşturucu - Detaylı Proje Kılavuzu

## 📋 Proje Yapısı

```
cv-olusturucu/
├── index.html              # Landing page - Ana sayfa
├── sablonlar.html          # Şablon seçim sayfası
├── cvlerim.html            # CV yönetim dashboard'u
├── onizleme.html           # CV önizleme ve yazdırma
├── editor.html             # MAIN: Split-screen CV editörü
├── style.css               # Paylaşılan CSS tasarımı
├── script.js               # Paylaşılan JavaScript (Canvas, routing)
├── logo.png                # Logo görseli
└── PROJE_KILAVUZU.md      # Bu dosya
```

---

## 🎨 DOSYA REHBERI

### 1. **index.html** - Landing Page (Ana Sayfa)

**Amaç:** Kullanıcıları karşıla, proje tanıtımı, CTA (Call-To-Action) butonları

**Bölümler:**
- **Header:** Logo + "Kayıtlı CV Yükle" butonu
- **Hero Section:** Başlık + Alt başlık + "Şimdi Başla" butonu
- **Features Section:** 3 özellik kartı (Gerçek zamanlı, Güvenli, PDF)
- **Templates Section:** 3 şablon örneği
- **Final CTA:** Başlama davetiyesi

**JavaScript Event Listeners:**
```javascript
loadCVBtn.addEventListener('click', handleLoadCVClick)
  → localStorage'dan CV yükle
  → cvlerim.html'e yönlendir
  
templateButtons.addEventListener('click', handleTemplateSelection)
  → localStorage'a seçimi kaydet
  → editor.html?template=X'e yönlendir
```

**Canvas Animation:**
- 50 beyaz partikül
- Mouse interaksiyonu (150px yarıçapında itme)
- Partiküller arası çizgi bağlantıları
- Trail efekti

---

### 2. **sablonlar.html** - Şablon Seçim Sayfası

**Amaç:** 3 CV şablonunu göster ve seçim yaptır

**İçerik:**
- 3 şablon kartı (Klasik, Modern, Minimal)
- Her kart: Örnek CV + "Seç" butonu
- Örnek veriler: sampleCVData (Hard-coded)

**Template Türleri:**
1. **Klasik** (template-klasik)
   - Siyah-beyaz, serif font (Georgia)
   - Profesyonel görünüm
   - Tek sütun layout

2. **Modern** (template-modern)
   - 2 sütun (sidebar + main)
   - Gradient banner
   - Accent renk (dinamik --accent-color)
   - Font: Montserrat

3. **Minimal** (template-minimal)
   - Pastel accent renk
   - Yalın tasarım
   - Başlık altında border

**Key Functions:**
```javascript
renderKlasikCV(cvData)    // Klasik şablonla render et
renderModernCV(cvData)    // Modern şablonla render et
renderMinimalCV(cvData)   // Minimal şablonla render et
```

---

### 3. **cvlerim.html** - CV Yönetim Dashboard

**Amaç:** Kaydedilmiş tüm CV'leri listele ve yönet

**localStorage Key:**
```javascript
cvListesi = [
  {
    ad: "CV Adı",
    tarih: "2024-05-11",
    template: "classic",
    kisisel: { ... },
    deneyimler: [ ... ],
    egitimler: [ ... ],
    ...
  }
]
```

**UI Elemanları:**
- Header: "CV'lerim" başlığı + CV sayısı
- CV Grid: Kartlar halinde CV'ler
- Empty State: "Henüz CV yok" (ilk kez)
- Her CV Kartı:
  - CV adı + tarih
  - Template türü göstergesi
  - 4 Action Button:
    - ✏️ Düzenle → editor.html?cvAdi=X&template=Y
    - 👁️ Önizle → onizleme.html?cvAdi=X
    - 🖨️ Yazdır → onizleme.html + print()
    - 🗑️ Sil → localStorage'dan kaldır

**CRUD İşlemleri:**
```javascript
// CREATE: Yeni CV (editor.html → kaydet)
cvListesi.push({ad: "Yeni CV", ...})

// READ: Tüm CV'leri oku
cvListesi = JSON.parse(localStorage.getItem('cvListesi'))

// UPDATE: CV güncelle (editor.html → kaydet)
cvListesi[index] = {...}

// DELETE: CV sil
cvListesi.splice(index, 1)
localStorage.setItem('cvListesi', JSON.stringify(cvListesi))
```

---

### 4. **onizleme.html** - CV Önizleme & Yazdırma

**Amaç:** Kaydedilmiş CV'yi göster, şablon/renk değiştir, PDF olarak yazdır

**URL Parameters:**
```
onizleme.html?cvAdi=MyCV&template=modern
```

**Flow:**
1. URL parametrelerinden CV adı ve template oku
2. localStorage'dan CV verisi bul
3. Seçili şablonla render et
4. Toolbar'da şablon seçici + renk seçici göster
5. Print butonu → Browser print dialog

**Toolbar Features:**
- **Logo Link:** Ana sayfaya dön
- **Template Switcher:** Klasik/Modern/Minimal arasında geçiş
- **Color Palette:** --accent-color değişkenini güncelle
- **Print Button:** window.print() → PDF olarak kaydet

**CSS Grid Layout:**
```
Klasik:  1 sütun, serif, black & white
Modern:  2 sütun (sidebar + main), gradient, accent color
Minimal: 1 sütun, pastel, minimal styling
```

**Print CSS:**
```css
@media print {
  @page {
    size: A4;
    margin: 6mm;
  }
  /* Sadece .cv-paper gösterilir */
  /* page-break-inside: avoid ile bölümler parçalanmaz */
  /* print-color-adjust: exact ile renkler korunur */
}
```

---

### 5. **editor.html** - MAIN CV EDITOR (Split-Screen)

**Amaç:** CV'yi gerçek zamanlı olarak düzenle ve önizle

**Sayfa Yapısı (Split-Screen):**
```
┌─────────────────────────────────────┐
│        Editor Header (Toolbar)       │  <- Logo, Template Switcher, Buttons
├──────────────────────┬──────────────┤
│                      │              │
│   SOL: Form Panel    │  SAĞ: CV    │
│  (editor-form-panel) │ (editor-    │
│   - 6 Tab            │  preview-   │
│   - Dynamic Forms    │  panel)     │
│                      │  - .cv-paper│
│                      │  - A4 size  │
└──────────────────────┴──────────────┘
```

**Sol Panel (Form) - 6 Sekme:**
1. **Kişisel** - Ad, Email, Telefon, Lokasyon, Fotoğraf, Özet
2. **Özet** - Profesyonel özet (textarea)
3. **Deneyim** - Tekrar-eklenebilir form entries
4. **Eğitim** - Tekrar-eklenebilir form entries
5. **Beceriler** - Tekrar-eklenebilir + skill bar
6. **Projeler** - Tekrar-eklenebilir form entries

**State Management (durum nesnesi):**
```javascript
const durum = {
  kisisel: {
    ad: "",
    telefon: "",
    email: "",
    lokasyon: "",
    ozet: "",
    foto: null
  },
  ozet: {
    metin: ""
  },
  deneyimler: [
    { id, sirket, pozisyon, tarih, aciklama }
  ],
  egitimler: [
    { id, okul, bolum, tarih, not }
  ],
  beceriler: [
    { id, ad, seviye }
  ],
  projeler: [
    { id, ad, aciklama, link }
  ]
}
```

**Key JavaScript Functions:**

| Fonksiyon | Amaç |
|-----------|------|
| `deneyimFormuEkle()` | Deneyim girdisi ekle (dinamik form) |
| `egitimFormuEkle()` | Eğitim girdisi ekle |
| `beceriFormuEkle()` | Beceri girdisi ekle |
| `projeFormuEkle()` | Proje girdisi ekle |
| `deneyimOnizlemesiGuncelle()` | Sağ panelde deneyim bölümünü güncelle |
| `egitimOnizlemesiGuncelle()` | Sağ panelde eğitim bölümünü güncelle |
| `beceriOnizlemesiGuncelle()` | Sağ panelde beceri bölümünü güncelle |
| `projeOnizlemesiGuncelle()` | Sağ panelde proje bölümünü güncelle |
| `cvYukle(cvAdi)` | localStorage'dan CV yükle ve form doldur |
| `cvKaydet()` | Mevcut form verilerini localStorage'a kaydet |

**Form Validation:**
```javascript
// E-posta: RFC 5322 basit regex
// Telefon: 10-15 rakam arası (TR format)
// Resim: JPEG/PNG, <500KB, max 300x300px compression
// Input masking: Telefon otomatik format (0 (5XX) XXX XX XX)
```

**localStorage Keys:**
```javascript
cvListesi          // Array: Tüm CV'ler
aktifCVAdi         // String: Düzenlenen CV'nin adı
selectedTemplate   // String: 'classic' | 'modern' | 'minimal'
```

**Right Panel (Preview) - CV Rendering:**
- `.cv-paper`: A4 simülasyonu (210x297mm)
- Max-height + overflow-y: auto (uzun CV'ler için)
- 3 şablon sınıfı: `.template-klasik`, `.template-modern`, `.template-minimal`
- Dinamik renk: `--accent-color` CSS variable ile tema rengi değişir

**Event Listeners:**
```javascript
// Input değişirse → durum güncelle → preview güncelle
input.addEventListener('input', (e) => {
  durum[field] = e.target.value
  updatePreview()
})

// Kaydet butonu
btnSaveCV.addEventListener('click', cvKaydet)

// Yazdır butonu
btnPrintCV.addEventListener('click', window.print)

// Template seçici
btnTpl.addEventListener('click', (e) => {
  activeTemplate = e.target.dataset.template
  updatePreview()
})
```

**Print CSS:**
```css
@media print {
  /* Tüm UI gizle */
  .editor-header, .editor-form-panel { display: none }
  
  /* Sadece CV göster */
  .cv-paper { width: 100%; padding: 12mm; box-shadow: none }
  
  /* A4 sayfası */
  @page { size: A4; margin: 6mm }
  
  /* Renk koruması */
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important }
  
  /* Bölümler parçalanmasın */
  .cv-entry, .cv-section { page-break-inside: avoid }
}
```

---

### 6. **style.css** - Paylaşılan Tasarım Sistemi

**CSS Custom Properties (Tema):**
```css
:root {
  /* Cherry Red Palette */
  --cherry-dark: #4a0e0e
  --cherry-ruby: #C20000
  --cherry-bright: #DC143C
  
  /* Powder Pink Palette */
  --pink-powder: #FFE4E1
  --pink-soft: #FFC0CB
  
  /* Neutral */
  --white: #ffffff
  --gray-dark: #1a1a1a
  
  /* Spacing, Typography, Shadows, Radius, Transitions */
}
```

**Key CSS Classes:**
- `.btn`, `.btn-primary`, `.btn-secondary` - Buton stilleri
- `.form-control`, `.form-group` - Form elemanları
- `.cv-paper` - A4 simülasyonu
- `.cv-entry`, `.cv-section` - CV bölümleri
- `.template-klasik`, `.template-modern`, `.template-minimal` - Şablon stilleri
- `.editor-layout`, `.editor-form-panel`, `.editor-preview-panel` - Editor layout

**Responsive Breakpoints:**
```css
@media (max-width: 1024px)  { /* Tablet */ }
@media (max-width: 768px)   { /* Tablet */ }
@media (max-width: 480px)   { /* Mobile */ }
```

**Print Media:**
```css
@media print { /* Yazdırma stilleri */ }
```

---

### 7. **script.js** - Paylaşılan JavaScript

**Canvas Particle System:**
- 50 beyaz partikül
- Mouse interaksiyonu (push physics)
- Partikül arası çizgiler (connection lines)
- Trail efekti (hafif iz bırakma)

**Key Functions:**

| Fonksiyon | Amaç |
|-----------|------|
| `handleLoadCVClick()` | "Kayıtlı CV Yükle" butonu → cvlerim.html |
| `handleTemplateSelection()` | Şablon seçimi → localStorage → editor.html |
| `showNotification()` | Bildirim göster (alert yerine) |
| `debounce()` | Event throttling |
| `throttle()` | Event rate limiting |

**Event Listeners:**
```javascript
loadCVBtn.addEventListener('click', handleLoadCVClick)
ctaBtn.addEventListener('click', smoothScroll)
templateButtons.forEach(btn => 
  btn.addEventListener('click', handleTemplateSelection)
)
```

**localStorage Usage:**
```javascript
cvListesi = JSON.parse(localStorage.getItem('cvListesi')) || []
selectedTemplate = localStorage.getItem('selectedTemplate')
aktifCVAdi = localStorage.getItem('aktifCVAdi')
```

---

## 🔄 Veri Akışı Diyagramı

```
index.html
  │
  ├─→ "Kayıtlı CV Yükle" → handleLoadCVClick()
  │                           ↓
  │                   cvlerim.html (Dashboard)
  │                       │
  │                       ├─→ "Düzenle" → editor.html?cvAdi=X
  │                       ├─→ "Önizle" → onizleme.html?cvAdi=X
  │                       ├─→ "Yazdır" → onizleme.html + print()
  │                       └─→ "Sil" → localStorage'dan kaldır
  │
  └─→ Template seçimi → handleTemplateSelection()
                            ↓
                    editor.html?template=X
                    ├─→ Form düzenleme
                    ├─→ "Kaydet" → cvListesi'ne ekle
                    ├─→ "PDF/Yazdır" → onizleme.html
                    └─→ "Şablon değiştir" → UI güncelle
```

---

## 💾 localStorage Yapısı

```json
{
  "cvListesi": [
    {
      "ad": "CV Adı",
      "tarih": "2024-05-11T14:30:00Z",
      "template": "modern",
      "kisisel": {
        "ad": "Ahmet Yılmaz",
        "telefon": "0 (555) 123 45 67",
        "email": "ahmet@example.com",
        "lokasyon": "İstanbul, Türkiye",
        "ozet": "Profesyonel özet...",
        "foto": "data:image/jpeg;base64,..."
      },
      "ozet": {
        "metin": "Özet metni..."
      },
      "deneyimler": [
        {
          "id": "deneyim_1",
          "sirket": "ABC Şirketi",
          "pozisyon": "Senior Developer",
          "tarih": "2020 - 2024",
          "aciklama": "Açıklama..."
        }
      ],
      "egitimler": [ ... ],
      "beceriler": [ ... ],
      "projeler": [ ... ]
    }
  ],
  "aktifCVAdi": "CV Adı",
  "selectedTemplate": "modern",
  "appVisited": "true"
}
```

---

## 🎯 Önemli Hususlar

### Validasyon
- **E-posta:** RFC 5322 basit regex
- **Telefon:** 10-15 rakam (Türkiye format)
- **Resim:** JPEG/PNG, <500KB, 300x300px compression
- **Input Masking:** Telefon otomatik format (0 (XXX) XXX XX XX)

### localStorage Limitleri
- **Max CV sayısı:** 5 (kodda kısıtlama var)
- **Toplam boyut:** ~5-10MB (browser bağlıdır)
- **Image compression:** 300x300px, 0.82 kalite

### Tarayıcı Uyumluluğu
- ✅ Chrome, Firefox, Safari, Edge (son versiyonlar)
- ✅ iOS Safari, Android Chrome
- ✅ localStorage ve Canvas destekleyen tüm browsers

### Performans
- Canvas animasyon: 50 partikül (performans dengesi)
- requestAnimationFrame kullanıyor (smooth 60fps)
- No external libraries (tamamen Vanilla JS)

### Accessibility (WCAG 2.1)
- Semantic HTML (`<main>`, `<aside>`, `<article>`)
- ARIA labels (`aria-label`, `aria-pressed`, `role`)
- Keyboard navigation (Tab, Enter)
- High contrast colors (Cherry Red + Powder Pink)

---

## 🚀 Başlangıç Rehberi

### Yeni CV Oluştur
1. `index.html` sayfasına git
2. "Şimdi Başla" butonu tıkla
3. Bir şablon seç (Klasik, Modern, Minimal)
4. `editor.html` açılacak
5. Sol panelden CV bilgilerini gir
6. Sağ panelde canlı önizlemeyi gözle
7. "Kaydet" butonuna bas
8. CV'ye isim ver (Modal)
9. localStorage'a kaydedilecek

### Kaydedilmiş CV'yi Düzenle
1. `index.html` sayfasında "Kayıtlı CV Yükle" tıkla
2. `cvlerim.html` açılacak
3. Düzenlemek istediğin CV'nin "Düzenle" butonuna tıkla
4. `editor.html` açılacak (mevcut CV verisi yüklü)
5. Değişiklikleri yap
6. "Kaydet" tıkla

### CV'yi Yazdır / PDF Olarak Kaydet
1. `cvlerim.html` sayfasında "Yazdır" butonuna tıkla
2. `onizleme.html` açılacak (full screen)
3. Sağ üstte "PDF / Yazdır" butonuna tıkla
4. Browser print dialog açılacak
5. "Kaydı PDF olarak" seç
6. Bilgisayarına kaydet

---

## 🔧 Teknik Stack

| Teknoloji | Kullanım |
|-----------|----------|
| HTML5 | Semantic markup |
| CSS3 | Flexbox, Grid, Custom Properties, Media Queries |
| Vanilla JavaScript | Canvas, Event Listeners, localStorage |
| Google Fonts | Montserrat + Outfit fontları |
| Canvas API | Particle animation system |
| FileReader API | Image upload & compression |
| localStorage API | Data persistence |

---

## 📝 Notlar

- Proje tamamen **Vanilla JS/CSS/HTML**'dir - harici kütüphane yok!
- localStorage kullanır - Cloud sync yok (local-only)
- Private data - Veriler sadece kullanıcının tarayıcısında saklanır
- Responsive design - Mobile, tablet, desktop'ta çalışır
- Print-optimized - A4 sayfaya perfect fit

---

**Son Güncelleme:** 11 Mayıs 2026  
**Versiyon:** 3.0 (Final)
