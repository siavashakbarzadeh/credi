import { Queue, Worker } from "bullmq";
import { redis } from "./redis.js";

export const googleWatchRenewalQueue = new Queue("google-watch-renewal", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

export function createGoogleWatchRenewalWorker(
  processor: (jobData: { channelId: string; applicationId: string }) => Promise<void>
): Worker {
  return new Worker(
    "google-watch-renewal",
    async (job) => {
      await processor(job.data);
    },
    { connection: redis }
  );
}

export default { googleWatchRenewalQueue, createGoogleWatchRenewalWorker };
