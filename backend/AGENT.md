# Backend API Documentation for AI Agents

This document provides comprehensive information about the backend API endpoints, request/response formats, and integration guidelines for AI agents building UI components.

## Base Configuration

- **Base URL**: `http://localhost:3001` (development) or your production URL
- **API Prefix**: `/api`
- **Content-Type**: `application/json`
- **CORS**: Configured via `CORS_ORIGIN` environment variable (supports multiple comma-separated origins)
- **Rate Limiting**: 100 requests per 15 minutes per IP address

## Environment Variables

The backend requires the following environment variables:

- `PORT`: Server port (default: 3001)
- `GROQ_API_KEY`: Your Groq API key for AI completions
- `CORS_ORIGIN`: Comma-separated list of allowed origins (e.g., `http://localhost:3000,https://example.com`)

## API Endpoints

### 1. Health Check

**Endpoint**: `GET /health`

**Description**: Check if the server is running and healthy.

**Request**: No body required

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-02-17T10:30:00.000Z"
}
```

**Status Codes**:
- `200`: Server is healthy

**Example Usage**:
```javascript
fetch('http://localhost:3001/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

### 2. Chat (Streaming)

**Endpoint**: `POST /api/chat/stream`

**Description**: Send a chat message and receive a streaming response from the AI model. This endpoint uses Server-Sent Events (SSE) to stream the response in real-time.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "model": "llama-3.1-8b-instant" // Optional, defaults to llama-3.1-8b-instant
}
```

**Message Format**:
- `role`: Must be one of `"user"`, `"assistant"`, or `"system"`
- `content`: String containing the message content
- `messages`: Array of message objects (required, must not be empty)
- `model`: Optional string specifying the Groq model to use

**Response Format**: Server-Sent Events (SSE) stream

**Stream Events**:
- Content chunks: `data: {"content": "partial text..."}\n\n`
- Completion: `data: {"done": true}\n\n`
- Error: `data: {"error": "error message"}\n\n`

**Status Codes**:
- `200`: Stream started successfully
- `400`: Invalid request (missing messages, invalid format)
- `429`: Too many requests (rate limit exceeded)
- `500`: Server error

**Example Usage (JavaScript)**:
```javascript
const messages = [
  { role: "user", content: "What is the capital of France?" }
];

const response = await fetch('http://localhost:3001/api/chat/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ messages })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split('\n\n');
  buffer = lines.pop() || '';

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      if (data.content) {
        // Append content to UI
        console.log(data.content);
      } else if (data.done) {
        // Stream complete
        console.log('Stream finished');
      } else if (data.error) {
        // Handle error
        console.error(data.error);
      }
    }
  }
}
```

**Example Usage (EventSource - Browser)**:
```javascript
const eventSource = new EventSource('http://localhost:3001/api/chat/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [{ role: "user", content: "Hello!" }]
  })
});

// Note: EventSource only supports GET, so use fetch with ReadableStream instead
```

---

### 3. Chat (Non-Streaming)

**Endpoint**: `POST /api/chat`

**Description**: Send a chat message and receive a complete response from the AI model. This endpoint waits for the full response before returning it.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What is 2+2?"
    }
  ],
  "model": "llama-3.1-8b-instant" // Optional
}
```

**Response**:
```json
{
  "content": "2 + 2 equals 4.",
  "model": "llama-3.1-8b-instant",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 5,
    "total_tokens": 15
  }
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid request
- `429`: Too many requests
- `500`: Server error

**Example Usage**:
```javascript
const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: "user", content: "Explain quantum computing in simple terms." }
    ]
  })
});

const data = await response.json();
console.log(data.content); // Full response text
console.log(data.usage); // Token usage information
```

---

## Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "error": "Error message describing what went wrong"
}
```

In development mode, additional details may be included:
```json
{
  "error": "Error message",
  "stack": "Error stack trace",
  "details": { /* Additional error details */ }
}
```

### Common Error Status Codes

- `400 Bad Request`: Invalid request format or missing required fields
  - Missing `messages` field
  - `messages` is not an array
  - Empty `messages` array
  - Invalid message structure (missing `role` or `content`)
  - Invalid `role` value (must be "user", "assistant", or "system")
  - `content` is not a string

- `404 Not Found`: Route not found
  ```json
  {
    "error": "Route not found"
  }
  ```

- `429 Too Many Requests`: Rate limit exceeded
  ```json
  {
    "error": "Too many requests from this IP, please try again later."
  }
  ```

- `500 Internal Server Error`: Server-side error
  ```json
  {
    "error": "Internal server error"
  }
  ```

### Validation Errors

The API validates requests before processing. Common validation errors:

```json
{
  "error": "Messages are required"
}
```

```json
{
  "error": "Messages must be an array"
}
```

```json
{
  "error": "Messages array cannot be empty"
}
```

```json
{
  "error": "Each message must have \"role\" and \"content\" fields"
}
```

```json
{
  "error": "Message role must be \"user\", \"assistant\", or \"system\""
}
```

```json
{
  "error": "Message content must be a string"
}
```

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP address
- **Headers**: Rate limit information is included in response headers:
  - `X-RateLimit-Limit`: Maximum number of requests allowed
  - `X-RateLimit-Remaining`: Number of requests remaining
  - `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

When rate limit is exceeded, the API returns:
- Status Code: `429`
- Response: `{ "error": "Too many requests from this IP, please try again later." }`

---

## CORS Configuration

The backend supports CORS with configurable allowed origins:

- **Single Origin**: `CORS_ORIGIN=http://localhost:3000`
- **Multiple Origins**: `CORS_ORIGIN=http://localhost:3000,https://example.com,https://app.example.com`

The backend validates the `Origin` header against the allowed list. Requests from unauthorized origins will be blocked.

**Credentials**: CORS credentials are enabled, so cookies and authentication headers can be sent.

---

## Request Size Limits

- **JSON Body Limit**: 10MB
- **URL Encoded Limit**: 10MB

---

## AI Model Configuration

### Default Model
- `llama-3.1-8b-instant` (default)

### Model Parameters
- **Temperature**: 0.7 (fixed)
- **Max Tokens**: 2048 (fixed)

### Supported Models
Check Groq's documentation for available models. Common options:
- `llama-3.1-8b-instant`
- `llama-3.1-70b-versatile`
- `mixtral-8x7b-32768`

---

## UI Integration Guide

### Recommended Approach: Streaming Chat

For the best user experience, use the streaming endpoint (`/api/chat/stream`) to display responses as they're generated.

#### React Example

```jsx
import { useState, useRef, useEffect } from 'react';

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    try {
      const response = await fetch('http://localhost:3001/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullResponse += data.content;
                setStreamingContent(fullResponse);
              } else if (data.done) {
                setMessages([...newMessages, { role: 'assistant', content: fullResponse }]);
                setStreamingContent('');
                setIsLoading(false);
              } else if (data.error) {
                throw new Error(data.error);
              }
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role}>
            {msg.content}
          </div>
        ))}
        {isLoading && streamingContent && (
          <div className="assistant streaming">
            {streamingContent}
          </div>
        )}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        disabled={isLoading}
      />
      <button onClick={sendMessage} disabled={isLoading}>
        Send
      </button>
    </div>
  );
}
```

#### Vanilla JavaScript Example

```javascript
async function sendChatMessage(messages) {
  const response = await fetch('http://localhost:3001/api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.content) {
            fullContent += data.content;
            // Update UI with fullContent
            updateChatUI(fullContent);
          } else if (data.done) {
            return fullContent;
          } else if (data.error) {
            throw new Error(data.error);
          }
        } catch (e) {
          console.error('Error parsing SSE:', e);
        }
      }
    }
  }

  return fullContent;
}
```

### Fallback: Non-Streaming Chat

For simpler implementations or when streaming isn't needed:

```javascript
async function sendChatMessage(messages) {
  const response = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const data = await response.json();
  return data.content;
}
```

---

## Testing the API

### Using cURL

**Health Check**:
```bash
curl http://localhost:3001/health
```

**Non-Streaming Chat**:
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

**Streaming Chat**:
```bash
curl -X POST http://localhost:3001/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Tell me a story"}
    ]
  }' \
  --no-buffer
```

---

## Best Practices for UI Integration

1. **Use Streaming**: Prefer `/api/chat/stream` for better UX with real-time responses
2. **Handle Errors**: Always check response status and handle errors gracefully
3. **Respect Rate Limits**: Implement client-side throttling and show rate limit warnings
4. **Validate Input**: Validate message format before sending to avoid 400 errors
5. **Show Loading States**: Display loading indicators during API calls
6. **Handle Disconnections**: Implement reconnection logic for streaming connections
7. **Manage Message History**: Maintain conversation context by including previous messages
8. **Token Usage**: Monitor token usage from non-streaming responses to optimize costs

---

## Notes for AI Agents

- The backend uses Express.js and supports ES modules
- All routes are prefixed with `/api` except `/health`
- The chat endpoints require rate limiting middleware
- Request validation happens before controller execution
- Errors are handled by a centralized error handler middleware
- CORS is configured to allow specific origins only
- The backend uses Groq SDK for AI completions
- Streaming uses Server-Sent Events (SSE) format
- No authentication is currently implemented (consider adding for production)

---

## Future Considerations

When building UI components, consider:
- Adding authentication/authorization
- Implementing WebSocket support for bidirectional communication
- Adding conversation persistence
- Implementing file upload support
- Adding support for function calling
- Implementing conversation history management
- Adding support for multiple AI providers
