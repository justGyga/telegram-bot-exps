import Scheduler from "./core/cron.js";
import Server from "./core/server.js";
import TelegramBot from "./core/telegram.js";
import botObject from "./modules/bot/router.js";

const APP_PORT = process.env.APP_PORT || 5000;

new Server(APP_PORT, [new Scheduler([]), new TelegramBot(botObject)])
    .initServices()
    .then((server) => server.run(() => console.log(`[App] Server started on port ${APP_PORT}`)));
