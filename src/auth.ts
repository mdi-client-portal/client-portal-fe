import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log("credentials", credentials.email, credentials.password);
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email or password missing");
        }

        try {
          const response = await axios.post(
            "http://127.0.0.1:5000/api/user/login",
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          let user = response.data.data;

          console.log(user);
          if (!user) {
            console.log("masuk sini bro 2");
            throw new Error("Invalid credentials.");
          }

          // return JSON object with the user data
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
