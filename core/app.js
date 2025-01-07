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
    /**@type {Array<BaseModule>} */
    #services;

    constructor(services) {
        this.#services = services;
    }

    async initServices() {
        if (!this.#services.length) process.exit(1);
        for (const service of this.#services) {
            await service._resolve(this.app);
        }
        console.log("[App] Services loaded");
        return Promise.resolve(this);
    }

    run(callback = undefined) {
        if (callback) callback();
        console.log("[App] run successfully");
    }
}
