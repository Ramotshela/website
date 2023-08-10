import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA_ioxUQo3hZVrH-9SEaE-vBIj3kcNrw_A",
    authDomain: "project-b8cf2.firebaseapp.com",
    projectId: "project-b8cf2",
    storageBucket: "project-b8cf2.appspot.com",
    messagingSenderId: "979487784937",
    appId: "1:979487784937:web:d5bb5b6a4202ada164d578",
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



const dataArray = [];


const getBookedVenues = async () => {
    const querySnapshot = await getDocs(collection(db, "venues"));
   dataArray.length = 0; // Clear existing data
  
    querySnapshot.forEach((doc) => {
      const venueData = doc.data();
  
      if (venueData.Status === false) {
        const dataset = {
          "Name": venueData.Name || "",
          "Status": "Unbooked",
          "Capacity": venueData.Capacity || "",
        };
  
        dataArray.push(dataset);
      }
    });
  
    createTableFromObjects(dataArray);
  };
  const createTableFromObjects = (data) => {
    const table = document.createElement("table");
  
    const headerRow = table.insertRow();
    for (const key in data[0]) {
      if (data[0].hasOwnProperty(key)) {
        const headerCell = headerRow.insertCell();
        headerCell.textContent = key;
      }
    }
  
    // Populate table with data
    for (const obj of data) {
      const row = table.insertRow();
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const cell = row.insertCell();
          cell.textContent = obj[key];
        }
      }
    }
    const tableContainer = document.getElementById("table-container");
    tableContainer.appendChild(table);
  };
  
  
  getBookedVenues();