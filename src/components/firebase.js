import firebase from 'firebase';
import 'firebase/storage';

const config =  {
    apiKey: "AIzaSyDPQxxuGEiAlRG6c-1rIb9G12tlamQy728",
    authDomain: "touchless-menu.firebaseapp.com",
    databaseURL: "https://touchless-menu.firebaseio.com",
    projectId: "touchless-menu",
    storageBucket: "touchless-menu.appspot.com",
    messagingSenderId: "184036300157",
    appId: "1:184036300157:web:fe83b24990c96802df2814",
    measurementId: "G-GJM70HV73W"
  };

  const fire = firebase.initializeApp(config);
  const storage = firebase.storage();

  export {storage,fire as default};