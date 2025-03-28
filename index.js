import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const bot = new TelegramBot(process.env.BOT_API, { polling: true });

const fastify = Fastify();
fastify.register(fastifyCors);

fastify.post("/callback", async (request, reply) => {
  try {
    const { name, phone, dentistName, serviceName } = JSON.parse(request.body);

    bot.sendMessage(
      process.env.CHAT_ID,
      `${dentistName ? `*Имя стоматолога:* \`${dentistName}\`\n` : ""}${
        serviceName ? `*Название услуги:* \`${serviceName}\`\n` : ""
      }*Имя:* \`${name}\`\n*Телефон:* ${phone}`,
      { parse_mode: "Markdown" }
    );
    reply.code(200).send();
  } catch (error) {}

  reply.code(200).send();
});

fastify.listen({ port: 3001 }, function (err) {
  if (err) {
    console.log("1", err);
    fastify.log.error(err);
    process.exit(1);
  }
});
