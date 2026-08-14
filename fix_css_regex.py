import re

file_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\styles\style.css"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace .header block (making it transparent and floating)
content = re.sub(
    r"\.header\s*\{[^}]*\}",
    ".header {\n    background: transparent !important;\n    border: none !important;\n    position: absolute;\n    width: 100%;\n    top: 0;\n    left: 0;\n    z-index: 1000;\n    box-shadow: none !important;\n    backdrop-filter: none !important;\n}",
    content
)

# Replace .navbar block (adjusting padding for floating nav)
content = re.sub(
    r"\.navbar\s*\{[^}]*\}",
    ".navbar {\n    padding: 1.5rem 2rem;\n}",
    content
)

# Replace editor-header block
content = re.sub(
    r"body\.editor-page\s+\.editor-header\s*\{[^}]*\}",
    "body.editor-page .editor-header {\n    background: transparent !important;\n    border: none !important;\n    box-shadow: none !important;\n    position: absolute;\n    width: 100%;\n    top: 0;\n    left: 0;\n    z-index: 1000;\n    backdrop-filter: none !important;\n}",
    content
)

# We will also make sure the buttons stand out properly since they are on the canvas background.
# The original nav-action-btn was fine for dark red backgrounds. We will just restore it to something clean.
content = re.sub(
    r"\.nav-action-btn\s*\{[^}]*\}",
    ".nav-action-btn {\n    display: inline-flex;\n    align-items: center;\n    gap: 8px;\n    background: rgba(255, 255, 255, 0.1);\n    border: 1px solid rgba(255, 255, 255, 0.25);\n    color: #fff;\n    padding: 0.6rem 1.4rem;\n    border-radius: 50px;\n    font-weight: 600;\n    font-size: 0.95rem;\n    cursor: pointer;\n    transition: all 0.3s ease;\n    margin-left: 10px;\n    font-family: 'Outfit', sans-serif;\n}",
    content
)

content = re.sub(
    r"\.nav-action-btn:hover\s*\{[^}]*\}",
    ".nav-action-btn:hover {\n    background: rgba(255, 255, 255, 0.2);\n    border-color: rgba(255, 255, 255, 0.4);\n    transform: translateY(-2px);\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}",
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
