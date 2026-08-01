# Your DJ Name — site

Astro site, static content in the code, mixes pulled from a Notion database
at build time. No local tools needed once it's set up — edit Notion, click
Republish, done.

## 1. Create the Notion databases

Two databases, both already created in this workspace ("Mixes" and
"Site Content") — this section is here for reference if you ever rebuild
from scratch.

**Mixes** (table view) with exactly these columns:

| Column name       | Type  |
|--------------------|-------|
| Title              | Title |
| SoundCloud Link     | URL   |
| Date               | Date  |
| Description        | Text  |

Add one row per mix. `SoundCloud Link` is the normal share link from
SoundCloud (not the embed code) — e.g. `https://soundcloud.com/you/mix-name`.

**Site Content** (table view) with exactly these columns:

| Column name | Type  |
|-------------|-------|
| Key         | Title |
| Value       | Text  |

One row per editable piece of text. The site currently looks up these keys:
`homepage_tagline`, `homepage_bio`, `booking_intro`, `booking_email`. Edit
the Value cell, click Republish, done — no code changes needed.

## 2. Connect Notion's API

1. Go to notion.so/my-integrations → New integration → name it e.g. "DJ Site".
2. Copy the generated **Internal Integration Token** — this is `NOTION_TOKEN`.
3. Open each database in Notion → `•••` menu (top right) → Connections
   → add the integration you just created. Without this step the API can't
   see the table. Do this for both Mixes and Site Content.
4. Copy each database ID from its URL:
   `notion.so/yourworkspace/DATABASE_ID?v=...` — the 32-character string
   before `?v=` is the database ID. You'll need both — one for
   `NOTION_DATABASE_ID` (Mixes) and one for `NOTION_SITE_CONTENT_DATABASE_ID`
   (Site Content).

## 3. Push this project to GitHub

Create a new repo on GitHub, then upload this folder to it (drag-and-drop
works fine on GitHub's web UI, or use git if you prefer).

## 4. Connect GitHub to Vercel

1. vercel.com → New Project → import the GitHub repo.
2. Framework preset: Astro (auto-detected).
3. Add environment variables in the project settings:
   - `NOTION_TOKEN` = the token from step 2
   - `NOTION_DATABASE_ID` = the Mixes database ID from step 2
   - `NOTION_SITE_CONTENT_DATABASE_ID` = the Site Content database ID from step 2
4. Deploy. You'll get a live `.vercel.app` URL.
5. Add your custom domain under Project → Settings → Domains, and point
   your DNS at it (see the DNS notes from our chat).

## 5. Set up the Republish button

1. In Vercel: Project → Settings → Git → Deploy Hooks → create one
   (name it "Republish", branch `main`). Copy the URL it gives you.
2. Open `republish.html` in this folder, paste that URL into
   `DEPLOY_HOOK_URL`.
3. Upload `republish.html` somewhere you can open it (e.g. as a page in
   this same Vercel project, or just open the file locally in a browser
   and bookmark it). Clicking the button triggers an instant rebuild.

## Editing content going forward

- **Add/edit a mix:** edit the Mixes table in Notion → click Republish. A
  new page appears automatically at `/mixes/mix-title` with the SoundCloud
  player embedded.
- **Edit bio, homepage tagline, or booking info:** edit the matching row's
  Value in the Site Content table in Notion → click Republish. No code
  changes needed.
