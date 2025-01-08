import { Sequelize } from "sequelize";
import { App } from "./core/app.js";
import { Scheduler } from "./core/cron.js";
import { DatabaseAdapter } from "./core/databases/postgres-adapter.js";
import { BotRouting } from "./core/telegram.js";
import { userPlotter } from "./modules/_models/user.js";
import { BOT_COMMANDS } from "./modules/bot/commands.js";
import composer from "./modules/bot/router.js";

const ApiToken = process.env.TG_API_TOKEN;

new App(ApiToken, [
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
    new BotRouting([composer], BOT_COMMANDS)
])
    .initServices()
    .then((server) => server.run());
