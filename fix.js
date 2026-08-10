const fs = require('fs');
let content = fs.readFileSync('styles/cv-templates.css', 'utf8');

const s1 = "    body.editor-page,\n    body.preview-page {\n        overflow: visible !important;\n    }";
const s2 = "    .cv-paper[data-layout=\"modern\"] #cvBody {";

const idx1 = content.indexOf("    body.editor-page,\r\n    body.preview-page {\r\n        overflow: visible !important;\r\n    }") !== -1 ? content.indexOf("    body.editor-page,\r\n    body.preview-page {\r\n        overflow: visible !important;\r\n    }") : content.indexOf("    body.editor-page,\n    body.preview-page {\n        overflow: visible !important;\n    }");

const idx2 = content.indexOf(s2, idx1);

if (idx1 !== -1 && idx2 !== -1) {
    const before = content.substring(0, idx1);
    const after = content.substring(idx2);
    
    const insert = `    body.editor-page,
    body.preview-page {
        overflow: visible !important;
    }

    .canvas-background,
    .editor-header,
    .editor-form-panel,
    .preview-toolbar,
    #toastContainer,
    .modal-overlay,
    .editor-analysis-panel {
        display: none !important;
    }

    body.editor-page .editor-layout,
    body.preview-page .preview-area {
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        min-height: 0 !important;
        height: auto !important;
        overflow: visible !important;
        background: #ffffff !important;
    }

    body.editor-page .editor-preview-panel,
    body.preview-page .preview-area {
        padding: 0 !important;
        background: #ffffff !important;
    }

    .cv-paper {
        width: 100% !important;
        max-width: 100% !important;
        min-height: 0 !important;
        max-height: none !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
        overflow: visible !important;
        transform: none !important;
        page-break-before: auto;
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
    }

    .cv-entry,
    .cv-section {
        page-break-inside: avoid;
    }

    /* Layout: modern / tech iki kolon */
    .cv-paper[data-layout="modern"] #cvHeader,
    .cv-paper[data-layout="modern"] #cvTekSutun {
        display: none !important;
    }

    .cv-paper[data-layout="modern"] #cvModernBanner {
        display: flex !important;
    }

    .cv-paper[data-layout="modern"] #cvModernBody {
        display: grid !important;
    }

`;

    fs.writeFileSync('styles/cv-templates.css', before + insert + after);
    console.log('Fixed successfully by index');
} else {
    console.log('Indexes not found', idx1, idx2);
}
