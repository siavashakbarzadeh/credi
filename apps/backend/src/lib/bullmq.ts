import { Queue, Worker } from "bullmq";

const connection = { url: process.env.REDIS_URL || "redis://localhost:6379" };

export const googleWatchRenewalQueue = new Queue("google-watch-renewal", {
  connection,
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
    { connection }
  );
}

export default { googleWatchRenewalQueue, createGoogleWatchRenewalWorker };
