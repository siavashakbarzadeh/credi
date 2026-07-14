import { buildApp } from "./app.js";
import { ensureUploadDir } from "./utils/uploads.js";
import { createGoogleWatchRenewalWorker } from "./lib/bullmq.js";
import { renewWatchChannel } from "./lib/google-watch.js";
import { logger } from "./utils/logger.js";

const PORT = parseInt(process.env.PORT || "3001", 10);
const HOST = "0.0.0.0";

async function start() {
  await ensureUploadDir();

  const app = buildApp();

  createGoogleWatchRenewalWorker(async (data) => {
    logger.info("Rinnovo watch channel Google Drive", data);
    try {
      await renewWatchChannel(data.channelId, data.applicationId);
      logger.info("Watch channel rinnovato con successo", data);
    } catch (err) {
      logger.error("Errore rinnovo watch channel", { error: String(err), ...data });
    }
  });

  try {
    await app.listen({ port: PORT, host: HOST });
    logger.info(`Server in ascolto su http://${HOST}:${PORT}`);
    logger.info(`Ambiente: ${process.env.NODE_ENV || "development"}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
