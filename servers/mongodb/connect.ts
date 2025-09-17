
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
// connecting to client
import { MongoClient, ServerApiVersion } from "mongodb";

// ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(`Directory name: ${__dirname}`)
console.log(`File name: ${__filename}`)

// Load ../.env relative to this file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// importing APIs
import * as AccountApis from './APIs/account.ts';
import * as NoteApis from './APIs/notes.ts';

import express from 'express';
import cors from "cors";

let database = "NotesApp"
let collections = ['Users', 'Notes']
const app = express();
// initializing uri and database and connecting to client
const uri = process.env.MONGO_DB!
console.log("Connecting to MongoDB...")
const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

async function run() {
    try {
        // connects client and listens for server response
        await client.connect();

        // initial setup
        app.use(express.json());
        app.use(cors({
            origin: 'http://localhost:3000' // frontend URL
        }));

        // account specific APIs
        await AccountApis.getUserAccount(app, client, database, collections);
        await AccountApis.createAccount(app, client, database, collections);

        // note specific APIs
        // await NoteApis.getUserNotes(app, client, database, collections);
        await NoteApis.addNotesToAccount(app, client, database, collections);
        // await NoteApis.updateNote(app, client, database, collections);
        // await NoteApis.deleteNote(app, client, database, collections);

        // Start the server
        app.listen(5000, () => {
            console.log("App is running on port 5000");
        });

    } catch (e) {
        console.error(e);
        await client.close();
    } 
}

run()