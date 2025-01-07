// eslint-disable-next-line import/no-extraneous-dependencies
import { Bot } from "grammy";
import { BOT_COMMANDS } from "./commands.js";
import Controller from "./controller.js";

const bot = new Bot(process.env.TG_API_TOKEN);

bot.api.setMyCommands([
    { command: BOT_COMMANDS.START, description: "Attach your account to tg" },
    { command: BOT_COMMANDS.ADD_SCHEDULE, description: "Send message in group after delay" }
]);

bot.use(Controller.addSessionToContext);

bot.command(BOT_COMMANDS.START, Controller.start);

bot.command(BOT_COMMANDS.ADD_SCHEDULE, async (ctx) => {
    await ctx.reply("Привет! Пожалуйста, укажите дату и время, когда вы хотите записаться.");
});
// Функция для обработки текстового сообщения (для даты и времени)
bot.on("message:text", async (ctx) => {
    console.log("-----CONFIG-------------");
    console.log(ctx.session);
    const messageText = ctx.message.text;

    // Проверка на то, что пользователь ввел дату и время (функция может быть улучшена)
    if (isDateValid(messageText)) {
        await ctx.reply("Спасибо! Теперь, пожалуйста, отправьте любые медиафайлы, которые хотите прикрепить.");
        // Можно сохранить состояние, чтобы ожидать медиафайлы
        ctx.session.awaitingMedia = true;
    } else {
        await ctx.reply("Пожалуйста, введите корректную дату и время.");
    }
});

// Обработка медиафайлов (фото и видео)
bot.on("message", async (ctx) => {
    if (ctx.session.awaitingMedia) {
        if (ctx.message.photo) {
            await ctx.reply("Спасибо за медиафайл (фото). Ваш файл был получен!");
            ctx.session.awaitingMedia = false; // Сбрасываем ожидание
        } else if (ctx.message.video) {
            await ctx.reply("Спасибо за медиафайл (видео). Ваш файл был получен!");
            ctx.session.awaitingMedia = false; // Сбрасываем ожидание
        } else await ctx.reply("Пожалуйста, отправьте только медиафайлы (фото или видео).");
    }
});

bot.on("message_reaction", async (ctx) => {
    const { emojiAdded } = ctx.reactions();
    if (emojiAdded.includes("🎉")) {
        await ctx.reply("partY");
    }
});

// Проверка корректности даты (можно улучшить)
function isDateValid(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

bot.catch(Controller.catchError);

export default bot;
