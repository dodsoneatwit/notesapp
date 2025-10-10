/**
 * appends spaces from current user to their account storage in MongoDB
 * @param app - express.js app
 * @param client - MongoDB client
 * @param database - database coontaining collections
 * @param collections - array of collections in database
 */
async function updateSpaces(app, client, database, collections) {
    // API to add ntoes to user's account
    app.post("/update_spaces", async (req, resp) => {
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
            console.log(`Existing user: ${JSON.stringify(user)}`)

            // replaces new notes to a space
            const update_result = await collection.updateOne(
                { 
                    "credentials.username": result.username,
                    "credentials.password": result.password
                },
                { $set: { spaces: result.Spaces } }

            );

            console.log(`Update result: ${JSON.stringify(update_result)}`)
            resp.status(201).send("Spaces added/updated successfully");
            
        } catch (e) {
            resp.status(500).send({ message: "Something went wrong when updating spaces...", error: e.message });
        }
    })
}

export { updateSpaces }