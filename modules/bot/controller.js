import { GrammyError, HttpError } from "grammy";

class Controller {
    /**
     *
     * @param {import('grammy').Context} ctx
     */
    async start(ctx) {
        console.log(ctx);
        ctx.reply(ctx.chat);
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
