import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  // 🔴 YOUR FIREBASE CONFIG
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
