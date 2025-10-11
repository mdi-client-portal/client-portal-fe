import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import jwt from "jsonwebtoken";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log(
          "credentials authorize",
          credentials.email,
          credentials.password
        );
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email or password missing");
        }

        try {
          const response = await axios.post(
            `${process.env.API_URL}/api/clients/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          let data = response.data.data;

          if (!data) {
            return null;
          }

          const user = {
            id: data.client_id,
            name: data.client_name,
            email: data.client_email,
          };

          return user;
        } catch (error) {
          console.log("error wak");
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.jwtToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.token = token.jwtToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
