import { writable, readable } from "svelte/store";
import { firestore } from "../lib/firebase"

function createGameStore() {
    const { subscribe, set } = writable({});

    return {
        subscribe,
        init: function (code) {
            return new Promise((resolve, reject) => {
                console.log("this", this);
                if (typeof code != "string") reject("Code must be of type String");
                this.code = code;
                this.loading = writable(false);
                this.error = writable(null);
                this._doc = firestore.collection("games").doc(code);
                this.loading.set(true);
                this._doc.onSnapshot(doc => {
                    console.log("doc", doc);
                    console.log("setting", doc.data())
                    this.id = doc.id;
                    set({ id: doc.id, ...doc.data() });
                    this.loading.set(false);
                    resolve();
                }, err => {
                    console.error(err);
                    this.loading.set(false);
                    this.error.set(err);
                    reject()
                });
            })
        },
        setInstructions: async function (code, instructions) {
            console.log("code", code);
            await this._doc.update({
                instructions,
                "selected.currentCode": code
            });
        }
    }
}

export const game = createGameStore();