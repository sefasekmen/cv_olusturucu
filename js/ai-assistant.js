/* ========================================================
   AI ASSISTANT - Google Gemini API Entegrasyonu
   Premium kullanıcılar için CV metin üretimi
   ======================================================== */

class AIAssistant {
    constructor() {
        // Google Gemini API - Ücretsiz tier
        this.API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.DEFAULT_KEY = '';
        this.STORAGE_KEY = 'cv-builder-ai-key';
        this.API_KEY = this.DEFAULT_KEY;
        this.loadApiKey();
    }

    loadApiKey() {
        try {
            const savedKey = localStorage.getItem(this.STORAGE_KEY);
            this.API_KEY = savedKey || this.DEFAULT_KEY;
        } catch (e) {
            this.API_KEY = this.DEFAULT_KEY;
        }
    }

    saveApiKey(key) {
        this.API_KEY = key;
        try {
            localStorage.setItem(this.STORAGE_KEY, key);
        } catch (e) {
            console.warn('API key kaydedilemedi:', e);
        }
    }

    hasApiKey() {
        return this.API_KEY && this.API_KEY.trim().length > 10;
    }

    async generateText(prompt, context = {}) {
        if (!this.hasApiKey()) {
            throw new Error('API_KEY_MISSING');
        }

        const systemPrompt = `Sen profesyonel bir CV yazarısın. Türkçe olarak yanıt ver.
Kurallar:
- Kısa, öz ve etkileyici cümleler kur.
- Sonuç odaklı ifadeler kullan (sayılar, yüzdeler, metrikler ekle).
- Profesyonel ve resmi bir dil kullan.
- Sadece istenen metni yaz, ekstra açıklama veya başlık ekleme.
- Markdown formatı kullanma, düz metin yaz.`;

        const fullPrompt = `${systemPrompt}\n\n${prompt}`;

        try {
            const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: fullPrompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                        topP: 0.9
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("AI API Hatası:", response.status, errorData);
                
                if (response.status === 400 || response.status === 403) {
                    throw new Error('API_KEY_INVALID');
                }
                if (response.status === 429) {
                    throw new Error('RATE_LIMIT');
                }
                throw new Error(`API_ERROR:${response.status}`);
            }

            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!text) {
                console.error("AI API Yanıtı Boş:", data);
                throw new Error('EMPTY_RESPONSE');
            }

            return text.trim();
        } catch (error) {
            console.error("AI İstek Hatası:", error);
            if (error.message.startsWith('API_') || error.message === 'RATE_LIMIT' || error.message === 'EMPTY_RESPONSE') {
                throw error;
            }
            throw new Error('NETWORK_ERROR');
        }
    }

    async generateSummary(jobTitle, experience = '') {
        const prompt = `Bir "${jobTitle}" pozisyonu için profesyonel bir CV özet paragrafı yaz.
${experience ? `Deneyim bilgisi: ${experience}` : ''}
2-4 cümle olsun. Kişinin güçlü yönlerini, deneyimini ve hedeflerini vurgula.`;
        return this.generateText(prompt);
    }

    async generateExperienceDesc(jobTitle, company = '') {
        const prompt = `"${company ? company + ' şirketinde ' : ''}" "${jobTitle}" olarak çalışan biri için 3-4 maddelik iş tanımı yaz.
Her madde bir satırda olsun. Madde işareti kullanma.
Sonuç odaklı ifadeler kullan (örn: "%20 artış sağladı", "15 kişilik ekip yönetti").`;
        return this.generateText(prompt);
    }

    async generateProjectDesc(projectName, technologies = '') {
        const prompt = `"${projectName}" adlı bir proje için 2-3 cümlelik açıklama yaz.
${technologies ? `Kullanılan teknolojiler: ${technologies}` : ''}
Projenin amacını, kullanılan yöntemleri ve sonuçlarını kısaca anlat.`;
        return this.generateText(prompt);
    }
}

// Global instance
window.aiAssistant = new AIAssistant();
