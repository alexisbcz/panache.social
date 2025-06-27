import { db } from "@/db";
import { accounts, sessions, users, verifications } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
    user: {
        fields: {
            name: "username",
        },
        deleteUser: { enabled: true },
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        schema: {
            users,
            accounts,
            sessions,
            verifications,
        },
    }),
    emailAndPassword: {
        enabled: true,
        hashPassword: true,
        sendResetPassword: async ({ user, url }) => {
            await sendEmail(
                user.email,
                "Reset your password",
                `Click the link to reset your password: ${url}`,
            );
        },
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});
