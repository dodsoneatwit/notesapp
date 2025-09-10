
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

import mongoose from 'mongoose';
import express from 'express';
import cors from "cors";

let database = "NotesApp"
let collections = ['Users', 'Notes']
const app = express();
// initializing uri and database and connecting to client
const uri = process.env.MONGO_DB!
console.log("Connecting to MongoDB...")
// console.log(`URI: ${uri}`)
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

        // user account retrieval API
        app.get("/user", async (req: any, resp: any) => {
            try {
                console.log(`Request: ${req}`)
                // confirms successful connection by sending ping
                const db = client.db(database);
                console.log("Successful MongoDB connection...");
                
                let collection = db.collection(collections[0])
                
                const users = await collection.find({});

                resp.status(200).send(await users.toArray());

            } catch (e) {
                resp.status(500).send({ message: "Something went wrong", error: e.message });
            }
        });

        // API to register a user
        app.post("/account_creation", async (req, resp) => {
            try {
                
                let result = req.body;
                console.log(`Request body: ${JSON.stringify(result)}`)

                await client.connect();
                const db = client.db(database);
                console.log("Successful MongoDB connection...");

                let collection = db.collection(collections[0])
                // await collection.insertOne(result);

                resp.status(201).send("User registered successfully");
                let existingUser = await collection.findOne({ email: result.email, password: result.password });

                console.log(`Existing user: ${existingUser}`)

                if (existingUser === null) {
                    const insertion = await collection.insertOne(result);
                    console.log(`Insertion result: ${insertion}`)
                }
                
            } catch (e) {
                resp.status(500).send({ message: "Something went wrong", error: e.message });
            }
        });

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