import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
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

          const user = {
            id: data.client_id,
            name: data.client_name,
            email: data.client_email,
          };

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
  pages: {
    signIn: "/login",
  },
});
