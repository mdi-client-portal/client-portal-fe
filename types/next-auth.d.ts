import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      token?: string;
      [key: string]: any;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    token?: string;
    [key: string]: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      email: string;
      name?: string;
      token?: string;
      [key: string]: any;
    };
  }
}
