import { useSession } from "@tanstack/react-start/server";
export interface SessionData {
	userId: string;
	username: string;
	sessionToken: string;
}
const configured = process.env.SESSION_SECRET;
if (process.env.NODE_ENV === "production" && !configured)
	throw new Error("SESSION_SECRET must be configured in production");
const secret = configured || "development-only-session-secret";
export function useAppSession() {
	return useSession<SessionData>({
		password: secret,
		name: "chirp-session",
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 604800,
		},
	});
}
export async function getSessionData() {
	const s = await useAppSession();
	if (!s.data.userId || !s.data.sessionToken) return null;
	return s.data as SessionData;
}
export async function setSessionData(data: SessionData) {
	const s = await useAppSession();
	await s.update(data);
}
export async function clearSessionData() {
	const s = await useAppSession();
	await s.clear();
}
export async function requireAuth() {
	const s = await getSessionData();
	if (!s) throw new Error("Unauthorized");
	return s;
}
