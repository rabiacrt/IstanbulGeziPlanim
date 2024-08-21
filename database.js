import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"; 

const firebaseConfig = {
   
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const registerButton = document.getElementById('registerButton');
registerButton.addEventListener("click", function(event){
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      
      const user = userCredential.user;
      alert("Başarıyla kayıt oldunuz!");
      window.location.href = "/pages/login.html";
     
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/email-already-in-use') {
        alert("Bu e-posta adresi zaten kullanımda. Lütfen başka bir e-posta adresi deneyin.");
    } else {
        alert(errorMessage);
    }
    });
});
