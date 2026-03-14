import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const authLibPath = path.resolve(__dirname, "../../lib/auth.ts");
const authLib = fs.readFileSync(authLibPath, "utf-8");

const registerRoutePath = path.resolve(__dirname, "../../app/api/auth/register/route.ts");
const registerRoute = fs.readFileSync(registerRoutePath, "utf-8");

const nextAuthRoutePath = path.resolve(__dirname, "../../app/api/auth/[...nextauth]/route.ts");
const nextAuthRoute = fs.readFileSync(nextAuthRoutePath, "utf-8");

// ===================================================================
// 1. NextAuth Configuration (25 tests)
// ===================================================================
describe("NextAuth configuration (auth.ts)", () => {
  it("should export authOptions", () => {
    expect(authLib).toContain("export const authOptions");
  });

  it("should be typed as NextAuthOptions", () => {
    expect(authLib).toContain("NextAuthOptions");
  });

  it("should import NextAuthOptions from next-auth", () => {
    expect(authLib).toContain('import { NextAuthOptions } from "next-auth"');
  });

  it("should import CredentialsProvider", () => {
    expect(authLib).toContain("CredentialsProvider");
    expect(authLib).toContain('from "next-auth/providers/credentials"');
  });

  it("should import PrismaAdapter", () => {
    expect(authLib).toContain("PrismaAdapter");
    expect(authLib).toContain('from "@auth/prisma-adapter"');
  });

  it("should import bcrypt", () => {
    expect(authLib).toContain("bcrypt");
    expect(authLib).toContain('from "bcryptjs"');
  });

  it("should import prisma client", () => {
    expect(authLib).toContain('import { prisma } from "./prisma"');
  });

  it("should configure PrismaAdapter as adapter", () => {
    expect(authLib).toContain("adapter: PrismaAdapter(prisma)");
  });

  it("should configure CredentialsProvider in providers array", () => {
    expect(authLib).toContain("providers:");
    expect(authLib).toContain("CredentialsProvider({");
  });

  it("should set provider name to credentials", () => {
    expect(authLib).toContain('name: "credentials"');
  });

  it("should define email credential field", () => {
    expect(authLib).toContain('email: { label: "Email", type: "email" }');
  });

  it("should define password credential field", () => {
    expect(authLib).toContain('password: { label: "Password", type: "password" }');
  });

  it("should define authorize function", () => {
    expect(authLib).toContain("async authorize(credentials)");
  });

  it("should validate email and password are provided", () => {
    expect(authLib).toContain("!credentials?.email || !credentials?.password");
  });

  it("should look up user by email", () => {
    expect(authLib).toContain("prisma.user.findUnique");
    expect(authLib).toContain("where: { email: credentials.email }");
  });

  it("should check if user exists and has hashed password", () => {
    expect(authLib).toContain("!user || !user.hashedPassword");
  });

  it("should compare password with bcrypt", () => {
    expect(authLib).toContain("bcrypt.compare(credentials.password, user.hashedPassword)");
  });

  it("should throw error for invalid password", () => {
    expect(authLib).toContain("!isValid");
  });

  it("should return user object with id, email, name, image on success", () => {
    expect(authLib).toContain("id: user.id");
    expect(authLib).toContain("email: user.email");
    expect(authLib).toContain("name: user.name");
    expect(authLib).toContain("image: user.image");
  });

  it("should use JWT strategy", () => {
    expect(authLib).toContain("session:");
    expect(authLib).toContain('strategy: "jwt"');
  });

  it("should define jwt callback", () => {
    expect(authLib).toContain("async jwt({ token, user })");
  });

  it("should set token.id from user.id in jwt callback", () => {
    expect(authLib).toContain("token.id = user.id");
  });

  it("should define session callback", () => {
    expect(authLib).toContain("async session({ session, token })");
  });

  it("should set session.user.id from token.id", () => {
    expect(authLib).toContain("session.user");
    expect(authLib).toContain("token.id");
  });

  it("should set login page to /login", () => {
    expect(authLib).toContain("pages:");
    expect(authLib).toContain('signIn: "/login"');
  });
});

// ===================================================================
// 2. NextAuth Route Handler (5 tests)
// ===================================================================
describe("NextAuth route handler", () => {
  it("should import NextAuth", () => {
    expect(nextAuthRoute).toContain('import NextAuth from "next-auth"');
  });

  it("should import authOptions from lib/auth", () => {
    expect(nextAuthRoute).toContain('import { authOptions } from "@/lib/auth"');
  });

  it("should create handler with NextAuth(authOptions)", () => {
    expect(nextAuthRoute).toContain("const handler = NextAuth(authOptions)");
  });

  it("should export handler as GET", () => {
    expect(nextAuthRoute).toContain("handler as GET");
  });

  it("should export handler as POST", () => {
    expect(nextAuthRoute).toContain("handler as POST");
  });
});

// ===================================================================
// 3. Register Route Validation (20 tests)
// ===================================================================
describe("Register route validation", () => {
  it("should export a POST function", () => {
    expect(registerRoute).toMatch(/export\s+async\s+function\s+POST/);
  });

  it("should import bcrypt from bcryptjs", () => {
    expect(registerRoute).toContain('import bcrypt from "bcryptjs"');
  });

  it("should import prisma", () => {
    expect(registerRoute).toContain('import { prisma } from "@/lib/prisma"');
  });

  it("should import NextResponse from next/server", () => {
    expect(registerRoute).toContain('import { NextResponse } from "next/server"');
  });

  it("should parse request body as JSON", () => {
    expect(registerRoute).toContain("request.json()");
  });

  it("should destructure name, email, password from body", () => {
    expect(registerRoute).toContain("const { name, email, password } = body");
  });

  it("should validate name is required", () => {
    expect(registerRoute).toContain("!name");
  });

  it("should validate email is required", () => {
    expect(registerRoute).toContain("!email");
  });

  it("should validate password is required", () => {
    expect(registerRoute).toContain("!password");
  });

  it("should return 400 when required fields are missing", () => {
    expect(registerRoute).toContain("!name || !email || !password");
    expect(registerRoute).toContain("status: 400");
  });

  it("should validate password minimum length of 8 characters", () => {
    expect(registerRoute).toContain("password.length < 8");
  });

  it("should return 400 for short passwords", () => {
    const passwordCheck = registerRoute.indexOf("password.length < 8");
    const statusAfter = registerRoute.indexOf("status: 400", passwordCheck);
    expect(statusAfter).toBeGreaterThan(passwordCheck);
  });

  it("should check for existing user with same email", () => {
    expect(registerRoute).toContain("prisma.user.findUnique");
    expect(registerRoute).toContain("where: { email }");
  });

  it("should return 409 when email already exists", () => {
    expect(registerRoute).toContain("existingUser");
    expect(registerRoute).toContain("status: 409");
  });

  it("should hash password with bcrypt using 12 salt rounds", () => {
    expect(registerRoute).toContain("bcrypt.hash(password, 12)");
  });

  it("should store hashed password, not plain text", () => {
    expect(registerRoute).toContain("const hashedPassword = await bcrypt.hash");
  });

  it("should create user with prisma.user.create", () => {
    expect(registerRoute).toContain("prisma.user.create");
  });

  it("should pass name, email, hashedPassword to user creation", () => {
    expect(registerRoute).toContain("name,");
    expect(registerRoute).toContain("email,");
    expect(registerRoute).toContain("hashedPassword,");
  });

  it("should return 201 on successful registration", () => {
    expect(registerRoute).toContain("status: 201");
  });

  it("should return 500 on server error", () => {
    expect(registerRoute).toContain("status: 500");
  });
});
