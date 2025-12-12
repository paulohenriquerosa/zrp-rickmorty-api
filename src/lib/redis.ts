// src/lib/redis.ts
import { createClient } from "redis";

const isTestEnv = process.env.NODE_ENV === "test";
const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

const realClient = createClient({ url: redisUrl });

realClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

let isConnected = false;

const testStub = {
  async get(_key: string): Promise<string | null> {
    return null;
  },
  async setEx(_key: string, _ttl: number, _value: string): Promise<void> {
    return;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  on(_event: string, _listener: (...args: unknown[]) => void): void {
    return;
  },
};

export const redis = (isTestEnv ? testStub : realClient) as typeof realClient;

export async function ensureRedisConnected(): Promise<void> {
  if (isTestEnv) {
    return;
  }

  if (!isConnected) {
    await realClient.connect();
    isConnected = true;
    console.log("Redis connected");
  }
}

