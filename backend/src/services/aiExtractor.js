const { GoogleGenerativeAI } = require("@google/generative-ai");
const extractionPrompt = require("../prompts/extractionPrompt");


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


async function extractBatchWithRetry(batchRows, retryCount = 1) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables!");
    return {
      imported: [],
      skipped: batchRows.map(row => ({
        original_row: row,
        reason: "GEMINI_API_KEY is not configured on the server"
      }))
    };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const promptText = extractionPrompt.replace("<INSERT_BATCH_JSON_HERE>", JSON.stringify(batchRows, null, 2));

  try {
    const result = await model.generateContent(promptText);
    const response = await result.response;
    const text = response.text();

    try {
      const parsed = JSON.parse(text);
      return {
        imported: Array.isArray(parsed.imported) ? parsed.imported : [],
        skipped: Array.isArray(parsed.skipped) ? parsed.skipped : []
      };
    } catch (parseError) {
      console.error("JSON parsing failed. Raw response text was:", text);
      if (retryCount > 0) {
        await delay(1000);
        return await extractBatchWithRetry(batchRows, retryCount - 1);
      }
      return {
        imported: [],
        skipped: batchRows.map(row => ({
          original_row: row,
          reason: "Failed to parse AI response JSON after retries"
        }))
      };
    }
  } catch (apiError) {
    console.error("Gemini API error:", apiError);
    if (retryCount > 0) {
      await delay(2000);
      return await extractBatchWithRetry(batchRows, retryCount - 1);
    }
    return {
      imported: [],
      skipped: batchRows.map(row => ({
        original_row: row,
        reason: `Gemini API Error: ${apiError.message || apiError}`
      }))
    };
  }
}

module.exports = {
  extractBatchWithRetry,
  delay
};
