import os

file_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\styles\style.css"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix .header
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
    background: var(--white);
    border-bottom: 1px solid #eaeaea;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    animation: slideDownHeader 0.5s ease-out;
}"""
content = content.replace(target_header, replacement_header)

# 2. Fix .navbar
target_navbar = """.navbar {
    padding: var(--spacing-lg) var(--spacing-xl);
}"""
replacement_navbar = """.navbar {
    padding: 0.75rem var(--spacing-xl);
}"""
content = content.replace(target_navbar, replacement_navbar)

# 3. Fix .editor-header
target_editor_header = """body.editor-page .editor-header {
    background: rgba(74, 14, 14, 0.92);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}"""
replacement_editor_header = """body.editor-page .editor-header {
    background: var(--white);
    border-bottom: 1px solid #eaeaea;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}"""
content = content.replace(target_editor_header, replacement_editor_header)

# 4. Fix .nav-action-btn
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
    background: var(--white);
    border: 1px solid #d1d5db;
    color: var(--gray-dark);
    padding: 0.5rem 1.2rem;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: 10px;
    font-family: 'Outfit', sans-serif;
}

.nav-action-btn:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}"""
content = content.replace(target_nav_btn, replacement_nav_btn)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
