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

          const customJwtToken = jwt.sign(
            {
              userId: data.client_id,
              email: data.client_email,
              name: data.client_name,
            },
            process.env.NEXTAUTH_SECRET!
          );

          console.log("=== GENERATED JWT TOKEN ===");
          console.log("Token:", customJwtToken);
          console.log("Payload:", jwt.decode(customJwtToken));
          console.log("========================");

          const user = {
            id: data.client_id,
            name: data.client_name,
            email: data.client_email,
            token: customJwtToken,
          };

          return user;
        } catch (error) {
          console.log("error wak", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("=== JWT CALLBACK ===");

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.customToken = user.token;

        console.log("User object exists - first sign in");
        console.log("Storing custom token in NextAuth token:", user.token);
      }

      console.log("Current token state:", token);
      console.log("==================");

      return token;
    },

    async session({ session, token }) {
      console.log("=== SESSION CALLBACK ===");

      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.token = token.customToken as string;

        console.log("Session user token:", session.user.token);
      }

      console.log("==================");

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: `access_token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});
