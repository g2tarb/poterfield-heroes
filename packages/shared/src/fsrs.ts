// FSRS-4 wrapper for Porterfield Heroes.
// We use ts-fsrs (MIT) and adapt its output to our DB columns.

import {
  fsrs as createFsrs,
  generatorParameters,
  Rating,
  State,
  type Card as FsrsCard,
  type Grade,
} from "ts-fsrs";

export const FSRS_RATING = {
  again: 1, // = Rating.Again
  hard: 2,
  good: 3,
  easy: 4,
} as const;

export type FsrsRating = (typeof FSRS_RATING)[keyof typeof FSRS_RATING];

// FSRS uses retention 0.9 by default — we keep it. Higher = more reviews, better retention.
const params = generatorParameters({ enable_fuzz: true, request_retention: 0.9 });
const scheduler = createFsrs(params);

export type CardStateString = "new" | "learning" | "review" | "mature" | "suspended";

function fsrsStateToString(state: State, intervalDays: number): CardStateString {
  if (state === State.New) return "new";
  if (state === State.Learning || state === State.Relearning) return "learning";
  if (state === State.Review && intervalDays >= 21) return "mature";
  return "review";
}

export function buildFsrsCard(args: {
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  intervalDays: number;
  state: CardStateString;
  lastReviewAt: Date | null;
  dueAt: Date;
}): FsrsCard {
  let state: State = State.New;
  if (args.state === "learning") state = State.Learning;
  else if (args.state === "review" || args.state === "mature")
    state = State.Review;

  return {
    due: args.dueAt,
    stability: args.stability,
    difficulty: args.difficulty,
    elapsed_days: 0,
    scheduled_days: args.intervalDays,
    reps: args.reps,
    lapses: args.lapses,
    state,
    ...(args.lastReviewAt ? { last_review: args.lastReviewAt } : {}),
  };
}

export type ScheduleResult = {
  rating: FsrsRating;
  nextCard: {
    stability: number;
    difficulty: number;
    reps: number;
    lapses: number;
    intervalDays: number;
    state: CardStateString;
    dueAt: Date;
    lastReviewAt: Date;
  };
  log: {
    stabilityBefore: number;
    stabilityAfter: number;
    difficultyBefore: number;
    difficultyAfter: number;
    elapsedDays: number;
    scheduledDays: number;
  };
};

export function reviewCard(args: {
  current: FsrsCard;
  rating: FsrsRating;
  now?: Date;
}): ScheduleResult {
  const now = args.now ?? new Date();
  const ratingMap: Record<FsrsRating, Grade> = {
    1: Rating.Again,
    2: Rating.Hard,
    3: Rating.Good,
    4: Rating.Easy,
  };
  const fsrsRating = ratingMap[args.rating];

  const result = scheduler.next(args.current, now, fsrsRating);
  const c = result.card;
  const log = result.log;

  return {
    rating: args.rating,
    nextCard: {
      stability: c.stability,
      difficulty: c.difficulty,
      reps: c.reps,
      lapses: c.lapses,
      intervalDays: c.scheduled_days,
      state: fsrsStateToString(c.state, c.scheduled_days),
      dueAt: c.due,
      lastReviewAt: now,
    },
    log: {
      stabilityBefore: log.stability ?? 0,
      stabilityAfter: c.stability,
      difficultyBefore: log.difficulty ?? 0,
      difficultyAfter: c.difficulty,
      elapsedDays: log.elapsed_days,
      scheduledDays: log.scheduled_days,
    },
  };
}
