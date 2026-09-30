import { type ChirpClient, createChirpClient } from "@chirp/grpc-client";
import { getSessionData, type SessionData } from "./session.server";
const host = process.env.GRPC_API_HOST || "localhost:50051";
let client: ChirpClient | null = null;
export function getGrpcClient() {
	if (!client) client = createChirpClient({ host, secure: process.env.NODE_ENV === "production" });
	return client;
}
export function createGrpcSessionToken(session: SessionData) {
	return session.sessionToken;
}
export async function getGrpcSessionToken() {
	const s = await getSessionData();
	return s?.sessionToken;
}
export async function requireGrpcSessionToken() {
	const t = await getGrpcSessionToken();
	if (!t) throw new Error("Authentication required");
	return t;
}
export function fromProtoTimestamp(t: { seconds: bigint; nanos: number } | undefined) {
	return t ? new Date(Number(t.seconds) * 1000 + Math.floor(t.nanos / 1000000)) : new Date();
}
