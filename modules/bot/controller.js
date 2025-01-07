import { GrammyError, HttpError } from "grammy";

export const DEFAULT_SESSION = {
    awaitingMedia: false,
    awaitingDate: false
};

class Controller {
    constructor() {}
    /**
     *
     * @param {import('grammy').Context} ctx
     */
    async start(ctx) {
        console.log("-----------------------");
        console.log(ctx);
        console.log("-----CONFIG-------------");
        console.log(ctx.session);
        ctx.reply(ctx.chat);
    }

    /**
     *
     * @param {import('grammy').Context} ctx
     * @param {import('grammy').NextFunction} next
     */
    async addSessionToContext(ctx, next) {
        ctx.session = { ...DEFAULT_SESSION };
        await next();
    }

    /**
     *
     * @param {import('grammy').Context} ctx
     */
    async addSchedule(ctx) {
        console.log("-----------------------");
        console.log(ctx);
        console.log("----KEYS----------------");
        console.log(Object.keys(ctx));
        console.log("---------MSG-----------");
        console.log(ctx.message);
        ctx.reply(ctx);
    }

    /**
     *
     * @param {GrammyError|HttpError|Error} exception
     */
    catchError(exception) {
        const context = exception.ctx;
        console.info(`[Telegram] Error while handling ${context.update.update_id}`);
        if (exception.error instanceof GrammyError) {
            console.error(`[Telegram] Error in request: ${exception.error.description}`);
        } else if (exception.error instanceof HttpError) {
            console.error(`[Telegram] Could not contact Telegram: ${exception.error}`);
        } else console.error(`Unknown error: ${exception.error}`);
    }
}

export default new Controller();
