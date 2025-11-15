import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { env } from "@/env.mjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  // Note: Database adapter removed for Sanity integration
  // Session will use JWT by default
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || user.email || "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || token.sub || "";
      }
      return session;
    },
  },
});
