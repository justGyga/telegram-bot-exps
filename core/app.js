/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line max-classes-per-file
import { Bot } from "grammy";

export class BaseModule {
    async beforeHandler(app) {}
    async handler(app) {}
    async afterHandler(app) {}

    async _resolve(app) {
        await this.beforeHandler(app);
        await this.handler(app);
        await this.afterHandler(app);
    }
}

export class App {
    /** @type {Array<BaseModule>} */
    #services;

    constructor(apiToken, services) {
        this.#services = services;
        this.bot = new Bot(apiToken);
    }

    async initServices() {
        if (!this.#services.length) process.exit(1);
        for (const service of this.#services) {
            await service._resolve(this.bot);
        }
        console.log("[App] Services loaded");
        return Promise.resolve(this);
    }

    run(callback = undefined) {
        try {
            if (callback) callback();
            this.bot.start();
            console.log("[App] run successfully");
        } catch (error) {
            console.log(error);
        }
    }
}
