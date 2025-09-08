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

// initializing uri and database and connecting to client
const uri = process.env.MONGO_DB!
console.log("Connecting to MongoDB...")
console.log(`URI: ${uri}`)
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

    // confirms successful connection by sending ping
    const database = client.db("NotesApp");
    console.log("You successfully connected to MongoDB!");
    
    const collections = await database.listCollections().toArray();
    collections.forEach((col: any) => console.log(col.name));
    // console.log(recipe)

  } finally {
    // closes client
    await client.close();
  }
}

run();
