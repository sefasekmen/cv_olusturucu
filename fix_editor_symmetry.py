import re

file_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\editor.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = """.form-group {
            margin-bottom: 0.9rem;
        }"""
replacement = """.form-group {
            margin-bottom: 0.9rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            height: 100%;
        }"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("Not found target. trying regex...")
    content = re.sub(
        r"\.form-group\s*\{\s*margin-bottom:\s*0\.9rem;\s*\}",
        replacement,
        content
    )

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
