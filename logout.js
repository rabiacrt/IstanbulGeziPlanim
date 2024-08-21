import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth,  signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
    
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function() {
    const logoutButton = document.getElementById('cikisYap');

    if (logoutButton) {
        logoutButton.addEventListener("click", function(event) {
            event.preventDefault();
            signOut(auth)
                .then(() => {
                    alert("Başarıyla çıkış yapıldı.");
                    window.location.href = "/index.html";
                })
                .catch((error) => {
                    alert("Çıkış yaparken bir hata oluştu: " + error.message);
                });
        });
    }
});