const { delay } = require('../services/aiExtractor');

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn(),
      }),
    })),
  };
});

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { extractBatchWithRetry } = require('../services/aiExtractor');

// Helper to set up the mock return value for generateContent
function mockGeminiResponse(jsonObject) {
  const mockGenerate = jest.fn().mockResolvedValue({
    response: { text: () => JSON.stringify(jsonObject) },
  });
  GoogleGenerativeAI.mockImplementation(() => ({
    getGenerativeModel: () => ({ generateContent: mockGenerate }),
  }));
  return mockGenerate;
}

describe('aiExtractor - delay', () => {
  test('resolves after approximately the given ms', async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(90);
  });
});

describe('aiExtractor - extractBatchWithRetry', () => {
  const sampleBatch = [{ Name: 'Alice', Email: 'alice@test.com' }];

  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-api-key-123';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns skipped rows with reason when GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const result = await extractBatchWithRetry(sampleBatch);
    expect(result.imported).toEqual([]);
    expect(result.skipped).toHaveLength(1);
    expect(result.skipped[0].reason).toMatch(/GEMINI_API_KEY/);
  });

  test('returns parsed imported/skipped arrays on successful Gemini call', async () => {
    mockGeminiResponse({
      imported: [{ name: 'Alice', email: 'alice@test.com' }],
      skipped: [],
    });

    const result = await extractBatchWithRetry(sampleBatch);
    expect(result.imported).toHaveLength(1);
    expect(result.imported[0].name).toBe('Alice');
    expect(result.skipped).toHaveLength(0);
  });

  test('returns empty arrays when AI returns empty lists', async () => {
    mockGeminiResponse({ imported: [], skipped: [] });
    const result = await extractBatchWithRetry(sampleBatch);
    expect(result.imported).toEqual([]);
    expect(result.skipped).toEqual([]);
  });

  test('retries once on JSON parse failure and returns skipped on second failure', async () => {
    // Make generateContent always return invalid JSON
    const mockGenerate = jest.fn().mockResolvedValue({
      response: { text: () => 'THIS IS NOT JSON }{' },
    });
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({ generateContent: mockGenerate }),
    }));

    const result = await extractBatchWithRetry(sampleBatch, 1);
    // Should have been called twice (original + 1 retry)
    expect(mockGenerate).toHaveBeenCalledTimes(2);
    expect(result.imported).toEqual([]);
    expect(result.skipped).toHaveLength(1);
    expect(result.skipped[0].reason).toMatch(/Failed to parse/);
  });

  test('retries once on API error and returns skipped on second failure', async () => {
    const mockGenerate = jest.fn().mockRejectedValue(new Error('Network timeout'));
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({ generateContent: mockGenerate }),
    }));

    const result = await extractBatchWithRetry(sampleBatch, 1);
    expect(mockGenerate).toHaveBeenCalledTimes(2);
    expect(result.skipped[0].reason).toMatch(/Gemini API Error/);
  });

  test('handles missing imported/skipped keys in AI response gracefully', async () => {
    mockGeminiResponse({ someOtherKey: 'unexpected' });
    const result = await extractBatchWithRetry(sampleBatch);
    expect(result.imported).toEqual([]);
    expect(result.skipped).toEqual([]);
  });
});
