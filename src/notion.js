import { Client } from '@notionhq/client';
import { configDotenv } from 'dotenv';

configDotenv();

const notion = new Client({
  auth: process.env.NOTION_KEY,
});

export const createNote = async (note, user) => {
  const response = await notion.pages.create({
    parent: { type: 'database_id', database_id: process.env.NOTION_DB_ID },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: note,
            },
          },
        ],
      },
      Date: {
        date: {
          start: new Date().toISOString(),
        },
      },
      User: {
        rich_text: [
          {
            text: {
              content: `${user.first_name} ${user.last_name}`,
            },
          },
        ],
      },
    },
  });

  await notion.blocks.children.append({
    block_id: response.id,
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'You can continue your note here...',
              },
            },
          ],
        },
      },
    ],
  });

  return response;
};

export const addImage = async (imageUrl, user) => {
  const response = await notion.pages.create({
    parent: { type: 'database_id', database_id: process.env.NOTION_DB_ID },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: 'Фото',
            },
          },
        ],
      },
      Date: {
        date: {
          start: new Date().toISOString(),
        },
      },
      User: {
        rich_text: [
          {
            text: {
              content: `${user.first_name} ${user.last_name}`,
            },
          },
        ],
      },
      Image: {
        files: [
          {
            name: user.username,
            external: {
              url: imageUrl,
            },
          },
        ],
      },
    },
  });

  await notion.blocks.children.append({
    block_id: response.id,
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'You can continue your note here...',
              },
            },
          ],
        },
      },
    ],
  });

  return response;
};
