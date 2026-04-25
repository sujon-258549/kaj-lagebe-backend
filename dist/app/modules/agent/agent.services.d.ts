import OpenAI from "openai";
export declare const AgentService: {
    generateResponse: (content: string) => Promise<OpenAI.Chat.Completions.ChatCompletionMessage | {
        role: "assistant";
        content: string;
    }>;
};
//# sourceMappingURL=agent.services.d.ts.map