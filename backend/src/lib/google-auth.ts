import { google } from "googleapis";
import prisma from "./prisma.js";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export function getGoogleAuthUrl(userId: string): string {
  const scopes = [
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
    state: userId,
  });
}

export async function handleGoogleCallback(code: string, userId: string) {
  const { tokens } = await oauth2Client.getToken(code);

  let googleEmail: string | null = null;
  try {
    const tempClient = new google.auth.OAuth2();
    tempClient.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: tempClient });
    const { data } = await oauth2.userinfo.get();
    googleEmail = data.email || null;
  } catch {
    // email fetch best-effort
  }

  await prisma.googleConnection.upsert({
    where: { userId },
    update: {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      tokenExpiry: new Date(tokens.expiry_date!),
      googleEmail,
    },
    create: {
      userId,
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      tokenExpiry: new Date(tokens.expiry_date!),
      googleEmail,
    },
  });

  return tokens;
}

export async function getAuthenticatedClient(userId: string) {
  const connection = await prisma.googleConnection.findUnique({
    where: { userId },
  });

  if (!connection) {
    throw new Error("Connessione Google non configurata per questo utente");
  }

  oauth2Client.setCredentials({
    access_token: connection.accessToken,
    refresh_token: connection.refreshToken,
    expiry_date: connection.tokenExpiry.getTime(),
  });

  oauth2Client.on("tokens", async (tokens) => {
    if (tokens.access_token) {
      await prisma.googleConnection.update({
        where: { userId },
        data: {
          accessToken: tokens.access_token,
          tokenExpiry: tokens.expiry_date
            ? new Date(tokens.expiry_date)
            : connection.tokenExpiry,
        },
      });
    }
  });

  return oauth2Client;
}

export async function getGoogleConnection(userId: string) {
  return prisma.googleConnection.findUnique({
    where: { userId },
    select: {
      id: true,
      googleEmail: true,
      tokenExpiry: true,
      createdAt: true,
    },
  });
}

export async function disconnectGoogle(userId: string) {
  return prisma.googleConnection.delete({
    where: { userId },
  });
}

export default {
  getGoogleAuthUrl,
  handleGoogleCallback,
  getAuthenticatedClient,
  getGoogleConnection,
  disconnectGoogle,
};
