import { useSession } from "@tanstack/react-start/server";
export interface AdminSessionData {
	userId: string;
	username: string;
	role: "admin" | "moderator";
	sessionToken: string;
}
const configured = process.env.SESSION_SECRET;
if (process.env.NODE_ENV === "production" && !configured)
	throw new Error("SESSION_SECRET must be configured in production");
const secret = configured || "development-only-admin-session-secret";
export function useAdminSession() {
	return useSession<AdminSessionData>({
		password: secret,
		name: "chirp-admin-session",
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 28800,
		},
	});
}
export async function getAdminSessionData() {
	const s = await useAdminSession();
	if (!s.data.userId || !s.data.role || !s.data.sessionToken) return null;
	if (s.data.role !== "admin" && s.data.role !== "moderator") return null;
	return s.data as AdminSessionData;
}
export async function setAdminSessionData(d: AdminSessionData) {
	const s = await useAdminSession();
	await s.update(d);
}
export async function clearAdminSessionData() {
	const s = await useAdminSession();
	await s.clear();
}
export async function requireAdminAuth() {
	const s = await getAdminSessionData();
	if (!s) throw new Error("Admin access required");
	return s;
}
