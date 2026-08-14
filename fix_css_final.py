import re

file_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\styles\style.css"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the generic block that got accidentally overridden
content = re.sub(
    r"\.header,\s*\.main-content,\s*\.footer\s*\{[^}]*\}",
    ".header,\n.main-content,\n.footer {\n    position: relative;\n    z-index: 10;\n}",
    content
)

# Fix the specific .footer block to be transparent with no excessive margins
content = re.sub(
    r"/\*\s*=====\s*FOOTER\s*=====\s*\*/\s*/\*\s*[^\*]*\*/\s*\.footer\s*\{[^}]*\}",
    "/* ===== FOOTER ===== */\n.footer {\n    position: relative;\n    z-index: 2;\n    background: transparent !important;\n    border-top: none !important;\n    padding: var(--spacing-xl) 0;\n    margin-top: 0;\n}",
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
