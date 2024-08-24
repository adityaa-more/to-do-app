const firebaseConfig = {
  apiKey: "AIzaSyBW1TmnmQs3p-8HsvJ_O880lYjrIOXyZIg",
  authDomain: "to-do-live-b36eb.firebaseapp.com",
  projectId: "to-do-live-b36eb",
  storageBucket: "to-do-live-b36eb.appspot.com",
  messagingSenderId: "267270795931",
  appId: "1:267270795931:web:072a3904408ba330094c3e",
  measurementId: "G-VHWJ4QB1W7",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();
