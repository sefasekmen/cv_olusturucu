(function (global) {
    'use strict';

    // ===== YARDIMCI FONKSİYONLAR =====
    function toText(value) {
        return String(value || '').trim();
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function scoreLabel(score) {
        if (score < 30) return 'Yetersiz';
        if (score < 50) return 'Zayıf';
        if (score < 70) return 'Orta';
        if (score < 85) return 'Güçlü';
        return 'Mükemmel';
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

    // ===== SEKTÖR BAZLI ANAHTAR KELİME SÖZLÜĞÜ =====
    const SECTOR_KEYWORDS = {
        yazilim: {
            label: 'Yazılım / IT',
            critical: ['javascript', 'python', 'java', 'c#', 'c++', 'typescript', 'react', 'angular', 'vue', 'node',
                'nodejs', 'html', 'css', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'git', 'github', 'gitlab',
                'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'linux', 'api', 'rest', 'graphql', 'microservices',
                'ci/cd', 'devops', 'agile', 'scrum', 'jira', 'figma', 'test', 'unit test', 'selenium', 'jenkins',
                'terraform', 'redis', 'kafka', 'elasticsearch', 'spring', 'django', 'flask', 'express', 'nextjs',
                'tailwind', 'sass', 'webpack', 'vite', 'npm', 'yarn', 'firebase', 'supabase', 'vercel',
                'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'data science', 'big data',
                'swift', 'kotlin', 'flutter', 'react native', 'android', 'ios', 'mobile',
                'yazılım', 'geliştirme', 'programlama', 'kodlama', 'veri tabanı', 'web', 'frontend', 'backend', 'fullstack',
                'full-stack', 'front-end', 'back-end', 'responsive', 'performans', 'optimizasyon', 'debug',
                'algoritma', 'veri yapıları', 'oop', 'solid', 'design pattern', 'mvc', 'mvvm'],
            actionVerbs: ['geliştirdim', 'kodladım', 'programladım', 'entegre ettim', 'deploy ettim', 'optimize ettim',
                'refactor ettim', 'test ettim', 'debug ettim', 'tasarladım', 'uyguladım', 'mimari oluşturdum',
                'developed', 'coded', 'programmed', 'integrated', 'deployed', 'optimized', 'refactored',
                'tested', 'debugged', 'designed', 'implemented', 'architected', 'built', 'created', 'automated',
                'migrated', 'maintained', 'scaled', 'containerized']
        },
        satis: {
            label: 'Satış / Pazarlama',
            critical: ['satış', 'pazarlama', 'müşteri', 'crm', 'salesforce', 'hubspot', 'b2b', 'b2c', 'lead',
                'pipeline', 'revenue', 'target', 'hedef', 'ciro', 'kota', 'müzakere', 'negotiation',
                'reklam', 'kampanya', 'dijital pazarlama', 'seo', 'sem', 'google ads', 'facebook ads',
                'sosyal medya', 'içerik', 'content', 'analytics', 'google analytics', 'roi', 'kpi',
                'marka', 'brand', 'pazar araştırması', 'market research', 'e-ticaret', 'ecommerce',
                'email marketing', 'influencer', 'conversion', 'dönüşüm', 'funnel', 'engagement',
                'stratejik planlama', 'iş geliştirme', 'business development', 'teklif', 'sunum',
                'presentation', 'pitch', 'ürün yönetimi', 'product management'],
            actionVerbs: ['sattım', 'pazarladım', 'hedefi aştım', 'ciro artırdım', 'müşteri kazandım',
                'kampanya yürüttüm', 'strateji geliştirdim', 'büyüttüm', 'genişlettim', 'analiz ettim',
                'sold', 'marketed', 'exceeded', 'generated', 'acquired', 'negotiated', 'closed',
                'increased', 'grew', 'expanded', 'launched', 'managed', 'directed', 'led']
        },
        tasarim: {
            label: 'Tasarım / Yaratıcı',
            critical: ['tasarım', 'design', 'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'indesign',
                'xd', 'after effects', 'premiere', 'blender', '3d', 'ui', 'ux', 'ui/ux', 'user experience',
                'user interface', 'wireframe', 'prototype', 'prototip', 'mockup', 'kullanıcı deneyimi',
                'kullanıcı arayüzü', 'interaction design', 'motion design', 'animasyon', 'tipografi',
                'renk teorisi', 'color theory', 'branding', 'logo', 'görsel tasarım', 'visual design',
                'responsive design', 'design system', 'component library', 'accessibility', 'a11y',
                'usability', 'kullanılabilirlik', 'user research', 'persona', 'user flow', 'sitemap',
                'canva', 'dribbble', 'behance', 'portfolio', 'creative'],
            actionVerbs: ['tasarladım', 'çizdim', 'oluşturdum', 'görselleştirdim', 'modelledim',
                'designed', 'created', 'illustrated', 'visualized', 'modeled', 'prototyped',
                'wireframed', 'animated', 'branded', 'crafted', 'conceptualized', 'redesigned']
        },
        ik: {
            label: 'İnsan Kaynakları',
            critical: ['insan kaynakları', 'ik', 'hr', 'human resources', 'işe alım', 'recruitment', 'mülakat',
                'interview', 'onboarding', 'performans yönetimi', 'performance management', 'yetenek yönetimi',
                'talent management', 'eğitim', 'training', 'bordro', 'payroll', 'sgk', 'iş kanunu',
                'organizasyonel gelişim', 'çalışan bağlılığı', 'employee engagement', 'kariyer planlama',
                'succession planning', 'yetkinlik', 'competency', 'özlük', 'ücret yönetimi',
                'compensation', 'benefits', 'iş güvenliği', 'occupational safety', 'disiplin',
                'toplu sözleşme', 'sendika', 'workday', 'sap hr', 'linkedin recruiter'],
            actionVerbs: ['işe aldım', 'eğitim verdim', 'mülakat yaptım', 'değerlendirdim', 'yönettim',
                'planladım', 'organize ettim', 'koordine ettim', 'geliştirdim', 'oluşturdum',
                'recruited', 'trained', 'interviewed', 'evaluated', 'managed', 'coordinated',
                'organized', 'developed', 'facilitated', 'mentored', 'coached']
        },
        finans: {
            label: 'Finans / Muhasebe',
            critical: ['finans', 'finance', 'muhasebe', 'accounting', 'bütçe', 'budget', 'mali', 'financial',
                'denetim', 'audit', 'vergi', 'tax', 'bilanço', 'balance sheet', 'gelir tablosu',
                'income statement', 'nakit akışı', 'cash flow', 'maliyet', 'cost', 'kar', 'profit',
                'yatırım', 'investment', 'risk yönetimi', 'risk management', 'portföy', 'portfolio',
                'kredi', 'credit', 'excel', 'sap', 'erp', 'ifrs', 'gaap', 'tfrs',
                'fatura', 'invoice', 'e-fatura', 'luca', 'netsis', 'logo', 'eta',
                'sermaye', 'capital', 'tahvil', 'bond', 'hisse', 'stock', 'bankacılık', 'banking'],
            actionVerbs: ['analiz ettim', 'raporladım', 'denetledim', 'bütçeledim', 'hesapladım',
                'yönettim', 'optimize ettim', 'değerlendirdim', 'planladım', 'tahmin ettim',
                'analyzed', 'reported', 'audited', 'budgeted', 'calculated', 'forecasted',
                'managed', 'reconciled', 'processed', 'evaluated', 'assessed']
        },
        saglik: {
            label: 'Sağlık',
            critical: ['sağlık', 'health', 'tıp', 'medicine', 'hastane', 'hospital', 'klinik', 'clinic',
                'hemşire', 'nurse', 'doktor', 'doctor', 'hasta bakım', 'patient care', 'eczane', 'pharmacy',
                'laboratuvar', 'laboratory', 'cerrahi', 'surgery', 'tanı', 'diagnosis', 'tedavi', 'treatment',
                'reçete', 'prescription', 'ilaç', 'drug', 'acil', 'emergency', 'ambulans',
                'fizyoterapi', 'physiotherapy', 'psikoloji', 'psychology', 'diş', 'dental',
                'radyoloji', 'radiology', 'kardiyoloji', 'ortopedi', 'pediatri', 'nöroloji',
                'sterilizasyon', 'enfeksiyon', 'hijyen', 'tıbbi cihaz', 'sağlık bakanlığı'],
            actionVerbs: ['tedavi ettim', 'bakım verdim', 'muayene ettim', 'tanı koydum', 'takip ettim',
                'raporladım', 'koordine ettim', 'eğitim verdim', 'değerlendirdim',
                'treated', 'examined', 'diagnosed', 'monitored', 'administered', 'assessed',
                'coordinated', 'documented', 'managed', 'provided', 'assisted']
        },
        egitim: {
            label: 'Eğitim',
            critical: ['eğitim', 'education', 'öğretmen', 'teacher', 'öğretim', 'instruction', 'müfredat',
                'curriculum', 'pedagoji', 'pedagogy', 'sınıf yönetimi', 'classroom management',
                'ders planı', 'lesson plan', 'öğrenci', 'student', 'akademik', 'academic',
                'araştırma', 'research', 'yayın', 'publication', 'tez', 'thesis',
                'ölçme değerlendirme', 'assessment', 'e-öğrenme', 'e-learning', 'lms',
                'moodle', 'eğitim teknolojileri', 'edtech', 'mentörlük', 'danışmanlık',
                'özel eğitim', 'special education', 'rehberlik', 'guidance',
                'yükseköğretim', 'higher education', 'üniversite', 'okul'],
            actionVerbs: ['öğrettim', 'eğittim', 'hazırladım', 'değerlendirdim', 'mentorluk yaptım',
                'geliştirdim', 'planladım', 'koordine ettim', 'araştırdım', 'yayınladım',
                'taught', 'educated', 'mentored', 'assessed', 'developed', 'designed',
                'facilitated', 'researched', 'published', 'supervised', 'guided']
        },
        musteri_hizmetleri: {
            label: 'Müşteri Hizmetleri / Destek',
            critical: ['müşteri hizmetleri', 'çağrı merkezi', 'call center', 'müşteri memnuniyeti', 'customer satisfaction', 'destek', 'support', 'helpdesk', 'ticket', 'şikayet yönetimi', 'complaint management', 'inbound', 'outbound', 'tele-satış', 'crm', 'sla', 'müşteri deneyimi', 'cx', 'iletişim', 'problem çözme', 'ikna', 'retention'],
            actionVerbs: ['yanıtladım', 'çözdüm', 'yönlendirdim', 'destek verdim', 'dinledim', 'ikna ettim', 'memnuniyet sağladım', 'answered', 'resolved', 'assisted', 'supported', 'handled', 'convinced', 'managed']
        },
        otomotiv_makine: {
            label: 'Otomotiv / Makine',
            critical: ['otomotiv', 'automotive', 'makine', 'mechanical', 'ar-ge', 'r&d', 'cad', 'cam', 'solidworks', 'catia', 'ansys', 'autocad', 'üretim', 'imalat', 'manufacturing', 'montaj', 'assembly', 'kalite', 'ppap', 'fmea', 'cnc', 'otomasyon', 'automation', 'mekatronik', 'mechatronics', 'termodinamik', 'pnömatik', 'hidrolik'],
            actionVerbs: ['tasarladım', 'ürettim', 'test ettim', 'geliştirdim', 'modelledim', 'iyileştirdim', 'kurulum yaptım', 'designed', 'manufactured', 'tested', 'developed', 'modeled', 'improved', 'installed']
        },
        havacilik_uzay: {
            label: 'Havacılık / Uzay',
            critical: ['havacılık', 'aviation', 'uzay', 'aerospace', 'uçak', 'aircraft', 'havalimanı', 'airport', 'pilot', 'kabin memuru', 'flight attendant', 'yer hizmetleri', 'ground handling', 'uçuş', 'flight', 'shgm', 'easa', 'faa', 'bakım', 'maintenance', 'biletleme', 'ticketing', 'rezervasyon', 'harekat', 'aerodinamik', 'aviyonik'],
            actionVerbs: ['uçtum', 'uçurdum', 'koordine ettim', 'hizmet verdim', 'denetledim', 'bakım yaptım', 'yönlendirdim', 'flew', 'piloted', 'coordinated', 'served', 'inspected', 'maintained', 'directed']
        },
        tarim_ziraat: {
            label: 'Tarım / Ziraat',
            critical: ['tarım', 'agriculture', 'ziraat', 'agronomy', 'çiftçilik', 'farming', 'sera', 'greenhouse', 'hasat', 'harvest', 'gübre', 'fertilizer', 'sulama', 'irrigation', 'bitki koruma', 'plant protection', 'tohum', 'seed', 'hayvancılık', 'animal husbandry', 'organik tarım', 'organic farming', 'peyzaj', 'toprak analizi', 'tarım makineleri'],
            actionVerbs: ['yetiştirdim', 'hasat ettim', 'suladım', 'ilaçladım', 'analiz ettim', 'ekim yaptım', 'geliştirdim', 'grew', 'harvested', 'irrigated', 'cultivated', 'analyzed', 'planted', 'managed']
        },
        stk_sosyal: {
            label: 'Sivil Toplum / STK',
            critical: ['stk', 'ngo', 'sivil toplum', 'civil society', 'gönüllülük', 'volunteering', 'sosyal sorumluluk', 'csr', 'bağış', 'donation', 'fon bulma', 'fundraising', 'hibe', 'grant', 'proje yazımı', 'project writing', 'insan hakları', 'human rights', 'savunuculuk', 'advocacy', 'toplum gelişimi', 'community development', 'sürdürülebilirlik', 'sustainability', 'kampanya', 'etkinlik'],
            actionVerbs: ['organize ettim', 'fon buldum', 'yazdım', 'yürüttüm', 'savundum', 'destekledim', 'gönüllü oldum', 'katıldım', 'organized', 'raised', 'wrote', 'executed', 'advocated', 'supported', 'volunteered', 'participated']
        },
        guvenlik_savunma: {
            label: 'Güvenlik / Savunma',
            critical: ['güvenlik', 'security', 'savunma', 'defense', 'isg', 'iş sağlığı ve güvenliği', 'ohs', 'koruma', 'protection', 'risk analizi', 'risk analysis', 'acil durum', 'emergency', 'cctv', 'kamera', 'alarm', 'denetim', 'devriye', 'patrol', 'siber güvenlik', 'cybersecurity', 'fiziki güvenlik', 'krize müdahale', 'istihbarat', 'intelligence'],
            actionVerbs: ['korudum', 'denetledim', 'müdahale ettim', 'analiz ettim', 'devriye gezdim', 'raporladım', 'önledim', 'protected', 'secured', 'inspected', 'intervened', 'analyzed', 'patrolled', 'reported', 'prevented']
        },
        spor_fitness: {
            label: 'Spor / Fitness',
            critical: ['spor', 'sports', 'fitness', 'antrenman', 'training', 'antrenör', 'coach', 'koç', 'beslenme', 'nutrition', 'pilates', 'yoga', 'vücut geliştirme', 'bodybuilding', 'kardiyo', 'cardio', 'fiziksel gelişim', 'physical development', 'spor salonu', 'gym', 'atletizm', 'athletics', 'takım çalışması', 'teamwork', 'müsabaka', 'competition', 'anatomi', 'kinesiyoloji'],
            actionVerbs: ['çalıştırdım', 'eğittim', 'hazırladım', 'yönlendirdim', 'programladım', 'motive ettim', 'kazandım', 'coached', 'trained', 'prepared', 'guided', 'programmed', 'motivated', 'won']
        },
        veri_bilimi: {
            label: 'Veri Bilimi / Analitik',
            critical: ['veri', 'data', 'analiz', 'analysis', 'veri analizi', 'data analysis', 'sql', 'python', 'r', 'excel', 'power bi', 'tableau', 'machine learning', 'makine öğrenmesi', 'istatistik', 'statistics', 'veri madenciliği', 'data mining', 'big data', 'büyük veri', 'kds', 'karar destek sistemleri', 'dashboard', 'raporlama', 'predictive modeling', 'yapay zeka', 'ai', 'data warehouse', 'etl', 'veri tabanı', 'a/b testing'],
            actionVerbs: ['analiz ettim', 'raporladım', 'modeller kurdum', 'görselleştirdim', 'tahminledim', 'veri topladım', 'optimize ettim', 'anlamlandırdım', 'analyzed', 'reported', 'modeled', 'visualized', 'forecasted', 'extracted', 'processed', 'interpreted']
        },
        uretim_operasyon: {
            label: 'Üretim / Operasyon Yönetimi',
            critical: ['üretim', 'production', 'operasyon', 'operation', 'yalın üretim', 'lean manufacturing', 'kalite kontrol', 'quality control', 'erp', 'mrp', 'sap', 'talep tahmini', 'demand forecasting', 'stok yönetimi', 'inventory management', 'iso', 'kaizen', '6 sigma', 'six sigma', 'verimlilik', 'efficiency', 'üretim planlama', 'kapasite planlama', 'süreç iyileştirme', 'process improvement', 'iş etüdü'],
            actionVerbs: ['planladım', 'yönettim', 'optimize ettim', 'iyileştirdim', 'denetledim', 'uyguladım', 'kapasite artırdım', 'maliyet düşürdüm', 'planned', 'managed', 'optimized', 'improved', 'controlled', 'streamlined', 'executed', 'reduced']
        },
        lojistik_tedarik: {
            label: 'Lojistik / Tedarik Zinciri',
            critical: ['lojistik', 'logistics', 'tedarik zinciri', 'supply chain', 'satınalma', 'procurement', 'purchasing', 'depo', 'warehouse', 'nakliye', 'transportation', 'dağıtım', 'distribution', 'ithalat', 'import', 'ihracat', 'export', 'gümrük', 'customs', 'filo yönetimi', 'fleet management', 'navlun', 'freight', 'tedarikçi', 'vendor', 'incoterms', 'barkod', 'rfid'],
            actionVerbs: ['tedarik ettim', 'sevk ettim', 'depoladım', 'müzakere ettim', 'organize ettim', 'dağıttım', 'koordine ettim', 'procured', 'dispatched', 'stored', 'negotiated', 'organized', 'distributed', 'coordinated', 'shipped']
        },
        medya_iletisim: {
            label: 'Medya / İletişim',
            critical: ['medya', 'media', 'iletişim', 'communication', 'halkla ilişkiler', 'pr', 'public relations', 'gazetecilik', 'journalism', 'editörlük', 'editing', 'metin yazarlığı', 'copywriting', 'içerik üretimi', 'content creation', 'yayıncılık', 'broadcasting', 'televizyon', 'tv', 'radyo', 'sosyal medya', 'kurumsal iletişim', 'corporate communication', 'kriz yönetimi', 'röportaj', 'basın bülteni', 'press release', 'podcast'],
            actionVerbs: ['yazdım', 'yayınladım', 'düzenledim', 'sundum', 'röportaj yaptım', 'yönettim', 'ürettim', 'kurguladım', 'wrote', 'published', 'edited', 'presented', 'interviewed', 'managed', 'produced', 'directed']
        },
        hukuk: {
            label: 'Hukuk / Danışmanlık',
            critical: ['hukuk', 'law', 'avukat', 'lawyer', 'attorney', 'dava', 'litigation', 'sözleşme', 'contract', 'mevzuat', 'legislation', 'uyum', 'compliance', 'kvkk', 'gdpr', 'fikri mülkiyet', 'intellectual property', 'ticaret hukuku', 'corporate law', 'iş hukuku', 'employment law', 'arabuluculuk', 'mediation', 'duruşma', 'hearing', 'müvekkil', 'client', 'dilekçe', 'petition'],
            actionVerbs: ['savundum', 'temsil ettim', 'hazırladım', 'danışmanlık verdim', 'inceledim', 'müzakere ettim', 'çözümledim', 'defended', 'represented', 'drafted', 'advised', 'reviewed', 'negotiated', 'resolved']
        },
        mimarlik_insaat: {
            label: 'Mimarlık / İnşaat',
            critical: ['mimarlık', 'architecture', 'inşaat', 'construction', 'mühendislik', 'engineering', 'autocad', 'revit', 'sketchup', '3ds max', 'bim', 'şantiye', 'site', 'proje', 'project', 'statik', 'structural', 'hakediş', 'progress billing', 'metraj', 'quantity takeoff', 'keşif', 'zemin', 'betonarme', 'çelik', 'steel', 'peyzaj', 'landscape', 'iç mimarlık', 'interior design'],
            actionVerbs: ['çizdim', 'inşa ettim', 'yönettim', 'denetledim', 'tasarladım', 'modelledim', 'hesapladım', 'uyguladım', 'drew', 'built', 'constructed', 'managed', 'supervised', 'designed', 'modeled', 'calculated']
        },
        turizm_gastronomi: {
            label: 'Turizm / Gastronomi',
            critical: ['turizm', 'tourism', 'otel', 'hotel', 'konaklama', 'hospitality', 'gastronomi', 'gastronomy', 'mutfak', 'kitchen', 'culinary', 'şef', 'chef', 'aşçı', 'cook', 'f&b', 'food and beverage', 'rezervasyon', 'reservation', 'ön büro', 'front desk', 'misafir ilişkileri', 'guest relations', 'acente', 'agency', 'tur', 'tour', 'etkinlik', 'event', 'hijyen', 'haccp', 'menü', 'menu'],
            actionVerbs: ['ağırladım', 'pişirdim', 'organize ettim', 'hazırladım', 'servis ettim', 'yönettim', 'planladım', 'karşıladım', 'hosted', 'cooked', 'organized', 'prepared', 'served', 'managed', 'planned', 'welcomed']
        }
    };

    // ===== GENEL (SEKTÖR-BAĞIMSIZ) AKSİYON FİİLLERİ =====
    const GENERAL_ACTION_VERBS_TR = [
        'yönettim', 'liderlik ettim', 'organize ettim', 'koordine ettim', 'planladım',
        'geliştirdim', 'oluşturdum', 'iyileştirdim', 'optimize ettim', 'analiz ettim',
        'tasarladım', 'uyguladım', 'başlattım', 'tamamladım', 'çözdüm',
        'raporladım', 'sundum', 'eğittim', 'denetledim', 'yürüttüm',
        'artırdım', 'azalttım', 'hızlandırdım', 'otomatikleştirdim', 'entegre ettim',
        'dönüştürdüm', 'modernize ettim', 'yeniledim', 'kurdum', 'başardım',
        'sorumlu oldum', 'katkı sağladım', 'destekledim', 'yönetiminde bulundum'
    ];
    const GENERAL_ACTION_VERBS_EN = [
        'managed', 'led', 'organized', 'coordinated', 'planned',
        'developed', 'created', 'improved', 'optimized', 'analyzed',
        'designed', 'implemented', 'launched', 'completed', 'resolved',
        'reported', 'presented', 'trained', 'supervised', 'executed',
        'increased', 'decreased', 'accelerated', 'automated', 'integrated',
        'transformed', 'modernized', 'renovated', 'established', 'achieved',
        'spearheaded', 'streamlined', 'pioneered', 'orchestrated', 'delivered',
        'built', 'drove', 'mentored', 'negotiated', 'oversaw'
    ];

    // ===== CV METNİNİ BİRLEŞTİRME =====
    function buildCvText(cv) {
        const personal = getPersonal(cv);
        const lists = getLists(cv);
        const pieces = [
            personal.fullName, personal.ad, personal.title, personal.unvan,
            personal.email, personal.telefon, personal.konum, personal.location,
            personal.linkedin, personal.github, personal.behance, personal.website,
            getSummary(cv)
        ];

        Object.values(lists).forEach((list) => {
            list.forEach((item) => {
                if (typeof item === 'string') { pieces.push(item); return; }
                if (item && typeof item === 'object') {
                    Object.values(item).forEach((value) => pieces.push(value));
                }
            });
        });

        return pieces.map(toText).filter(Boolean).join(' ').toLowerCase();
    }

    // ===== DENEYİM METİNLERİNİ BİRLEŞTİR =====
    function buildExperienceText(experiences) {
        return experiences.map(exp => {
            return [exp.pozisyon, exp.sirket, exp.aciklama, exp.tarih]
                .map(toText).filter(Boolean).join(' ');
        }).join(' ').toLowerCase();
    }

    // ===== SEKTÖR OTOMATİK TESPİTİ =====
    function detectSector(cv) {
        const text = buildCvText(cv);
        const personal = getPersonal(cv);
        const title = toText(personal.title || personal.unvan).toLowerCase();
        let bestSector = null;
        let bestScore = 0;

        for (const [key, sector] of Object.entries(SECTOR_KEYWORDS)) {
            let matchCount = 0;

            // Unvandan eşleşme (ağırlık: 3x)
            sector.critical.forEach(kw => {
                if (title.includes(kw)) matchCount += 3;
            });

            // Tüm metinden eşleşme
            sector.critical.forEach(kw => {
                if (text.includes(kw)) matchCount++;
            });

            if (matchCount > bestScore) {
                bestScore = matchCount;
                bestSector = key;
            }
        }

        return bestScore >= 3 ? bestSector : null;
    }

    // ===== E-POSTA GEÇERLİLİK KONTROLÜ =====
    function isValidEmail(email) {
        const str = toText(email);
        if (!str) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
    }

    // ===== TELEFON FORMAT KONTROLÜ =====
    function isValidPhone(phone) {
        const str = toText(phone);
        if (!str) return false;
        const digits = str.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
    }

    // ===== LinkedIn URL KONTROLÜ =====
    function isValidLinkedIn(url) {
        const str = toText(url).toLowerCase();
        if (!str) return false;
        return str.includes('linkedin.com/in/') || str.includes('linkedin.com/');
    }

    // ===== TARİH TUTARLILIĞI KONTROLÜ =====
    function checkDateConsistency(experiences) {
        const issues = [];
        const validEntries = experiences.filter(e => toText(e.tarih));

        if (validEntries.length >= 2) {
            // Basit kontrol: "Halen" veya "Devam" olan birden fazla olmamalı
            const currentJobs = validEntries.filter(e => {
                const date = toText(e.tarih).toLowerCase();
                return date.includes('halen') || date.includes('devam') || date.includes('present') || date.includes('current');
            });
            if (currentJobs.length > 1) {
                issues.push('Birden fazla deneyimde "Halen" veya "Devam ediyor" belirtilmiş. Güncel pozisyonunuzu netleştirin.');
            }
        }

        // Tarihi olmayan deneyim kontrolü
        const noDateEntries = experiences.filter(e => toText(e.sirket || e.pozisyon) && !toText(e.tarih));
        if (noDateEntries.length > 0) {
            issues.push(`${noDateEntries.length} deneyim kaydında tarih bilgisi eksik. ATS sistemleri tarih bilgisine önem verir.`);
        }

        return issues;
    }

    // ===== CÜMLE KALİTESİ ANALİZİ =====
    function analyzeDescriptionQuality(descriptions, sectorVerbs) {
        const result = {
            hasActionVerbs: false,
            hasQuantifiedResults: false,
            hasTechnicalTerms: false,
            avgLength: 0,
            tooShort: 0,
            tooGeneric: 0,
            issues: []
        };

        if (!descriptions.length) return result;

        const allVerbs = [...GENERAL_ACTION_VERBS_TR, ...GENERAL_ACTION_VERBS_EN, ...(sectorVerbs || [])];

        let totalLength = 0;
        let verbCount = 0;
        let quantifiedCount = 0;

        descriptions.forEach((desc, idx) => {
            const text = toText(desc).toLowerCase();
            if (!text) return;

            totalLength += text.length;

            // Aksiyon fiili kontrolü
            const hasVerb = allVerbs.some(verb => text.includes(verb));
            if (hasVerb) verbCount++;

            // Rakamsal başarı kontrolü (%, sayılar, TL, $, €, kişi, adet vb.)
            const quantifiedPatterns = /(\d+\s*%|\$\s*\d|€\s*\d|\d+\s*(tl|try|usd|eur|kişi|adet|müşteri|proje|yıl|ay|kez|kat|milyon|bin|k))/i;
            if (quantifiedPatterns.test(text)) quantifiedCount++;

            // Çok kısa açıklama
            if (text.length < 30) {
                result.tooShort++;
            }

            // Çok jenerik ifadeler
            const genericPhrases = ['çeşitli görevlerde bulundum', 'görevlerimi yerine getirdim',
                'sorumluluklarım arasında', 'various tasks', 'responsible for',
                'duties included', 'görev tanımı', 'iş yapılması'];
            if (genericPhrases.some(phrase => text.includes(phrase))) {
                result.tooGeneric++;
            }
        });

        result.hasActionVerbs = verbCount > 0;
        result.hasQuantifiedResults = quantifiedCount > 0;
        result.avgLength = descriptions.length ? Math.round(totalLength / descriptions.length) : 0;

        // Detaylı öneriler
        if (verbCount === 0 && descriptions.length > 0) {
            result.issues.push('Deneyim açıklamalarınızda güçlü aksiyon fiilleri kullanın. Örn: "Yönettim", "Geliştirdim", "Artırdım", "Optimize ettim" gibi fiillerle cümlelere başlayın.');
        } else if (verbCount < descriptions.length / 2) {
            result.issues.push(`${descriptions.length} deneyim açıklamasından sadece ${verbCount} tanesi aksiyon fiili içeriyor. Her açıklamada somut bir fiil kullanmaya çalışın.`);
        }

        if (quantifiedCount === 0 && descriptions.length > 0) {
            result.issues.push('Hiçbir deneyim açıklamasında ölçülebilir sonuç yok. Rakamsal başarılar ekleyin: "%20 artış sağladım", "5 kişilik ekibi yönettim", "50+ müşteriye hizmet verdim" gibi.');
        }

        if (result.tooShort > 0) {
            result.issues.push(`${result.tooShort} deneyim açıklaması çok kısa (30 karakterden az). Yaptığınız işi, kullandığınız araçları ve elde ettiğiniz sonuçları detaylıca anlatın.`);
        }

        if (result.tooGeneric > 0) {
            result.issues.push('Bazı açıklamalarınız çok genel. "Çeşitli görevlerde bulundum" yerine spesifik başarılarınızı yazın.');
        }

        return result;
    }

    // ===== ÖZET KALİTESİ ANALİZİ =====
    function analyzeSummaryQuality(summary, sectorKey) {
        const text = toText(summary).toLowerCase();
        const issues = [];
        const length = text.length;

        if (!text) {
            issues.push('Profesyonel özet bölümü boş. Bu bölüm ATS sistemleri için çok kritiktir. 2-4 cümlelik, kendinizi ve deneyiminizi tanıtan bir özet yazın.');
            return { score: 0, issues };
        }

        let score = 0;

        // Uzunluk analizi
        if (length >= 150 && length <= 500) {
            score += 40; // ideal uzunluk
        } else if (length >= 80 && length < 150) {
            score += 25;
            issues.push('Özet bölümünüz biraz kısa. Teknik yetkinliklerinizi, sektör deneyiminizi ve kariyer hedefinizi eklemeyi düşünün (ideal: 150-500 karakter).');
        } else if (length > 500) {
            score += 20;
            issues.push('Özet bölümünüz çok uzun (500+ karakter). ATS sistemleri öz ve net özetleri tercih eder. En önemli 3-4 yetkinliğinize odaklanın.');
        } else {
            score += 10;
            issues.push('Özet bölümünüz çok kısa. ATS taramasında özetin en az 2-3 cümle olması beklenir.');
        }

        // Yıl deneyim ifadesi
        if (/(\d+)\s*(yıl|year|sene)/i.test(text)) {
            score += 15;
        } else {
            issues.push('Özetinize deneyim sürenizi ekleyin. Örn: "5 yıllık yazılım geliştirme deneyimi" gibi ifadeler ATS puanınızı artırır.');
        }

        // Sektör kelimesi eşleşmesi
        if (sectorKey && SECTOR_KEYWORDS[sectorKey]) {
            const sectorMatches = SECTOR_KEYWORDS[sectorKey].critical.filter(kw => text.includes(kw));
            if (sectorMatches.length >= 3) {
                score += 30;
            } else if (sectorMatches.length >= 1) {
                score += 15;
                issues.push('Özetinize sektörünüzle ilgili daha fazla anahtar kelime ekleyin. ATS filtreleri bu kelimeleri arar.');
            } else {
                issues.push('Özetinizde sektörünüzle ilgili hiçbir teknik terim bulunamadı. Hedeflediğiniz pozisyonun iş ilanındaki kelimeleri kullanın.');
            }
        } else {
            // Genel sektör kontrolü
            const hasAnyTechnicalTerm = Object.values(SECTOR_KEYWORDS).some(sector =>
                sector.critical.some(kw => text.includes(kw))
            );
            if (hasAnyTechnicalTerm) {
                score += 20;
            } else {
                score += 5;
                issues.push('Özetinizde teknik veya mesleki terimler eksik. Uzmanlık alanınıza ait anahtar kelimeleri mutlaka ekleyin.');
            }
        }

        // Cümle sayısı
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
        if (sentences.length >= 2 && sentences.length <= 5) {
            score += 15;
        } else if (sentences.length === 1) {
            issues.push('Özetiniz tek bir cümleden oluşuyor. En az 2-3 cümle ile kendinizi, deneyiminizi ve hedefinizi anlatın.');
        }

        return { score: clamp(score, 0, 100), issues };
    }

    // ===== ANAHTAR KELİME YOĞUNLUĞU ANALİZİ =====
    function analyzeKeywordDensity(cvText, sectorKey) {
        const result = {
            totalUniqueWords: 0,
            sectorMatchCount: 0,
            sectorMatchedKeywords: [],
            missingSectorKeywords: [],
            score: 0,
            issues: []
        };

        const stopWords = new Set([
            've', 'ile', 'bir', 'için', 'olarak', 'gibi', 'daha', 'çok', 'az', 'bu', 'şu', 'o',
            'de', 'da', 'den', 'dan', 'ne', 'ki', 'ya', 'hem', 'veya', 'ama', 'fakat', 'ancak',
            'the', 'and', 'or', 'to', 'of', 'a', 'in', 'on', 'with', 'for', 'is', 'at', 'by',
            'an', 'it', 'as', 'be', 'has', 'was', 'are', 'had', 'not', 'but', 'from', 'that', 'this'
        ]);

        const words = cvText
            .replace(/[^\p{L}\p{N}\s/+-]/gu, ' ')
            .split(/\s+/)
            .map(w => w.trim().toLowerCase())
            .filter(w => w.length > 2 && !stopWords.has(w));

        result.totalUniqueWords = new Set(words).size;

        if (sectorKey && SECTOR_KEYWORDS[sectorKey]) {
            const sector = SECTOR_KEYWORDS[sectorKey];
            sector.critical.forEach(kw => {
                if (cvText.includes(kw)) {
                    result.sectorMatchCount++;
                    result.sectorMatchedKeywords.push(kw);
                }
            });

            // Eksik olan önemli anahtar kelimeleri listele (ilk 8 tanesini)
            const missing = sector.critical
                .filter(kw => !cvText.includes(kw))
                .slice(0, 8);
            result.missingSectorKeywords = missing;

            const matchRatio = result.sectorMatchCount / Math.min(sector.critical.length, 20);
            if (matchRatio >= 0.4) {
                result.score = 100;
            } else if (matchRatio >= 0.25) {
                result.score = 70;
                result.issues.push(`Sektör anahtar kelimelerinden ${result.sectorMatchCount} tanesi bulundu. Daha fazla teknik terim ekleyerek ATS puanınızı artırabilirsiniz.`);
            } else if (matchRatio >= 0.1) {
                result.score = 40;
                result.issues.push(`CV'nizde sektörünüzle ilgili yeterli anahtar kelime yok (sadece ${result.sectorMatchCount} eşleşme). Hedef iş ilanındaki kelimeleri CV'nize entegre edin.`);
            } else {
                result.score = 15;
                result.issues.push('CV\'nizde sektörünüze ait hemen hiç anahtar kelime bulunamadı. İş ilanlarındaki teknik terimleri, araçları ve yetkinlikleri CV\'nize ekleyin.');
            }

            if (result.missingSectorKeywords.length > 0) {
                const topMissing = result.missingSectorKeywords.slice(0, 5).join(', ');
                result.issues.push(`Eklemeyi düşünebileceğiniz anahtar kelimeler: ${topMissing}`);
            }
        } else {
            // Sektör tespit edilemedi
            if (result.totalUniqueWords >= 50) {
                result.score = 60;
            } else if (result.totalUniqueWords >= 25) {
                result.score = 40;
                result.issues.push('CV\'nizdeki kelime çeşitliliği düşük. Daha fazla teknik terim ve yetkinlik ekleyin.');
            } else {
                result.score = 20;
                result.issues.push('CV\'niz çok az içerik barındırıyor. Her bölümü detaylı doldurun.');
            }
        }

        return result;
    }

    // ===== BECERİ ANALİZİ =====
    function analyzeSkills(skills, sectorKey) {
        const result = { score: 0, issues: [] };
        const count = skills.filter(s => toText(s.ad)).length;

        if (count === 0) {
            result.issues.push('Beceri bölümü boş. En az 5-8 beceri ekleyin. ATS sistemleri bu bölümü özellikle tarar.');
            return result;
        }

        if (count >= 8) {
            result.score = 100;
        } else if (count >= 5) {
            result.score = 75;
            result.issues.push(`${count} beceri eklenmiş. İdeal olarak 8-12 arası beceri yazmanız ATS puanını artırır.`);
        } else if (count >= 3) {
            result.score = 50;
            result.issues.push(`Sadece ${count} beceri var. Hedef pozisyona uygun teknik ve soft-skill becerileri ekleyin.`);
        } else {
            result.score = 25;
            result.issues.push(`Sadece ${count} beceri var. Bu çok yetersiz. En az 5-8 beceri eklemeniz gerekiyor.`);
        }

        // Sektörel beceri kontrolü
        if (sectorKey && SECTOR_KEYWORDS[sectorKey]) {
            const skillNames = skills.map(s => toText(s.ad).toLowerCase()).filter(Boolean);
            const sectorMatches = skillNames.filter(name =>
                SECTOR_KEYWORDS[sectorKey].critical.some(kw => name.includes(kw) || kw.includes(name))
            );

            if (sectorMatches.length === 0 && count > 0) {
                result.issues.push(`Becerileriniz arasında "${SECTOR_KEYWORDS[sectorKey].label}" sektörüne özel terimler bulunamadı. İş ilanlarındaki aranan becerileri ekleyin.`);
                result.score = Math.max(result.score - 15, 10);
            }
        }

        return result;
    }

    // ================================================================
    //  ANA ANALİZ FONKSİYONU: CV TAMAMLIK SKORU
    // ================================================================
    function calculateCompletionScore(cv) {
        const personal = getPersonal(cv);
        const lists = getLists(cv);
        const summary = getSummary(cv);
        const hasPhoto = Boolean(personal.photo || personal.foto);

        // Ağırlıklı alan skorlaması
        const fieldChecks = [
            { name: 'isim', value: personal.fullName || personal.ad, weight: 12 },
            { name: 'unvan', value: personal.title || personal.unvan, weight: 8 },
            { name: 'e-posta', value: personal.email, weight: 10 },
            { name: 'telefon', value: personal.telefon, weight: 8 },
            { name: 'konum', value: personal.konum || personal.location, weight: 5 },
            { name: 'linkedin', value: personal.linkedin, weight: 5 },
            { name: 'özet', value: summary, weight: 12 }
        ];

        let score = 0;
        const missingSections = [];

        fieldChecks.forEach(field => {
            if (toText(field.value)) {
                score += field.weight;
            } else {
                missingSections.push(field.name);
            }
        });

        // Deneyim (max 20)
        const expCount = lists.experience.filter(e => toText(e.sirket || e.pozisyon)).length;
        if (expCount >= 3) score += 20;
        else if (expCount === 2) score += 16;
        else if (expCount === 1) score += 10;
        else missingSections.push('deneyim');

        // Eğitim (max 10)
        const eduCount = lists.education.filter(e => toText(e.okul || e.bolum)).length;
        if (eduCount >= 2) score += 10;
        else if (eduCount === 1) score += 8;
        else missingSections.push('eğitim');

        // Beceriler (max 10)
        const skillCount = lists.skills.filter(s => toText(s.ad)).length;
        if (skillCount >= 6) score += 10;
        else if (skillCount >= 3) score += 7;
        else if (skillCount >= 1) score += 4;
        else missingSections.push('beceriler');

        // Projeler (max 5)
        if (lists.projects.filter(p => toText(p.ad)).length > 0) score += 5;
        else missingSections.push('projeler');

        // Diller (max 5)
        if (lists.languages.filter(l => toText(l.ad)).length > 0) score += 5;
        else missingSections.push('diller');

        // Fotoğraf (max 3)
        if (hasPhoto) score += 3;
        else missingSections.push('fotoğraf');

        // Sertifikalar bonus (max 2)
        if (lists.certificates.filter(c => toText(c.ad)).length > 0) score += 2;

        score = clamp(Math.round(score), 0, 100);

        let summaryText;
        if (score >= 90) summaryText = 'CV\'niz kapsamlı ve güçlü görünüyor. Küçük detaylar dışında tamamlanmış.';
        else if (score >= 70) summaryText = 'İyi bir CV yapısı. Eksik alanları tamamlayarak puanı yükseltebilirsiniz.';
        else if (score >= 50) summaryText = 'CV\'niz temel alanları içeriyor ama önemli eksikler var.';
        else summaryText = 'CV\'niz henüz çok eksik. Ana bölümleri (kişisel bilgiler, deneyim, beceriler) doldurmaya başlayın.';

        return {
            score,
            level: scoreLabel(score),
            missingSections,
            summary: summaryText
        };
    }

    // ================================================================
    //  ANA ANALİZ FONKSİYONU: ATS UYUM SKORU
    // ================================================================
    function calculateATSScore(cv) {
        const personal = getPersonal(cv);
        const lists = getLists(cv);
        const summary = getSummary(cv);
        const cvText = buildCvText(cv);
        const recommendations = [];
        let totalScore = 0;
        const maxScore = 100;

        // 1. SEKTÖR TESPİTİ
        const sectorKey = detectSector(cv);
        const sectorVerbs = sectorKey ? SECTOR_KEYWORDS[sectorKey].actionVerbs : [];

        // ========== BÖLÜM 1: İLETİŞİM BİLGİLERİ (max 20 puan) ==========
        let contactScore = 0;

        // E-posta (8 puan)
        const emailStr = toText(personal.email);
        if (emailStr) {
            if (isValidEmail(emailStr)) {
                contactScore += 8;
            } else {
                contactScore += 3;
                recommendations.push('E-posta adresiniz geçersiz formatta görünüyor. Doğru bir e-posta adresi girin (örn: ad@domain.com).');
            }
        } else {
            recommendations.push('E-posta adresi ekleyin. ATS sistemleri için iletişim bilgileri zorunludur.');
        }

        // Telefon (6 puan)
        const phoneStr = toText(personal.telefon);
        if (phoneStr) {
            if (isValidPhone(phoneStr)) {
                contactScore += 6;
            } else {
                contactScore += 2;
                recommendations.push('Telefon numaranız geçersiz formatta. Uluslararası formatta yazın: +90 5XX XXX XX XX');
            }
        } else {
            recommendations.push('Telefon numarası ekleyin.');
        }

        // LinkedIn (4 puan)
        const linkedinStr = toText(personal.linkedin);
        if (linkedinStr) {
            if (isValidLinkedIn(linkedinStr)) {
                contactScore += 4;
            } else {
                contactScore += 2;
                recommendations.push('LinkedIn URL\'niz standart formatta değil. "linkedin.com/in/kullaniciadi" formatını kullanın.');
            }
        } else {
            recommendations.push('LinkedIn profil URL\'nizi ekleyin. İşverenlerin %87\'si LinkedIn profilini kontrol eder.');
        }

        // Konum (2 puan)
        if (toText(personal.konum || personal.location)) {
            contactScore += 2;
        }

        totalScore += contactScore; // max 20

        // ========== BÖLÜM 2: PROFESYONEL ÖZET (max 20 puan) ==========
        const summaryAnalysis = analyzeSummaryQuality(summary, sectorKey);
        const summaryScore = Math.round(summaryAnalysis.score * 0.2); // 0-100 -> 0-20
        totalScore += summaryScore;
        recommendations.push(...summaryAnalysis.issues);

        // ========== BÖLÜM 3: İŞ DENEYİMİ KALİTESİ (max 25 puan) ==========
        let experienceScore = 0;
        const validExperiences = lists.experience.filter(e => toText(e.sirket || e.pozisyon));

        if (validExperiences.length === 0) {
            recommendations.push('İş deneyimi bölümü boş. Staj, freelance iş veya gönüllü çalışma bile olsa mutlaka ekleyin.');
        } else {
            // Deneyim sayısı (max 8)
            if (validExperiences.length >= 3) experienceScore += 8;
            else if (validExperiences.length === 2) experienceScore += 6;
            else experienceScore += 4;

            // Tarih tutarlılığı (max 4)
            const dateIssues = checkDateConsistency(validExperiences);
            if (dateIssues.length === 0) {
                experienceScore += 4;
            } else {
                experienceScore += 1;
                recommendations.push(...dateIssues);
            }

            // Açıklama kalitesi (max 13)
            const descriptions = validExperiences
                .map(e => toText(e.aciklama))
                .filter(Boolean);

            if (descriptions.length === 0) {
                recommendations.push('Deneyim açıklamaları boş. Her deneyim için ne yaptığınızı, hangi araçları kullandığınızı ve ne başardığınızı yazın.');
            } else {
                const descAnalysis = analyzeDescriptionQuality(descriptions, sectorVerbs);

                if (descAnalysis.hasActionVerbs) experienceScore += 5;
                if (descAnalysis.hasQuantifiedResults) experienceScore += 5;
                if (descAnalysis.avgLength >= 80) experienceScore += 3;
                else if (descAnalysis.avgLength >= 40) experienceScore += 1;

                recommendations.push(...descAnalysis.issues);
            }
        }

        totalScore += experienceScore; // max 25

        // ========== BÖLÜM 4: BECERİLER (max 15 puan) ==========
        const skillAnalysis = analyzeSkills(lists.skills, sectorKey);
        const skillsScore = Math.round(skillAnalysis.score * 0.15); // 0-100 -> 0-15
        totalScore += skillsScore;
        recommendations.push(...skillAnalysis.issues);

        // ========== BÖLÜM 5: ANAHTAR KELİME YOĞUNLUĞU (max 15 puan) ==========
        const keywordAnalysis = analyzeKeywordDensity(cvText, sectorKey);
        const keywordScore = Math.round(keywordAnalysis.score * 0.15); // 0-100 -> 0-15
        totalScore += keywordScore;
        recommendations.push(...keywordAnalysis.issues);

        // ========== BÖLÜM 6: EĞİTİM + EKSTRA (max 5 puan) ==========
        const validEducation = lists.education.filter(e => toText(e.okul || e.bolum));
        if (validEducation.length > 0) {
            totalScore += 3;
            // Eğitimde bölüm kontrolü
            const noDept = validEducation.filter(e => !toText(e.bolum));
            if (noDept.length > 0) {
                recommendations.push('Eğitim bilgilerinize bölüm adını da ekleyin. ATS sistemleri bölüm bilgisini arar.');
            }
        } else {
            recommendations.push('Eğitim bilgisi ekleyin.');
        }

        if (lists.certificates.filter(c => toText(c.ad)).length > 0) totalScore += 1;
        if (lists.languages.filter(l => toText(l.ad)).length > 0) totalScore += 1;

        // ========== FİNAL SKOR ==========
        totalScore = clamp(Math.round(totalScore), 0, maxScore);

        // Tekrar eden önerileri kaldır ve ilk 6 ile sınırla
        const uniqueRecommendations = Array.from(new Set(recommendations)).slice(0, 6);

        if (!uniqueRecommendations.length) {
            uniqueRecommendations.push('ATS uyumunuz güçlü görünüyor. CV\'nizi hedef iş ilanlarıyla karşılaştırmayı unutmayın.');
        }

        let summaryText;
        if (totalScore >= 85) summaryText = 'ATS uyumunuz mükemmel. CV\'niz çoğu ATS sisteminden başarıyla geçecektir.';
        else if (totalScore >= 70) summaryText = 'ATS uyumunuz güçlü. Birkaç iyileştirme ile mükemmel seviyeye ulaşabilirsiniz.';
        else if (totalScore >= 50) summaryText = 'ATS uyumunuz orta düzeyde. Aşağıdaki önerileri uygulayarak puanınızı artırın.';
        else if (totalScore >= 30) summaryText = 'ATS uyumunuz zayıf. Önemli eksikler var. Önerileri dikkate alın.';
        else summaryText = 'ATS uyumunuz yetersiz. CV\'nizin temel alanlarını tamamlayın ve iş ilanlarındaki anahtar kelimeleri kullanın.';

        return {
            score: totalScore,
            level: scoreLabel(totalScore),
            recommendations: uniqueRecommendations,
            summary: summaryText,
            detectedSector: sectorKey ? SECTOR_KEYWORDS[sectorKey].label : null,
            keywordStats: {
                matched: keywordAnalysis.sectorMatchCount,
                suggestions: keywordAnalysis.missingSectorKeywords.slice(0, 5)
            }
        };
    }

    // ===== GLOBAL EXPORT =====
    global.CVAnalysis = {
        calculateCompletionScore,
        calculateATSScore
    };
})(window);
