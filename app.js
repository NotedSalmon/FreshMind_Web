import firebase from "firebase/compat/app";
import "firebase/firestore";
import "firebase/compat/auth";


const firebaseConfig = {
  apiKey: "AIzaSyB62W0YNT2F-b4sL35uql0Y3WbFAeIMb_c",
  authDomain: "freshmind-fa1cc.firebaseapp.com",
  projectId: "freshmind-fa1cc",
  storageBucket: "freshmind-fa1cc.appspot.com",
  messagingSenderId: "506217254250",
  appId: "1:506217254250:web:617f9d9bbf83374405a913",
  measurementId: "G-TM6QC7T1X1"
};


firebase.initializeApp(firebaseConfig);


// Firestore
const db = firebase.firestore();
const auth = firebase.auth();


// Login function
function login() {
    console.log("Login button clicked"); // Check if the function is being called
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            document.getElementById('user-email').innerText = user.email;
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('data-container').style.display = 'block';
            fetchData(user.uid);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);

            // Display error message on the screen
            document.getElementById('error-message').innerText = errorMessage;
        });
}



// Logout function
function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('data-container').style.display = 'none';
  }).catch((error) => {
    // An error happened.
    console.error(error);
  });
}

// Fetch user's data from Firestore
function fetchData() {
  const dataList = document.getElementById('data-list');

  db.collection('feedback').get() // Retrieve all documents in the "feedback" collection
      .then((querySnapshot) => {
        dataList.innerHTML = ''; // Clear previous data
        querySnapshot.forEach((doc) => { // Iterate over each document in the query snapshot
          const userData = doc.data();
          for (const key in userData) {
            if (userData.hasOwnProperty(key)) {
              const li = document.createElement('li');
              li.textContent = `${key}: ${userData[key]}`;
              dataList.appendChild(li);
            }
          }
        });
      })
      .catch((error) => {
        console.error('Error getting documents:', error);
      });
}

