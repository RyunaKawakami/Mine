import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { env } from "@/config/env";
import {
  canAccessPath,
  isAllowedEmail,
  verifiedGoogleEmail,
} from "@/features/auth/services/access-policy";
import { bootstrapAlbumMembership } from "@/features/auth/services/bootstrap-album";
import { getPrisma } from "@/lib/db/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  adapter: PrismaAdapter(getPrisma()),
  trustHost: true,
  providers: [Google],
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    signIn({ account, profile }) {
      const email = verifiedGoogleEmail(account?.provider, profile);
      return email !== null && isAllowedEmail(email, env.MINE_ALLOWED_EMAILS);
    },
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    authorized({ auth: session, request }) {
      return canAccessPath(request.nextUrl.pathname, Boolean(session?.user));
    },
  },
  events: {
    async signIn({ user }) {
      if (!user.id || !user.email) {
        throw new Error("A persisted user with an email is required.");
      }

      await bootstrapAlbumMembership({
        userId: user.id,
        email: user.email,
      });
    },
  },
}));
