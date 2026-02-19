import Groq from 'groq-sdk';
import { AppError } from '../utils/errors.js';
import { setCorsHeaders } from '../utils/cors.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const DEFAULT_MODEL = 'llama-3.1-8b-instant';
const DEFAULT_TEMPERATURE = 0.5;
const DEFAULT_MAX_TOKENS = 2048;

const SUPPORTED_MODELS = [
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'openai/gpt-oss-120b',
];

function validateModel(model) {
  if (model && !SUPPORTED_MODELS.includes(model)) {
    throw new AppError(
      `Unsupported model: ${model}. Supported models: ${SUPPORTED_MODELS.join(', ')}`,
      400
    );
  }
}

function handleGroqModelError(error, selectedModel, res, next) {
  const message = error?.message ?? String(error);
  if (message.toLowerCase().includes('model')) {
    const err = new AppError(
      `Model ${selectedModel} is not available. Please try a different model.`,
      400
    );
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    } else {
      next(err);
    }
    return true;
  }
  return false;
}

export const chatController = {
  /**
   * Stream chat response from Groq
   */
  async streamChat(req, res, next) {
    try {
      const { model, messages, temperature, max_tokens } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        throw new AppError('Messages array is required', 400);
      }

      const selectedModel = model || DEFAULT_MODEL;
      validateModel(selectedModel);

      const selectedTemperature = temperature ?? DEFAULT_TEMPERATURE;
      const selectedMaxTokens = max_tokens ?? DEFAULT_MAX_TOKENS;

      // Set CORS headers explicitly for streaming responses
      setCorsHeaders(req, res);

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');

      let stream;
      try {
        stream = await groq.chat.completions.create({
          model: selectedModel,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          stream: true,
          temperature: selectedTemperature,
          max_tokens: selectedMaxTokens,
        });
      } catch (error) {
        if (handleGroqModelError(error, selectedModel, res, next)) return;
        throw error;
      }

      // Stream the response
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // Send completion signal
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();

    } catch (error) {
      if (!res.headersSent) {
        next(error);
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      }
    }
  },

  /**
   * Non-streaming chat response (fallback)
   */
  async chat(req, res, next) {
    try {
      const { model, messages, temperature, max_tokens } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        throw new AppError('Messages array is required', 400);
      }

      const selectedModel = model || DEFAULT_MODEL;
      validateModel(selectedModel);

      const selectedTemperature = temperature ?? DEFAULT_TEMPERATURE;
      const selectedMaxTokens = max_tokens ?? DEFAULT_MAX_TOKENS;

      let completion;
      try {
        completion = await groq.chat.completions.create({
          model: selectedModel,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: selectedTemperature,
          max_tokens: selectedMaxTokens,
        });
      } catch (error) {
        if (handleGroqModelError(error, selectedModel, res, next)) return;
        throw error;
      }

      const response = completion.choices[0]?.message?.content || '';

      res.json({
        content: response,
        model: completion.model,
        usage: completion.usage
      });

    } catch (error) {
      next(error);
    }
  }
};
