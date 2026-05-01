export declare const AutomationService: {
    processFollowUpEmails: () => Promise<void>;
    sendIndividualFollowUp: (userId: string, subject: string, content: string) => Promise<{
        message: string;
    }>;
    processContactNurturingEmails: () => Promise<void>;
};
//# sourceMappingURL=automation.services.d.ts.map