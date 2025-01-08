// eslint-disable-next-line import/no-extraneous-dependencies
import { Composer } from "grammy";
import Controller from "./controller.js";

const composer = new Composer();

composer.use(Controller.addSessionToContext);

composer.command("start", Controller.start);
composer.command("delayed_message", Controller.addSchedule);
// Функция для обработки текстового сообщения (для даты и времени)
composer.on("message:text", Controller.messageTextHandler);

// Обработка медиафайлов (фото и видео)
composer.on("message", Controller.messageHandler);

export default composer;
