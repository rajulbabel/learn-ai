---
name: verify
description: Run all quality checks - tests, coverage, lint, and format. Use when the user wants to verify code quality or after making changes.
user-invocable: true
allowed-tools: Bash
---

# Verify All Quality Checks

Run these checks in sequence. Stop on first failure and report the issue.

## Step 1: Unit Tests
```bash
npm run test
```
If tests fail, report which tests failed and why. Do not continue.

## Step 2: Coverage Check
```bash
npx vitest run --coverage
```
Coverage must not decrease from current targets (100% lines, 97.7%+ branches).
If coverage dropped, report which files/lines are uncovered. Do not continue.

## Step 3: Lint
```bash
npm run lint
```
If lint errors found, report them. Do not continue.

## Step 4: Format Check
```bash
npm run format -- --check
```
If formatting issues found, list the files.

## Report

Summarize results:
- Tests: PASS/FAIL (count)
- Coverage: lines% / branches%
- Lint: PASS/FAIL
- Format: PASS/FAIL
