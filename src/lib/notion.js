import { Client } from '@notionhq/client';

// Mixes are hardcoded in src/data/mixes.js, not pulled from Notion — see
// that file to add one. Site Content (bio/tagline/booking text) still
// reads from Notion at build time.
//
// Reads credentials from Vercel environment variables.
// Set NOTION_TOKEN and NOTION_SITE_CONTENT_DATABASE_ID in your Vercel
// project settings.
const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });
const siteContentDatabaseId = import.meta.env.NOTION_SITE_CONTENT_DATABASE_ID;

// Pulls every row from the Site Content database and shapes it into a
// { key: value } map, so pages can do content.homepage_bio, etc.
// Add a row in Notion first; the "Key" value is what pages look up.
export async function getSiteContent() {
  const response = await notion.databases.query({
    database_id: siteContentDatabaseId,
  });

  const content = {};
  for (const page of response.results) {
    const props = page.properties;
    const key = props['Key']?.title?.[0]?.plain_text;
    const value = props['Value']?.rich_text?.[0]?.plain_text ?? '';
    if (key) content[key] = value;
  }
  return content;
}
