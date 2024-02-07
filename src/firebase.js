import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDjssWAARc2Q-3vmlaWeJVjrFMOerlLVKI",
    authDomain: "weatherapp-8287e.firebaseapp.com",
    projectId: "weatherapp-8287e",
    storageBucket: "weatherapp-8287e.appspot.com",
    messagingSenderId: "204825026697",
    appId: "1:204825026697:web:98129a0cca35f48ff76658",
    measurementId: "G-MFT8MHP17R"
  };
  

  const app = initializeApp(firebaseConfig);

  // Get instances of Auth and Database services
  const auth = getAuth(app);
  const database = getDatabase(app);
  
  export { auth, database };
  
