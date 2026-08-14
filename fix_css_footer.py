import re

file_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\styles\style.css"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Make footer transparent and remove borders
content = re.sub(
    r"\.footer\s*\{[^}]*\}",
    ".footer {\n    position: relative;\n    z-index: 2;\n    background: transparent !important;\n    border-top: none !important;\n    padding: var(--spacing-3xl) var(--spacing-xl);\n    margin-top: var(--spacing-4xl);\n}",
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
