import { db } from "./firebase.js";
import { collection, onSnapshot } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* MAIN MAP */
const map = L.map('map').setView([21.25, 81.63], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  .addTo(map);

const photoList = document.getElementById("photoList");

onSnapshot(collection(db, "cow_reports"), snapshot => {
  snapshot.forEach(doc => {
    const data = doc.data();

    L.marker([data.lat, data.lng])
      .addTo(map)
      .bindPopup(`<b>${data.note}</b>`);

    const card = document.createElement("div");
    card.className = "photo-card";
    card.innerHTML = `
      <img src="${data.photoURL}">
      <p>${data.note}</p>
    `;
    photoList.appendChild(card);
  });
});

/* SEVA MAP */
const sevaMap = L.map('sevaMap').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  .addTo(sevaMap);
