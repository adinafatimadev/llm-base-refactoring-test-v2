import { type ChirpClient, createChirpClient } from "@chirp/grpc-client";
import { type AdminSessionData, getAdminSessionData } from "./session.server";
const host = process.env.GRPC_API_HOST || "localhost:50051";
let client: ChirpClient | null = null;
export function getGrpcClient() {
	if (!client) client = createChirpClient({ host, secure: process.env.NODE_ENV === "production" });
	return client;
}
export function createAdminGrpcSessionToken(session: AdminSessionData) {
	return session.sessionToken;
}
export async function getAdminGrpcSessionToken() {
	const s = await getAdminSessionData();
	return s?.sessionToken;
}
export async function requireAdminGrpcSessionToken() {
	const t = await getAdminGrpcSessionToken();
	if (!t) throw new Error("Admin authentication required");
	return t;
}
export function fromProtoTimestamp(t: { seconds: bigint; nanos: number } | undefined) {
	return t ? new Date(Number(t.seconds) * 1000 + Math.floor(t.nanos / 1000000)) : new Date();
}
