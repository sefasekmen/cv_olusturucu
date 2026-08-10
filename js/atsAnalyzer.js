(function (global) {
    'use strict';

    function toText(value) {
        return String(value || '').trim();
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function scoreLabel(score) {
        if (score < 40) return 'Zayıf';
        if (score < 70) return 'İyi';
        if (score < 90) return 'Güçlü';
        return 'Mükemmel';
    }

    function scoreFromCount(count, maxCount, weight) {
        if (!count || !maxCount) return 0;
        return Math.round(clamp((count / maxCount) * weight, 0, weight));
    }

    function normalizeList(value) {
        return Array.isArray(value) ? value.filter(Boolean) : [];
    }

    function getPersonal(cv) {
        return cv.personal || cv.kisisel || {};
    }

    function getSummary(cv) {
        const personal = getPersonal(cv);
        return toText(cv.summary || personal.ozet || personal.summary || '');
    }

    function getLists(cv) {
        return {
            experience: normalizeList(cv.experience || cv.deneyimler),
            education: normalizeList(cv.education || cv.egitimler),
            skills: normalizeList(cv.skills || cv.beceriler),
            projects: normalizeList(cv.projects || cv.projeler),
            languages: normalizeList(cv.languages || cv.diller),
            certificates: normalizeList(cv.certificates || cv.sertifikalar),
            volunteers: normalizeList(cv.volunteers || cv.gonullu),
            references: normalizeList(cv.references || cv.referanslar)
        };
    }

    function getListItemCount(list) {
        return list.reduce((count, item) => {
            if (typeof item === 'string') {
                return count + (toText(item) ? 1 : 0);
            }

            if (item && typeof item === 'object') {
                const hasValue = Object.values(item).some((value) => toText(value));
                return count + (hasValue ? 1 : 0);
            }

            return count;
        }, 0);
    }

    function buildCvText(cv) {
        const personal = getPersonal(cv);
        const lists = getLists(cv);
        const pieces = [
            personal.fullName,
            personal.ad,
            personal.title,
            personal.unvan,
            personal.email,
            personal.telefon,
            personal.location,
            personal.konum,
            personal.linkedin,
            personal.website,
            getSummary(cv)
        ];

        Object.values(lists).forEach((list) => {
            list.forEach((item) => {
                if (typeof item === 'string') {
                    pieces.push(item);
                    return;
                }

                if (item && typeof item === 'object') {
                    Object.values(item).forEach((value) => pieces.push(value));
                }
            });
        });

        return pieces.map(toText).join(' ').toLowerCase();
    }

    function extractKeywords(text) {
        const stopWords = new Set([
            've', 'ile', 'bir', 'için', 'olarak', 'the', 'and', 'or', 'to', 'of', 'a', 'in', 'on', 'with', 'de', 'da', 'ile', 'gibi', 'daha', 'çok', 'az'
        ]);

        // Industry standard high-value keywords
        const industryKeywords = [
            'html', 'css', 'javascript', 'react', 'angular', 'vue', 'node', 'python', 'java', 'c#', 'sql', 'nosql', 'aws', 'azure', 'docker', 'kubernetes',
            'agile', 'scrum', 'kanban', 'jira', 'git', 'ci/cd', 'devops', 'management', 'leadership', 'sales', 'marketing', 'b2b', 'b2c', 'seo', 'ui', 'ux',
            'design', 'figma', 'adobe', 'analytics', 'data', 'machine learning', 'ai', 'strategy', 'planning', 'budgeting', 'finance', 'accounting'
        ];

        const words = String(text || '')
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, ' ')
            .split(/\s+/)
            .map((word) => word.trim())
            .filter((word) => word.length > 2 && !stopWords.has(word));

        const uniqueWords = Array.from(new Set(words));
        
        let industryMatchCount = 0;
        const textLower = String(text || '').toLowerCase();
        industryKeywords.forEach(kw => {
            if (textLower.includes(kw)) industryMatchCount++;
        });

        return {
            uniqueCount: uniqueWords.length,
            industryMatchCount: industryMatchCount
        };
    }

    function detectActionVerb(text) {
        const verbs = [
            'developed', 'designed', 'implemented', 'managed', 'built', 'optimized', 'improved', 'launched', 'created', 'led',
            'geliştirdim', 'tasarladım', 'uyguladım', 'yönettim', 'oluşturdum', 'iyileştirdim', 'optimize ettim', 'başlattım', 'liderlik ettim'
        ];

        return verbs.some((verb) => text.includes(verb));
    }

    function countDigits(text) {
        return (String(text || '').match(/\d+/g) || []).length;
    }

    function calculateCompletionScore(cv) {
        const personal = getPersonal(cv);
        const lists = getLists(cv);
        const summary = getSummary(cv);
        const hasPhoto = Boolean(personal.photo || personal.foto);

        const personalFields = [
            personal.fullName || personal.ad,
            personal.title || personal.unvan,
            personal.email,
            personal.telefon,
            personal.location || personal.konum,
            personal.linkedin,
            personal.website,
            summary
        ].filter((value) => toText(value));

        const personalScore = scoreFromCount(personalFields.length, 8, 20);
        const experienceScore = lists.experience.length ? Math.round(clamp((lists.experience.length / 3) * 25, 0, 25)) : 0;
        const educationScore = lists.education.length ? Math.round(clamp((lists.education.length / 2) * 15, 0, 15)) : 0;
        const skillsScore = lists.skills.length ? Math.round(clamp((lists.skills.length / 6) * 15, 0, 15)) : 0;
        const projectsScore = lists.projects.length ? Math.round(clamp((lists.projects.length / 2) * 10, 0, 10)) : 0;
        const languagesScore = lists.languages.length ? Math.round(clamp((lists.languages.length / 3) * 10, 0, 10)) : 0;
        const photoScore = hasPhoto ? 5 : 0;

        const score = clamp(
            personalScore + experienceScore + educationScore + skillsScore + projectsScore + languagesScore + photoScore,
            0,
            100
        );

        const missingSections = [];
        if (!toText(personal.fullName || personal.ad)) missingSections.push('isim');
        if (!toText(personal.title || personal.unvan)) missingSections.push('unvan');
        if (!toText(personal.email)) missingSections.push('e-posta');
        if (!toText(personal.telefon)) missingSections.push('telefon');
        if (!summary) missingSections.push('özet');
        if (!lists.experience.length) missingSections.push('deneyim');
        if (!lists.education.length) missingSections.push('eğitim');
        if (!lists.skills.length) missingSections.push('beceriler');
        if (!lists.projects.length) missingSections.push('projeler');
        if (!lists.languages.length) missingSections.push('diller');
        if (!hasPhoto) missingSections.push('fotoğraf');

        return {
            score,
            level: scoreLabel(score),
            missingSections,
            summary: score >= 90
                ? 'CV yapınız güçlü görünüyor; küçük detaylar dışında tamam.'
                : 'Ana bölümleri tamamladıkça skor yükselir.'
        };
    }

    function calculateATSScore(cv) {
        const personal = getPersonal(cv);
        const lists = getLists(cv);
        const summary = getSummary(cv);
        const text = buildCvText(cv);
        const recommendations = [];
        let score = 0;

        if (toText(personal.email)) {
            score += 15;
        } else {
            recommendations.push('E-posta adresi ekleyin.');
        }

        if (toText(personal.telefon)) {
            score += 15;
        } else {
            recommendations.push('Telefon numarası ekleyin.');
        }

        if (toText(personal.linkedin)) {
            score += 10;
        } else {
            recommendations.push('LinkedIn profilinizi ekleyin.');
        }

        if (summary.length >= 100 && summary.length <= 400) {
            score += 15;
        } else if (summary.length > 0) {
            score += 8;
            if (summary.length < 100) {
                recommendations.push('Özet bölümünüz kısa. Teknik becerilerinizi vurgulayacak şekilde 2-3 cümle daha ekleyin.');
            } else {
                recommendations.push('Özet bölümünüz çok uzun. ATS sistemleri için daha öz bir giriş yazın.');
            }
        } else {
            recommendations.push('Özet bölümünü doldurun.');
        }

        if (lists.skills.length >= 6) {
            score += 15;
        } else if (lists.skills.length >= 3) {
            score += 10;
            recommendations.push('Beceri listenizi genişletin. Hedeflediğiniz pozisyona uygun anahtar kelimeler ekleyin.');
        } else if (lists.skills.length > 0) {
            score += 5;
            recommendations.push('Daha fazla teknik veya iş becerisi ekleyin.');
        } else {
            recommendations.push('Beceri ekleyin.');
        }

        if (lists.experience.length >= 2) {
            score += 15;
        } else if (lists.experience.length === 1) {
            score += 10;
            recommendations.push('Varsa staj veya gönüllü çalışmalarınızı da deneyim olarak ekleyin.');
        } else {
            recommendations.push('İş deneyimi ekleyin.');
        }

        const digitCount = countDigits(text);
        if (digitCount >= 5) {
            score += 10;
        } else if (digitCount > 0) {
            score += 5;
            recommendations.push('Deneyimlerinizde daha fazla rakamsal başarı (örn: %20 artış, 5 kişilik ekip) kullanın.');
        } else {
            recommendations.push('Ölçülebilir sonuçlar ve rakamsal başarılar (%, TL, Yıl) ekleyin.');
        }

        const keywordData = extractKeywords(text);
        if (keywordData.uniqueCount >= 30 || keywordData.industryMatchCount >= 4) {
            score += 10;
        } else if (keywordData.uniqueCount >= 15 || keywordData.industryMatchCount >= 2) {
            score += 6;
            recommendations.push('Endüstri standardı teknik yetkinlik kelimeleri (Agile, Yazılım, Yönetim vb.) eksik görünüyor.');
        } else {
            recommendations.push('İş ilanlarındaki rol odaklı anahtar kelimeleri CV\'nize entegre edin.');
        }

        if (detectActionVerb(text)) {
            score += 10;
        } else {
            recommendations.push('Deneyimlerinizi açıklarken güçlü aksiyon fiilleri (yönettim, optimize ettim, geliştirdim) kullanın.');
        }

        score = clamp(Math.round(score), 0, 100);

        if (!recommendations.length) {
            recommendations.push('ATS uyumunuz iyi görünüyor.');
        }

        return {
            score,
            level: scoreLabel(score),
            recommendations: Array.from(new Set(recommendations)).slice(0, 4),
            summary: score >= 80
                ? 'ATS sinyalleri güçlü. Temel bilgiler ve içerik yapısı iyi.'
                : 'ATS uyumunu artırmak için iletişim, beceri ve ölçülebilir başarılar ekleyin.'
        };
    }

    global.CVAnalysis = {
        calculateCompletionScore,
        calculateATSScore
    };
})(window);
