/* ========================================================
   SAVE MANAGER - CV Otomatik Kayıt Sistemi
   %100 Firebase Firestore — localStorage KULLANILMAZ
   Firestore offline persistence sayesinde çevrimdışı destek
   ======================================================== */

class SaveManager {
    constructor() {
        this.saveTimeout = null;
        this.DEBOUNCE_MS = 500;
        this.listeners = [];
        this.currentCVId = null;
        this.MAX_CV_FREE = 1;
        this.MAX_CV_PREMIUM = 10;
        this._syncPromise = null;
        this._initialSyncDone = false;
    }

    // ===== Kullanıcı doğrulama yardımcısı =====
    _requireAuth() {
        if (!window.auth || !window.auth.currentUser) {
            throw new Error('Bu işlem için giriş yapmanız gerekiyor.');
        }
        if (!window.db) {
            throw new Error('Veritabanı bağlantısı kurulamadı.');
        }
        return window.auth.currentUser.uid;
    }

    // ===== Firestore koleksiyon referansı =====
    _cvsRef(userId) {
        return window.db.collection("users").doc(userId).collection("cvs");
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notify(status, message = '') {
        this.listeners.forEach(callback => {
            callback({ status, message, timestamp: new Date() });
        });
    }

    autoSave(cvData) {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        this.notify('saving');

        this.saveTimeout = setTimeout(async () => {
            try {
                await this.saveCV(cvData);
                this.notify('saved');
            } catch (error) {
                console.error('Auto-save error:', error);
                this.notify('error', error.message);
            }
        }, this.DEBOUNCE_MS);
    }

    // ===== ANA KAYDETME FONKSİYONU — Sadece Firebase =====
    async saveCV(cvData) {
        const userId = this._requireAuth();

        if (!cvData.id) cvData.id = this.generateId();
        if (!cvData.createdAt) cvData.createdAt = new Date().toISOString();
        cvData.updatedAt = new Date().toISOString();
        cvData.userId = userId;

        try {
            const sanitize = (obj) => JSON.parse(JSON.stringify(obj));
            const cloudData = sanitize(cvData);

            await this._cvsRef(userId).doc(cvData.id).set(cloudData);
            console.log('CV başarıyla Firebase\'e kaydedildi.');
            this.notify('cloud-sync-success', window.t ? window.t('Buluta kaydedildi') : 'Buluta kaydedildi');
        } catch (error) {
            console.error("Firebase'e kaydederken hata oluştu:", error);
            if (typeof window.toastGoster === 'function') {
                window.toastGoster("CV buluta kaydedilemedi: " + error.message, "error");
            }
            this.notify('cloud-sync-error', error.message);
            throw error;
        }

        this.currentCVId = cvData.id;
        return cvData.id;
    }

    // ===== CV YÜKLEME — Sadece Firebase =====
    async loadCV(cvId) {
        const userId = this._requireAuth();

        const doc = await this._cvsRef(userId).doc(cvId).get();
        if (!doc.exists) {
            throw new Error(`CV bulunamadı: ${cvId}`);
        }

        const cv = doc.data();

        // Güvenlik: Bu CV bu kullanıcıya mı ait?
        if (cv.userId && cv.userId !== userId) {
            throw new Error('Bu CV size ait değil.');
        }

        this.currentCVId = cvId;
        return cv;
    }

    // ===== TÜM CV'LERİ GETİR — Sadece Firebase =====
    async getAllCVs() {
        const userId = this._requireAuth();

        try {
            console.log(`[Diagnostic] Firestore'dan CV'ler çekiliyor. UID: ${userId}`);
            const snapshot = await this._cvsRef(userId).get();
            const cvs = [];
            snapshot.forEach(doc => {
                cvs.push(doc.data());
            });
            console.log(`[Diagnostic] ${cvs.length} adet CV bulundu.`);
            return cvs;
        } catch (error) {
            console.error('[Diagnostic] getAllCVs Hata:', error);
            if (error.code === 'permission-denied') {
                const msg = "Firebase Erişim Reddedildi! Lütfen Firebase Console'dan 'firestore.rules' dosyasındaki kuralları uyguladığınıza emin olun.";
                if (typeof window.toastGoster === 'function') window.toastGoster(msg, 'error');
                else alert(msg);
            }
            throw error; // Hatayı cvlerim.html'e fırlat
        }
    }

    // ===== Firebase Sync — Giriş yapıldığında çağrılır =====
    async syncWithFirebase() {
        if (this._syncPromise) return this._syncPromise;

        this._syncPromise = this._doSync();
        try {
            await this._syncPromise;
        } finally {
            this._syncPromise = null;
        }
    }

    async _doSync() {
        try {
            if (!window.auth || !window.auth.currentUser || !window.db) return;

            this.notify('cloud-sync-start', window.t ? window.t('Bulutla eşitleniyor...') : 'Bulutla eşitleniyor...');

            // Firebase'den tüm CV'leri çek (Firestore offline cache de burada devreye girer)
            await this.getAllCVs();

            this._initialSyncDone = true;

            // UI'ı güncelle
            if (typeof window.kartlarıGuncelleSaveManager === 'function') {
                window.kartlarıGuncelleSaveManager();
            }

            this.notify('cloud-sync-success', window.t ? window.t('Bulutla eşitlendi') : 'Bulutla eşitlendi');
        } catch (e) {
            console.warn("Firebase sync failed:", e);
            this.notify('cloud-sync-error', window.t ? window.t('Eşitleme başarısız') : 'Eşitleme başarısız');
        }
    }

    // ===== SİLME — Sadece Firebase =====
    async deleteCV(cvId) {
        const userId = this._requireAuth();

        await this._cvsRef(userId).doc(cvId).delete();
        console.log("CV successfully deleted from Firebase.");

        if (this.currentCVId === cvId) {
            this.currentCVId = null;
        }

        return true;
    }

    // ===== ARAMA — Firebase'den çekip filtrele =====
    async searchCVs(query) {
        const allCVs = await this.getAllCVs();
        const lowerQuery = query.toLowerCase();

        return allCVs.filter(cv => {
            return (
                (cv.name && cv.name.toLowerCase().includes(lowerQuery)) ||
                (cv.personal?.fullName && cv.personal.fullName.toLowerCase().includes(lowerQuery)) ||
                (cv.template && cv.template.toLowerCase().includes(lowerQuery))
            );
        });
    }

    sortCVs(cvs, sortBy = 'newest') {
        const sorted = [...cvs];
        switch (sortBy) {
            case 'oldest': return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'alphabetical': return sorted.sort((a, b) => {
                const nameA = a.name || a.personal?.fullName || 'CV';
                const nameB = b.name || b.personal?.fullName || 'CV';
                return nameA.localeCompare(nameB);
            });
            case 'newest':
            default: return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }
    }

    async getCVsWithFilters(options = {}) {
        const { search = '', sortBy = 'newest' } = options;
        let cvs = await this.getAllCVs();
        if (search) {
            const lowerQuery = search.toLowerCase();
            cvs = cvs.filter(cv => {
                return (
                    (cv.name && cv.name.toLowerCase().includes(lowerQuery)) ||
                    (cv.personal?.fullName && cv.personal.fullName.toLowerCase().includes(lowerQuery)) ||
                    (cv.template && cv.template.toLowerCase().includes(lowerQuery))
                );
            });
        }
        return this.sortCVs(cvs, sortBy);
    }

    getMaxCVCount() {
        return window.isPremium ? this.MAX_CV_PREMIUM : this.MAX_CV_FREE;
    }

    async getUserCVCount() {
        const allCVs = await this.getAllCVs();
        return allCVs.length;
    }

    async canCreateCV() {
        const count = await this.getUserCVCount();
        return count < this.getMaxCVCount();
    }

    async duplicateCV(cvId) {
        const canCreate = await this.canCreateCV();
        if (!canCreate) {
            const max = this.getMaxCVCount();
            throw new Error(`QUOTA_EXCEEDED:${max}`);
        }

        const cv = await this.loadCV(cvId);

        const duplicate = JSON.parse(JSON.stringify(cv));
        duplicate.id = this.generateId();
        duplicate.name = `${cv.name || cv.ad || 'CV'} Kopya`;
        if (duplicate.ad) duplicate.ad = `${cv.ad || cv.name || 'CV'} Kopya`;
        duplicate.createdAt = new Date().toISOString();
        duplicate.updatedAt = new Date().toISOString();

        await this.saveCV(duplicate);
        return duplicate.id;
    }

    async renameCV(cvId, newName) {
        const userId = this._requireAuth();

        const doc = await this._cvsRef(userId).doc(cvId).get();
        if (!doc.exists) throw new Error('CV not found');

        const cvData = doc.data();
        cvData.name = newName;
        if (cvData.ad) cvData.ad = newName;
        cvData.updatedAt = new Date().toISOString();

        await this._cvsRef(userId).doc(cvId).set(cvData);
        return true;
    }

    async toggleFavorite(cvId) {
        const userId = this._requireAuth();

        const doc = await this._cvsRef(userId).doc(cvId).get();
        if (!doc.exists) throw new Error('CV not found');

        const cvData = doc.data();
        cvData.favorite = !cvData.favorite;
        cvData.updatedAt = new Date().toISOString();

        await this._cvsRef(userId).doc(cvId).set(cvData);
        return cvData.favorite;
    }

    generateId() {
        return `cv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    async exportCV(cvId) {
        const cv = await this.loadCV(cvId);
        const jsonString = JSON.stringify(cv, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cv.name || 'cv'}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    async importCV(jsonString) {
        try {
            const cvData = JSON.parse(jsonString);
            cvData.id = this.generateId();
            cvData.createdAt = new Date().toISOString();
            return await this.saveCV(cvData);
        } catch (error) {
            throw new Error('Invalid JSON format');
        }
    }

    // ===== Kullanıcı çıkış yaptığında state sıfırla =====
    resetState() {
        this.currentCVId = null;
        this._initialSyncDone = false;
    }
}

// Global instance
window.saveManager = new SaveManager();
