import prisma from "../../lib/prisma.js";
import { ensureUploadDir, getUploadPath, validateFile } from "../../utils/uploads.js";
import { writeFile } from "fs/promises";
import { join } from "path";
import { nanoid } from "nanoid";

export async function listDocuments(applicationId: string) {
  return prisma.uploadedDocument.findMany({
    where: { applicationId },
    include: {
      uploadedBy: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function uploadDocument(applicationId: string, file: any, userId: string) {
  const validation = validateFile(file.mimetype, file.filesize);
  if (!validation.valid) {
    throw new Error(validation.error!);
  }

  const uploadDir = await ensureUploadDir();
  const ext = file.filename.split(".").pop();
  const filename = `${nanoid()}.${ext}`;
  const filePath = getUploadPath(filename);

  const buffer = await file.toBuffer();
  await writeFile(filePath, buffer);

  const document = await prisma.uploadedDocument.create({
    data: {
      documentType: (file.fields?.documentType?.value || "OTHER") as any,
      fileName: file.filename,
      filePath: `/uploads/${filename}`,
      fileSize: file.filesize,
      mimeType: file.mimetype,
      status: "PENDING",
      applicationId,
      uploadedById: userId,
    },
    include: {
      uploadedBy: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "DOCUMENT_UPLOADED",
      details: { fileName: file.filename, documentType: file.fields?.documentType?.value || "OTHER" },
      userId,
      applicationId,
    },
  });

  return document;
}

export async function updateDocumentStatus(id: string, status: string, rejectionReason?: string) {
  return prisma.uploadedDocument.update({
    where: { id },
    data: {
      status: status as any,
      rejectionReason: rejectionReason || null,
    },
  });
}

export async function deleteDocument(id: string) {
  return prisma.uploadedDocument.delete({ where: { id } });
}

export default { listDocuments, uploadDocument, updateDocumentStatus, deleteDocument };
