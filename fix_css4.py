import os

file_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\styles\style.css"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update .header (Remove background, border, blur)
target_header = """.header {
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
replacement_header = """.header {
    background: transparent;
    border: none;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
    box-shadow: none;
    animation: slideDownHeader 0.5s ease-out;
}"""
if target_header in content:
    content = content.replace(target_header, replacement_header)
else:
    print("Could not find target_header")

# 2. Update .editor-header
target_editor_header = """body.editor-page .editor-header {
    background: rgba(18, 18, 18, 0.65);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}"""
replacement_editor_header = """body.editor-page .editor-header {
    background: transparent;
    border: none;
    box-shadow: none;
    position: relative;
}"""
if target_editor_header in content:
    content = content.replace(target_editor_header, replacement_editor_header)
else:
    print("Could not find target_editor_header")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
