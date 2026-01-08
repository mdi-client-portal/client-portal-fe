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
        // console.log("=== AUTHORIZE CALLED ===");
        // console.log("Credentials:", { email: credentials?.email });
        // console.log("API_URL:", process.env.API_URL);

        if (!credentials?.email || !credentials?.password) {
          // console.log("Missing email or password");
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

          // console.log("API Response Status:", response.status);
          // console.log("API Response Data:", response.data);

          let data = response.data.data;

          if (!data) {
            // console.log("No data in response");
            return null;
          }

          // console.log("Extracted data:", data);

          const customJwtToken = jwt.sign(
            {
              userId: data.client_id,
              email: data.client_email,
              name: data.client_name,
            },
            process.env.NEXTAUTH_SECRET!
          );

          const user = {
            id: data.client_id,
            name: data.client_name,
            email: data.client_email,
            token: customJwtToken,
          };

          // console.log("User created successfully:", user.email);
          return user;
        } catch (error) {
          // console.error("=== AUTHORIZE ERROR ===");
          // console.error("Error details:", error);
          if (axios.isAxiosError(error)) {
            // console.error("Axios error response:", error.response?.data);
            // console.error("Axios error status:", error.response?.status);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.customToken = user.token;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.token = token.customToken as string;
      }

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
