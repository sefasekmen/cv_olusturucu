// firebase-config.js
// Firebase Web Compat SDK configuration

const firebaseConfig = {
  apiKey: "AIzaSyCciI7" + "tOgGsxyAMkPyGloSoppwfauFxhH4",
  authDomain: "onlinecvolusturucu.firebaseapp.com",
  projectId: "onlinecvolusturucu",
  storageBucket: "onlinecvolusturucu.firebasestorage.app",
  messagingSenderId: "244006423859",
  appId: "1:244006423859:web:e2c36cd5daaf6770508246",
  measurementId: "G-WY9LPFKC7T"
};

// Global variables for non-module scripts
window.auth = null;
window.db = null;

try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        window.auth = firebase.auth();
        window.db = firebase.firestore();

        // Firestore Offline Persistence — localStorage yerine IndexedDB cache
        // Bu sayede internet kesintisinde bile veriler erişilebilir kalır
        window.db.enablePersistence({ synchronizeTabs: true })
            .then(() => console.log("Firestore offline persistence aktif."))
            .catch((err) => {
                if (err.code === 'failed-precondition') {
                    console.warn("Offline persistence: Birden fazla sekme açık, sadece birinde aktif.");
                } else if (err.code === 'unimplemented') {
                    console.warn("Offline persistence: Bu tarayıcı desteklemiyor.");
                }
            });

        console.log("Firebase initialized successfully (Compat).");
    } else {
        console.warn("Firebase SDK not loaded yet.");
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
}
