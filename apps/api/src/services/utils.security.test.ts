import { describe, expect, it } from "vitest";
import { hashPassword, isLegacyPasswordHash, legacyHashPassword, verifyPassword } from "./utils";
describe("password storage migration", () => {
	it("proves legacy hashes are accepted", async () => {
		const legacy = legacyHashPassword("password123");
		expect(isLegacyPasswordHash(legacy)).toBe(true);
		expect(await verifyPassword("password123", legacy)).toBe(true);
		expect(await verifyPassword("wrong", legacy)).toBe(false);
	});
	it("uses salted scrypt for new credentials", async () => {
		const a = await hashPassword("password123"),
			b = await hashPassword("password123");
		expect(a).toMatch(/^scrypt\$v1\$/);
		expect(b).not.toBe(a);
		expect(await verifyPassword("password123", a)).toBe(true);
		expect(await verifyPassword("wrong", a)).toBe(false);
	});
});
