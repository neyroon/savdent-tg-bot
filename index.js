import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const bot = new TelegramBot(process.env.BOT_API, { polling: true });

const fastify = Fastify();
fastify.register(fastifyCors);

const transporter = nodemailer.createTransport({
  service: "yandex",
  auth: { user: process.env.USER_EMAIL, pass: process.env.USER_PASS },
});

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

    transporter.sendMail({
      from: "saf.dent@yandex.ru",
      to: "safdent@bk.ru",
      subject: "Hello World!",
      html: `${
        dentistName ? `<p><b>Имя стоматолога:</b> \`${dentistName}\`</p>` : ""
      }${
        serviceName ? `<p><b>Название услуги:</b> \`${serviceName}\`</p>` : ""
      }<p><b>Имя:</b> \`${name}\`</p><p><b>Телефон:</b> ${phone}</p>`,
    });
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
