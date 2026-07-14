import { googleWatchRenewalQueue, createGoogleWatchRenewalWorker } from "../../lib/bullmq.js";
import { renewWatchChannel } from "../../lib/google-watch.js";
import { logger } from "../../utils/logger.js";

export async function startWatchRenewalWorker() {
  const worker = createGoogleWatchRenewalWorker(async (data) => {
    logger.info("Rinnovo automatico watch channel", { channelId: data.channelId });
    try {
      await renewWatchChannel(data.channelId, data.applicationId);
      logger.info("Watch channel rinnovato con successo", { channelId: data.channelId });
    } catch (err) {
      logger.error("Errore rinnovo watch channel", {
        channelId: data.channelId,
        error: String(err),
      });
    }
  });

  worker.on("failed", (job, err) => {
    logger.error("Job di rinnovo fallito", { jobId: job?.id, error: String(err) });
  });

  logger.info("Worker di rinnovo watch channel avviato");
  return worker;
}

export default { startWatchRenewalWorker };
