"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { Header } from "@/components/layout/header";

export default function Home() {
  return (
    <main className="flex flex-col h-screen w-full overflow-hidden">
      <Header />
      <ChatInterface />
    </main>
  );
}
