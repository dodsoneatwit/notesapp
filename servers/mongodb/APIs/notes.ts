
/**
 * appends notes from current user to their account storage in MongoDB
 * @param app - express.js app
 * @param client - MongoDB client
 * @param database - database coontaining collections
 * @param collections - array of collections in database
 */
async function addNotesToAccount(app: any, client: any, database: string, collections: string[]) {
    // API to add ntoes to user's account
    app.post("/add_notes", async (req, resp) => {
        try {
            
            let result = req.body;
            console.log(`Request body: ${JSON.stringify(result)}`)

            // confirms succesful MongoDB connection with log
            const db = client.db(database);
            console.log("Successful MongoDB connection...");

            // retrieves user credentials and notes from MongoDB database
            let collection = db.collection(collections[1])
            let user = await collection.findOne({credentials: { username: result.username, password: result.password }});

            // logs user credentials and notes to console
            console.log(`Existing user: ${user}`)
            let curr_notes = result.Notes

            // replaces new notes with old notes
            const update_result = await collection.updateOne(
                { credentials: { username: result.username, password: result.password } },
                { $set: { notes: curr_notes } }
            );

            console.log(`Update result: ${update_result}`)
            resp.status(201).send("Notes added/updated successfully");
            
        } catch (e) {
            resp.status(500).send({ message: "Something went wrong when adding notes...", error: e.message });
        }
    })
}

export { addNotesToAccount }