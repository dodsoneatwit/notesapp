
async function getUserAccount(app: any, client: any, database: string, collections: string[]) {
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
}

async function createAccount(app: any, client: any, database: string, collections: string[]) {
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
    })
}

export { getUserAccount, createAccount };