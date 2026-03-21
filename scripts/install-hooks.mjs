/**
 * Installs git hooks. Called automatically by npm's "prepare" lifecycle
 * (runs after every `npm install`). No extra dependencies needed.
 */
import { writeFileSync, chmodSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const hooksDir = join(".git", "hooks");

if (!existsSync(".git")) {
  // Not inside a git repo (e.g., CI tarball) - skip silently
  process.exit(0);
}

if (!existsSync(hooksDir)) {
  mkdirSync(hooksDir, { recursive: true });
}

const preCommit = `#!/bin/sh
# Auto-installed by scripts/install-hooks.mjs
# Auto-sync embeddings with chunks before committing

# First check if they're already in sync
node scripts/check-embeddings.mjs 2>/dev/null
if [ $? -ne 0 ]; then
  echo "\\033[33m[pre-commit] Embeddings out of sync. Rebuilding...\\033[0m"
  npm run search:build
  if [ $? -ne 0 ]; then
    echo "\\033[31m[pre-commit] search:build failed. Commit aborted.\\033[0m"
    exit 1
  fi
  # Stage the updated files so they're included in this commit
  git add src/data/chunks.json src/data/embeddings.json src/data/embeddings-checksum.json
  echo "\\033[32m[pre-commit] Embeddings rebuilt and staged.\\033[0m"
fi
`;

const hookPath = join(hooksDir, "pre-commit");
writeFileSync(hookPath, preCommit);
chmodSync(hookPath, 0o755);
console.log("[hooks] Installed pre-commit hook (embedding sync check)");

// Clean up old pre-push hook if it exists from a previous install
const oldHook = join(hooksDir, "pre-push");
if (existsSync(oldHook)) {
  const { unlinkSync } = await import("fs");
  try {
    const content = readFileSync(oldHook, "utf-8");
    if (content.includes("check-embeddings")) {
      unlinkSync(oldHook);
      console.log("[hooks] Removed old pre-push hook");
    }
  } catch { /* ignore */ }
}
