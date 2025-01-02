import { Sequelize } from "sequelize";
import Scheduler from "./core/cron.js";
import DatabaseAdapter from "./core/databases/postgres-adapter.js";
import Server from "./core/server.js";
import TelegramBot from "./core/telegram.js";
import botObject from "./modules/bot/router.js";

const APP_PORT = process.env.APP_PORT || 5000;

new Server(APP_PORT, [
    new DatabaseAdapter(
        new Sequelize(process.env.DB_NAME, process.env.PG_USER, process.env.PG_PASS, {
            dialect: "postgres",
            host: process.env.PG_HOST || "127.0.0.1",
            port: process.env.PG_PORT || 5432,
            logging: false,
            query: { raw: true, nest: true },
            sync: { alter: true }
        })
    ).registerModels([]),
    new Scheduler([]),
    new TelegramBot(botObject)
])
    .initServices()
    .then((server) => server.run(() => console.log(`[App] Server started on port ${APP_PORT}`)));
