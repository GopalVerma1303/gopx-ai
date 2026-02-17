const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatStreamOptions {
  messages: Message[];
  model?: string;
  onChunk: (content: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Stream chat response from backend
 */
export async function streamChat({
  messages,
  model = 'llama-3.1-8b-instant',
  onChunk,
  onComplete,
  onError,
}: ChatStreamOptions): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, model }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        if (onComplete) onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              onChunk(data.content);
            }
            if (data.done) {
              if (onComplete) onComplete();
              return;
            }
            if (data.error) {
              throw new Error(data.error);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    if (onError) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    } else {
      throw error;
    }
  }
}
