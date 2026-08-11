/// <reference types="bun-types" />
import { expect, test, describe } from "bun:test";
import { timingSafeEqual, parseRevenueCatEvent } from "../http";

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

describe("parseRevenueCatEvent", () => {
  test("rejects a payload with no event field", () => {
    const result = parseRevenueCatEvent({ foo: "bar" });
    expect("error" in result).toBe(true);
  });

  test("rejects a null/non-object payload", () => {
    expect("error" in parseRevenueCatEvent(null)).toBe(true);
    expect("error" in parseRevenueCatEvent("string")).toBe(true);
    expect("error" in parseRevenueCatEvent(undefined)).toBe(true);
  });

  test("rejects an event missing app_user_id", () => {
    const result = parseRevenueCatEvent({ event: { type: "INITIAL_PURCHASE" } });
    expect("error" in result).toBe(true);
  });

  test("parses a valid INITIAL_PURCHASE event", () => {
    const result = parseRevenueCatEvent({
      event: {
        id: "evt_123",
        type: "INITIAL_PURCHASE",
        app_user_id: "user_abc",
        entitlement_ids: ["hizli-okuma Pro"],
        expiration_at_ms: Date.now() + 1000 * 60 * 60 * 24 * 30,
      },
    });
    if ("error" in result) throw new Error("expected a parsed event");
    expect(result.eventId).toBe("evt_123");
    expect(result.eventType).toBe("INITIAL_PURCHASE");
    expect(result.clerkId).toBe("user_abc");
    expect(result.isPremium).toBe(true);
  });

  test("EXPIRATION event forces isPremium false even with entitlement_ids present", () => {
    const result = parseRevenueCatEvent({
      event: {
        id: "evt_456",
        type: "EXPIRATION",
        app_user_id: "user_abc",
        entitlement_ids: ["hizli-okuma Pro"],
      },
    });
    if ("error" in result) throw new Error("expected a parsed event");
    expect(result.isPremium).toBe(false);
  });

  test("a past expiration_at_ms forces isPremium false", () => {
    const result = parseRevenueCatEvent({
      event: {
        id: "evt_789",
        type: "RENEWAL",
        app_user_id: "user_abc",
        entitlement_ids: ["hizli-okuma Pro"],
        expiration_at_ms: Date.now() - 1000,
      },
    });
    if ("error" in result) throw new Error("expected a parsed event");
    expect(result.isPremium).toBe(false);
  });

  test("missing event id parses as eventId: null (caller must skip dedup)", () => {
    const result = parseRevenueCatEvent({
      event: { type: "RENEWAL", app_user_id: "user_abc", entitlement_ids: [] },
    });
    if ("error" in result) throw new Error("expected a parsed event");
    expect(result.eventId).toBeNull();
  });
});
