import { describe, expect, it } from "vitest";
import { createGrpcSessionToken } from "./grpc.server";
describe("client/API trust", () => {
	it("forwards the API-issued credential instead of minting a new JWT", () => {
		const token = "api-issued-token";
		expect(createGrpcSessionToken({ userId: "u", username: "user", sessionToken: token })).toBe(
			token,
		);
	});
});
