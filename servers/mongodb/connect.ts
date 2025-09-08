
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

// initial setup
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000' // frontend URL
}));

// sample route sanity check
app.get("/user", async (req: any, resp: any) => {
    try {
        // connects client and listens for server response
        await client.connect();
        console.log(`Request: ${req}`)
        // confirms successful connection by sending ping
        const database = client.db("NotesApp");
        console.log("You successfully connected to MongoDB!");
        
        let collection = database.collection("Users")
        
        const users = await collection.find({});

        resp.status(200).send(await users.toArray());

    } finally {
        // closes client
        await client.close();
    }
});

// API to register a user
app.post("/account_creation", async (req, resp) => {
    try {
        
        let result = req.body;
        console.log(`Request body: ${JSON.stringify(result)}`)
        // if (result) {
        //     delete result.password; // Ensure you're not sending sensitive info
        //     resp.status(201).send(result); // Send successful response
        // } else {
        //     console.log("User already registered");
        //     resp.status(400).send("User already registered");
        // }
    } catch (e) {
        resp.status(500).send({ message: "Something went wrong", error: e.message });
    }
});

// Start the server
app.listen(5000, () => {
    console.log("App is running on port 5000");
});