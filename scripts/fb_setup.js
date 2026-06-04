const firebaseConfig = {
  apiKey: "AIzaSyAboa585vFNBApD40DNOiPatFOwumthHD4",
  authDomain: "comp-5e4a5.firebaseapp.com",
  databaseURL: "https://comp-5e4a5-default-rtdb.firebaseio.com",
  projectId: "comp-5e4a5",
  storageBucket: "comp-5e4a5.firebasestorage.app",
  messagingSenderId: "54958349244",
  appId: "1:54958349244:web:e9365af72e18efb8e929b9"
};

firebase.initializeApp(firebaseConfig);

function firebaseRead(ref, func)
{
  firebase.database().ref(ref).once('value', func);
}

function firebaseWrite(ref, write)
{
  firebase.database().ref(ref).update(write);
}

function firebaseRef(ref)
{
  return firebase.database().ref(ref);
}