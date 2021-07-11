import { Telegraf } from "telegraf";
import { MessageEntity } from "telegraf/typings/core/types/typegram";
import { createPhrase, getRandomPhrase } from "./database";

export const setupBot = (token: string) => {
  const bot = new Telegraf(token);

  bot.command("add", async (ctx) => {
    const chatId = ctx.message.chat.id;
    const owner = ctx.message.from.username ?? ctx.message.from.first_name;

    console.log("entities", ctx.message.entities);
    console.log("msg", ctx.message);

    const message = ctx.message.reply_to_message !== undefined
      ? (() =>"text" in ctx.message.reply_to_message ? ctx.message.reply_to_message.text : undefined)()
      : (() => {
          const commandRegions =
            ctx.message.entities?.filter(
              (entity) => entity.type === "bot_command"
            ) ?? [];

          const inRegion = (test: number, ranges: MessageEntity[]) =>
            ranges.reduce(
              (val, range) =>
                val ||
                (test >= range.offset && test < range.offset + range.length),
              false
            );
          return ctx.message.text
            .split("")
            .filter((_, i) => !inRegion(i, commandRegions))
            .join("")
            .trim();
        })();

    console.log(
      `Got command add for chat ${chatId}. Message ${message}. Owner ${owner}`
    );

    if (message === undefined || message === '') {
      return ctx.replyWithHTML(`Sorry... I don't know what I'm supposed to add`)
    }

    await createPhrase({
      data: {
        chat: chatId,
        content: message,
        author: owner,
      },
    });

    console.log(`got arguments`, ctx.message.entities);

    await ctx.replyWithHTML(
      `Created phrase ${message.bold()} for owner ${owner.bold()} in chat ${chatId
        .toString()
        .bold()}`
    );

    console.log(`sent bot message`);
  });

  bot.command("randomPhrase", async (ctx) => {
    const chatId = ctx.message.chat.id;

    const phrase = await getRandomPhrase(chatId);

    ctx.replyWithHTML(`msg: ${phrase?.content}.`);
  });

  return bot;
};
