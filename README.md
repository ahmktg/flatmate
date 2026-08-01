# Flatmate — site

Astro site. Mixes are hardcoded in `src/data/mixes.js` — no Notion, no
build-time API calls, no env vars to break. Bio/tagline/booking text still
comes from a Notion database at build time.

## Adding a mix

Open `src/data/mixes.js` and add an entry to the array:

```js
{
  slug: 'my-new-mix',          // becomes the URL: /mixes/my-new-mix
  title: 'My New Mix',
  soundcloudUrl: 'https://soundcloud.com/you/my-new-mix', // share link, not embed code
  date: '2026-01-01',          // YYYY-MM-DD
  description: '',             // optional
},
```

Keep the list sorted newest first — the homepage shows the top 3. Commit
and push; Vercel rebuilds automatically. The SoundCloud player embed and
branding are handled automatically by the page template.

## 1. Create the Site Content database

Already created in this workspace ("Site Content") — this section is here
for reference if you ever rebuild from scratch.

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
3. Open the Site Content database in Notion → `•••` menu (top right) →
   Connections → add the integration you just created. Without this step
   the API can't see the table.
4. Copy the database ID from its URL:
   `notion.so/yourworkspace/DATABASE_ID?v=...` — the 32-character string
   before `?v=` is `NOTION_SITE_CONTENT_DATABASE_ID`.

## 3. Push this project to GitHub

Create a new repo on GitHub, then upload this folder to it (drag-and-drop
works fine on GitHub's web UI, or use git if you prefer).

## 4. Connect GitHub to Vercel

1. vercel.com → New Project → import the GitHub repo.
2. Framework preset: Astro (auto-detected).
3. Add environment variables in the project settings:
   - `NOTION_TOKEN` = the token from step 2
   - `NOTION_SITE_CONTENT_DATABASE_ID` = the database ID from step 2
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

- **Add/edit a mix:** edit `src/data/mixes.js` (see "Adding a mix" above)
  and push. A new page appears automatically at `/mixes/your-slug` with the
  SoundCloud player embedded.
- **Edit bio, homepage tagline, or booking info:** edit the matching row's
  Value in the Site Content table in Notion → click Republish. No code
  changes needed.
