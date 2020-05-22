import firebase from 'firebase/app';
import 'firebase/firebase-firestore'
import 'firebase/firebase-auth'
import 'firebase/functions';

import { firebaseConfig } from "../config/firebase"

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const firestore = app.firestore();
const functions = app.functions();

export { app, auth, firestore, functions }