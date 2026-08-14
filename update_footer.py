import re

# 1. Update index.html
html_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\index.html"
with open(html_path, "r", encoding="utf-8") as f:
    html_content = f.read()

old_footer = """    <footer class="footer">
        <div class="footer-container">
            <p class="footer-text">
                &copy; 2026 CV Oluşturucu. Tüm hakları saklıdır. |
                <a href="gizlilik.html" style="color: var(--cherry-ruby); text-decoration: none;">Gizlilik
                    Politikası</a> •
                <a href="kullanim-kosullari.html" style="color: var(--cherry-ruby); text-decoration: none;">Kullanım
                    Koşulları</a>
            </p>
            <p class="footer-subtitle">
                Profesyonel CV'nizi dakikalar içinde oluşturun ✨
            </p>
        </div>
    </footer>"""

new_footer = """    <footer class="footer">
        <div class="footer-container">
            <div class="footer-left">
                <div class="footer-logo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e59b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                        <polyline points="2 17 12 22 22 17"></polyline>
                        <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                    <span style="font-weight:900; color: #fff;">CV</span><span style="font-weight:600; color: #fff;">Lab</span>
                </div>
                <span class="footer-copyright">&copy; 2026 All rights reserved.</span>
                <span class="footer-powered">Powered by <a href="#" style="color:#00e59b;text-decoration:none;">Tedlite LLP</a></span>
            </div>
            <div class="footer-right">
                <a href="gizlilik.html">Privacy</a>
                <a href="kullanim-kosullari.html">Terms</a>
                <a href="#">Refunds</a>
                <a href="mailto:iletisim@cv-olusturucu.com">Contact</a>
            </div>
        </div>
    </footer>"""

if old_footer in html_content:
    html_content = html_content.replace(old_footer, new_footer)
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print("index.html updated")
else:
    print("index.html footer not found exactly as string. Using regex...")
    html_content = re.sub(r'<footer class="footer">.*?</footer>', new_footer, html_content, flags=re.DOTALL)
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print("index.html updated with regex")

# 2. Update style.css
css_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\styles\style.css"
with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

# Replace .footer { ... } through .footer-subtitle { ... }
# I will just replace .footer block and everything up to the next section

old_css_regex = r"\.footer\s*\{[^}]+\}\s*\.footer-container\s*\{[^}]+\}\s*\.footer-text\s*\{[^}]+\}\s*\.footer-divider\s*\{[^}]+\}\s*\.footer-subtitle\s*\{[^}]+\}"

new_css = """.footer {
    position: relative;
    z-index: 2;
    background: #111111 !important;
    border-top: none !important;
    padding: 1.2rem 2rem;
    margin-top: 0;
    width: 100%;
}

.footer-container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.footer-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    color: #888;
    font-size: 0.9rem;
}

.footer-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
}

.footer-right {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

.footer-right a {
    color: #888;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;
}

.footer-right a:hover {
    color: #fff;
}

@media (max-width: 768px) {
    .footer-container {
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }
    .footer-left {
        flex-direction: column;
        gap: 0.5rem;
    }
}"""

if re.search(old_css_regex, css_content):
    css_content = re.sub(old_css_regex, new_css, css_content)
    with open(css_path, "w", encoding="utf-8") as f:
        f.write(css_content)
    print("style.css updated")
else:
    print("Could not find the footer css block. Trying a broader regex...")
    # fallback: just replace .footer { transparent !important ... } block
    css_content = re.sub(r"\.footer\s*\{[^}]*transparent\s*!important[^}]*\}", new_css, css_content)
    with open(css_path, "w", encoding="utf-8") as f:
        f.write(css_content)
    print("style.css updated with fallback regex")
