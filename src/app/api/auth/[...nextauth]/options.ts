import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    // CredentialsProvider({
    //   id: "credentials",
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     if (!credentials?.email || !credentials?.password) {
    //       throw new Error("Email and password are required");
    //     }

    //     await dbConnect();

    //     const normalizedEmail = String(credentials.email).toLowerCase();
    //     const user = await UserModel.findOne({ email: normalizedEmail });

    //     if (!user) {
    //       throw new Error("No user found with this email");
    //     }

    //     if (!user.isVerified) {
    //       throw new Error("Please verify your account first");
    //     }

    //     const isPasswordCorrect = await bcrypt.compare(
    //       String(credentials.password),
    //       user.password
    //     );

    //     if (!isPasswordCorrect) {
    //       throw new Error("Invalid email or password");
    //     }

    //     return {
    //       id: user._id.toString(),
    //       name: user.username,
    //       email: user.email,
    //       _id: user._id.toString(),
    //       isVerified: user.isVerified,
    //       isAcceptingMessage: user.isAcceptingMessage,
    //       username: user.username,
    //     };
    //   },
    // }),
    CredentialsProvider({
  id: "credentials",
  name: "Credentials",
  credentials: {
    identifier: {
      label: "Email or Username",
      type: "text",
    },
    password: {
      label: "Password",
      type: "password",
    },
  },

  async authorize(credentials) {
    const identifier = credentials?.identifier;
    const password = credentials?.password;

    if (
      typeof identifier !== "string" ||
      typeof password !== "string" ||
      !identifier.trim() ||
      !password
    ) {
      throw new Error("Email/username and password are required");
    }

    await dbConnect();

    const value = identifier.trim();

    const user = await UserModel.findOne({
      $or: [
        { email: value.toLowerCase() },
        { username: value },
      ],
    });

    if (!user) {
      throw new Error("Invalid email/username or password");
    }

    if (!user.isVerified) {
      throw new Error("Please verify your account first");
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new Error("Invalid email/username or password");
    }

    return {
      id: user._id.toString(),
      name: user.username,
      email: user.email,
      _id: user._id.toString(),
      username: user.username,
      isVerified: user.isVerified,
      isAcceptingMessage: user.isAcceptingMessage,
    };
  },
})
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as any;
        token._id = authUser._id ?? authUser.id;
        token.isVerified = authUser.isVerified;
        token.isAcceptingMessage = authUser.isAcceptingMessage;
        token.username = authUser.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id as string | undefined;
        session.user.isVerified = Boolean(token.isVerified);
        session.user.isAcceptingMessage = Boolean(token.isAcceptingMessage);
        session.user.username = token.username as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};