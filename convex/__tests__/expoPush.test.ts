/// <reference types="bun-types" />
import { expect, test, describe } from "bun:test";
import { buildExpoPushMessages, findDeadTokenIndexes } from "../expoPush";

describe("buildExpoPushMessages", () => {
  test("builds one message per token with shared content", () => {
    const messages = buildExpoPushMessages(["tokenA", "tokenB"], {
      title: "Title",
      body: "Body",
      data: { screen: "/settings" },
    });
    expect(messages).toEqual([
      { to: "tokenA", title: "Title", body: "Body", data: { screen: "/settings" } },
      { to: "tokenB", title: "Title", body: "Body", data: { screen: "/settings" } },
    ]);
  });

  test("empty token list produces no messages", () => {
    expect(buildExpoPushMessages([], { title: "t", body: "b" })).toEqual([]);
  });
});

describe("findDeadTokenIndexes", () => {
  test("flags only DeviceNotRegistered tickets", () => {
    const response = {
      data: [
        { status: "ok", id: "receipt-1" },
        { status: "error", message: "not registered", details: { error: "DeviceNotRegistered" } },
        { status: "error", message: "rate limited", details: { error: "MessageRateExceeded" } },
      ],
    };
    expect(findDeadTokenIndexes(["a", "b", "c"], response)).toEqual([1]);
  });

  test("returns empty array for malformed/missing response bodies", () => {
    expect(findDeadTokenIndexes(["a"], null)).toEqual([]);
    expect(findDeadTokenIndexes(["a"], {})).toEqual([]);
    expect(findDeadTokenIndexes(["a"], { data: "not-an-array" })).toEqual([]);
  });

  test("ignores tickets past the end of the token list", () => {
    const response = {
      data: [
        { status: "error", details: { error: "DeviceNotRegistered" } },
        { status: "error", details: { error: "DeviceNotRegistered" } },
      ],
    };
    expect(findDeadTokenIndexes(["a"], response)).toEqual([0]);
  });
});
