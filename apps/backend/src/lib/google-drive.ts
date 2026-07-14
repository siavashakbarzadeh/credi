import { google } from "googleapis";
import { getAuthenticatedClient } from "./google-auth.js";

export async function getDriveFileMetadata(userId: string, fileId: string) {
  const auth = await getAuthenticatedClient(userId);
  const drive = google.drive({ version: "v3", auth });

  const response = await drive.files.get({
    fileId,
    fields: "id, name, mimeType, modifiedTime, version, webViewLink",
  });

  return response.data;
}

export async function createWatchChannel(
  userId: string,
  fileId: string,
  webhookUrl: string,
  channelId: string,
  expiration: number
) {
  const auth = await getAuthenticatedClient(userId);
  const drive = google.drive({ version: "v3", auth });

  const response = await drive.files.watch({
    fileId,
    requestBody: {
      id: channelId,
      type: "web_hook",
      address: webhookUrl,
      token: process.env.GOOGLE_WEBHOOK_ADDRESS,
      expiration: expiration.toString(),
    },
  });

  return {
    channelId: response.data.id!,
    resourceId: response.data.resourceId!,
    expiration: response.data.expiration!,
  };
}

export async function stopWatchChannel(userId: string, channelId: string, resourceId: string) {
  const auth = await getAuthenticatedClient(userId);
  const drive = google.drive({ version: "v3", auth });

  await drive.channels.stop({
    requestBody: {
      id: channelId,
      resourceId,
    },
  });
}

export async function listChanges(
  userId: string,
  startToken?: string
) {
  const auth = await getAuthenticatedClient(userId);
  const drive = google.drive({ version: "v3", auth });

  const response = await drive.changes.list({
    pageToken: startToken,
    fields: "nextPageToken, newStartToken, items(fileId, file(id, name, modifiedTime))",
  });

  return {
    changes: response.data.items || [],
    newStartToken: response.data.newStartToken || null,
    nextPageToken: response.data.nextPageToken || null,
  };
}

export default {
  getDriveFileMetadata,
  createWatchChannel,
  stopWatchChannel,
  listChanges,
};
