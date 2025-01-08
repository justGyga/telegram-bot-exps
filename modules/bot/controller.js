import { Service } from "./service";

export const DEFAULT_SESSION = {
    awaitingMedia: false,
    awaitingDate: false
};

function isDateValid(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

class Controller {
    #service;
    constructor() {
        this.#service = new Service();
    }
    /**
     *
     * @param {import('grammy').Context} ctx
     */
    async start(ctx) {
        console.log("-----------------------");
        console.log(ctx);
        console.log("-----CONFIG-------------");
        console.log(ctx.session);
        ctx.reply(ctx.chat);
    }

    /**
     *
     * @param {import('grammy').Context} ctx
     * @param {import('grammy').NextFunction} next
     */
    async addSessionToContext(ctx, next) {
        ctx.session = { ...DEFAULT_SESSION };
        await next();
    }

    /**
     *
     * @param {import('grammy').Context} ctx
     */
    async addSchedule(ctx) {
        console.log("-----------------------");
        console.log(ctx);
        console.log("----KEYS----------------");
        console.log(Object.keys(ctx));
        console.log("---------MSG-----------");
        console.log(ctx.message);
        ctx.reply("Привет! Пожалуйста, укажите дату и время, когда вы хотите записаться.");
    }

    async messageTextHandler(ctx) {
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
    }

    async messageHandler(ctx) {
        if (ctx.session.awaitingMedia) {
            if (ctx.message.photo) {
                await ctx.reply("Спасибо за медиафайл (фото). Ваш файл был получен!");
                ctx.session.awaitingMedia = false; // Сбрасываем ожидание
            } else if (ctx.message.video) {
                await ctx.reply("Спасибо за медиафайл (видео). Ваш файл был получен!");
                ctx.session.awaitingMedia = false; // Сбрасываем ожидание
            } else await ctx.reply("Пожалуйста, отправьте только медиафайлы (фото или видео).");
        }
    }
}

export default new Controller();
