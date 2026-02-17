"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  isStreaming = false,
}: MarkdownRendererProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", isStreaming && "animate-pulse")}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const codeString = String(children).replace(/\n$/, "");

            return !inline && match ? (
              <div className="relative my-4">
                <SyntaxHighlighter
                  style={isDark ? vscDarkPlus : vs}
                  language={language}
                  PreTag="div"
                  className="rounded-lg !bg-muted !p-4"
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={cn("bg-muted px-1.5 py-0.5 rounded text-sm", className)} {...props}>
                {children}
              </code>
            );
          },
          p({ children }: any) {
            return <p className="mb-3 last:mb-0">{children}</p>;
          },
          ul({ children }: any) {
            return <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>;
          },
          ol({ children }: any) {
            return <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>;
          },
          li({ children }: any) {
            return <li className="mb-1">{children}</li>;
          },
          h1({ children }: any) {
            return <h1 className="text-2xl font-bold mb-3 mt-6 first:mt-0">{children}</h1>;
          },
          h2({ children }: any) {
            return <h2 className="text-xl font-semibold mb-3 mt-6 first:mt-0">{children}</h2>;
          },
          h3({ children }: any) {
            return <h3 className="text-lg font-semibold mb-3 mt-6 first:mt-0">{children}</h3>;
          },
          blockquote({ children }: any) {
            return (
              <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                {children}
              </blockquote>
            );
          },
          a({ href, children }: any) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {children}
              </a>
            );
          },
          table({ children }: any) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-border">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }: any) {
            return <thead className="bg-muted">{children}</thead>;
          },
          th({ children }: any) {
            return (
              <th className="border border-border px-4 py-2 text-left font-semibold">
                {children}
              </th>
            );
          },
          td({ children }: any) {
            return <td className="border border-border px-4 py-2">{children}</td>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
