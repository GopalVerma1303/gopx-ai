export const validateChatRequest = (req, res, next) => {
  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages must be an array' });
  }

  if (messages.length === 0) {
    return res.status(400).json({ error: 'Messages array cannot be empty' });
  }

  // Validate message structure
  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return res.status(400).json({ 
        error: 'Each message must have "role" and "content" fields' 
      });
    }

    if (!['user', 'assistant', 'system'].includes(msg.role)) {
      return res.status(400).json({ 
        error: 'Message role must be "user", "assistant", or "system"' 
      });
    }

    if (typeof msg.content !== 'string') {
      return res.status(400).json({ 
        error: 'Message content must be a string' 
      });
    }
  }

  next();
};
