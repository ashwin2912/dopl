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

  if (isUser) {
    return (
      <div className="flex gap-4 items-start max-w-2xl ml-auto flex-row-reverse text-right">
        <div className="text-slate-600 mt-0.5">
          <span className="material-symbols-outlined text-sm">
            alternate_email
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[9px] text-slate-600 uppercase">
            User Query
          </span>
          <p className="text-primary italic whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-start max-w-2xl">
      <div className="text-primary mt-0.5">
        <span className="material-symbols-outlined text-sm">terminal</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[9px] text-slate-600 uppercase">
          Data Response
        </span>
        <p className="text-slate-400 leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
