const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/app');

// Initialize Google Gemini client
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY || '');

/**
 * Process meeting notes using Google Gemini API
 * @param {string} meetingText - Raw meeting notes text
 * @returns {Promise<Object>} Processed meeting data
 */
async function processMeetingNotes(meetingText) {
    const prompt = `
You are a helpful assistant that extracts structured information from meeting notes. Always respond with valid JSON only, no additional text or formatting.

Please analyze the following meeting notes and extract the information in the specified JSON format.

Meeting Notes:
${meetingText}

Please extract:
1. A 2-3 sentence summary of the meeting
2. Key decisions that were made
3. Action items with task descriptions, owners (if mentioned), and deadlines (if mentioned)

Return the response as a valid JSON object with this exact structure:
{
  "summary": "2-3 sentence summary here",
  "decisions": ["decision 1", "decision 2"],
  "actionItems": [
    {
      "task": "task description",
      "owner": "person name or null if not specified",
      "due": "deadline or null if not specified"
    }
  ]
}

Important:
- Keep the summary concise (2-3 sentences maximum)
- Only include clear, actionable decisions
- For action items, extract the task, owner (if mentioned), and deadline (if mentioned)
- If owner or deadline is not specified, use null
- Ensure the response is valid JSON
- If no decisions or action items are found, return empty arrays
`;

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1000
            }
        });

        const completion = await model.generateContent(prompt);
        const response = completion.response;
        let responseText = (await response.text()).trim();

        // Some models may wrap JSON in code fences; strip them if present
        if (responseText.startsWith('```')) {
            const first = responseText.indexOf('```');
            const last = responseText.lastIndexOf('```');
            if (last > first) {
                responseText = responseText.substring(first + 3, last).trim();
                // remove optional language hint like "json"
                if (responseText.toLowerCase().startsWith('json')) {
                    responseText = responseText.substring(4).trim();
                }
            }
        }

        // Parse JSON response
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            console.error('Raw response:', responseText);
            throw new Error('AI service returned invalid JSON format');
        }

        // Validate response structure
        if (!result.summary || !Array.isArray(result.decisions) || !Array.isArray(result.actionItems)) {
            throw new Error('AI service returned incomplete response structure');
        }

        // Validate action items structure
        for (const item of result.actionItems) {
            if (!item.task || typeof item.task !== 'string') {
                throw new Error('Invalid action item structure - missing or invalid task');
            }
        }

        // Ensure consistent data types
        result.decisions = result.decisions.filter(decision =>
            decision && typeof decision === 'string' && decision.trim().length > 0
        );

        result.actionItems = result.actionItems.map(item => ({
            task: item.task.trim(),
            owner: item.owner && typeof item.owner === 'string' ? item.owner.trim() : null,
            due: item.due && typeof item.due === 'string' ? item.due.trim() : null
        }));

        return result;

    } catch (error) {
        console.error('Gemini API error:', error);

        const message = (error && error.message) ? error.message : String(error);

        if (message.includes('API Key') || message.includes('permission') || message.includes('unauthorized')) {
            throw new Error('Gemini API key is invalid or missing');
        }

        if (message.includes('quota') || message.includes('billing') || message.includes('exceeded')) {
            throw new Error('Gemini API quota exceeded or billing issue');
        }

        if (message.includes('rate limit') || message.includes('429')) {
            throw new Error('Gemini API rate limit exceeded');
        }

        if (message.includes('timeout') || message.includes('ETIMEDOUT')) {
            throw new Error('Gemini API request timeout');
        }

        // Re-throw parsing and validation errors
        if (message.includes('JSON') || message.includes('structure')) {
            throw error;
        }

        throw new Error(`Gemini API error: ${message}`);
    }
}

module.exports = {
    processMeetingNotes
};