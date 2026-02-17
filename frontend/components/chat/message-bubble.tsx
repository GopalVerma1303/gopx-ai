"use client";

import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "./markdown-renderer";
import { cn } from "@/lib/utils";
import { type Message } from "@/lib/api";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-4 group",
        isUser && "flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-border/50",
          isUser
            ? "bg-muted/60 text-foreground"
            : "bg-muted/40 text-muted-foreground"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      <div className={cn("flex-1 space-y-2", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-xl px-4 py-3 max-w-[85%] sm:max-w-[75%] border border-border/50",
            isUser
              ? "bg-muted/50 text-foreground ml-auto"
              : "bg-muted/30 text-foreground"
          )}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          ) : (
            <MarkdownRenderer content={message.content} isStreaming={isStreaming} />
          )}
        </div>

        {!isUser && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity border border-border/50 hover:bg-muted/50"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
