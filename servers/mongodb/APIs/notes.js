
/**
 * appends notes from current user to their account storage in MongoDB
 * @param app - express.js app
 * @param client - MongoDB client
 * @param database - database coontaining collections
 * @param collections - array of collections in database
 */
async function addNotesToAccountSpaces(app, client, database, collections) {
    // API to add ntoes to user's account
    app.post("/add_notes_spaces", async (req, resp) => {
        try {
            
            let result = req.body;
            console.log(`Request body: ${JSON.stringify(result)}`)

            // confirms succesful MongoDB connection with log
            const db = client.db(database);
            console.log("Successful MongoDB connection...");

            // retrieves user credentials and notes from MongoDB database
            let collection = db.collection("Spaces")
            let user = await collection.findOne({credentials: { username: result.username, password: result.password }});

            // logs user credentials and notes to console
            console.log(`Existing user: ${user}`)
            let curr_notes = result.Notes

            // replaces new notes to a space
            const update_result = await collection.updateOne(
                { 
                    "credentials.username": result.username,
                    "credentials.password": result.password,
                    "spaces.name": result.spname
                },
                { $set: { "spaces.$.notes": curr_notes}}
            );

            console.log(`Update result: ${update_result}`)
            resp.status(201).send("Notes added/updated successfully");
            
        } catch (e) {
            resp.status(500).send({ message: "Something went wrong when adding notes...", error: e.message });
        }
    })
}

/**
 * initializes notes from user's account in MongoDB into app
 * @param app - express.js app
 * @param client - MongoDB client
 * @param database - database coontaining collections
 * @param collections - array of collections in database 
 */
async function getAccountSpaces(app, client, database, collections) {

    app.get("/get_spaces", async (req, resp) => {
        try {
            console.log(`Request: ${req}`)
            console.log(`Request body: ${JSON.stringify(req.body)}`)

            // confirms succesful MongoDB connection with log
            const db = client.db(database);
            console.log("Successful MongoDB connection...");

            // retrieves user credentials and notes from MongoDB database
            const collection = db.collection("Spaces")
            let spaces_credentials = await collection.find({}).toArray();

            console.log(`Spaces credentials: ${spaces_credentials}`)
            
            resp.status(200).send(spaces_credentials);

        } catch (e) {
            resp.status(500).send({ message: "Something went wrong when initializing notes...", error: e.message });
        }
    })
}

export { getAccountSpaces, addNotesToAccountSpaces }