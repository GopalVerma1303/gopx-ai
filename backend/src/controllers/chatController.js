import Groq from 'groq-sdk';
import { AppError } from '../utils/errors.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const chatController = {
  /**
   * Stream chat response from Groq
   */
  async streamChat(req, res, next) {
    try {
      const { messages, model = 'llama-3.1-8b-instant' } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        throw new AppError('Messages array is required', 400);
      }

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');

      const stream = await groq.chat.completions.create({
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      });

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
      const { messages, model = 'llama-3.1-8b-instant' } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        throw new AppError('Messages array is required', 400);
      }

      const completion = await groq.chat.completions.create({
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 2048,
      });

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
