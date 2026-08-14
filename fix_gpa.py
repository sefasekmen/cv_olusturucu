import os

file_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\editor.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = """                div.querySelectorAll('.form-control').forEach(input => {
                    input.addEventListener('input', function () {
                        const idx = durum.egitimler.findIndex(e => e.id === this.dataset.id);
                        if (idx === -1) return;
                        if (this.classList.contains('entry-okul')) durum.egitimler[idx].okul = this.value;
                        if (this.classList.contains('entry-bolum')) durum.egitimler[idx].bolum = this.value;
                        if (this.classList.contains('entry-tarih')) durum.egitimler[idx].tarih = this.value;
                        if (this.classList.contains('entry-not')) durum.egitimler[idx].not = this.value;
                        egitimOnizlemesiGuncelle();
                    });
                });"""

replacement = """                div.querySelectorAll('.form-control').forEach(input => {
                    input.addEventListener('input', function () {
                        const idx = durum.egitimler.findIndex(e => e.id === this.dataset.id);
                        if (idx === -1) return;
                        if (this.classList.contains('entry-okul')) durum.egitimler[idx].okul = this.value;
                        if (this.classList.contains('entry-bolum')) durum.egitimler[idx].bolum = this.value;
                        if (this.classList.contains('entry-tarih')) durum.egitimler[idx].tarih = this.value;
                        if (this.classList.contains('entry-not')) durum.egitimler[idx].not = this.value;
                        egitimOnizlemesiGuncelle();
                    });
                    
                    input.addEventListener('blur', function() {
                        if (this.classList.contains('entry-not')) {
                            let val = this.value.trim();
                            if (val && !val.includes('/')) {
                                let num = parseFloat(val.replace(',', '.'));
                                if (!isNaN(num)) {
                                    if (num <= 4) {
                                        this.value = num.toFixed(2) + " / 4.00";
                                    } else if (num <= 100 && num > 4) {
                                        this.value = num.toFixed(2) + " / 100";
                                    }
                                    
                                    const idx = durum.egitimler.findIndex(e => e.id === this.dataset.id);
                                    if (idx !== -1) {
                                        durum.egitimler[idx].not = this.value;
                                        egitimOnizlemesiGuncelle();
                                    }
                                }
                            }
                        }
                    });
                });"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("done")
else:
    print("Target not found. Please verify the code exact match.")
