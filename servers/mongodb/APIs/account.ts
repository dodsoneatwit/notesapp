/**
 * retrieves user account information from MongoDB database
 * @param app - express.js app
 * @param client - MongoDB client
 * @param database - database coontaining collections
 * @param collections - array of collections in database
 */
async function getUserAccount(app: any, client: any, database: string, collections: string[]) {
    // user account retrieval API
    app.get("/user", async (req: any, resp: any) => {
        try {
            console.log(`Request: ${req}`)

            // confirms succesful MongoDB connection with log
            const db = client.db(database);
            console.log("Successful MongoDB connection...");
            
            // retrieves all users in Users collection and sends as response
            let collection = db.collection(collections[0])
            const users = await collection.find({});
            resp.status(200).send(await users.toArray());

        } catch (e) {
            resp.status(500).send({ message: "Something went wrong", error: e.message });
        }
    });    
}

/**
 * creates a new user account in MongoDB that does not already exist
 * @param app - express.js app
 * @param client - MongoDB client
 * @param database - database coontaining collections
 * @param collections - array of collections in database
 */
async function createAccount(app: any, client: any, database: string, collections: string[]) {
    // API to register a user
    app.post("/account_creation", async (req, resp) => {
        try {
            
            let result = req.body;
            console.log(`Request body: ${JSON.stringify(result)}`)

            // confirms succesful MongoDB connection with log
            const db = client.db(database);
            console.log("Successful MongoDB connection...");

            // checks if user already exists within User collection
            let collection = db.collection(collections[0])
            let existingUser = await collection.findOne({ email: result.email, password: result.password });
            console.log(`Existing user: ${existingUser}`)

            // if user not found, insert new user into collection
            if (existingUser === null) {
                // inserting account information into Users collection
                const insertion_account = await collection.insertOne(result);

                // retrieving Notes collection and initializing document for new user
                let notes_collection = db.collection("Spaces")
                const insertion_spaces = await notes_collection.insertOne(
                    {
                        credentials: {
                            username: result.username,
                            password: result.password
                        },
                        spaces: {}
                    }
                );
                console.log(`User insertion result: ${insertion_account}`)
                console.log(`Spaces insertion result: ${insertion_spaces}`)
            }
            return existingUser ? resp.status(201).send("User account already registered") : resp.status(201).send("User account registered successfully");
            
        } catch (e) {
            resp.status(500).send({ message: "Something went wrong", error: e.message });
        }
    })
}

export { getUserAccount, createAccount };