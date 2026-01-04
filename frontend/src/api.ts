import { Message } from "./components/MessageBubble";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface ChatRequest {
  message: string;
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

export interface ChatResponse {
  response: string;
}

export interface BioResponse {
  name: string;
  bio: string;
  lastUpdated: string;
}

export async function sendMessage(
  message: string,
  conversationHistory: Message[],
): Promise<string> {
  try {
    // FUTURE: Add authentication headers here
    // const token = getAuthToken();
    // headers: { 'Authorization': `Bearer ${token}` }

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        conversationHistory: conversationHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      } as ChatRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function fetchBio(): Promise<BioResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/bio`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BioResponse = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// FUTURE: Authentication functions
// export async function login(email: string, password: string) { }
// export async function signup(email: string, password: string) { }
// export async function getAuthToken(): string | null { }

// FUTURE: Payment functions
// export async function createCheckoutSession() { }
// export async function getSubscriptionStatus() { }
