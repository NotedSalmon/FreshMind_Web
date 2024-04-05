import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

const firebaseConfig = ({
    apiKey: "AIzaSyB62W0YNT2F-b4sL35uql0Y3WbFAeIMb_c",
    authDomain: "freshmind-fa1cc.firebaseapp.com",
    projectId: "freshmind-fa1cc",
    storageBucket: "freshmind-fa1cc.appspot.com",
    messagingSenderId: "506217254250",
    appId: "1:506217254250:web:617f9d9bbf83374405a913",
    measurementId: "G-TM6QC7T1X1"
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");
const dataContainer = document.getElementById("data-container");
const logoutButton = document.getElementById("logout-button");
function clearFields() {
    loginForm.email.value = "";
    loginForm.password.value = "";
}
loginButton.addEventListener("click", (e) => {
    e.preventDefault()
    console.log("Login button clicked"); // Check if the function is being called
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(`${user} Has logged in`);
            dataContainer.style.display = "block";
            fetchData();
            clearFields();
        })
        .catch((error) => {
            loginErrorMsg.style.opacity = 1;
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error`);
        });
});

async function fetchData() {
    const dataList = document.getElementById('data-list');
    const querySnapshot = await getDocs(collection(db, 'feedback'));
    dataList.innerHTML = '';
    querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `<td>${userData.username}</td><td>${userData.feedback}</td><td>${userData.date}</td>`;
        dataList.appendChild(row);
    })
}

logoutButton.addEventListener("click", (e) => {
    e.preventDefault()
    signOut(auth).then(() => {
        // Sign-out successful.
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('data-container').style.display = 'none';
        clearFields();
    }).catch((error) => {
        // An error happened.
        console.error(error);
    });
})
