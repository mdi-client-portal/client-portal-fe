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
            "http://127.0.0.1:8080/api/clients/login",
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          let data = response.data.data;

          // Generate JWT token saat login menggunakan logic yang sama seperti di invoices
          const payload = {
            sub: data.client_id,
            email: data.client_email,
            name: data.client_name,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 jam
          };

          // Simple base64 encoding (sama seperti di invoices page)
          const jwtToken = Buffer.from(JSON.stringify(payload)).toString(
            "base64"
          );

          const user = {
            id: data.client_id,
            name: data.client_name,
            email: data.client_email,
            token: jwtToken, // Simpan JWT token yang sudah di-generate
          };

          console.log("Generated JWT Token at login:", jwtToken);

          if (!user) {
            console.log("masuk sini bro 2");
            throw new Error("Invalid credentials.");
          }

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
      // Persist user data dan JWT token to the token right after signin
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.jwtToken = user.token; // Simpan JWT token yang sudah di-generate
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, including the pre-generated JWT token
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.token = token.jwtToken as string; // Gunakan JWT token yang sudah di-generate
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
