import re

file_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\editor.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacement = """.input-error-text {
            display: block;
            min-height: 0.9rem;
            margin-top: 0.3rem;
            font-size: 0.72rem;
            color: red;
        }
        
        .input-error-text:empty {
            display: none;
        }"""

content = re.sub(
    r"\.input-error-text\s*\{[^}]*\}",
    replacement,
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
