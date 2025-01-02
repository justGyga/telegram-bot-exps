// eslint-disable-next-line import/no-extraneous-dependencies
import { Bot } from "grammy";
import { BOT_COMMANDS } from "./commands.js";
import Controller from "./controller.js";

const bot = new Bot(process.env.TG_API_TOKEN);

bot.api.setMyCommands([{ command: BOT_COMMANDS.START, description: "Attach your account to tg" }]);

bot.command(BOT_COMMANDS.START, Controller.start);
bot.catch(Controller.catchError);

export default bot;
