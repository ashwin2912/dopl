import React, { useState, useRef, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import MessageBubble, { Message } from "./MessageBubble";
import { sendMessage } from "../api";

const ChatInterface: React.FC = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const MESSAGE_LIMIT = 5;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message and load message count on component mount
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content:
        "Hello. I'm the digital twin of this portfolio. Ask me about technical proficiencies or active projects.",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);

    // Load message count from localStorage
    const storedCount = localStorage.getItem("messageCount");
    const count = storedCount ? parseInt(storedCount, 10) : 0;
    setMessageCount(count);

    if (count >= MESSAGE_LIMIT) {
      setIsLimitReached(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    // Check message limit
    if (isLimitReached) {
      const limitMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "You've reached the 5-message limit. To continue chatting, please contact me directly!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, limitMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Generate CAPTCHA token
      if (!executeRecaptcha) {
        throw new Error("reCAPTCHA not ready. Please refresh the page.");
      }

      const captchaToken = await executeRecaptcha("chat_message");
      console.log("CAPTCHA token generated");

      const response = await sendMessage(inputValue, messages, captchaToken);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Increment message count and save to localStorage
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      localStorage.setItem("messageCount", newCount.toString());

      // Check if limit is reached
      if (newCount >= MESSAGE_LIMIT) {
        setIsLimitReached(true);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      console.log("Error details:", {
        type: typeof error,
        isError: error instanceof Error,
        message: error instanceof Error ? error.message : "unknown",
      });

      let errorContent =
        "Sorry, I'm having trouble connecting right now. Please try again later.";

      // Extract error message from Error object
      if (error instanceof Error) {
        errorContent = error.message;
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto mb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <h2 className="text-xs font-bold uppercase tracking-[0.3em]">
            My Dopl AI
          </h2>
        </div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          {isLimitReached
            ? `Limit: ${MESSAGE_LIMIT}/${MESSAGE_LIMIT}`
            : `Remaining: ${MESSAGE_LIMIT - messageCount}/${MESSAGE_LIMIT}`}
        </div>
      </div>
      <div className="bg-black border border-white/10 rounded-lg overflow-hidden terminal-glow">
        {/* Terminal Header */}
        <div className="bg-slate-900/50 border-b border-white/5 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/20"></div>
              <div className="w-2 h-2 rounded-full bg-white/20"></div>
              <div className="w-2 h-2 rounded-full bg-white/20"></div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 tracking-wider">
              PROMPT_SYSTEM:READY
            </span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="p-6 min-h-[160px] max-h-[500px] overflow-y-auto flex flex-col gap-5 font-mono text-xs scrollbar-hide">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex gap-4 items-start max-w-2xl">
              <div className="text-primary mt-0.5">
                <span className="material-symbols-outlined text-sm">
                  terminal
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-600 uppercase">
                  Processing
                </span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/5 bg-slate-900/30 p-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <span className="text-primary font-bold text-sm ml-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isLimitReached ? "Message limit reached..." : "Type command..."
              }
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white font-mono text-xs placeholder:text-slate-700 p-0"
              disabled={isLoading || isLimitReached}
            />
            <button
              type="submit"
              className="text-slate-500 hover:text-primary transition-colors pr-2 disabled:opacity-30 disabled:hover:text-slate-500"
              disabled={isLoading || !inputValue.trim() || isLimitReached}
            >
              <span className="material-symbols-outlined text-lg">
                arrow_right_alt
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChatInterface;
