export const Quiz = {
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
  STARTING: "STARTING",
  LOADING: "LOADING",
} as const;

export type QuizStatus = (typeof Quiz)[keyof typeof Quiz];
