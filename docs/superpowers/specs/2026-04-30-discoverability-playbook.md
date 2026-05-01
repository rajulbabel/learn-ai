# Discoverability Setup Guide

Goal: Make `https://rajulbabel.github.io/learn-ai/` and "Rajul Babel" appear when anyone searches on Google, Bing, ChatGPT, Claude, Gemini, Perplexity, etc.

## How to use this file

- Each step has a **Status** field. Update it as you (or Claude) progress.
- Steps marked `[I do]` mean Claude can execute them - just reply with the trigger phrase.
- Steps marked `[You do]` mean you click through the UI manually.
- Status values: `⬜ Not started`, `🟡 In progress`, `✅ Done`, `⏭️ Skipped`, `🔄 Recurring`.

---

## 1. GitHub profile [I do]

**Trigger:** Reply "yes do profile"
**Status:** ✅ Done

I will:
- Set bio: "Author of Learn AI - free visual guide to AI internals, RAG, vector DBs, agents. https://rajulbabel.github.io/learn-ai/"
- Set Website field: `https://rajulbabel.github.io/learn-ai/`
- Pin `learn-ai` repo
- Create `rajulbabel/rajulbabel` profile README repo

---

## 2. GitHub repo polish [I do]

**Trigger:** Reply "do repo polish"
**Status:** ✅ Done

I will:
- Set About description on `rajulbabel/learn-ai`
- Set Website to learn-ai URL
- Add topics: `ai`, `machine-learning`, `llm`, `transformer`, `attention`, `rag`, `vector-database`, `langgraph`, `education`, `interactive`
- Create `LICENSE` file (MIT, in your name)
- Improve `README.md` with hero screenshot + live site link

---

## 3. Deploy code changes [I do]

**Trigger:** Reply "push it"
**Status:** ⬜ Not started

I will: commit + push to `main`. GitHub Pages auto-deploys in ~2 min.

---

## 4. Google Search Console [You do]

**Status:** ⬜ Not started

1. Open https://search.google.com/search-console in Chrome (logged into your Google account).
2. Click **Add property** (top-left dropdown if existing user, or **Start now** button).
3. Choose the **URL prefix** card (right side).
4. Paste `https://rajulbabel.github.io/learn-ai/` → click **Continue**.
5. Verification page opens. Click **HTML tag** to expand it.
6. Copy the FULL meta tag shown, looks like:
   `<meta name="google-site-verification" content="abc123XYZ..." />`
7. Send that line to Claude in chat.
8. Claude pastes it into `index.html` + pushes (Step 3).
9. Wait 2 min for deploy → click **Verify** on Google page.
10. Once verified, left sidebar → **Sitemaps** → enter `sitemap.xml` → click **Submit**.
11. Left sidebar → **URL Inspection** → paste `https://rajulbabel.github.io/learn-ai/` → click **Request indexing**.

---

## 5. Bing Webmaster Tools [You do]

**Status:** ⬜ Not started

1. Open https://www.bing.com/webmasters in Chrome.
2. Click **Sign in** → use Microsoft / Google / Facebook account.
3. After login, click **Import your sites from Google Search Console** (auto-imports verification + sitemap). Skip steps 4-9 if this works.
4. Otherwise click **Add a site** manually.
5. Paste `https://rajulbabel.github.io/learn-ai/` → click **Add**.
6. Choose **HTML Meta Tag** verification method.
7. Copy the meta tag content value.
8. Send to Claude.
9. Claude pastes into `index.html` + pushes; wait 2 min, click **Verify** on Bing.
10. Left sidebar → **Sitemaps** → click **Submit sitemap** → enter `https://rajulbabel.github.io/learn-ai/sitemap.xml`.
11. Left sidebar → **URL Submission** → paste your URL → click **Submit**.

Why important: Bing index powers ChatGPT search, DuckDuckGo, Yahoo.

---

## 6. Open Graph image [I do]

**Trigger:** Reply "make og image"
**Status:** ⬜ Not started

I will:
- Generate `public/og.png` (1200x630) with title + your name + tagline.
- Add `og:image` and `twitter:image` meta tags to `index.html`.
- Push.

Why important: Without this, every social share looks bare and gets ignored.

---

## 7. LinkedIn [You do]

**Status:** ⬜ Not started

### 7a. Bio + Featured

1. Open https://www.linkedin.com/in/rajulbabel.
2. Click the **Edit profile** pencil (top-right of header card).
3. **Headline** field → add: "Building Learn AI - free visual guide to AI".
4. Scroll to **Website** field in dialog → enter `https://rajulbabel.github.io/learn-ai/` → label "Learn AI".
5. Click **Save**.
6. Back on profile, find the **Featured** section. If missing, click **Add profile section** → **Recommended** → **Add Featured**.
7. Click **+** → **Add a link** → paste learn-ai URL → upload screenshot of TOC page → **Save**.

### 7b. Launch post

1. LinkedIn home → **Start a post**.
2. Paste:
   > Spent months building this. **Learn AI** - a free, visual, interactive guide that teaches AI end-to-end: model internals, RAG, vector databases, agent frameworks. No watered-down content - real formulas, real numbers, real diagrams.
   >
   > Click-through learning. From neural nets to agents.
   >
   > https://rajulbabel.github.io/learn-ai/
   >
   > Feedback welcome.
3. Add 2-3 screenshots (TOC + favorite chapter).
4. Click **Post**.

### 7c. Long-form article

1. LinkedIn home → **Write article** (top of feed, near "Start a post").
2. Title: `Why I built Learn AI`.
3. Body: 500-800 words on motivation + what it covers + link to site at top + bottom.
4. Click **Publish**.

---

## 8. Hacker News Show HN [You do]

**Status:** ⬜ Not started

1. Open https://news.ycombinator.com/submit (sign up free if no account).
2. **Title** field: `Show HN: Learn AI - free visual guide from neural nets to RAG and vector DBs`.
3. **URL** field: `https://rajulbabel.github.io/learn-ai/`.
4. Leave **text** empty, or short context: "I built this over the past few months. Visual interactive chapters covering AI internals, RAG, vector databases, agent frameworks. Free, no signup. Feedback welcome."
5. Click **Submit**.
6. Refresh, click into your post, reply to first comments yourself.

Best time to post: Tue-Thu, 8-10am Pacific.

---

## 9. Reddit posts [You do]

**Status:** ⬜ Not started

For each subreddit below:

1. Open subreddit URL.
2. Click **Create Post**.
3. Title: `Built a free visual guide to AI - covers internals, RAG, vector databases, agents`.
4. Body:
   > I built [Learn AI](https://rajulbabel.github.io/learn-ai/) - free, interactive, no signup. Visual explanations of model internals, attention, RAG, vector databases, agent frameworks.
   >
   > Feedback welcome - what's missing, what's confusing.
5. Attach 1-2 screenshots.
6. Click **Post**.

Subreddits (one post each, spread over 2-3 days):

- https://www.reddit.com/r/learnmachinelearning/ ⬜
- https://www.reddit.com/r/LocalLLaMA/ ⬜
- https://www.reddit.com/r/LLMDevs/ ⬜
- https://www.reddit.com/r/MachineLearning/ ⬜ (read rules first - prefix title `[P]` for project)

---

## 10. Cross-post articles [You write, then click]

**Status:** ⬜ Not started

Pick 1 chapter (e.g., chapter 7 attention or chapter 11.7 HNSW). Rewrite as a standalone 800-1500 word article. Add at top and bottom:
> Full interactive version + 100 more chapters at [Learn AI](https://rajulbabel.github.io/learn-ai/).

### 10a. dev.to
1. https://dev.to/new (sign up free).
2. Paste markdown article.
3. **Tags**: `ai`, `machinelearning`, `llm`, `tutorial`.
4. Click **Publish**.

### 10b. Hashnode
1. https://hashnode.com (sign up free, create blog).
2. **Write** → paste markdown.
3. **Tags**: same as above.
4. Click **Publish**.

### 10c. Medium
1. https://medium.com/new-story (sign up free).
2. Paste content.
3. Optional: submit to a publication (e.g., **Towards Data Science**) via that publication's submission page.
4. Click **Publish**.

---

## 11. Awesome-list PRs [I draft, you monitor]

**Trigger:** Reply "draft awesome PRs"
**Status:** ⬜ Not started

I will:
- Fork each target repo.
- Add a learn-ai entry in the correct alphabetical/categorical position.
- Commit + push to your fork.
- Open PR via `gh` CLI.
- Send you the PR URLs - you just monitor for merge.

Targets:

- https://github.com/josephmisiti/awesome-machine-learning ⬜
- https://github.com/Hannibal046/Awesome-LLM ⬜
- https://github.com/currentslab/awesome-vector-search ⬜
- https://github.com/lucifertrj/Awesome-RAG ⬜

---

## 12. ProductHunt launch [You do]

**Status:** ⬜ Not started

1. Open https://www.producthunt.com/posts/new (sign up free).
2. Click **New product**.
3. **Name**: `Learn AI`.
4. **Tagline**: `Free, visual, interactive guide to AI - internals to production`.
5. **Link**: `https://rajulbabel.github.io/learn-ai/`.
6. **Description**: 260 chars max - reuse the description text.
7. **Topics**: AI, Education, Developer Tools.
8. Upload 3-5 screenshots + 1 thumbnail (240x240).
9. Click **Schedule** → pick a Tuesday 12:01am Pacific (best launch slot).
10. On launch day: post on LinkedIn + Twitter + Reddit asking for upvotes. Never DM individuals "please upvote" - that gets the post banned.

---

## 13. YouTube screencast [You do]

**Status:** ⬜ Not started

1. Record screen: Mac → Cmd+Shift+5; alternative → OBS Studio (free).
2. 5-10 min walkthrough: open site → walk through TOC → demo 2-3 favorite chapters → close with URL on screen.
3. Open https://youtube.com/upload.
4. Upload video.
5. **Title**: `Learn AI - Free Visual Guide to How AI Works`.
6. **Description**:
   ```
   Learn AI: https://rajulbabel.github.io/learn-ai/

   A free, interactive, visual guide to AI - from neural network internals to RAG and vector databases.

   Chapters covered:
   00:00 Intro
   00:30 Table of contents tour
   ...

   By Rajul Babel
   GitHub: https://github.com/rajulbabel/learn-ai
   LinkedIn: https://www.linkedin.com/in/rajulbabel
   ```
7. **Tags**: `ai`, `machine learning`, `transformer`, `rag`, `vector database`, `learn ai`, `tutorial`.
8. **Thumbnail**: same image as OG image.
9. Click **Publish**.

Why important: YouTube videos rank in Google top results for educational queries.

---

## 14. Q&A site answers [You do, ongoing] 🔄

**Status:** ⬜ Not started

### Quora
1. https://www.quora.com (sign up free).
2. Search for: "how does attention work", "what is RAG", "what is a vector database".
3. Pick questions with high follower count and few good answers.
4. Write a 200-400 word answer.
5. End with: "For a visual interactive walkthrough, see [chapter X of Learn AI](https://rajulbabel.github.io/learn-ai/)."

### Stack Overflow
- Same approach, but only on questions you can technically answer.
- Don't spam - link only when genuinely helpful.

---

## What to do when you make code changes to the app

Most discoverability work is done once. But these tasks recur every time content changes meaningfully.

### After every push to `main`

- ✅ GitHub Pages auto-deploys. Nothing to do.
- ⬜ If you added or renamed a chapter, update the mapping table in `CLAUDE.md` (already a project rule).

### When you add a new section or many new chapters

- ⬜ Update `public/llms.txt` - the topic list under "What it covers".
- ⬜ Update `index.html` JSON-LD `teaches` array if the new content is a major topic area.
- ⬜ Update `index.html` `<meta name="description">` if the description should now mention the new topic.
- ⬜ Update `public/sitemap.xml` if you ever move to per-chapter URLs (right now everything is one SPA URL, so no change needed).
- ⬜ In Google Search Console: **URL Inspection** → paste site URL → click **Request indexing** to nudge re-crawl.
- ⬜ In Bing Webmaster Tools: **URL Submission** → paste URL → **Submit**.

### When you change the site's visual identity (logo, hero, colors)

- ⬜ Regenerate `public/og.png` so social shares look right.

### When you change the page title, description, or author name

- ⬜ Update `index.html` `<title>`, `<meta name="description">`, `og:title`, `og:description`, `twitter:title`, `twitter:description`, JSON-LD `name`/`description`.
- ⬜ Update `public/llms.txt` heading + summary line.
- ⬜ Update `DISCOVERABILITY.md` (this file) if any URLs or claims shift.

### Code-quality rules from CLAUDE.md (always)

- ⬜ Test-Driven Development: write tests first, code second. Mandatory for every change.
- ⬜ Run `npm run test` and `npm run lint` before pushing.
- ⬜ Coverage must not decrease.
- ⬜ For UI changes, test in the browser before reporting done.

---

## Quick reference: what I need from you to start

Reply with any of these triggers:

- `yes do profile` → I run Step 1 (GitHub profile + README repo).
- `do repo polish` → I run Step 2 (About, topics, LICENSE, README).
- `push it` → I run Step 3 (deploy current branch).
- `make og image` → I run Step 6 (OG image + tags).
- `draft awesome PRs` → I run Step 11 (awesome-list PR drafts).

Steps 4, 5, 7, 8, 9, 10, 12, 13, 14 are click-through - you do them, then send me the verification meta tags from Steps 4 and 5.
