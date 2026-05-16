import { describe, it, expect } from "vitest";
import { buildFsrsCard, reviewCard, FSRS_RATING } from "./fsrs.js";

describe("FSRS", () => {
  const newCard = buildFsrsCard({
    stability: 0,
    difficulty: 0,
    reps: 0,
    lapses: 0,
    intervalDays: 0,
    state: "new",
    lastReviewAt: null,
    dueAt: new Date(),
  });

  it("Again sur carte new → état learning, courte fenêtre", () => {
    const result = reviewCard({
      current: newCard,
      rating: FSRS_RATING.again,
      now: new Date("2026-01-01T10:00:00Z"),
    });
    expect(result.nextCard.state).toBe("learning");
    expect(result.nextCard.lapses).toBeGreaterThanOrEqual(0);
    expect(result.nextCard.dueAt.getTime()).toBeGreaterThan(
      new Date("2026-01-01T10:00:00Z").getTime(),
    );
  });

  it("Good sur new → état learning, interval > 0", () => {
    const result = reviewCard({
      current: newCard,
      rating: FSRS_RATING.good,
      now: new Date("2026-01-01T10:00:00Z"),
    });
    expect(["learning", "review"]).toContain(result.nextCard.state);
    expect(result.nextCard.intervalDays).toBeGreaterThanOrEqual(0);
  });

  it("Easy sur new → progression directe vers review", () => {
    const result = reviewCard({
      current: newCard,
      rating: FSRS_RATING.easy,
      now: new Date("2026-01-01T10:00:00Z"),
    });
    expect(["learning", "review", "mature"]).toContain(result.nextCard.state);
    expect(result.nextCard.intervalDays).toBeGreaterThanOrEqual(0);
  });

  it("rating object exposé", () => {
    expect(FSRS_RATING.again).toBe(1);
    expect(FSRS_RATING.hard).toBe(2);
    expect(FSRS_RATING.good).toBe(3);
    expect(FSRS_RATING.easy).toBe(4);
  });
});
