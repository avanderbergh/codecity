const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const instructionsApp = express();
instructionsApp.use(cors({ origin: true }));


exports.newGame = functions.https.onRequest(async (req, res) => {
    const emojis = require('./lib/emojis-list');
    const e = () => emojis[Math.floor(Math.random() * emojis.length - 1)];
    const code = `${e()}${e()}${e()}`;
    const app = (admin.apps.length === 0) ? admin.initializeApp() : admin.apps[0];
    const firestore = app.firestore();
    const doc = await firestore.collection("games").add({ code });
    res.send(JSON.stringify({ id: doc.id, code }))
    return;
});
instructionsApp.get('/', async (req, res) => {
    const app = (admin.apps.length === 0) ? admin.initializeApp() : admin.apps[0];
    const db = app.firestore();
    const result = await db.collection("instructions").doc("test").get();
    res.send(result.data());
});

instructionsApp.post('/', async (req, res) => {
    const app = (admin.apps.length === 0) ? admin.initializeApp() : admin.apps[0];
    const db = app.firestore();
    const payload = req.body;
    console.log("payload", payload);
    await db.collection("instructions").doc("object").set(payload);
    res.send("OK");
});

exports.instructions = functions.https.onRequest(instructionsApp);

