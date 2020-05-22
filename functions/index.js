const functions = require('firebase-functions');
const admin = require('firebase-admin');


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
