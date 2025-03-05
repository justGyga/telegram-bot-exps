import { InlineKeyboard } from "grammy";
import { Group } from "../_models/group.js";
import { Service } from "./service.js";

export const DEFAULT_SESSION = {
    awaitingMedia: false,
    awaitingDate: false
};

function isDateValid(dateString) {
    const date = new Date(dateString);
    return !Number.isNaN(date.getTime());
}

class Controller {
    #service;
    constructor() {
        this.#service = new Service();
    }

    /** @param {import('grammy').Context} ctx */
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
     * @param {import('grammy').NextFunction} next
     */
    async checkAccess(ctx, next) {
        await next();
    }

    /**
     *
     * @param {import('grammy').Context} ctx
     * @param {import('grammy').NextFunction} next
     */
    async isPrivate(ctx, next) {
        if (ctx.message.chat.type != "group") return ctx.reply("No permissions");
        await next();
    }

    /**
     *
     * @param {import('grammy').Context} ctx
     * @param {import('grammy').NextFunction} next
     */
    async isGroup(ctx, next) {
        if (ctx.message.chat.type != "group") return ctx.reply("No permissions");
        await next();
    }

    /** @param {import('grammy').Context} ctx */
    async regGroup(ctx) {
        const { id, title } = ctx.message.chat;
        const telegramId = +id;
        if (!(await Group.count({ where: { telegramId } }))) return ctx.reply("That chat already is registered");
        await Group.create({ telegramId, name: title });
        ctx.reply("That chat was registered successfully");
    }

    /** @param {import('grammy').Context} ctx */
    async getGroupsList(ctx) {
        const groups = (await Group.findAll({ attributes: ["name", "id"], raw: true })).map(({ id, name }) => [name, id]);
        if (!groups.length) return ctx.reply("No one group was registered");
        const buttonRow = groups.map(([label, data]) => InlineKeyboard.text(label, data));
        const keyboard = InlineKeyboard.from([buttonRow]);
        await ctx.reply("Choose group:", { reply_markup: keyboard });
    }

    async deleteGroup(ctx) {
        await ctx.answerCallbackQuery({
            text: "You were curious, indeed!"
        });
    }

    /** @param {import('grammy').Context} ctx */
    async addSchedule(ctx) {
        console.log("-----------------------");
        console.log(ctx);
        console.log("----KEYS----------------");
        console.log(Object.keys(ctx));
        console.log("---------MSG-----------");
        console.log(ctx.message);
        ctx.reply("Привет! Пожалуйста, укажите дату и время, когда вы хотите записаться.");
    }

    /** @param {import('grammy').Context} ctx */
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

    /** @param {import('grammy').Context} ctx */
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
