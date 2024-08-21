import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
    
};

// Firebase'i başlatın
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', (event) => {

    // Kullanıcı giriş yapıp yapmadığını kontrol eden fonksiyon
    function checkLoginStatus() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Giriş yapılmışsa, giriş yap ve kayıt ol linklerini gizle
                document.getElementById('girisYap').style.display = 'none';
                document.getElementById('kayitOl').style.display = 'none';
                
                // Post ekle, benim haritam ve çıkış yap linklerini göster
                document.getElementById('postEkle').style.display = 'inline';
                document.getElementById('benimHaritam').style.display = 'inline';
                document.getElementById('cikisYap').style.display = 'inline';
            } else {
                // Giriş yapılmamışsa, giriş yap ve kayıt ol linklerini göster
                document.getElementById('girisYap').style.display = 'inline';
                document.getElementById('kayitOl').style.display = 'inline';
                
                // Post ekle, benim haritam ve çıkış yap linklerini gizle
                document.getElementById('postEkle').style.display = 'none';
                document.getElementById('benimHaritam').style.display = 'none';
                document.getElementById('cikisYap').style.display = 'none';
            }
        });
    }


    // Sayfa yüklendiğinde giriş durumunu kontrol et
    checkLoginStatus();
});

async function checkAuth() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(true);
            } else {
                window.location.href = 'login.html';
                resolve(false);
            }
        });
    });
}

// "POST EKLE" butonuna tıklama olayını ekle
document.getElementById('addPostBtn').addEventListener('click', async (e) => {
    if (!await checkAuth()) {
        e.preventDefault();
    }
});

// "BENİM HARİTAM" butonuna tıklama olayını ekle
document.getElementById('createMapBtn').addEventListener('click', async (e) => {
    if (!await checkAuth()) {
        e.preventDefault();
    }
});