import { GrammyError, HttpError } from "grammy";
import { BaseModule } from "./app.js";

// eslint-disable-next-line import/no-mutable-exports
export let telegramConnection = () => null;

export class BotRouting extends BaseModule {
    /**
     *
     * @param {Array<import('grammy').Composer> | import('grammy').Composer} composers
     * @param {Array<{command: string, description: string}>} commands
     */
    constructor(composers, commands = []) {
        super();
        this.composers = [composers].flat();
        this.commands = commands;
    }

    /**
     * @param { import('grammy').Bot } bot
     */
    async beforeHandler(bot) {
        bot.api.setMyCommands(this.commands);
        bot.catch((exception) => {
            const context = exception.ctx;
            console.info(`[Telegram] Error while handling ${context.update.update_id}`);
            if (exception.error instanceof GrammyError) {
                console.error(`[Telegram] Error in request: ${exception.error.description}`);
            } else if (exception.error instanceof HttpError) {
                console.error(`[Telegram] Could not contact Telegram: ${exception.error}`);
            } else console.error(`Unknown error: ${exception.error}`);
        });
    }

    /**
     * @param { import('grammy').Bot } bot
     */
    async handler(bot) {
        try {
            this.composers.forEach((composer) => bot.use(composer));
            console.info("[Telegram] Connection is established");
        } catch (error) {
            console.error("[Telegram] Connection is crashed");
        }
    }

    /**
     * @param { import('grammy').Bot } bot
     */
    async afterHandler(bot) {
        telegramConnection = () => bot;
    }
}
