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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MESSAGE_LIMIT = 3;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  // Add welcome message and load message count on component mount
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content:
        "Hey there! I'm the digital twin. Ask me anything about my background, experience, or interests!",
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
          "You've reached the 3-message limit. To continue chatting, please contact me directly!",
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
    <div className="flex flex-col h-screen">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-retro bg-retro-bg">
        <div className="container mx-auto max-w-4xl">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-3">
              <div className="message-assistant">
                <div className="font-mono text-sm">
                  <span className="font-bold text-xs text-retro-gray block mb-1">
                    DIGITAL TWIN
                  </span>
                  <div className="flex gap-1">
                    <span className="typing-indicator"></span>
                    <span className="typing-indicator"></span>
                    <span className="typing-indicator"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t-4 border-black bg-retro-gray p-8">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="bg-retro-light border-2 border-black p-4 w-full">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type your message here... (Shift+Enter for new line)"
                className="w-full text-base resize-none overflow-y-auto min-h-[48px] max-h-[200px] border-0 p-0 focus:outline-none bg-transparent font-mono"
                disabled={isLoading}
                rows={1}
              />
            </div>
            <button
              type="submit"
              className="retro-button font-bold text-base px-8 py-3 self-start"
              disabled={isLoading || !inputValue.trim() || isLimitReached}
            >
              SEND
            </button>
          </form>

          {/* Message count indicator */}
          <div className="mt-3 text-sm font-mono text-retro-dark">
            {isLimitReached ? (
              <span className="text-red-600 font-bold">
                Message limit reached (3/3)
              </span>
            ) : (
              <span>
                Messages remaining: {MESSAGE_LIMIT - messageCount} /{" "}
                {MESSAGE_LIMIT}
              </span>
            )}
          </div>

          {/* FUTURE: Add authentication/payment UI here */}
          {/* <div className="mt-2 text-xs text-retro-gray font-mono">
            Credits remaining: XX | <a href="/pricing">Upgrade</a>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
