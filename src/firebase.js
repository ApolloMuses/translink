import firebase from 'firebase';

  // Initialize Firebase
var config = {
    apiKey: "YOUR_____API____KEY____HERE",
    authDomain: "translink-79b18.firebaseapp.com",
    databaseURL: "https://translink-79b18.firebaseio.com",
    projectId: "translink-79b18",
    storageBucket: "translink-79b18.appspot.com",
    messagingSenderId: "377560734683"
};

const fire = firebase.initializeApp(config);

export default fire;
