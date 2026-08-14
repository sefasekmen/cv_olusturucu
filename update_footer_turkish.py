import re

html_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\index.html"
with open(html_path, "r", encoding="utf-8") as f:
    html_content = f.read()

old_footer = """    <footer class="footer">
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

new_footer = """    <footer class="footer">
        <div class="footer-container">
            <div class="footer-left">
                <div class="footer-logo">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--cherry-ruby)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span style="font-weight:900; color: #fff; letter-spacing: 0.5px;">CV</span>
                    <span style="font-weight:500; color: rgba(255, 255, 255, 0.75);">Oluşturucu</span>
                </div>
                <span class="footer-copyright">&copy; 2026 Tüm hakları saklıdır.</span>
            </div>
            <div class="footer-right">
                <a href="gizlilik.html">Gizlilik Politikası</a>
                <a href="kullanim-kosullari.html">Kullanım Koşulları</a>
                <a href="mailto:iletisim@cv-olusturucu.com">İletişim</a>
            </div>
        </div>
    </footer>"""

if old_footer in html_content:
    html_content = html_content.replace(old_footer, new_footer)
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print("index.html updated perfectly")
else:
    print("Could not find old footer exactly. Trying regex.")
    html_content = re.sub(r'<footer class="footer">.*?</footer>', new_footer, html_content, flags=re.DOTALL)
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print("index.html updated with regex")

# Let's check style.css to ensure hover states use cherry ruby instead of generic white if needed, but white is fine for dark theme.
css_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\styles\style.css"
with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

# Update hover color to cherry ruby
old_css_hover = """.footer-right a:hover {
    color: #fff;
}"""
new_css_hover = """.footer-right a:hover {
    color: var(--cherry-ruby);
}"""

if old_css_hover in css_content:
    css_content = css_content.replace(old_css_hover, new_css_hover)
    with open(css_path, "w", encoding="utf-8") as f:
        f.write(css_content)
    print("style.css updated for hover effect")
