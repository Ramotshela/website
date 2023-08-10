import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, sendPasswordResetEmail, sendEmailVerification, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyA_ioxUQo3hZVrH-9SEaE-vBIj3kcNrw_A",
  authDomain: "project-b8cf2.firebaseapp.com",
  projectId: "project-b8cf2",
  storageBucket: "project-b8cf2.appspot.com",
  messagingSenderId: "979487784937",
  appId: "1:979487784937:web:d5bb5b6a4202ada164d578",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let loginForm = document.getElementById("login-form");
let registerForm = document.getElementById("register-form");
let resetPasswordForm = document.getElementById("reset-password-form")
function isStrongPassword(password) {
  // Check if the password meets the required criteria
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasDigit &&
    hasSpecialChar
  );
}


if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value + "@keyaka.ul.ac.za";
    const password = document.getElementById("password").value;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in user:", userCredential.user);
      // Redirect to dashboard or another page
      window.location.href = "../signin/Home.html";
    } catch (error) {
      console.error("Login error:", error.message);
      
    }
  });
} else {
  console.error("Login form not found.");
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const resetEmail = document.getElementById('reset-email').value + "@keyaka.ul.ac.za";

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      console.log("Password reset email sent.");
      alert("Password reset email sent.");
    } catch (error) {
      console.error("Password reset error:", error.message);
      
    }
  });
} else {
  console.error("Reset password form not found.");
  
}

// Register new users with the registration form:

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value + "@keyaka.ul.ac.za";
  const password = document.getElementById("password").value;
  if (!isStrongPassword(password)) {
    console.error("Password is not strong enough.");
    alert("Password is not strong enough.");
    // Display an error message to the user
    return;
  } 
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registered user:", userCredential.user);
      await sendEmailVerification(user);
      window.location.href = "../signin/Home.html";
      // Redirect to login page or dashboard
    } catch (error) {
      console.error("Registration error:", error.message);
      
    }
  
});
// Send a confirmation link when clicking on "Forgot Password" button from Login screen:
sendEmailVerification(auth.currentUser)
  .then(() => {
    // Email verification sent!
    // ...
  });