import os

file_path = r"c:\Users\Asus\Desktop\PROJECTS\Cv_olusturucu\editor.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = "                analizPaneliniGuncelle();\n            }"
replacement = "                analizPaneliniGuncelle();\n                if (typeof onizlemeyiGuncelle === 'function') onizlemeyiGuncelle();\n            }"

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("replaced exactly")
else:
    # Try with \r\n
    target2 = "                analizPaneliniGuncelle();\r\n            }"
    replacement2 = "                analizPaneliniGuncelle();\r\n                if (typeof onizlemeyiGuncelle === 'function') onizlemeyiGuncelle();\r\n            }"
    if target2 in content:
        content = content.replace(target2, replacement2)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("replaced exactly with CRLF")
    else:
        print("target not found")
