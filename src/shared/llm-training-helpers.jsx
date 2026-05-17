// Shared data constants for llm-training section chapters.
// Extracted from src/sections/llm-training.jsx so they can be imported
// by both the current monolithic section file and the future per-chapter files.

export const SCORES = {
  the: 4.2,
  cat: 1.1,
  sat: 0.3,
  on: -0.5,
  mat: 3.8,
  a: 2.1,
  dog: 0.8,
  ran: -0.2,
  is: 0.5,
  was: 1.4,
  big: -1.5,
  small: -2.1,
  red: -1.8,
  blue: -2.3,
  and: 0.9,
  in: 1.6,
  it: 0.2,
  my: -3.1,
  to: 0.7,
  with: -0.9,
};

export const EXP_SCORES = {};
let _expSum = 0;
Object.entries(SCORES).forEach(([w, s]) => {
  EXP_SCORES[w] = Math.exp(s);
  _expSum += Math.exp(s);
});
export const EXP_SUM = _expSum;

export const SORTED_SCORES = Object.entries(SCORES).sort((a, b) => b[1] - a[1]);
export const SORTED_PROBS = Object.entries(SCORES)
  .map(([w, s]) => [w, Math.exp(s) / EXP_SUM])
  .sort((a, b) => b[1] - a[1]);
