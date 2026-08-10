document.addEventListener('DOMContentLoaded', () => {
    // Check if user already accepted cookies
    if (localStorage.getItem('cookieConsent') === 'accepted') {
        return;
    }

    // Create the cookie banner
    const banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(20, 20, 20, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); padding: 15px 25px; border-radius: 50px; display: flex; align-items: center; gap: 20px; z-index: 9999; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: max-content; max-width: 90vw; flex-wrap: wrap; justify-content: center;">
            <span style="color: #eee; font-size: 0.9rem; font-family: 'Outfit', sans-serif;">
                🍪 Sitemiz, deneyiminizi geliştirmek ve verilerinizi güvenle saklamak için çerezler kullanır. 
                <a href="gizlilik.html" style="color: var(--cherry-ruby); text-decoration: underline;">Gizlilik Politikası</a>
            </span>
            <button id="acceptCookies" style="background: var(--cherry-ruby); color: white; border: none; padding: 8px 20px; border-radius: 50px; cursor: pointer; font-weight: 600; font-family: 'Outfit', sans-serif; transition: all 0.3s ease;">Kabul Et</button>
        </div>
    `;

    document.body.appendChild(banner);

    // Handle accept button click
    document.getElementById('acceptCookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.style.opacity = '0';
        banner.style.transform = 'translateX(-50%) translateY(20px)';
        banner.style.transition = 'all 0.4s ease';
        setTimeout(() => {
            if (banner.parentNode) {
                banner.parentNode.removeChild(banner);
            }
        }, 400);
    });
});
