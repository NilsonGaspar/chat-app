import firebase from "firebase";

const firebaseConfig = {
 apiKey: "AIzaSyB4AvIxSVq60yO2o2pIYvVW8PAm1vxK_B8",
 authDomain: "chat-app-22910.firebaseapp.com",
 databaseURL: "https://chat-app-22910.firebaseio.com",
 projectId: "chat-app-22910",
 storageBucket: "chat-app-22910.appspot.com",
 messagingSenderId: "777656118399",
 appId: "1:777656118399:web:5ae1db8b33c46bc50e634a",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebaseApp.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export { auth, googleProvider };
export default firestore;
