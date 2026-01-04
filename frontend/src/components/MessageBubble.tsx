import React from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={isUser ? "message-user" : "message-assistant"}>
        <div className="font-mono text-sm">
          <span className="font-bold text-xs text-retro-gray block mb-1">
            {isUser ? "YOU" : "ASHWIN'S DIGITAL TWIN"}
          </span>
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          <span className="text-xs text-retro-gray mt-1 block">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
