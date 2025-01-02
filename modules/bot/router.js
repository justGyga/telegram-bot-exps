// eslint-disable-next-line import/no-extraneous-dependencies
import { Bot, GrammyError, HttpError } from "grammy";
import { BOT_COMMANDS } from "./commands";

const bot = new Bot(process.env.TG_API_TOKEN);

bot.api.setMyCommands([{ command: BOT_COMMANDS.START, description: "Attach your account to tg" }]);

// bot.command(BOT_COMMANDS.START, Controller.startHandler);
// bot.command(BOT_COMMANDS.GET_CURRENCIES, Controller.getCurrencies);
bot.catch((exception) => {
    const context = exception.ctx;
    console.info(`[Telegram] Error while handling ${context.update.update_id}`);
    if (exception.error instanceof GrammyError) {
        console.error(`[Telegram] Error in request: ${exception.error.description}`);
    } else if (exception.error instanceof HttpError) {
        console.error(`[Telegram] Could not contact Telegram: ${exception.error}`);
    } else console.error(`Unknown error: ${exception.error}`);
});

export default bot;
