import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getDatabase, ref, child, get } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  databaseURL: "https://student-projects-48fc1-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const dbRef = ref(database);

loadDropdown('years');

function createTable(){
  const parent = 'coding_i/' + document.getElementById('dropdown').value;
  get(child(dbRef, parent)).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}

function loadDropdown(course){
  get(child(dbRef, course)).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const dropdown = document.createElement("select");
      dropdown.id = "dropdown";
      dropdown.addEventListener("change", createTable);
      const first = document.createElement("option");
      first.value = "";
      first.innerHTML = "--Please choose an option--";
      dropdown.append(first);
      for (const item in data) {
        let option = document.createElement("option");
        option.value = data[item];
        option.innerHTML = data[item];
        dropdown.append(option);
      }
      document.getElementById("dropDiv").appendChild(dropdown);
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}