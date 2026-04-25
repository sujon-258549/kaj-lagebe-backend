export declare const AutomationService: {
    processFollowUpEmails: () => Promise<void>;
    sendIndividualFollowUp: (userId: string, subject: string, content: string) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=automation.services.d.ts.map