// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore
const db = firebase.firestore();

// Login function
function login() {
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
function fetchData(userId) {
  const dataList = document.getElementById('data-list');
  
  db.collection('users').doc(userId).get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        dataList.innerHTML = '';
        for (const key in userData) {
          if (userData.hasOwnProperty(key)) {
            const li = document.createElement('li');
            li.textContent = `${key}: ${userData[key]}`;
            dataList.appendChild(li);
          }
        }
      } else {
        console.log('No such document!');
      }
    })
    .catch((error) => {
      console.error('Error getting document:', error);
    });
}
