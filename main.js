import { Sequelize } from "sequelize";
import { App } from "./core/app.js";
import { Scheduler } from "./core/cron.js";
import { DatabaseAdapter } from "./core/databases/postgres-adapter.js";
import { TelegramBot } from "./core/telegram.js";
import { userPlotter } from "./modules/_models/user.js";
import botObject from "./modules/bot/router.js";

new App([
    new DatabaseAdapter(
        new Sequelize(process.env.DB_NAME, process.env.PG_USER, process.env.PG_PASS, {
            dialect: "postgres",
            host: process.env.PG_HOST || "127.0.0.1",
            port: process.env.PG_PORT || 5432,
            logging: false,
            query: { raw: true, nest: true },
            sync: { alter: true }
        })
    ).registerModels([userPlotter]),
    new Scheduler([]),
    new TelegramBot(botObject)
])
    .initServices()
    .then((server) => server.run());
