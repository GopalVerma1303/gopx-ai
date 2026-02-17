"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "./chat-input";
import { MessageBubble } from "./message-bubble";
import { streamChat, type Message } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Bot } from "lucide-react";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setStreamingContent("");

    let accumulatedContent = "";

    try {
      await streamChat({
        messages: newMessages,
        onChunk: (chunk) => {
          accumulatedContent += chunk;
          setStreamingContent(accumulatedContent);
        },
        onComplete: () => {
          if (accumulatedContent) {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: accumulatedContent },
            ]);
          }
          setStreamingContent("");
          setIsLoading(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to get response",
            variant: "destructive",
          });
          setIsLoading(false);
          setStreamingContent("");
        },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
      setIsLoading(false);
      setStreamingContent("");
    }
  };

  const handleClear = () => {
    setMessages([]);
    setStreamingContent("");
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full bg-background">
      <div className="flex-1 overflow-hidden" ref={scrollAreaRef}>
        <ScrollArea className="h-full w-full">
          <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6 min-h-full">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center border border-border/50">
                  <Bot className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">Welcome to Gopx AI</h2>
                  <p className="text-muted-foreground/70 max-w-md">
                    Start a conversation by typing a message below. I&apos;m here to help!
                  </p>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`}>
                <MessageBubble message={message} />
              </div>
            ))}

            {isLoading && streamingContent && (
              <div>
                <MessageBubble
                  message={{ role: "assistant", content: streamingContent }}
                  isStreaming
                />
              </div>
            )}

            {isLoading && !streamingContent && (
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted/40 flex items-center justify-center border border-border/50">
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-muted-foreground/50"
                        style={{
                          animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="bg-background">
        <div className="container max-w-4xl mx-auto">
          <ChatInput
            onSend={handleSend}
            onClear={handleClear}
            disabled={isLoading}
            hasMessages={messages.length > 0}
          />
        </div>
      </div>
    </div>
  );
}
