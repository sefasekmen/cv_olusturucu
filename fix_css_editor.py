import re

file_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\styles\style.css"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove the broken editor-header block that overrides the inline styles
content = re.sub(
    r"body\.editor-page\s+\.editor-header\s*\{[^}]*\}",
    "",
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
