import { createClient } from "redis"

export const redisClient = await createClient({
        url: process.env.REDIS_URL ?? "redis://localhost:6379"
    })
    .on("error", err => console.error(err))
    .connect();

const SESSION_TTL = 24*60*60; // 24 hours in seconds

export type SessionData = {
    userID: number;
    count: number;
}

export async function createSession(id: string, data: SessionData | void) {
    return await redisClient.set(id, JSON.stringify(data ?? {}), {EX: SESSION_TTL});
}

export async function getSession(id: string) {
    const sessionData = await redisClient.get(id);
    if(!sessionData)
        return null;

    await redisClient.expire(id, SESSION_TTL);
    return JSON.parse(sessionData) as SessionData;
}

export async function deleteSession(id: string) {
    return await redisClient.del(id);
}

export async function updateSession(id: string, data: Partial<SessionData>) {
    const sessionData = await getSession(id);
    if(!sessionData)
        return null;

    const newData = Object.assign({}, sessionData, data);

    return await redisClient.set(id, JSON.stringify(newData));
}