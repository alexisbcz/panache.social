import { Resend } from "resend";


export const sendEmail = async (to: string, subject: string, text: string) => {
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
            to,
            subject,
            text,
        });

    } else {
        console.log(`
            Resend API key is not set.
            Email will not be sent.
            To: ${to}
            Subject: ${subject}
            Text: ${text}
        `);
    }

};