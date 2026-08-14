import os

file_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\styles\style.css"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target_header = """.header {
    background: rgba(74, 14, 14, 0.85);
    backdrop-filter: blur(8px);
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: var(--shadow-sm);
    animation: slideDownHeader 0.5s ease-out;
}"""
replacement_header = """.header {
    background: rgba(18, 18, 18, 0.65);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    animation: slideDownHeader 0.5s ease-out;
}"""
content = content.replace(target_header, replacement_header)

target_navbar = """.navbar {
    padding: var(--spacing-lg) var(--spacing-xl);
}"""
replacement_navbar = """.navbar {
    padding: 0.85rem var(--spacing-xl);
}"""
content = content.replace(target_navbar, replacement_navbar)

target_editor_header = """body.editor-page .editor-header {
    background: rgba(74, 14, 14, 0.92);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}"""
replacement_editor_header = """body.editor-page .editor-header {
    background: rgba(18, 18, 18, 0.65);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}"""
content = content.replace(target_editor_header, replacement_editor_header)

target_nav_btn = """.nav-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: var(--white);
    padding: 0.6rem 1.4rem;
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: 10px;
    font-family: 'Outfit', sans-serif;
}

.nav-action-btn:hover {
    background: var(--cherry-ruby);
    border-color: var(--cherry-ruby);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(194, 0, 0, 0.3);
}"""
replacement_nav_btn = """.nav-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.06) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: rgba(255, 255, 255, 0.95) !important;
    padding: 0.65rem 1.25rem !important;
    border-radius: 12px !important;
    font-weight: 500 !important;
    font-size: 0.95rem !important;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    margin-left: 8px;
    font-family: 'Outfit', sans-serif;
    backdrop-filter: blur(10px);
}

.nav-action-btn:hover {
    background: rgba(255, 255, 255, 0.12) !important;
    border-color: rgba(255, 255, 255, 0.25) !important;
    color: #fff !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15) !important;
}

/* Premium Button Special Override */
.nav-action-btn.premium-btn {
    background: linear-gradient(135deg, #f59e0b, #d97706) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    color: white !important;
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.25) !important;
}
.nav-action-btn.premium-btn:hover {
    background: linear-gradient(135deg, #fbbf24, #f59e0b) !important;
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4) !important;
}"""
content = content.replace(target_nav_btn, replacement_nav_btn)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
