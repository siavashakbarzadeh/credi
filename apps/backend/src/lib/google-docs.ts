import { google } from "googleapis";
import { getAuthenticatedClient } from "./google-auth.js";

export async function createGoogleDoc(userId: string, title: string) {
  const auth = await getAuthenticatedClient(userId);
  const docs = google.docs({ version: "v1", auth });

  const doc = await docs.documents.create({
    requestBody: {
      title,
    },
  });

  return {
    documentId: doc.data.documentId!,
    title: doc.data.title!,
  };
}

export async function getGoogleDocMetadata(userId: string, documentId: string) {
  const auth = await getAuthenticatedClient(userId);
  const docs = google.docs({ version: "v1", auth });

  const doc = await docs.documents.get({
    documentId,
  });

  return {
    documentId: doc.data.documentId!,
    title: doc.data.title!,
    revisionId: doc.data.revisionId!,
  };
}

export default { createGoogleDoc, getGoogleDocMetadata };
