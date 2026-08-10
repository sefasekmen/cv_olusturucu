/* ========================================================
   CV OLUŞTURUCU - VANILLA JAVASCRIPT
   Canvas Particle Animation System (Beyaz Partiküller)
   Interactive Background: Mouse Reaction, Physics, Line Drawing
   100% Vanilla JS - No Libraries
   ======================================================== */

// ===== CANVAS SETUP & INITIALIZATION =====
// Canvas elementini al ve 2D context oluştur
(function() {
const canvas = document.getElementById('particleCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {

// Canvas'ı pencere boyutuna ayarla
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ===== MOUSE POSITION TRACKING =====
// Kullanıcı mouse'u hareket ettirdiğinde koordinatları takip et
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let mouseActive = false;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseActive = true;
});

document.addEventListener('mouseleave', () => {
    mouseActive = false;
});

document.addEventListener('mouseenter', () => {
    mouseActive = true;
});

// ===== PARTICLE CLASS =====
// Beyaz partiküllerin fizik ve davranışını tanımla
class Particle {
    constructor(x, y) {
        // Pozisyon - Random başlangıç noktası
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        
        // Hız - Random yön ve büyüklük
        this.vx = (Math.random() - 0.5) * 2;  // -1 ile 1 arasında
        this.vy = (Math.random() - 0.5) * 2;  // -1 ile 1 arasında
        
        // Partikül özellikleri
        this.radius = Math.random() * 1.5 + 0.5;  // Boyut: 0.5 - 2px
        this.mass = this.radius;  // Kütlesi boyutuyla orantılı
        
        // Orijinal hız kaydı (sabit tutmak için)
        this.baseVx = this.vx;
        this.baseVy = this.vy;
        
        // Renk ve opaklık
        this.opacity = 0.7;
        this.color = '#ffffff';  // Beyaz
    }
    
    // ===== UPDATE METODU =====
    // Partikülün konumunu her frame güncelle
    update() {
        // 1. Mouse etkileşimi (çekim / itme)
        if (mouseActive) {
            // Mouse'a mesafeyi hesapla
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Etkileşim alanı (piksel cinsinden)
            const interactionRadius = 150;
            
            if (distance < interactionRadius && distance > 0) {
                // Normalize et (birim vektör yap)
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                
                // Gücü mesafeyle azalt (daha yakın = daha güçlü)
                const force = (interactionRadius - distance) / interactionRadius;
                
                // Partiküle itme kuvveti uygula (mouse'tan uzaklaş)
                const pushStrength = 0.3;
                this.vx += normalizedDx * force * pushStrength;
                this.vy += normalizedDy * force * pushStrength;
                
                // Opaklığını arttır (mouse yakın ise daha görünür)
                this.opacity = Math.min(1, 0.7 + (force * 0.3));
            } else {
                // Mouse uzaksa opaklık normal düzeye dön
                this.opacity = Math.max(0.3, this.opacity - 0.01);
            }
        }
        
        // 2. Konumu hızla güncelle
        this.x += this.vx;
        this.y += this.vy;
        
        // 3. Hızı hafif düşür (friction/damping)
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        // 4. Duvarlardan sıçra (bounce physics)
        const bounceStrength = 0.8;  // Sıçrama gücü (0.8 = biraz enerji kaybı)
        
        // Sağ duvar
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx *= -bounceStrength;
        }
        
        // Sol duvar
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx *= -bounceStrength;
        }
        
        // Üst duvar
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy *= -bounceStrength;
        }
        
        // Alt duvar
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy *= -bounceStrength;
        }
    }
    
    // ===== DRAW METODU =====
    // Partikülü canvas'e çiz
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        ctx.closePath();
    }
}

// ===== PARTICLE SYSTEM OLUŞTUR =====
// Başlangıçta partikülleri yarat
const particles = [];
const particleCount = 50;  // Partiküll sayısı (performans vs görünüm dengesi)

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// ===== ÇIZGI BAĞLANTISI FONKSİYONU =====
// Yakın partiküller arasında çizgi çiz
function drawConnections() {
    // Bağlantı maksimum mesafesi
    const maxDistance = 100;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Eğer partiküller yakın ise çizgi çiz
            if (distance < maxDistance) {
                // Opaklığı mesafeye göre ayarla (daha yakın = daha opak)
                const opacity = (maxDistance - distance) / maxDistance * 0.3;
                
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

// ===== ATTRACTION FONKSİYONU =====
// Tüm partikülleri mouse'a doğru çek (minor efekt)
function applyMouseAttraction() {
    if (!mouseActive) return;
    
    particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const attractionRadius = 200;
        
        if (distance < attractionRadius && distance > 0) {
            const attractionStrength = 0.05;
            const force = (attractionRadius - distance) / attractionRadius;
            
            const normalizedDx = dx / distance;
            const normalizedDy = dy / distance;
            
            // HAFIF çekim (itme kadar kuvvetli değil)
            particle.vx += normalizedDx * force * attractionStrength;
            particle.vy += normalizedDy * force * attractionStrength;
        }
    });
}

// ===== MAIN ANIMATION LOOP =====
// requestAnimationFrame kullanarak smooth animasyon oluştur
function animate() {
    // Canvas'ı temizle (hafif trail efekti ile)
    ctx.fillStyle = 'rgba(74, 14, 14, 0.02)';  // Çok hafif trail efekti
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Partikülleri güncelle ve çiz
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Yakın partiküller arasında çizgiler çiz
    drawConnections();
    
    // Mouse çekimini uygula (hafif efekt)
    applyMouseAttraction();
    
    // Sonraki frame için tekrarla
    requestAnimationFrame(animate);
}

// Animasyonu başlat
animate();
}
})(); // End of canvas particle IIFE

// ===== DOM ELEMENT REFERENCES =====
// Tüm interactive elemanlar için referanslar
const loadCVBtn = document.getElementById('loadCVBtn');
const ctaBtn = document.getElementById('ctaBtn');
const templateButtons = document.querySelectorAll('.btn-template');
const templatesSection = document.getElementById('templatesSection');

// ===== EVENT LISTENERS ===== 

// "Kayıtlı CV Yükle" butonu
if (loadCVBtn) {
    loadCVBtn.addEventListener('click', function() {
        console.log('Load CV button clicked');
        handleLoadCVClick();
    });
}

// "Şimdi Başla" CTA butonu - Smooth scroll
if (ctaBtn) {
    ctaBtn.addEventListener('click', function() {
        console.log('CTA button clicked - scrolling to features');
        const featuresSection = document.getElementById('featuresSection');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// Şablon seçim butonları
if (templateButtons.length > 0) {
    templateButtons.forEach((button) => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            handleTemplateSelection(this);
        });
    });
}

// Keyboard Navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.classList.contains('btn')) {
            console.log('Button activated via keyboard (Enter)');
            focusedElement.click();
        }
    }
});

// ===== HANDLE LOAD CV CLICK =====
// Firebase'den kaydedilmiş CV'leri kontrol et ve cvlerim.html'e yönlendir
// Eğer CV varsa: cvlerim.html sayfasına git
// Yoksa: Kullanıcı yeni CV yaratmaya teşvik et
//
// AMAÇ: 'Kayıtlı CV Yükle' butonunun tıklanmasını işle
// FLOW: Firebase'den CV kontrol et → cvlerim.html'e yönlendir

async function handleLoadCVClick() {
    // Giriş yapılmışsa doğrudan CV'lerim sayfasına (dashboard) yönlendir
    // CV olup olmadığını kontrol etmek sayfa geçişini yavaşlatır ve gereksiz ağ isteği yapar.
    // Dashboard sayfasının kendi "boş durum (empty state)" UI'ı vardır.
    if (window.auth && window.auth.currentUser) {
        window.location.href = 'cvlerim.html';
    } else {
        showNotification('Lütfen önce giriş yapın.', 'warning');
    }
}

// ===== HANDLE TEMPLATE SELECTION =====
// Kullanıcı CV şablonu seçtiğinde: URL parametresiyle editor.html'e yönlendir
//
// AMAÇ: Şablon seçim butonunun tıklanmasını işle
// FLOW: Template ID oku → editor.html?template=X ile yönlendir
//
// Şablon bilgisi URL parametresi ile taşınır (localStorage kullanılmaz)

function handleTemplateSelection(button) {
    // Tıklanan şablon butonundan template ID'sini oku
    // HTML: <button data-template="classic">Klasik</button>
    const selectedTemplate = button.getAttribute('data-template');
    
    // Validation: Eğer data-template attribute yoksa hata
    if (!selectedTemplate) {
        console.error('Şablon seçimi başarısız');
        return;
    }

    const premiumTemplates = ['minimal', 'creative', 'tech', 'executive', 'template-minimal', 'template-creative', 'template-tech', 'template-executive'];
    if (!window.isPremium && premiumTemplates.includes(selectedTemplate)) {
        if (typeof window.showPremiumModal === 'function') {
            window.showPremiumModal('Premium Şablonlar');
        }
        return;
    }
    
    console.log(`Şablon seçildi: ${selectedTemplate}`);
    
    // Giriş yapıp yapmadığını kontrol et
    if (window.auth && !window.auth.currentUser) {
        if (document.getElementById('authRequiredModal')) return;
        
        const targetPath = 'editor.html?template=' + encodeURIComponent(selectedTemplate);
        const authUrl = 'auth.html?redirect=' + encodeURIComponent(window.location.pathname.replace(/[^/]+$/, '') + targetPath);
        
        const modalHtml = `
            <div id="authRequiredModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; z-index:9999; backdrop-filter: blur(4px);">
                <div style="background:var(--white); padding:2.5rem; border-radius:1rem; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.2); max-width:400px; width:90%; animation: slideIn 0.3s ease;">
                    <div style="font-size:3rem; margin-bottom:1rem;">🔒</div>
                    <h3 style="color:var(--dark-text); margin-bottom:1rem; font-family:var(--font-heading); font-size:1.5rem;">Giriş Yapmanız Gerekiyor</h3>
                    <p style="color:var(--gray-medium); margin-bottom:2rem; line-height:1.6; font-size:0.95rem;">Şablonu kullanmaya başlamak ve CV'nizi kaydedebilmek için lütfen giriş yapın veya ücretsiz hesap oluşturun.</p>
                    <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
                        <button onclick="document.getElementById('authRequiredModal').remove()" class="btn btn-secondary" style="flex:1; padding:0.8rem; font-size:0.9rem; background:#f1f5f9; color:#475569; border:none; border-radius:0.5rem; font-weight:600; cursor:pointer;">Vazgeç</button>
                        <button onclick="window.location.href='${authUrl}'" class="btn btn-primary" style="flex:1; padding:0.8rem; font-size:0.9rem; white-space:nowrap; background:var(--cherry-ruby); color:white; border:none; border-radius:0.5rem; font-weight:600; cursor:pointer; box-shadow:0 4px 10px rgba(225, 29, 72, 0.3);">Giriş Yap / Kayıt Ol</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        return;
    }
    
    // Şablon seçimi URL parametresiyle editor.html'e iletilir (localStorage kullanılmaz)
    
    // Template'lar için insan tarafından okunabilir adlar
    // Bu adlar success notification'da gösterilir
    const templateNames = {
        classic: 'Klasik',    // Profesyonel, siyah-beyaz, serif
        modern: 'Modern',     // İki sütun, gradient banner
        minimal: 'Minimal',   // Yalın, pastel accent
        creative: 'Creative',
        tech: 'Tech',
        executive: 'Executive'
    };
    
    // Seçilen template'ın adını al (fallback: template ID)
    const templateName = templateNames[selectedTemplate] || selectedTemplate;
    // Başarı mesajı (emoji ile gösterişli)
    const message = `✨ ${templateName} şablonuyla başlıyorsunuz!`;
    showNotification(message, 'success');
    
    // editor.html'e yönlendir (tost bildiriminin görünmesi için hafif gecikmeli)
    setTimeout(() => {
        window.location.href = 'editor.html?template=' + encodeURIComponent(selectedTemplate);
    }, 1200);
    
    console.log(`${selectedTemplate} şablonu yükleniyor...`);
}

// ===== NOTIFICATION SYSTEM =====
// Kullanıcıya bilgi mesajlarını göster

function showNotification(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✨';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 400);
    }, 3000);
}

// ===== INTERACTIVE BACKGROUND EFFECTS =====
// Mouse hareketlerine göre orbs'ları hareket ettir

function initializeInteractiveBackground() {
    document.addEventListener('mousemove', function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        
        // Her orb'u mouse konumuna göre hareket ettir (parallax effect)
        if (orbs.length > 0) {
            orbs.forEach((orb, index) => {
                // Her orb için farklı hız (parallax depth)
                const speed = (index + 1) * 0.02;
                const offsetX = (mouseX - window.innerWidth / 2) * speed;
                const offsetY = (mouseY - window.innerHeight / 2) * speed;
                
                orb.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        }
    });
}

// ===== SCROLL ANIMATIONS =====
// Kaydırırken elemanları animate et (Intersection Observer)

function initializeScrollAnimations() {
    // IntersectionObserver ayarla
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Görünür hale gelince animasyon ekle
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Feature cards ve template cards'a observer uygula
    const animatedElements = document.querySelectorAll(
        '.feature-card, .template-card, .section-title'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        observer.observe(element);
    });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Erişilebilirlik - Klavye navigasyonu ve ARIA

function initializeAccessibility() {
    // Focus visible için renk şeması
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('focus', function() {
            this.style.outline = '3px solid #0066ff';
            this.style.outlineOffset = '2px';
        });
        
        button.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Skip links (optional, prodüksiyon için)
    console.log('Accessibility features initialized');
}

// ===== APP PREFERENCES & PERSISTENCE =====
// Uygulama tercihlerini kaydet

function initializeAppPreferences() {
    const hasVisited = localStorage.getItem('appVisited');
    
    if (!hasVisited) {
        console.log('🎉 İlk ziyaret algılandı');
        
        // İlk ziyaret verilerini kaydet
        localStorage.setItem('appVisited', 'true');
        localStorage.setItem('appVersion', '2.0.0');
        localStorage.setItem('firstVisitTime', new Date().toISOString());
        localStorage.setItem('theme', 'light');
    } else {
        // Tekrarlayan ziyaretçi
        const firstVisit = localStorage.getItem('firstVisitTime');
        console.log(`👋 Hoş geldin! İlk ziyaret: ${firstVisit}`);
    }
    
    // Son ziyaret zamanını güncelle
    localStorage.setItem('lastVisitTime', new Date().toISOString());
}

// ===== ADVANCED: MOUSE OVER BUTTON EFFECTS =====
// Butonlar üzerinde hover'da ışık efekti

function initializeButtonGlowEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(event) {
            const rect = this.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // Glow pozisyonunu ayarla (CSS variables kullanarak)
            this.style.setProperty('--mouse-x', x + 'px');
            this.style.setProperty('--mouse-y', y + 'px');
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.setProperty('--mouse-x', '0px');
            this.style.setProperty('--mouse-y', '0px');
        });
    });
}

// ===== PERFORMANCE: LAZY LOADING EXAMPLE =====
// Görüntüler için lazy loading (gelecek versiyonda)

function initializeLazyLoading() {
    // Native lazy loading desteği kontrol et
    if ('IntersectionObserver' in window) {
        console.log('IntersectionObserver destekleniyor');
    }
}

// ===== ANALYTICS & TRACKING =====
// Kullanıcı etkileşimlerini takip et (optional)

function trackUserInteraction(action, category, label) {
    console.log(`📊 Etkileşim: ${action} | ${category} | ${label}`);
    
    // Google Analytics entegrasyonu (gelecek versiyonda)
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         'event_category': category,
    //         'event_label': label
    //     });
    // }
}

// ===== SCROLL POSITION TRACKING =====
// Sayfa kaydırma konumunu takip et

let scrollProgress = 0;

window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = (scrollTop / docHeight) * 100;
    
    console.log(`📍 Scroll: ${scrollProgress.toFixed(2)}%`);
});

// ===== WINDOW RESIZE HANDLER =====
// Pencere boyutu değişirse tepki ver

window.addEventListener('resize', function() {
    console.log(`📐 Pencere boyutu: ${window.innerWidth}x${window.innerHeight}`);
});

// ===== ERROR HANDLING =====
// Hataları yakala ve raporla

window.addEventListener('error', function(event) {
    console.error('❌ Hata oluştu:', event.message);
    // Production'da hata raporlama servisi ile iletişim kur
});

// ===== PERFORMANCE MONITORING =====
// Performans metriklerini ölç

window.addEventListener('load', function() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Sayfa yükleme süresi: ${pageLoadTime}ms`);
    }
});

// ===== UTILITY: DEBOUNCE FUNCTION =====
// Event'leri sık tetiklemesini önle

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// ===== UTILITY: THROTTLE FUNCTION =====
// Event'leri belirli aralıklarla tetikle

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== CONSOLE WELCOME MESSAGE =====
// Geliştirici konsolu için hoş geldin mesajı

console.log('%c✨ CV Oluşturucu v3.0 ✨', 'color: #C20000; font-size: 20px; font-weight: bold;');
console.log('%cCherry Red + Powder Pink Tema | Canvas Particle Sistemi', 'color: #C20000; font-size: 14px;');
console.log('---');
console.log('🎨 Tasarım: Cherry Red hero bölümü, Powder Pink şablonlar');
console.log('⚛️  Fizik Sistemi:');
console.log('   • 50 beyaz partikül (performans dengesi)');
console.log('   • Mouse etkileşim yarıçapı: 150px');
console.log('   • İtme gücü: 0.3 (normalized vector)');
console.log('   • Sıçrama gücü: 0.8 (20% enerji kaybı)');
console.log('   • Sürtünme: 0.98 (hafif hız azalması)');
console.log('   • Bağlantı mesafesi: 100px (çizgi çizimi için)');
console.log('   • Hafif çekim: 0.05 gücü (mouse attraction)');
console.log('---');
console.log('Geliştiriciye: Bu uygulama 100% Vanilla JS, HTML5, CSS3 ile yazılmıştır. 🎉');
console.log('Framework veya kütüphane yok. Sadece saf web teknolojileri!');
console.log('Canvas API ile custom particle physics sistemi uygulandı.');
console.log('---');

/* ========================================================
   FEATURE 1: AUTO SAVE SYSTEM
   Form değişikliklerini izle ve otomatik kaydet
   ======================================================== */

let currentCVData = {
    id: null,
    name: '',
    template: 'template-modern',
    personal: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
    certificates: [],
    volunteers: [],
    references: []
};

function initAutoSaveSystem() {
    // Save status güncellemesi
    saveManager.subscribe(({ status, message }) => {
        const statusEl = document.getElementById('saveStatus');
        const statusText = document.getElementById('saveStatusText');
        
        if (!statusEl) return;

        statusEl.className = `save-status ${status}`;
        
        switch (status) {
            case 'saving':
                statusText.textContent = 'Kaydediliyor...';
                break;
            case 'saved':
                statusText.textContent = 'Kaydedildi';
                setTimeout(() => {
                    if (statusEl.classList.contains('saved')) {
                        statusEl.classList.remove('saved');
                    }
                }, 2000);
                break;
            case 'error':
                statusText.textContent = 'Hata! ' + (message || 'Tekrar deneyin');
                console.error('Save error:', message);
                break;
            case 'cloud-sync-start':
                statusText.textContent = '☁️ Bulutla Eşitleniyor...';
                statusEl.classList.add('saving');
                break;
            case 'cloud-sync-success':
                statusText.textContent = '☁️ Buluta Kaydedildi ✓';
                statusEl.classList.add('saved');
                showNotification(message || 'Bulutla eşitlendi', 'success');
                setTimeout(() => {
                    statusEl.classList.remove('saved');
                }, 3000);
                break;
            case 'cloud-sync-error':
                statusText.textContent = '☁️ Bulut Hatası';
                showNotification(message || 'Bulut eşitleme hatası', 'error');
                break;
        }
    });

    // Removed conflicting save/new listeners that bypass form data
}

// ===== PREMIUM (FREEMIUM) STATE YÖNETİMİ =====
window.isPremium = true; // Premium zorunluluğu geçici olarak devre dışı bırakıldı

function initPremiumState() {
    window.isPremium = true;
    applyPremiumState();
}

function applyPremiumState() {
    document.body.classList.remove('free-tier');
}

// TEST İÇİN: Konsoldan veya herhangi bir butondan çalıştırılabilir
window.grantPremium = async function() {
    window.isPremium = true;
    localStorage.setItem('isPremium', 'true');
    applyPremiumState();
    
    if (window.auth && window.auth.currentUser && window.db) {
        try {
            await window.db.collection("users").doc(window.auth.currentUser.uid).set({ isPremium: true }, { merge: true });
            alert('Tebrikler! Hesabınız başarıyla ve kalıcı olarak Premium yapıldı! (Firebase güncellendi)');
        } catch (e) {
            console.error(e);
            alert('Tarayıcı üzerinden geçici Premium yapıldı. (Firebase\'e yazma izniniz olmayabilir)');
        }
    } else {
        alert('Şu an giriş yapmadığınız için tarayıcıda geçici olarak Premium oldunuz.');
    }
    window.location.reload();
}

window.showPremiumModal = function(featureName = 'Bu özellik') {
    let modal = document.getElementById('premiumModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'premiumModal';
        modal.className = 'modal premium-modal';
        modal.innerHTML = `
            <div class="modal-content premium-modal-content">
                <span class="close-modal">&times;</span>
                <h2 style="color: var(--cherry-ruby); margin-top: 0;">👑 Premium'a Yükseltin</h2>
                <p style="font-size: 1.1rem; line-height: 1.6;"><strong>${featureName}</strong> sadece Premium kullanıcılarımıza özeldir.</p>
                <div class="premium-features-list" style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; text-align: left;">
                    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.8rem;">
                        <li>✨ Sınırsız Premium Şablonlar</li>
                        <li>🚀 Filigransız PDF Çıktısı (CV İmzası Olmaz)</li>
                        <li>🎨 Gelişmiş Renk ve Font Özelleştirme</li>
                        <li>📄 Farklı Pozisyonlar İçin Sınırsız CV Versiyonu</li>
                    </ul>
                </div>
                <button class="btn btn-primary btn-cta" style="width: 100%;" onclick="alert('Ödeme altyapısı yakında buraya entegre edilecek!')">Hemen Premium Al - 49₺/Ay</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    } else {
        modal.querySelector('p').innerHTML = `<strong>${featureName}</strong> sadece Premium kullanıcılarımıza özeldir.`;
    }
    modal.style.display = 'flex';
}

// ===== APP INITIALIZATION =====
// Sayfa yüklendiğinde uygulamayı başlat

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 CV Oluşturucu başlatılıyor...');
    
    // Premium Durumunu Başlat
    initPremiumState();
    
    // Auto Save Sistemi başlat
    if (typeof saveManager !== 'undefined') {
        initAutoSaveSystem();
        console.log('✅ Auto-Save System aktif');
    }
    
    // Uygulama tercihlerini başlat
    initializeAppPreferences();
    
    // Erişilebilirlik özelliklerini başlat
    initializeAccessibility();
    
    // Buton glow efektlerini başlat
    initializeButtonGlowEffects();
    
    // Scroll animasyonlarını başlat
    initializeScrollAnimations();
    
    // Lazy loading başlat
    initializeLazyLoading();
    
    console.log('✅ Uygulama başarıyla başlatıldı!');
});
