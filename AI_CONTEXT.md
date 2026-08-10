# Proje Bağlamı (AI_CONTEXT)
**Proje Adı:** Online CV Oluşturucu
**Açıklama:** Kullanıcıların dakikalar içinde profesyonel özgeçmişler oluşturmasına, şablon değiştirmesine, gerçek zamanlı önizlemesine ve PDF olarak indirmesine olanak tanıyan web tabanlı bir uygulama.

## 🚀 Teknoloji Yığını
- **Frontend Core:** HTML5, CSS3, Vanilla JavaScript (Framework kullanılmamış)
- **Backend & Veritabanı:** Firebase (Firestore veritabanı, Authentication)
- **Tasarım / UI:** Modern UI, "Cherry Red + Powder Pink" tema odaklı, interaktif Canvas arka planı, Google Fonts (Montserrat, Outfit).
- **Veri Katmanı:** %100 Firebase Firestore (tek kaynak, offline persistence aktif via IndexedDB)

## 📁 Proje Klasör Yapısı ve Önemli Dosyalar

### Ana Sayfalar (HTML)
- `index.html`: Uygulamanın açılış (landing) sayfası.
- `editor.html`: Kullanıcıların formları doldurduğu ve CV'nin canlı olarak (real-time) önizlendiği ana çalışma alanı.
- `sablonlar.html`: CV şablonlarının görüntülendiği ve seçildiği sayfa.
- `cvlerim.html`: Kaydedilmiş CV'lerin listelendiği kullanıcı dashboard'u.
- `auth.html`: Giriş/Kayıt olma işlemlerinin yapıldığı Firebase Auth sayfası.
- `onizleme.html` / `view.html`: Oluşturulan CV'lerin dışarıdan görüntülenebileceği sayfalar.

### Stil Dosyaları (styles/)
- `style.css`: Sitenin genel yerleşimi, renk paleti (Cherry Red gradyan vb.), butonlar ve arayüz elemanlarının stilleri.
- `cv-templates.css`: CV şablonlarının (Modern, Tech vb.) PDF veya ekranda nasıl görüneceğini belirleyen stiller.

### JavaScript Mantığı (js/)
- `cv-render.js`: Formdan alınan JSON verilerini alıp HTML'e dönüştüren ve canlı önizleme/PDF görünümünü DOM'a basan temel render motoru.
- `saveManager.js`: CV verilerini %100 Firebase Firestore üzerinden yöneten sistem. localStorage **kullanılmaz**. Tüm CRUD işlemleri (save/load/delete/search/rename/toggleFavorite/duplicate) doğrudan Firestore'a yapılır. Auto-save debounce destekli. Firestore offline persistence sayesinde internet kesintisinde de çalışır.
- `atsAnalyzer.js`: (Eğer kullanılıyorsa) CV'nin ATS (Aday Takip Sistemleri) uyumluluğunu analiz eden modül.
- `auth.js`: Firebase kullanıcı oturum yönetimi.
- `script.js`: Genel UI etkileşimleri, modal yönetimleri vs.
- `ai-assistant.js`: Muhtemelen OpenAI veya benzeri bir API ile CV'ye içerik önerisi/düzenlemesi yapan modül.

## ⚙️ Temel Mekanizmalar ve Kurallar
1. **Veri Akışı:** Kullanıcı `editor.html` üzerindeki sol paneli (formları) doldurur. Değişiklikler anlık olarak yakalanır (`input`, `change` eventleri) ve `cv-render.js` yardımıyla sağ paneldeki önizleme alanına yansıtılır. Aynı zamanda `saveManager.js` ile buluta kaydedilir.
2. **Kayıt Sistemi:** Firebase Firestore %100 tek kaynak (single source of truth). `localStorage` CV verileri için **kullanılmaz**. Firestore offline persistence (IndexedDB cache) aktiftir — çevrimdışı durumda bile veriler erişilebilir. Kullanıcı giriş zorunludur (`auth.js` route guard). Sayfalar arası CV/şablon bilgisi URL parametreleri (?id=, ?template=) ile taşınır.
3. **Stil & Tasarım:** Tasarım "wow" efekti yaratacak şekilde, mikro animasyonlar, gradient metinler (Cherry Red) ve modern fontlarla kurgulanmıştır.
4. **Güncellemeler:** Yeni bir özellik eklendiğinde veya büyük değişiklikler yapıldığında, AI agent'ın projeyi yeniden tanıması için bu dosyadaki bilgiler (yapı, state yönetimi) güncellenmelidir.

## 📝 Notlar
- Projeyi düzenlerken mevcut `Vanilla JS` mimarisi korunmalı, zorunlu olmadıkça ağır kütüphaneler eklenmemelidir.
- Stil eklemeleri varolan sınıflara (`style.css` ve `cv-templates.css`) uyumlu yapılmalıdır.
