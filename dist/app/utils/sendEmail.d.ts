export declare const otpEmailTemplate: (data: {
    name?: string;
    otp: number;
}) => string;
export declare const contactAcknowledgmentTemplate: (data: {
    name: string;
    subject: string;
    aiMessage: string;
}) => string;
export declare const adminContactNotificationTemplate: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) => string;
export declare const contactFeedbackTemplate: (data: {
    name: string;
    originalMessage: string;
    feedbackMessage: string;
}) => string;
export declare const sendEmail: (to: string, html: string, subject?: string) => Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo>;
//# sourceMappingURL=sendEmail.d.ts.map