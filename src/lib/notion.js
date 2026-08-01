import { Client } from '@notionhq/client';

// Reads credentials from Vercel environment variables.
// Set NOTION_TOKEN, NOTION_DATABASE_ID, and NOTION_SITE_CONTENT_DATABASE_ID
// in your Vercel project settings.
const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });
const databaseId = import.meta.env.NOTION_DATABASE_ID;
const siteContentDatabaseId = import.meta.env.NOTION_SITE_CONTENT_DATABASE_ID;

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Pulls every row from the Mixes database and shapes it into
// simple objects the site can render. Add columns in Notion first;
// this function needs to match the property names exactly.
export async function getMixes() {
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [{ property: 'Date', direction: 'descending' }],
  });

  return response.results.map((page) => {
    const props = page.properties;
    const title = props['Title']?.title?.[0]?.plain_text ?? 'Untitled mix';
    const soundcloudUrl = props['SoundCloud Link']?.url ?? '';
    const date = props['Date']?.date?.start ?? '';
    const description = props['Description']?.rich_text?.[0]?.plain_text ?? '';

    return {
      id: page.id,
      slug: slugify(title),
      title,
      soundcloudUrl,
      date,
      description,
    };
  });
}

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
