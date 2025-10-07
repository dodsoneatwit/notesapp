
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
// connecting to MongoDB client
import { MongoClient, ServerApiVersion } from "mongodb";

// Anthropic Claude AI
import Anthropic from '@anthropic-ai/sdk';

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
import * as SpacesApis from './APIs/spaces.ts'
import * as AiApis from './APIs/ai_claude.ts'

import express from 'express';
import cors from "cors";

let database = "NotesApp"
let collections = ['Users', 'Notes', 'Spaces']

// initializing Express.js app
const app = express();
const host = process.env.WEB_HOST

// initializing MongoDB uri, claude API, and database and connecting to client
const uri = process.env.MONGO_DB!

// Anthropic model essentials
const model = "claude-3-5-haiku-20241022"
const claude_api_key = process.env.CLAUDE_AI!
const prompt = process.env.MODEL_PROMPT!

const anthropic = new Anthropic({
  apiKey: claude_api_key,
});

console.log("Connecting to MongoDB...")
const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

/**
 * running server host
 */
async function run() {
    try {
        // connects client and listens for server response
        await client.connect();

        // initial setup
        app.use(express.json());
        app.use(cors({
            origin: host // frontend URL
        }));

        // account specific APIs
        await AccountApis.getUserAccount(app, client, database, collections);
        await AccountApis.createAccount(app, client, database, collections);

        // note specific APIs
        await NoteApis.addNotesToAccountSpaces(app, client, database, collections);
        await NoteApis.getAccountSpaces(app, client, database, collections);

        // space specific APIs
        await SpacesApis.updateSpaces(app, client, database, collections)

        // ai specific APIs
        await AiApis.promptClaudeAi(app, anthropic, model, prompt)
        
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