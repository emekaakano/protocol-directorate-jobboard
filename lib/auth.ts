import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/schemas";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = adminLoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const admin = await prisma.admin.findUnique({
          where: { email: parsed.data.email },
        });
        if (!admin || !admin.isActive) return null;

        const valid = await bcrypt.compare(
          parsed.data.password,
          admin.passwordHash
        );
        if (!valid) return null;

        try {
          await prisma.auditLog.create({
            data: {
              adminId: admin.id,
              action: "admin.login",
              details: `Successful login for ${admin.email}`,
            },
          });
        } catch {
          // Non-critical — don't block login if audit write fails
        }

        return { id: admin.id, email: admin.email, name: admin.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.adminId = user.id;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.adminId as string;
      }
      return session;
    },
  },
};
