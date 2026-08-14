import re

file_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\styles\style.css"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace min-height: 700px with min-height: 100vh in .hero
content = re.sub(
    r"\.hero\s*\{[^}]*min-height:\s*700px;[^}]*\}",
    ".hero {\n    position: relative;\n    min-height: 100vh;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding: var(--spacing-4xl) var(--spacing-xl);\n    overflow: hidden;\n}",
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
