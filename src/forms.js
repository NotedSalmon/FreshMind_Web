import { initializeApp
} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';

import { getAuth,
    signInWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';

import {
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    doc, updateDoc
} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

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
            loginErrorMsg.hidden
        })
        .catch((error) => {
            loginErrorMsg.style.opacity = 1;
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error`);
        });
});

function createRow(userData, docId) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${userData.username}</td>
        <td>${userData.feedback}</td>
        <td>${userData.date}</td>
        <td><input type="checkbox" class="complete-checkbox" data-doc-id="${docId}" ${userData.completed ? 'checked' : ''}></td>
        <td><button class="delete-button" data-doc-id="${docId}">Delete</button></td>
    `;
    return row;
}

function handleTaskCompletionChange(event) {
    const checkbox = event.target;
    const docId = checkbox.getAttribute('data-doc-id');
    const completed = checkbox.checked; // Get the checked state of the checkbox
    updateTaskCompletionStatus(docId, completed);
}

function addCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.complete-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleTaskCompletionChange);
    });
}

function updateTaskCompletionStatus(docId, completed) {
    const taskRef = doc(db, 'feedback', docId);
    updateDoc(taskRef, {
        completed: completed // Update the completed field based on checkbox state
    })
        .then(() => {
            console.log('Task completion status updated in Firestore');
        })
        .catch((error) => {
            console.error('Error updating task completion status:', error);
        });
}

// Function to add event listeners to all delete buttons
function addDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const docId = button.getAttribute('data-doc-id');
            deleteItem(docId);
        });
    });
}

// Function to delete an item from the table and Firestore
async function deleteItem(docId) {
    try {
        await deleteDoc(doc(db, 'feedback', docId));
        const rowToDelete = document.querySelector(`[data-doc-id="${docId}"]`).closest('tr');
        rowToDelete.remove();
    } catch (error) {
        console.error('Error deleting document: ', error);
    }
}

async function fetchData() {
    const dataList = document.getElementById('data-list');
    const querySnapshot = await getDocs(collection(db, 'feedback'));
    dataList.innerHTML = '';
    querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const row = createRow(userData, doc.id);
        dataList.appendChild(row);
    });
    addDeleteButtonListeners(); // Add event listeners after fetching data
    addCheckboxListeners(); // Add event listeners for task completion
}

logoutButton.addEventListener("click", (e) => {
    e.preventDefault()
    signOut(auth).then(() => {
        document.getElementById('data-container').style.display = 'none';
        clearFields();
    }).catch((error) => {
        // An error happened.
        console.error(error);
    });
})
