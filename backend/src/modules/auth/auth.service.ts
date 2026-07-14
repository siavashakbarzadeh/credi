import prisma from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import { LoginInput, RegisterInput } from "./auth.schema.js";

const googleOAuth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

function generateAccessToken(user: { id: string; email: string; role: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
}

function generateRefreshToken(user: { id: string; email: string; role: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Email o password non corretti");
  }

  if (!user.active) {
    throw new Error("Account disattivato. Contattare l'amministratore.");
  }

  const validPassword = await bcrypt.compare(data.password, user.passwordHash);
  if (!validPassword) {
    throw new Error("Email o password non corretti");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

export async function register(data: RegisterInput) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error("Un utente con questa email esiste già");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || "LOAN_OFFICER",
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });

  return user;
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("Utente non trovato");
  }

  return user;
}

export async function refreshTokens(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || !user.active) {
      throw new Error("Utente non valido");
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch {
    throw new Error("Refresh token non valido o scaduto");
  }
}

export function getGoogleLoginUrl(): string {
  const scopes = ["openid", "email", "profile"];
  return googleOAuth.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
}

export async function handleGoogleLoginCallback(code: string) {
  const { tokens } = await googleOAuth.getToken(code);
  googleOAuth.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: "v2", auth: googleOAuth });
  const { data: googleUser } = await oauth2.userinfo.get();

  if (!googleUser.email) {
    throw new Error("Email Google non disponibile");
  }

  let user = await prisma.user.findUnique({
    where: { email: googleUser.email },
  });

  if (!user) {
    const passwordHash = await bcrypt.hash(Math.random().toString(36), 10);
    user = await prisma.user.create({
      data: {
        email: googleUser.email,
        passwordHash,
        firstName: googleUser.given_name || "",
        lastName: googleUser.family_name || "",
        role: "LOAN_OFFICER",
        active: true,
      },
    });
  }

  if (!user.active) {
    throw new Error("Account disattivato. Contattare l'amministratore.");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

export default { login, register, getMe, refreshTokens, getGoogleLoginUrl, handleGoogleLoginCallback };
