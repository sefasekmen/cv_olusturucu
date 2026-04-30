/* =============================================
   CV OLUŞTURUCU - MAIN JAVASCRIPT FILE
   Vanilla JavaScript - Event Listeners & Interactive Features
   ============================================= */

// ===== DOM Element References =====
// Get all important elements from the DOM for event handling

const loadCVBtn = document.getElementById('loadCVBtn');
const ctaBtn = document.getElementById('ctaBtn');
const templateButtons = document.querySelectorAll('.btn-template');
const templatesSection = document.getElementById('templatesSection');

// ===== Event Listener: Load Saved CV Button =====
// Handle the "Kayıtlı CV Yükle" button click
// Purpose: Allow users to load previously saved CV data from localStorage

if (loadCVBtn) {
    loadCVBtn.addEventListener('click', function() {
        console.log('Load CV button clicked');
        
        // Check if there's saved CV data in localStorage
        const savedCV = localStorage.getItem('savedCV');
        
        if (savedCV) {
            // If saved data exists, redirect to editor with the saved data
            console.log('Saved CV found, navigating to editor...');
            alert('Kaydedilmiş CV'niz bulundu! Düzenleyiciye yönlendiriliyorsunuz...');
            // In production, redirect to the editor page with saved data
            // window.location.href = 'editor.html?mode=edit';
        } else {
            // If no saved data, inform the user
            console.log('No saved CV found in localStorage');
            alert('Henüz kaydedilmiş CV bulunmuyor. Yeni bir CV oluşturmak için bir şablon seçin.');
        }
    });
}

// ===== Event Listener: CTA Button - Smooth Scroll =====
// Handle the primary "Şimdi Başla" button click
// Purpose: Smoothly scroll down to the templates section

if (ctaBtn) {
    ctaBtn.addEventListener('click', function() {
        console.log('CTA button clicked - scrolling to templates section');
        
        // Use smooth scroll to navigate to templates section
        if (templatesSection) {
            templatesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            console.warn('Templates section not found');
        }
    });
}

// ===== Event Listener: Template Selection Buttons =====
// Handle individual template card button clicks
// Purpose: Store selected template and redirect to CV editor

if (templateButtons.length > 0) {
    templateButtons.forEach((button) => {
        button.addEventListener('click', function(event) {
            // Prevent default button behavior
            event.preventDefault();
            
            // Get the selected template name from data attribute
            const selectedTemplate = this.getAttribute('data-template');
            
            console.log(`Template selected: ${selectedTemplate}`);
            
            // Store the selected template in localStorage for later use
            localStorage.setItem('selectedTemplate', selectedTemplate);
            
            // Display confirmation message
            const templateNames = {
                classic: 'Klasik',
                modern: 'Modern',
                minimal: 'Minimal'
            };
            
            const templateName = templateNames[selectedTemplate] || selectedTemplate;
            alert(`${templateName} şablonuyla başlıyorsunuz! Düzenleyiciye yönlendiriliyorsunuz...`);
            
            // In production, redirect to the editor page
            // Uncomment the line below when editor.html is created:
            // window.location.href = 'editor.html?template=' + selectedTemplate;
            
            console.log(`Redirecting to editor with ${selectedTemplate} template...`);
        });
    });
}

// ===== Event Listener: Keyboard Navigation (Optional Enhancement) =====
// Handle Enter key press on buttons for better accessibility

document.addEventListener('keydown', function(event) {
    // If Enter is pressed on a focused button, trigger click
    if (event.key === 'Enter' && event.target.classList.contains('btn')) {
        console.log('Button activated via keyboard (Enter key)');
        event.target.click();
    }
});

// ===== Feature: Auto-Save to LocalStorage (Optional Data Persistence) =====
// Purpose: Save app preferences or temporary data

function initializeAppPreferences() {
    // Check if user is visiting for the first time
    const hasVisited = localStorage.getItem('appVisited');
    
    if (!hasVisited) {
        console.log('First visit detected - setting initial preferences');
        
        // Set initial app preferences
        localStorage.setItem('appVisited', 'true');
        localStorage.setItem('appVersion', '1.0.0');
        localStorage.setItem('lastVisit', new Date().toISOString());
    } else {
        console.log('Returning visitor detected');
        const lastVisit = localStorage.getItem('lastVisit');
        console.log(`Last visit: ${lastVisit}`);
    }
}

// ===== Feature: Smooth Scroll Enhancement for Internal Links =====
// Purpose: Smooth scroll for any anchor links on the page

function initializeSmoothScroll() {
    // Get all anchor links on the page
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach((link) => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Get the target section ID
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                console.log(`Smooth scrolling to section: ${targetId}`);
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== Feature: Track User Interactions (Analytics) =====
// Purpose: Log user interactions for analytics and debugging

function trackUserInteraction(eventType, details) {
    // Create interaction data object
    const interactionData = {
        type: eventType,
        timestamp: new Date().toISOString(),
        details: details
    };
    
    // Log to console for development
    console.log('User Interaction Tracked:', interactionData);
    
    // In production, send this data to an analytics service
    // Example: sendToAnalytics(interactionData);
}

// ===== Feature: Add Hover Effects Logging (Development Tool) =====
// Purpose: Log when users hover over feature and template cards

function initializeHoverTracking() {
    // Track feature card hovers
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            trackUserInteraction('feature_card_hover', { card_index: index });
        });
    });
    
    // Track template card hovers
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            trackUserInteraction('template_card_hover', { card_index: index });
        });
    });
}

// ===== Feature: Responsive Navigation (Mobile Menu - Future Enhancement) =====
// Purpose: Placeholder for mobile menu functionality

function initializeMobileNavigation() {
    // Check if mobile navigation is needed (can be expanded in future)
    const navContainer = document.querySelector('.navbar-container');
    
    if (navContainer) {
        console.log('Mobile navigation initialized');
        // Future implementation for hamburger menu on mobile devices
    }
}

// ===== Feature: Scroll Position Restoration =====
// Purpose: Remember scroll position when returning to home page

function initializeScrollRestoration() {
    // Allow browser to handle scroll restoration naturally
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
        console.log('Scroll restoration enabled');
    }
}

// ===== Feature: Page Visibility Handler =====
// Purpose: Track when user returns to the page

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden - user navigated away');
        trackUserInteraction('page_hidden', {});
    } else {
        console.log('Page visible - user returned');
        trackUserInteraction('page_visible', {});
    }
});

// ===== Feature: Window Resize Handler (Responsive Design Debugging) =====
// Purpose: Log viewport size changes for responsive design testing

let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    
    resizeTimeout = setTimeout(function() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        console.log(`Viewport resized to: ${viewportWidth}x${viewportHeight}`);
        
        // Determine current breakpoint
        let breakpoint = 'desktop';
        if (viewportWidth <= 768) {
            breakpoint = 'mobile';
        } else if (viewportWidth <= 1024) {
            breakpoint = 'tablet';
        }
        
        console.log(`Current breakpoint: ${breakpoint}`);
    }, 250); // Debounce resize handler
});

// ===== Feature: Add Console Welcome Message =====
// Purpose: Display welcome message in browser console for developers

function initializeConsoleWelcome() {
    const welcomeMessage = `
    %c🎉 CV Oluşturucu v1.0.0
    %cÜniversite Final Projesi
    
    %cTeknolojiler:%c Semantic HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript
    %cRenkler:%c Navy Blue (#1a3a52) ve Baby Blue (#a8d8ea)
    
    %cGeliştiriciler tarafından öğrenme amacıyla geliştirilmiştir.
    `;
    
    console.log(
        welcomeMessage,
        'font-size: 16px; font-weight: bold; color: #1a3a52;',
        'font-size: 14px; color: #a8d8ea;',
        'font-size: 12px; color: #666;',
        'font-size: 12px; color: #1a3a52; font-weight: bold;',
        'font-size: 12px; color: #666;',
        'font-size: 12px; color: #a8d8ea; font-weight: bold;',
        'font-size: 11px; color: #999;'
    );
}

// ===== Main Initialization Function =====
// Purpose: Run all initialization functions when DOM is ready

function initializeApp() {
    console.log('=== CV Oluşturucu Initialization Started ===');
    
    // Run all initialization functions in order
    initializeConsoleWelcome();
    initializeAppPreferences();
    initializeSmoothScroll();
    initializeHoverTracking();
    initializeMobileNavigation();
    initializeScrollRestoration();
    
    console.log('=== CV Oluşturucu Initialization Completed ===');
    console.log('All systems ready. Users can now interact with the application.');
}

// ===== DOM Ready Check & App Initialization =====
// Purpose: Ensure DOM is fully loaded before running initialization

if (document.readyState === 'loading') {
    // DOM is still loading
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already fully loaded (if script is loaded at the end of body)
    initializeApp();
}

// ===== Error Handling =====
// Purpose: Catch and log any JavaScript errors for debugging

window.addEventListener('error', function(event) {
    console.error('JavaScript Error Caught:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
    
    // In production, send error to error tracking service
    // Example: sendErrorToService(event.error);
});

// ===== Unhandled Promise Rejection Handler =====
// Purpose: Catch unhandled promise rejections

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    
    // Prevent the default error handling
    event.preventDefault();
});

// ===== Debug Mode Toggle (Optional) =====
// Purpose: Allow developers to toggle debug mode in console
// Usage: debugMode = true; or debugMode = false;

let debugMode = false;

function setDebugMode(enable) {
    debugMode = enable;
    console.log(`Debug mode: ${debugMode ? 'ENABLED' : 'DISABLED'}`);
    
    if (debugMode) {
        console.log('=== Debug Information ===');
        console.log('Page URL:', window.location.href);
        console.log('Viewport Size:', `${window.innerWidth}x${window.innerHeight}`);
        console.log('LocalStorage Contents:', localStorage);
        console.log('SessionStorage Contents:', sessionStorage);
    }
}

// ===== End of Script =====
console.log('script.js loaded successfully');
