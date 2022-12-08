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
  const selection = document.getElementById('dropdown').value;
  if (selection){
    const parent = 'coding_i/' + selection;
    get(child(dbRef, parent)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const table = document.createElement("table");
        const header_row = document.createElement("tr");
        const name_header = document.createElement("th");
        name_header.innerHTML = "Name";
        header_row.appendChild(name_header);
        const type_header = document.createElement("th");
        type_header.innerHTML = "Project Type";
        header_row.appendChild(type_header);
        const link_header = document.createElement("th");
        link_header.innerHTML = "Project Link";
        header_row.appendChild(link_header);
        table.appendChild(header_row);
        const keys = Object.keys(data);
        let i = 0;
        for (const item in data){
          let table_row = document.createElement("tr");
          let row_name = document.createElement("td");
          row_name.innerHTML = keys[i];
          row_name.width = "140px";
          table_row.appendChild(row_name);
          let row_type = document.createElement("td");
          row_type.innerHTML = data[item].type;
          row_type.width = "140px";
          table_row.appendChild(row_type);
          let link = document.createElement("a");
          link.innerHTML = data[item].link;
          link.href = "https://" + data[item].link;
          let row_link = document.createElement("td");
          row_link.appendChild(link);
          table_row.appendChild(row_link);
          table.appendChild(table_row);
          i++;
        }
        const div = document.getElementById("tableDiv");
        div.innerHTML = "";
        div.appendChild(table);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
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
      dropdown.appendChild(first);
      for (const item in data) {
        let option = document.createElement("option");
        option.value = data[item];
        option.innerHTML = data[item].replaceAll("_"," ");
        dropdown.appendChild(option);
      }
      document.getElementById("dropDiv").appendChild(dropdown);
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}