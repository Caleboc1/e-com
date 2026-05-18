import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";

import { hasDatabaseUrl, prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/admin/login"
  },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        if (!hasDatabaseUrl()) {
          const fallbackEmail = process.env.ADMIN_EMAIL;
          const fallbackPassword = process.env.ADMIN_PASSWORD;

          if (email === fallbackEmail && password === fallbackPassword) {
            return {
              id: "local-admin",
              email,
              name: "Store Admin"
            };
          }

          return null;
        }

        const data = await prisma.adminUser.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true
          }
        });

        if (!data) {
          return null;
        }

        const valid = await bcrypt.compare(password, data.passwordHash);

        if (!valid) {
          return null;
        }

        return {
          id: data.id,
          email: data.email,
          name: data.name
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    }
  }
};

export async function getAdminSession() {
  return getServerSession(authOptions);
}
