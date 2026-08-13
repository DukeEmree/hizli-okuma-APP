import { expect, test, describe } from "bun:test";
import { startingLevelFromWpm } from "../onboarding";
import { getRSVPConfig } from "../difficultyMapper";

describe("startingLevelFromWpm", () => {
  test("is the inverse of the reading exercises' level -> wpm mapping", () => {
    for (let level = 1; level <= 10; level++) {
      const { wpm } = getRSVPConfig(level as 1);
      expect(startingLevelFromWpm(wpm as number)).toBe(level as 1);
    }
  });

  test("clamps a slow reader to the minimum level rather than 0 or negative", () => {
    expect(startingLevelFromWpm(120)).toBe(1);
    expect(startingLevelFromWpm(40)).toBe(1);
  });

  test("clamps a very fast reader to the maximum level", () => {
    expect(startingLevelFromWpm(900)).toBe(10);
  });

  test("rounds to the nearest level instead of truncating", () => {
    // 320 WPM sits between level 4 (300) and level 5 (350); 320 is closer to 300.
    expect(startingLevelFromWpm(320)).toBe(4);
    expect(startingLevelFromWpm(330)).toBe(5);
  });

  test("treats a missing or nonsensical measurement as the minimum level", () => {
    expect(startingLevelFromWpm(0)).toBe(1);
    expect(startingLevelFromWpm(-50)).toBe(1);
    expect(startingLevelFromWpm(Number.NaN)).toBe(1);
  });
});
