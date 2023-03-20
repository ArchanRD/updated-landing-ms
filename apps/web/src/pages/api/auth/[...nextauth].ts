import NextAuth, { DefaultUser, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getEnvVar } from "@untitledui/utils";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@ms/clients";

const GOOGLE_CLIENT_ID = getEnvVar("GOOGLE_CLIENT_ID", true);
const GOOGLE_CLIENT_SECRET = getEnvVar("GOOGLE_CLIENT_SECRET", true);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (session.user) {
        (session.user as DefaultUser).id = user.id;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
