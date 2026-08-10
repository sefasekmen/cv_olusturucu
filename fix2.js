const fs = require('fs');
let css = fs.readFileSync('styles/style.css', 'utf8');

const start = css.indexOf('.footer-divider {');
const end = css.indexOf('    .logo-img {');

if (start !== -1 && end !== -1) {
    const newPart = `.footer-divider {
    margin: 0 var(--spacing-md);
    opacity: 0.5;
}

.footer-subtitle {
    font-size: var(--font-size-sm);
    color: rgba(255, 255, 255, 0.85);
    font-weight: 500;
}

.footer a {
    color: var(--pink-pale, rgba(255, 228, 225, 0.95));
    text-decoration: none;
    transition: color var(--transition-fast), opacity var(--transition-fast);
}

.footer a:hover {
    color: var(--pink-soft, #FFC0CB);
    opacity: 1;
}

.footer a:focus-visible {
    color: var(--pink-soft, #FFC0CB);
    outline: 2px solid rgba(255, 228, 225, 0.8);
    outline-offset: 3px;
    border-radius: 4px;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
    .hero {
        min-height: 500px;
        padding: var(--spacing-3xl) var(--spacing-md);
    }
    
    .hero-title {
        font-size: var(--font-size-3xl);
    }
    
    .hero-subtitle {
        font-size: var(--font-size-base);
    }
    
    .section-title {
        font-size: var(--font-size-2xl);
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
    
    .templates-grid {
        grid-template-columns: 1fr;
    }

    .templates-carousel-shell {
        padding: 0 1rem;
    }

    .templates-carousel {
        padding-left: calc(50% - min(42.5vw, 160px));
        padding-right: calc(50% - min(42.5vw, 160px));
    }

    .tpl-card-scroll {
        min-width: min(85vw, 320px);
    }

    .templates-carousel-nav {
        display: none;
    }
    
    .navbar {
        padding: var(--spacing-md);
    }
    
    .navbar-container {
        flex-direction: column-reverse;
        gap: var(--spacing-lg);
    }
    
    .btn-primary {
        padding: var(--spacing-md) var(--spacing-2xl);
        font-size: var(--font-size-base);
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: var(--font-size-2xl);
        line-height: 1.2;
    }
    
    .hero-subtitle {
        font-size: var(--font-size-sm);
    }
    
    .section-title {
        font-size: var(--font-size-xl);
    }
    
    .btn-load-cv .btn-text {
        display: none;
    }

`;

    css = css.substring(0, start) + newPart + css.substring(end);
    fs.writeFileSync('styles/style.css', css);
    console.log('Successfully repaired style.css');
} else {
    console.log('Could not find markers to repair style.css');
}
