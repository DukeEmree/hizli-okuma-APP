/// <reference types="bun-types" />
import { expect, test, describe } from "bun:test";
import { timingSafeEqual } from "../http";

describe("timingSafeEqual", () => {
  test("returns true for identical strings", async () => {
    const secret = "my_super_secret_webhook_token_123";
    const result = await timingSafeEqual(secret, secret);
    expect(result).toBe(true);
  });

  test("returns false for completely different strings", async () => {
    const result = await timingSafeEqual("secret_A", "secret_B");
    expect(result).toBe(false);
  });

  test("returns false for strings of different lengths", async () => {
    const result = await timingSafeEqual("secret", "secret_long");
    expect(result).toBe(false);
  });

  test("returns false for strings with one character difference", async () => {
    const secret1 = "my_super_secret_webhook_token_123";
    const secret2 = "my_super_secret_webhook_token_124";
    const result = await timingSafeEqual(secret1, secret2);
    expect(result).toBe(false);
  });
});
