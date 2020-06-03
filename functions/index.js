const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const apiV1 = express();
apiV1.use(cors({ origin: true }));


apiV1.post('/game', async (req, res) => {
    const payload = req.body;
    let id, gameDoc;
    let tries = 0;
    do {
        id = generateCode(6);
        gameDoc = await db().collection("games").doc(id).get();
        if (++tries > 5) {
            res.send(500, "Could not create game after 5 tries");
            return;
        }
    } while (gameDoc.exists);
    const doc = await db().collection("games").doc(id).set({ id, ...payload });
    console.log('doc', doc.id);
    res.send({ id });
});

apiV1.post('/game/:id/select', async (req, res) => {
    await db().collection("games").doc(req.params.id).update ({selected: req.body})
});

apiV1.get('/game/:id', async (req, res) => {
    const game = await db().collection("games").doc(req.params.id).get();
    if (!game.exists) {
        res.send(404, "Game not found");
        return;
    }
    res.send(game.data());
});

apiV1.get('/game/:id/instructions', async (req, res) => {
    const result = await db().collection("games").doc(req.params.id).get();
    const game = result.data()
    res.send(game.instructions);
});

const generateCode = length => Math.random().toString(36).substr(2, length);
const app = () => (admin.apps.length === 0) ? admin.initializeApp() : admin.apps[0];
const db = () => app().firestore();

exports.v1 = functions.https.onRequest(apiV1);

