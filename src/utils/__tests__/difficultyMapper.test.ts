import { expect, test, describe } from "bun:test";
import {
  getRSVPConfig,
  getChunkingConfig,
  getPacerConfig,
  getSchulteConfig,
  getScanningConfig,
} from "../difficultyMapper";

describe("Difficulty Mapper", () => {

  describe("RSVP Configuration", () => {
    test("Calculates WPM correctly based on level", () => {
      expect(getRSVPConfig(1 as any).wpm).toBe(150); // 100 + 1*50
      expect(getRSVPConfig(5 as any).wpm).toBe(350); // 100 + 5*50
      expect(getRSVPConfig(10 as any).wpm).toBe(600); // 100 + 10*50
    });
  });

  describe("Chunking Configuration", () => {
    test("Calculates WPM correctly", () => {
      expect(getChunkingConfig(1 as any).wpm).toBe(150);
      expect(getChunkingConfig(10 as any).wpm).toBe(600);
    });

    test("Adjusts chunk size based on level", () => {
      // Level 1-3 -> chunkSize: 1
      expect(getChunkingConfig(1 as any).chunkSize).toBe(1);
      expect(getChunkingConfig(3 as any).chunkSize).toBe(1);
      // Level 4-6 -> chunkSize: 2
      expect(getChunkingConfig(4 as any).chunkSize).toBe(2);
      expect(getChunkingConfig(6 as any).chunkSize).toBe(2);
      // Level 7-8 -> chunkSize: 3
      expect(getChunkingConfig(7 as any).chunkSize).toBe(3);
      expect(getChunkingConfig(8 as any).chunkSize).toBe(3);
      // Level 9-10 -> chunkSize: 4
      expect(getChunkingConfig(9 as any).chunkSize).toBe(4);
      expect(getChunkingConfig(10 as any).chunkSize).toBe(4);
    });
  });

  describe("Pacer Configuration", () => {
    test("Calculates WPM correctly", () => {
      expect(getPacerConfig(1 as any).wpm).toBe(150);
      expect(getPacerConfig(10 as any).wpm).toBe(600);
    });

    test("Adjusts highlight mode based on level", () => {
      // Level <= 5 -> line mode
      expect(getPacerConfig(1 as any).highlightMode).toBe('line');
      expect(getPacerConfig(5 as any).highlightMode).toBe('line');
      // Level > 5 -> word mode
      expect(getPacerConfig(6 as any).highlightMode).toBe('word');
      expect(getPacerConfig(10 as any).highlightMode).toBe('word');
    });
  });

  describe("Schulte Configuration", () => {
    test("Adjusts grid size based on level", () => {
      // Level 1-2 -> 3x3
      expect(getSchulteConfig(1 as any).gridSize).toBe(3);
      expect(getSchulteConfig(2 as any).gridSize).toBe(3);
      // Level 3-5 -> 4x4
      expect(getSchulteConfig(3 as any).gridSize).toBe(4);
      expect(getSchulteConfig(5 as any).gridSize).toBe(4);
      // Level 6-8 -> 5x5
      expect(getSchulteConfig(6 as any).gridSize).toBe(5);
      expect(getSchulteConfig(8 as any).gridSize).toBe(5);
      // Level 9-10 -> 6x6
      expect(getSchulteConfig(9 as any).gridSize).toBe(6);
      expect(getSchulteConfig(10 as any).gridSize).toBe(6);
    });

    test("Calculates numberRange correctly", () => {
      expect(getSchulteConfig(2 as any).numberRange).toBe(9); // 3x3 = 9
      expect(getSchulteConfig(5 as any).numberRange).toBe(16); // 4x4 = 16
      expect(getSchulteConfig(8 as any).numberRange).toBe(25); // 5x5 = 25
      expect(getSchulteConfig(10 as any).numberRange).toBe(36); // 6x6 = 36
    });
  });

  describe("Scanning Configuration", () => {
    test("Adjusts grid size based on level", () => {
      // Level 1-3 -> 4x4
      expect(getScanningConfig(1 as any).gridSize).toBe(4);
      expect(getScanningConfig(3 as any).gridSize).toBe(4);
      // Level 4-6 -> 5x5
      expect(getScanningConfig(4 as any).gridSize).toBe(5);
      expect(getScanningConfig(6 as any).gridSize).toBe(5);
      // Level 7-8 -> 6x6
      expect(getScanningConfig(7 as any).gridSize).toBe(6);
      expect(getScanningConfig(8 as any).gridSize).toBe(6);
      // Level 9-10 -> 7x7
      expect(getScanningConfig(9 as any).gridSize).toBe(7);
      expect(getScanningConfig(10 as any).gridSize).toBe(7);
    });

    test("Calculates target and distractor counts correctly", () => {
      const config1 = getScanningConfig(1 as any);
      expect(config1.targetCount).toBe(3); // 3 + Math.floor(1/2) = 3
      expect(config1.distractorCount).toBe(16 - 3); // 4x4 = 16 total

      const config5 = getScanningConfig(5 as any);
      expect(config5.targetCount).toBe(5); // 3 + Math.floor(5/2) = 3 + 2 = 5
      expect(config5.distractorCount).toBe(25 - 5); // 5x5 = 25 total

      const config10 = getScanningConfig(10 as any);
      expect(config10.targetCount).toBe(7); // Max is 7
      expect(config10.distractorCount).toBe(49 - 7); // 7x7 = 49 total
    });
  });



  describe("Edge/Boundary Cases (Unsafe/Invalid output check)", () => {
    // Tests to ensure if a strange level is passed (e.g. from an old cache or bug), 
    // it doesn't return NaN or break.
    test("Handles level 0 gracefully (extrapolates backward)", () => {
      const rsvp = getRSVPConfig(0 as any);
      expect(rsvp.wpm).toBe(100); 

      const chunking = getChunkingConfig(0 as any);
      expect(chunking.chunkSize).toBe(1);

      const schulte = getSchulteConfig(0 as any);
      expect(schulte.gridSize).toBe(3);
    });

    test("Handles abnormally high levels (extrapolates forward)", () => {
      const rsvp = getRSVPConfig(20 as any);
      expect(rsvp.wpm).toBe(1100); 

      const chunking = getChunkingConfig(20 as any);
      expect(chunking.chunkSize).toBe(4);

      const schulte = getSchulteConfig(20 as any);
      expect(schulte.gridSize).toBe(6);
    });
  });

});
