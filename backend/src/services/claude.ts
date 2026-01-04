import Anthropic from '@anthropic-ai/sdk';
import config from '../config/env.js';
import knowledgeBaseService from './knowledgeBase.js';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

class ClaudeService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.anthropicApiKey,
    });
  }

  /**
   * Send a message to Claude and get a response
   */
  async chat(
    userMessage: string,
    conversationHistory: ConversationMessage[] = []
  ): Promise<string> {
    try {
      const systemPrompt = knowledgeBaseService.getSystemPrompt();

      // Build the messages array from conversation history + new message
      const messages: Anthropic.MessageParam[] = [
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user' as const,
          content: userMessage,
        },
      ];

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages,
      });

      // Extract text from response
      const textContent = response.content.find(
        block => block.type === 'text'
      );

      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text content in Claude response');
      }

      return textContent.text;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw new Error('Failed to get response from AI');
    }
  }

  /**
   * Stream a response from Claude (for future enhancement)
   * This can be used to provide real-time streaming responses
   */
  async streamChat(
    userMessage: string,
    conversationHistory: ConversationMessage[] = []
  ): Promise<AsyncIterable<string>> {
    const systemPrompt = knowledgeBaseService.getSystemPrompt();

    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: userMessage,
      },
    ];

    const stream = await this.client.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    // Convert the stream to an async iterable of text chunks
    async function* textGenerator() {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          yield chunk.delta.text;
        }
      }
    }

    return textGenerator();
  }
}

export default new ClaudeService();
