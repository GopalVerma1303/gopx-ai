"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ArrowRight, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  onClear: () => void;
  disabled?: boolean;
  hasMessages?: boolean;
}

export function ChatInput({ onSend, onClear, disabled = false, hasMessages = false }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <div className="relative flex items-center gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            disabled={disabled}
            rows={1}
            className={cn(
              "w-full resize-none rounded-lg border border-border/50 bg-muted/30 px-4 pr-20 py-4 min-h-[80px]",
              "text-sm text-foreground placeholder:text-muted-foreground/70",
              "focus-visible:outline-none focus-visible:border-border/70",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "max-h-32 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
              "dark:bg-muted/40 dark:border-border/40"
            )}
          />
          <div className="absolute right-2 bottom-3.5 flex items-center justify-center">
            <Button
              onClick={handleSend}
              disabled={!input.trim() || disabled}
              size="icon"
              className="h-8 w-8 rounded-full bg-background hover:bg-muted border border-border/50 shadow-sm flex items-center justify-center"
            >
              <ArrowRight className="h-4 w-4 text-foreground" />
            </Button>
          </div>
        </div>

        {hasMessages && (
          <div>
            <Button
              onClick={onClear}
              variant="ghost"
              size="icon"
              className="h-10 w-10 border border-border/50 hover:bg-muted/50"
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground/60 text-center mt-2 mb-4">
        AI can make mistakes. Check important info.
      </p>
    </div>
  );
}
