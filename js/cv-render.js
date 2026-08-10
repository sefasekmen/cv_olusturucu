/* CV önizleme render — editor.html ile aynı DOM yapısı */
    (function (global) {
        'use strict';

        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML.replace(/\n/g, '<br>');
        }

        function modernLayoutMi(template) {
            return template === 'template-modern' || template === 'template-tech';
        }

        function fotoHtml(foto, modernMi) {
            if (foto) {
                return `<div class="cv-photo-placeholder has-photo"><img src="${escapeHtml(foto)}" class="cv-photo" alt="Profil fotoğrafı"></div>`;
            }
            return '<div class="cv-photo-placeholder">👤</div>';
        }

        function iletisimHtml(k, ikonlu) {
            const parcalar = [];
            const ekle = (deger, icon) => {
                if (!deger) return;
                parcalar.push(`<span>${ikonlu ? icon + ' ' : ''}${escapeHtml(deger)}</span>`);
            };
            ekle(k.email, '✉');
            ekle(k.telefon, '📞');
            ekle(k.dogum, '🎂');
            ekle(k.konum, '📍');
            ekle(k.ehliyet, '🚗');
            ekle(k.linkedin, '🔗');
            ekle(k.github, '🐙');
            ekle(k.behance, '🎨');
            ekle(k.website, '🌐');
            return parcalar.join('');
        }

        function formatAciklama(metin) {
            if (!metin) return '';
            const satirlar = metin.split('\n').map(s => s.trim()).filter(s => s.length > 0);
            let html = '';
            let inList = false;
            
            for (let i = 0; i < satirlar.length; i++) {
                const satir = satirlar[i];
                if (satir.startsWith('-') || satir.startsWith('•')) {
                    if (!inList) {
                        html += `<ul class="cv-entry-desc-list" style="margin: 0.25rem 0 0.5rem 1rem; padding: 0;">\n`;
                        inList = true;
                    }
                    html += `<li style="margin-bottom: 0.2rem;">${escapeHtml(satir.replace(/^[-•]\s*/, ''))}</li>\n`;
                } else {
                    if (inList) {
                        html += `</ul>\n`;
                        inList = false;
                    }
                    html += `<p class="cv-entry-desc" style="margin-bottom: 0.25rem;">${escapeHtml(satir)}</p>\n`;
                }
            }
            if (inList) {
                html += `</ul>\n`;
            }
            return html;
        }

        function deneyimHtml(liste, baslik = 'İş Deneyimi') {
            if (!liste || !liste.length) return '';
            const items = liste.filter(d => d.sirket || d.pozisyon).map(d => `
            <div class="cv-entry">
                <div class="cv-entry-header">
                    <div>
                        <div class="cv-entry-title">${escapeHtml(d.pozisyon || '')}</div>
                        <div class="cv-entry-subtitle">${escapeHtml(d.sirket || '')}</div>
                    </div>
                    ${d.tarih ? `<div class="cv-entry-date">${escapeHtml(d.tarih)}</div>` : ''}
                </div>
                ${d.aciklama ? formatAciklama(d.aciklama) : ''}
            </div>`).join('');
            if (!items) return '';
            return `<div class="cv-section"><h2 class="cv-section-title">${baslik}</h2>${items}</div>`;
        }

        function egitimHtml(liste, baslik = 'Eğitim') {
            if (!liste || !liste.length) return '';
            const items = liste.filter(e => e.okul || e.bolum).map(e => `
            <div class="cv-entry">
                <div class="cv-entry-header">
                    <div>
                        <div class="cv-entry-title">${escapeHtml(e.bolum || '')}</div>
                        <div class="cv-entry-subtitle">${escapeHtml(e.okul || '')}${e.not ? ` • ${escapeHtml(e.not)}` : ''}</div>
                    </div>
                    ${e.tarih ? `<div class="cv-entry-date">${escapeHtml(e.tarih)}</div>` : ''}
                </div>
            </div>`).join('');
            if (!items) return '';
            return `<div class="cv-section"><h2 class="cv-section-title">${baslik}</h2>${items}</div>`;
        }

        function beceriHtml(liste, techMi, baslik = 'Beceriler') {
            if (!liste || !liste.length) return '';
            const items = liste.filter(b => b.ad).map(b => {
                if (b.ad.includes('\n') || b.ad.startsWith('-') || b.ad.startsWith('•')) {
                    return `<div class="cv-skill-item" style="margin-bottom: 0.3rem;">
                        ${formatAciklama(b.ad)}
                    </div>`;
                } else {
                    return `<div class="cv-skill-item" style="margin-bottom: 0.3rem;">
                        <span>• ${escapeHtml(b.ad)}</span>
                    </div>`;
                }
            }).join('');
            if (!items) return '';
            return `<div class="cv-section"><h2 class="cv-section-title">${baslik}</h2>${items}</div>`;
        }

        function projeHtml(liste, baslik = 'Projeler') {
            if (!liste || !liste.length) return '';
            const items = liste.filter(p => p.ad).map(p => `
            <div class="cv-entry">
                <div class="cv-entry-header">
                    <div>
                        <div class="cv-entry-title">
                            ${escapeHtml(p.ad || '')}
                            ${p.link ? `<a href="${escapeHtml(p.link)}" target="_blank" style="font-size: 0.85em; text-decoration: none; color: var(--primary-color); margin-left: 0.5rem;" title="Projeyi Gör">🔗</a>` : ''}
                        </div>
                        ${p.teknoloji ? `<div class="cv-entry-subtitle">${escapeHtml(p.teknoloji)}</div>` : ''}
                    </div>
                </div>
                ${p.aciklama ? formatAciklama(p.aciklama) : ''}
            </div>`).join('');
            if (!items) return '';
            return `<div class="cv-section"><h2 class="cv-section-title">${baslik}</h2>${items}</div>`;
        }

        function dilHtml(liste, baslik = 'Yabancı Diller', lang = 'tr') {
            if (!liste || !liste.length) return '';
            
            const langMap = {
                'İngilizce': 'English',
                'Almanca': 'German',
                'Fransızca': 'French',
                'İspanyolca': 'Spanish',
                'Arapça': 'Arabic',
                'Rusça': 'Russian',
                'Çince': 'Chinese',
                'Japonca': 'Japanese',
                'Türkçe': 'Turkish',
                'Diğer': 'Other'
            };

            const items = liste.filter(d => d.ad).map(d => {
                let dilAd = d.ad || '';
                if (lang === 'en' && langMap[dilAd]) {
                    dilAd = langMap[dilAd];
                }
                return `
            <div class="cv-entry">
                <div class="cv-entry-title">${escapeHtml(dilAd)}</div>
                <div class="cv-entry-subtitle">${escapeHtml(d.seviye || '')}</div>
            </div>`;
            }).join('');
            if (!items) return '';
            return `<div class="cv-section"><h2 class="cv-section-title">${baslik}</h2>${items}</div>`;
        }

        function sertifikaHtml(liste, baslik = 'Sertifika & Kurslar') {
            if (!liste || !liste.length) return '';
            const items = liste.filter(s => s.ad).map(s => `
            <div class="cv-entry">
                <div class="cv-entry-title">${escapeHtml(s.ad)}</div>
                <div class="cv-entry-subtitle">${escapeHtml(s.kurum || '')}${s.tarih ? ` • ${escapeHtml(s.tarih)}` : ''}</div>
            </div>`).join('');
            if (!items) return '';
            return `<div class="cv-section"><h2 class="cv-section-title">${baslik}</h2>${items}</div>`;
        }

        function gonulluHtml(liste, baslik = 'Gönüllü Çalışmalar') {
            if (!liste || !liste.length) return '';
            const items = liste.filter(g => g.kurum || g.rol).map(g => `
            <div class="cv-entry">
                <div class="cv-entry-header">
                    <div>
                        <div class="cv-entry-title">${escapeHtml(g.rol || '')}</div>
                        <div class="cv-entry-subtitle">${escapeHtml(g.kurum || '')}</div>
                    </div>
                    ${g.tarih ? `<div class="cv-entry-date">${escapeHtml(g.tarih)}</div>` : ''}
                </div>
                ${g.aciklama ? `<p class="cv-entry-desc">${escapeHtml(g.aciklama)}</p>` : ''}
            </div>`).join('');
            if (!items) return '';
            return `<div class="cv-section"><h2 class="cv-section-title">${baslik}</h2>${items}</div>`;
        }

        function referansHtml(liste, baslik = 'Referanslar') {
            if (!liste || !liste.length) return '';
            const items = liste.filter(r => r.ad).map(r => `
            <div class="cv-entry">
                <div class="cv-entry-title">${escapeHtml(r.ad)}</div>
                <div class="cv-entry-subtitle">${escapeHtml(r.unvan || '')}</div>
                ${r.iletisim ? `<div class="cv-entry-desc">${escapeHtml(r.iletisim)}</div>` : ''}
            </div>`).join('');
            if (!items) return '';
            return `<div class="cv-section"><h2 class="cv-section-title">${baslik}</h2>${items}</div>`;
        }

        function ozetHtml(ozet, baslik = 'Profesyonel Özet') {
            if (!ozet) return '';
            return `<div class="cv-section"><h2 class="cv-section-title">${baslik}</h2><p class="cv-summary-text">${escapeHtml(ozet)}</p></div>`;
        }

        function renderCV(cvPaper, cvVerisi) {
            const k = cvVerisi.personal || cvVerisi.kisisel || {};
            // k objesi içindeki muhtemel İngilizce anahtarları da Türkçeye eşitleyelim
            k.ad = k.fullName || k.ad;
            k.unvan = k.title || k.unvan;
            k.ozet = k.summary || k.ozet;
            k.telefon = k.phone || k.telefon;
            k.dogum = k.birthDate || k.dogum;
            k.konum = k.location || k.konum;
            k.ehliyet = k.driverLicense || k.ehliyet;

            const template = cvVerisi.template || cvVerisi.sablon || 'template-klasik';
            const modernMi = modernLayoutMi(template);
            const ikonlu = !['template-executive', 'template-tech'].includes(template);

            const deneyimler = cvVerisi.experience || cvVerisi.deneyimler || [];
            const egitimler = cvVerisi.education || cvVerisi.egitimler || [];
            const beceriler = cvVerisi.skills || cvVerisi.beceriler || [];
            const projeler = cvVerisi.projects || cvVerisi.projeler || [];
            const diller = cvVerisi.languages || cvVerisi.diller || [];
            const sertifikalar = cvVerisi.certificates || cvVerisi.sertifikalar || [];
            const gonullu = cvVerisi.volunteers || cvVerisi.gonullu || [];
            const referanslar = cvVerisi.references || cvVerisi.referanslar || [];

            const lang = cvVerisi.language || cvVerisi.cvDili || 'tr';
            let dict = (window.CV_LANGUAGES && window.CV_LANGUAGES[lang]) ? window.CV_LANGUAGES[lang] : {
                iletisim: "İletişim", ozet: "Profesyonel Özet", deneyim: "İş Deneyimi", egitim: "Eğitim",
                beceri: "Beceriler", proje: "Projeler", dil: "Yabancı Diller", sertifika: "Sertifika & Kurslar",
                gonullu: "Gönüllü Çalışmalar", referans: "Referanslar"
            };

            const ozetBaslik = template === 'template-minimal' ? dict.ozet : (lang === 'tr' ? 'Özet' : 'Summary');

            cvPaper.className = 'cv-paper ' + template;
            cvPaper.dataset.layout = modernMi ? 'modern' : 'classic';
            cvPaper.lang = lang;

            if (cvVerisi.aksanRengi) {
                cvPaper.style.setProperty('--accent-color', cvVerisi.aksanRengi);
            }

            if (modernMi) {
                cvPaper.innerHTML = `
                <div class="cv-modern-banner">
                    ${fotoHtml(k.foto, true)}
                    <div>
                        <h1 class="cv-name">${escapeHtml(k.ad || '')}</h1>
                        ${k.unvan ? `<p class="cv-title">${escapeHtml(k.unvan)}</p>` : ''}
                        <div class="cv-contact">${iletisimHtml(k, ikonlu)}</div>
                    </div>
                </div>
                <div class="cv-body">
                    <div class="cv-modern-body">
                        <div class="cv-modern-sidebar">
                            ${ozetHtml(cvVerisi.summary || k.ozet, lang === 'tr' ? 'Özet' : 'Summary')}
                            ${beceriHtml(beceriler, template === 'template-tech', dict.beceri)}
                            ${dilHtml(diller, dict.dil, lang)}
                            ${referansHtml(referanslar, dict.referans)}
                        </div>
                        <div class="cv-modern-main">
                            ${deneyimHtml(deneyimler, dict.deneyim)}
                            ${egitimHtml(egitimler, dict.egitim)}
                            ${projeHtml(projeler, dict.proje)}
                            ${sertifikaHtml(sertifikalar, dict.sertifika)}
                            ${gonulluHtml(gonullu, dict.gonullu)}
                        </div>
                    </div>
                </div>`;
                return;
            }

            cvPaper.innerHTML = `
            <div class="cv-header">
                ${fotoHtml(k.foto, false)}
                <div class="cv-header-info">
                    <h1 class="cv-name">${escapeHtml(k.ad || '')}</h1>
                    ${k.unvan ? `<p class="cv-title">${escapeHtml(k.unvan)}</p>` : ''}
                    <div class="cv-contact">${iletisimHtml(k, ikonlu)}</div>
                </div>
            </div>
            <div class="cv-body">
                <div id="cvTekSutun">
                    ${ozetHtml(cvVerisi.summary || k.ozet, ozetBaslik)}
                    ${deneyimHtml(deneyimler, dict.deneyim)}
                    ${egitimHtml(egitimler, dict.egitim)}
                    ${beceriHtml(beceriler, false, dict.beceri)}
                    ${projeHtml(projeler, dict.proje)}
                    ${dilHtml(diller, dict.dil, lang)}
                    ${sertifikaHtml(sertifikalar, dict.sertifika)}
                    ${gonulluHtml(gonullu, dict.gonullu)}
                    ${referansHtml(referanslar, dict.referans)}
                </div>
            </div>`;

            // Apply responsive scaling
            setTimeout(adjustCVScale, 50);
        }

        function adjustCVScale() {
            const cvPaper = document.getElementById('cvPaper');
            if (!cvPaper) return;

            const previewPanel = document.querySelector('.editor-preview-panel') || document.querySelector('.preview-area');
            if (!previewPanel) return;

            // Reset inline styles first
            cvPaper.style.transform = '';
            cvPaper.style.transformOrigin = '';
            cvPaper.style.marginLeft = '';
            cvPaper.style.marginRight = '';
            cvPaper.style.marginBottom = '';

            if (window.innerWidth <= 1024) {
                const containerWidth = previewPanel.clientWidth;
                const padding = window.innerWidth <= 480 ? 16 : 24;
                const availableWidth = containerWidth - padding;
                const paperWidth = cvPaper.offsetWidth || 794;

                const scale = Math.min(1.0, availableWidth / paperWidth);

                cvPaper.style.transform = `scale(${scale})`;
                cvPaper.style.transformOrigin = 'top center';

                // const leftOffset = Math.max(0, (containerWidth - (paperWidth * scale)) / 2);
                cvPaper.style.marginLeft = '0px';

                const paperHeight = cvPaper.offsetHeight || 1123;
                const heightDifference = paperHeight * (1 - scale);
                cvPaper.style.marginBottom = `-${heightDifference}px`;
            }
        }

        window.addEventListener('resize', adjustCVScale);
        window.addEventListener('load', () => {
            adjustCVScale();
            setTimeout(adjustCVScale, 100);
            setTimeout(adjustCVScale, 300);
            setTimeout(adjustCVScale, 600);
        });
        document.addEventListener('DOMContentLoaded', () => {
            adjustCVScale();
            setTimeout(adjustCVScale, 100);
        });

        global.CVRender = {
            renderCV,
            modernLayoutMi,
            escapeHtml,
            adjustCVScale
        };
    })(window);
