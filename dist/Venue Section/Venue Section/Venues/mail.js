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

const bookedTimeSlots = {}; // Store booked time slots for each venue
const getVenues = async () => {
  const querySnapshot = await getDocs(collection(db, "venues"));

  querySnapshot.forEach((doc) => {
    const venueData = doc.data();

    const dataset = {
      "Name": venueData.Name || "",
      "Status": venueData.Status == true ? "Booked" : "Unbooked",
      "Capacity": venueData.Capacity || "",
      "Date": venueData.Date || "",
      "Time": venueData.Timeslot || "",
      "Applicant":venueData.Applicant ||"",
    };

    dataArray.push(dataset);
  });

  createTableFromObjects(dataArray);
};
const unbookVenue = async (venue) => {
  const venueRef = doc(venuesCollectionRef, venue.id);

  try {
    await updateDoc(venueRef, {
      Status: false,
      Timeslot: null,
      Date: null,
    }); // Update the "Status", "Timeslot", and "Date" fields
    statusMessage.textContent = "Venue unbooked successfully!";
    statusMessage.style.color = "green";

    // Refresh the venue list after unbooking
    dataArray.length = 0;
    getVenues();
  } catch (error) {
    statusMessage.textContent = "Error unbooking venue.";
    statusMessage.style.color = "red";
    console.error("Error unbooking venue:", error);
  }
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
  const unbookHeaderCell = headerRow.insertCell();
  unbookHeaderCell.textContent = "Unbook";
  // Populate table with data
  for (const obj of data) {
    const row = table.insertRow();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const cell = row.insertCell();
        cell.textContent = obj[key];

        if (obj.Status === "Booked") {
         //const unbookCell = row.insertCell();
         //const unbookButton = document.createElement("button");
         //unbookButton.textContent = "Unbook";
         //unbookButton.addEventListener("click", () => unbookVenue(obj)); // Attach unbook event listener
        //unbookCell.appendChild(unbookButton);
          //unbookButton.addEventListener("click", () => unbookVenue(obj));
        }
      }
    }
  }
    const tableContainer = document.getElementById("table-container");
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
  };

  getVenues();



  // Booking venues
  const venueForm = document.getElementById("booking-form");
  const statusMessage = document.getElementById("status-message");

  const venuesCollectionRef = collection(db, "venues");

  // Function to handle venue booking
  const bookVenue = async (venueId, timeslot, date,email) => {
    const venueRef = doc(venuesCollectionRef, venueId);
  
    try {
      if (!bookedTimeSlots[venueId]) {
        bookedTimeSlots[venueId] = [];
      }
      await updateDoc(venueRef, {
        Status: true,
        Timeslot: timeslot,
        Date: date,
        Applicant:email,
      }); // Update the "Status" field
      statusMessage.textContent = "Venue booked successfully!";
      statusMessage.style.color = "green";

      // Refresh the venue list after booking
      dataArray.length = 0;
      getVenues();
    } catch (error) {
      statusMessage.textContent = "Error booking venue.";
      statusMessage.style.color = "red";
      console.error("Error booking venue:", error);
    }
  };

  venueForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const venueId = venueForm.venue.value;
    const timeslot = venueForm.timeslot.value; // Capture timeslot value
    const date = venueForm.date.value; 
    const email=venueForm.email.value// Capture date value
    if (date.trim() === "" || timeslot.trim() === "") {
      statusMessage.textContent = "Please provide both date and time.";
      statusMessage.style.color = "red";
      return; // Exit the function if missing
    }
    await bookVenue(venueId, timeslot, date,email);
    createTableFromObjects([
      {
        "Venue": venueId,
        "Timeslot": timeslot,
        "Date": date,
        "Applicant":email,
      }
    ]);
  });

  // Load venues for booking dropdown
  const loadVenuesForBooking = async () => {
    const querySnapshot = await getDocs(venuesCollectionRef);
    const venueSelect = document.getElementById("venue");

    querySnapshot.forEach((doc) => {
      const venueData = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = `${venueData.Name} (Capacity: ${venueData.Capacity})`;
      venueSelect.appendChild(option);
    });
  };

  loadVenuesForBooking();
  const searchInput = document.getElementById("search-input");

  // Function to filter venues based on search query
  const filterVenues = (venues, query) => {
    return venues.filter((venue) =>
      venue.Name.toLowerCase().includes(query.toLowerCase())
    );
  };

  searchInput.addEventListener("input", () => {
    const searchQuery = searchInput.value;
    const filteredBookedVenues = filterVenues(bookVenue, searchQuery);
    const filteredAvailableVenues = filterVenues(availableVenues, searchQuery);
    displayVenues(filteredBookedVenues, filteredAvailableVenues);
  });
  // Function to periodically check and update booking statuses
  const updateBookingStatuses = async () => {
    
    const querySnapshot = await getDocs(collection(db, "venues"));
    const currentTime = new Date();
  
    querySnapshot.forEach(async (doc) => {
      const venueData = doc.data();
  
      if (venueData.Status === true) {
        const bookingTime = new Date(venueData.Date + 'T' + venueData.Timeslot);
  
        if (currentTime > bookingTime) {
          // Update the status to "Unbooked" and clear date and time
          const venueRef = doc(venuesCollectionRef, doc.id);
          await updateDoc(venueRef, {
            Status: false,
            Timeslot: null,
            Date: null,
          });
        }
      }
    });
  
    // Refresh the venue list after updating statuses
    dataArray.length = 0;
    getVenues();
  };
  
  
      
    // Call the function immediately
    updateBookingStatuses();
  
    // Call the updateBookingStatuses function every minute (adjust the interval as needed)
    setInterval(updateBookingStatuses, 60000); // Every minute
  

  
