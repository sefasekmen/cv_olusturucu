// auth.js
// Firebase Auth handling (Compat API)

document.addEventListener('DOMContentLoaded', () => {
    // Check if auth is initialized
    if (!window.auth) {
        console.warn("Auth not initialized. Check firebase-config.js");
        return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const isLocalDev = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname) || searchParams.get('dev') === '1' || searchParams.get('noauth') === '1';

    // Global auth state listener
    window.auth.onAuthStateChanged(async (user) => {
        if (!user) {
            // Kullanıcı çıkış yaptı — state sıfırla
            if (window.saveManager) {
                window.saveManager.resetState();
            }

            // ROUTE GUARD: Prevent access to protected pages
            const currentPage = window.location.pathname.toLowerCase();
            if (!isLocalDev && (currentPage.includes('editor') || currentPage.includes('cvlerim'))) {
                const currentUrl = window.location.href;
                window.location.replace('auth?redirect=' + encodeURIComponent(currentUrl));
                return;
            }
        }
        const authBtn = document.getElementById('auth-btn');
        const loadCVBtn = document.getElementById('loadCVBtn');
        
        if (authBtn) {
            if (user) {
                authBtn.innerHTML = `Çıkış Yap (${user.email.split('@')[0]})`;
                authBtn.onclick = handleLogout;
                if (loadCVBtn) loadCVBtn.style.display = 'inline-flex';
            } else if (isLocalDev) {
                authBtn.innerHTML = `Yerel Test Modu`;
                authBtn.onclick = () => {};
                if (loadCVBtn) loadCVBtn.style.display = 'none';
            } else {
                authBtn.innerHTML = `Giriş Yap`;
                authBtn.onclick = () => {
                    const currentUrl = window.location.href;
                    window.location.href = 'auth?redirect=' + encodeURIComponent(currentUrl);
                };
                if (loadCVBtn) loadCVBtn.style.display = 'none';
            }
        }

        // Firebase-local sync trigger when user logs in
        if (user && window.saveManager) {
            try {
                await window.saveManager.syncWithFirebase();
            } catch (e) {
                console.warn('Sync after login failed:', e);
            }
        }
    });

    async function handleLogout() {
        try {
            // Çıkış öncesi state sıfırla
            if (window.saveManager) {
                window.saveManager.resetState();
            }
            await window.auth.signOut();
            window.location.reload();
        } catch (error) {
            console.error("Çıkış yapılırken hata:", error);
        }
    }

    // Yalnızca auth.html sayfasında çalışan form mantığı
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (isLocalDev && loginForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect');
        window.location.replace(redirectUrl || 'editor.html?dev=1');
        return;
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorDiv = document.getElementById('login-error');
            
            try {
                errorDiv.style.display = 'none';
                await window.auth.signInWithEmailAndPassword(email, password);
                
                // Smart redirect
                const urlParams = new URLSearchParams(window.location.search);
                const redirectUrl = urlParams.get('redirect');
                if (redirectUrl) {
                    window.location.replace(redirectUrl);
                } else {
                    window.location.replace('index.html');
                }
            } catch (error) {
                errorDiv.innerText = "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.";
                errorDiv.style.display = 'block';
                console.error(error);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const passwordConfirm = document.getElementById('reg-password-confirm').value;
            const errorDiv = document.getElementById('reg-error');
            
            if (password !== passwordConfirm) {
                errorDiv.innerText = "Şifreler eşleşmiyor.";
                errorDiv.style.display = 'block';
                return;
            }

            try {
                errorDiv.style.display = 'none';
                await window.auth.createUserWithEmailAndPassword(email, password);
                
                // Smart redirect
                const urlParams = new URLSearchParams(window.location.search);
                const redirectUrl = urlParams.get('redirect');
                if (redirectUrl) {
                    window.location.replace(redirectUrl);
                } else {
                    window.location.replace('index.html');
                }
            } catch (error) {
                errorDiv.innerText = "Kayıt başarısız: " + error.message;
                errorDiv.style.display = 'block';
                console.error(error);
            }
        });
    }

    // Toggle between Login and Register
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');

    if (showRegister && showLogin) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginBox.style.display = 'none';
            registerBox.style.display = 'block';
        });

        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerBox.style.display = 'none';
            loginBox.style.display = 'block';
        });
    }
});
