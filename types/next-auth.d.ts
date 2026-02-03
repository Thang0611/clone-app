/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User extends DefaultUser {
        id: string;
        email: string;
        name: string;
        role: string;
        image?: string;
        backendUserId?: number;
        googleId?: string;
        isPremium?: boolean;
    }

    interface Session extends DefaultSession {
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            image?: string;
            backendUserId?: number;
            googleId?: string;
            isPremium?: boolean;
        } & DefaultSession["user"];
        accessToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        email: string;
        name: string;
        role: string;
        image?: string;
        backendUserId?: number;
        googleId?: string;
        isPremium?: boolean;
        accessToken?: string;
    }
}
