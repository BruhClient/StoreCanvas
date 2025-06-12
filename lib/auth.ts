import { env } from "@/data/env/server";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import Credentials from "next-auth/providers/credentials";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { getUserById, updateUserById } from "@/server/db/users";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  events: {
    async linkAccount({ user }) {
      await updateUserById(user.id!, {
        emailVerified: new Date(),
      });
    },
    signIn: async ({ account, user }) => {
      if (account?.type !== "credentials") {
        await updateUserById(user.id!, {
          emailVerified: new Date(),
          isOauth: true,
        });
      }
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id!);
      if (!existingUser?.emailVerified) {
        return false;
      }
      return true;
    },
    async jwt({ token }) {
      const userExists = await getUserById(token.sub ?? (token.id as string));
      if (!userExists) return token;

      const user = await getUserById(token.sub ?? (token.id as string));

      return {
        id: user?.id,
        name: user?.name,
        isOauth: user?.isOauth,
        image: user?.image,
        email: user?.email,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.image = token.image as string;
        session.user.id = token.id as string;
        session.user.isOauth = token.isOauth as boolean;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({}),
  ],
});
