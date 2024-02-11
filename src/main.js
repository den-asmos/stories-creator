import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { Loader } from './loader.js';
import { addImage, createNote } from './notion.js';
import config from 'config';

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'), {
  handlerTimeout: Infinity,
});

bot.command('start', (context) => {
  context.reply('Добро пожаловать. Отправьте текстовое сообщение с информацией');
});

bot.on(message('text'), async (context) => {
  try {
    const text = context.message.text;
    const user = context.message.from;
    if (!text.trim()) {
      context.reply('Заметка не может быть пустой');
    }

    const loader = new Loader(context);
    loader.show();
    const notionResponse = await createNote(text, user);
    loader.hide();
    context.reply(`Информация записана. Ваша страница: ${notionResponse.url}`);
  } catch (error) {
    console.log('Error while recording your note', error.message);
  }
});

bot.on(message('photo'), async (context) => {
  try {
    const user = context.message.from;
    const image = context.message.photo[context.message.photo.length - 1].file_id;
    const url = await context.telegram.getFileLink(image);

    const loader = new Loader(context);
    loader.show();
    const notionResponse = await addImage(url.href, user);
    loader.hide();
    context.reply(`Фото загружено. Ваша страница: ${notionResponse.url}`);
  } catch (error) {
    console.log('Error while uploading your image', error.message);
  }
});

bot.launch();
