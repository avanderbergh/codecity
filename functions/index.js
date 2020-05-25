const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const apiV1 = express();
apiV1.use(cors({ origin: true }));


apiV1.post('/game', async (req, res) => {
    const payload = req.body;
    const code = generateCode(6);
    const doc = await db().collection("games").add({ ...payload, code });
    console.log('doc', doc.id);
    res.send({ id: doc.id, code });
});

apiV1.get('/game/:code', async (req, res) => {
    const games = await db().collection("games").where("code", "==", req.params.code).get();
    if (games.empty) {
        res.send(404, "No games found!");
        return;
    }
    const game = { id: games.docs[0].id, ...games.docs[0].data() }
    res.send(game);
});

apiV1.get('/game/:gameId/instructions', async (req, res) => {
    const result = await db().collection("games").doc(req.params.gameId).get();
    const game = result.data()
    res.send(game.instructions);
});

apiV1.post('/game/:gameId/instructions', async (req, res) => {
    const payload = req.body;
    console.log("payload", payload);
    await db().collection("games").doc(req.params.gameId).update({ instructions: payload });
    res.send("OK");
});

const generateCode = length => Math.random().toString(36).substr(2, length);
const app = () => (admin.apps.length === 0) ? admin.initializeApp() : admin.apps[0];
const db = () => app().firestore();

exports.v1 = functions.https.onRequest(apiV1);

