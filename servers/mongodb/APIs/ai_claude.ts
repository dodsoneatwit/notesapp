import Anthropic from "@anthropic-ai/sdk";

/**
 * inference Claude AI through API call and return response
 * @param app - express.js app
 * @param ai - Anthropic AI client
 * @param model - claude AI model ID
 * @param prompt - system prompt instructions
 */
async function promptClaudeAi(app: any, ai: Anthropic, model: string, prompt: string) {
    // API to add ntoes to user's account
    app.post("/prompt_claude_ai", async (req, resp) => {
        try {
            // POST body content
            let result = req.body;
            console.log(`Request body: ${JSON.stringify(result)}`)

            // calls model and returns response
            let response = await ai.messages.create({
                model: model,
                max_tokens: 1024,
                system: prompt || "You are a AI Model helpful in note taking",
                messages: [
                    {
                        "role": "user", 
                        "content": result.input
                    }
                ]
            })

            // successful API run
            resp.status(200).send(response);
            
        } catch (e) {
            console.error("Claude API Error:", e);
            resp.status(500).send({
                message: "Error response when during API request!",
                error: e.message,
                details: e,
            });
        }
    })
}

export { promptClaudeAi }