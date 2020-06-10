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
    await db().collection("games").doc(req.params.id).update({ selected: req.body })
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

apiV1.post('/game/:id/html', async (req, res) => {
    const id = req.param.id;
    const puppeteer = require("puppeteer");
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        headless: true,
        defaultViewport: null
    });
    console.log("browser launched");
    const page = await browser.newPage();
    console.log("new page...");
    page.setViewport({
        width: 900,
        height: 600,
        deviceScaleFactor: 1
    });
    console.log("setting content", req.body.html);
    await page.setContent(req.body.html, {
        waitUntil: "networkidle2"
    });

    const screenshot = await page.screenshot();
    const fs = require('fs');
    const os = require('os');
    const PNG = require('pngjs').PNG;
    const pixelmatch = require('pixelmatch');
    const streamifier = require('streamifier');
    const tmpDir = os.tmpdir() + '/images';
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }
    const compareScreenshots = (currentImgPath, screenshotBuffer) => {
        return new Promise((resolve) => {
            const img1 = streamifier.createReadStream(screenshotBuffer).on('error', fileError).pipe(new PNG()).on('parsed', doneReading);
            const img2 = fs.createReadStream(currentImgPath).on('error', fileError).pipe(new PNG()).on('parsed', doneReading);

            let filesRead = 0;
            console.log("comparing...")

            function doneReading() {
                // Wait until both files are read.
                console.log("files read", filesRead)
                if (++filesRead < 2) return;

                // Do the visual diff.
                const diff = new PNG({ width: img1.width, height: img2.height });
                const numDiffPixels = pixelmatch(
                    img1.data, img2.data, diff.data, img1.width, img1.height,
                    { threshold: 0.1 }
                );
                console.log('no. us pixels off ', numDiffPixels);
                // fs.writeFileSync('diff.png', diff.data);
                // res.set('Content-Type', 'image/png');
                // const img = diff.pack();
                res.send({ numDiffPixels })
            }

            function fileError(error) {
                console.log("sdasa")
                if (error.code === 'ENOENT') {
                    //no such file, so just create one from buffer
                    streamifier.createReadStream(screenshotBuffer).pipe(fs.createWriteStream(currentImgPath));
                    console.log('New file:', currentImgPath);
                    numberOfChanges++;
                    resolve();
                }
            }
        });
    };
    await compareScreenshots('response.png', screenshot);
});

const generateCode = length => Math.random().toString(36).substr(2, length);
const app = () => (admin.apps.length === 0) ? admin.initializeApp() : admin.apps[0];
const db = () => app().firestore();

exports.v1 = functions.https.onRequest(apiV1);

