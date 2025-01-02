import { BaseModule } from "../server.js";

export let transaction = null;
export let query = () => null;
export let getConnection = () => null;

export default class DatabaseAdapter extends BaseModule {
    constructor(connection) {
        super();
        this.connection = connection;
        this.models = [];
    }

    registerModels(models = []) {
        this.models = models;
        return this;
    }

    async #isConnect() {
        await this.connection.authenticate();
    }

    async #initModels() {
        const keySetter = [];
        this.models.forEach((plotter) => keySetter.push(plotter(this.connection)));
        keySetter.forEach((exec) => exec && exec(this.connection));
        await this.connection.sync({ alter: true });
    }

    async beforeHandler(_) {
        try {
            await this.#isConnect();
            console.log("[Postgres] Connection to database is established");
        } catch (ex) {
            console.error("[Postgres] DataBase host is unreachable");
            console.log(ex.message);
            process.exit(1);
        }
    }

    async handler(_) {
        getConnection = () => this.connection;
        query = () => this.connection.query();
        transaction = () => this.connection.transaction();
    }

    async afterHandler(_) {
        await this.#initModels();
        console.log("[Postgres] Models loaded");
    }
}