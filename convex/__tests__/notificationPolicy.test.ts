/// <reference types="bun-types" />
import { expect, test, describe } from "bun:test";
import { decideNotification } from "../notificationPolicy";

describe("decideNotification", () => {
  test("INITIAL_PURCHASE returns a notification", () => {
    expect(decideNotification("INITIAL_PURCHASE")).not.toBeNull();
  });

  test("CANCELLATION returns a notification", () => {
    expect(decideNotification("CANCELLATION")).not.toBeNull();
  });

  test("UNCANCELLATION returns a notification", () => {
    expect(decideNotification("UNCANCELLATION")).not.toBeNull();
  });

  test("EXPIRATION returns a notification", () => {
    expect(decideNotification("EXPIRATION")).not.toBeNull();
  });

  test("BILLING_ISSUE returns a notification", () => {
    expect(decideNotification("BILLING_ISSUE")).not.toBeNull();
  });

  test("RENEWAL is silent by default to avoid spam", () => {
    expect(decideNotification("RENEWAL")).toBeNull();
  });

  test("unknown event types are silent", () => {
    expect(decideNotification("SOME_FUTURE_EVENT")).toBeNull();
    expect(decideNotification("")).toBeNull();
  });

  test("every returned notification has non-empty title/body and a screen", () => {
    for (const type of [
      "INITIAL_PURCHASE",
      "CANCELLATION",
      "UNCANCELLATION",
      "EXPIRATION",
      "BILLING_ISSUE",
    ]) {
      const content = decideNotification(type);
      expect(content?.title.length).toBeGreaterThan(0);
      expect(content?.body.length).toBeGreaterThan(0);
      expect(content?.data.screen.length).toBeGreaterThan(0);
    }
  });
});
