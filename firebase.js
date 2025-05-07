  
  
  
  
// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";  
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
  



  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  const firebaseConfig = {
    apiKey: "AIzaSyDiYUg-6H28JmlOyF5G_eOWJYDVhDopx2A",
    authDomain: "growquiz-44c97.firebaseapp.com",
    projectId: "growquiz-44c97",
    storageBucket: "growquiz-44c97.firebasestorage.app",
    messagingSenderId: "711579880325",
    appId: "1:711579880325:web:f31962f35eeaa48d4812ec",
    measurementId: "G-L32SPECMN6"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
const auth = getAuth(app);
