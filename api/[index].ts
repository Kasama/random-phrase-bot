import dotenv from "dotenv";
import { setupBot } from "./bot";

if (process.env.VERCEL === undefined) dotenv.config();

const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}

const bot = setupBot(token);

// const secretPath = `/api/${bot.secretPathComponent()}`;
const secretPath = `/api/not-so-secret-anymore-testing-path`;

const setWebhook = () =>
  bot.telegram.setWebhook(
    `https://random-phrase-bot-kasama.vercel.app${secretPath}`
  );

console.log("Env vars:", process.env);
if (process.env.ENVIRONMENT === "local") {
  console.log("Running bot in LOCAL env");
  bot.launch();

  bot.telegram.deleteWebhook();

  process.once("SIGINT", () => setWebhook().then(() => bot.stop("SIGINT")));
  process.once("SIGTERM", () => setWebhook().then(() => bot.stop("SIGTERM")));
} else {
  bot.telegram
    .sendMessage(
      41487359,
      `Test message: My token is ${token}. Listening in the secret path ${secretPath}\nRunning from ${process.env.ENVIRONMENT}`
    )
    .then(() => {
      console.log("Was able to send message");
      return "Was able to send message";
    })
    .catch((e) => {
      console.log("Wasnt able to send message", e);
      return `Wasnt able to send message ${JSON.stringify(e)}`;
    });

  // Set telegram webhook
  // npm install -g localtunnel && lt --port 3000
  setWebhook()
    .then((e: any) => console.log(`Webhook was setup: ${JSON.stringify(e)}`))
    .catch((e: any) =>
      console.log(`Error setting webhook: ${JSON.stringify(e)}`)
    );

  // Set the bot API endpoint
  // module.exports = bot.webhookCallback(secretPath)
  console.log(`Setting up everything. Path is ${secretPath}`);
}

export default async (req: any, res: any) => {
  console.log("Stuff:", {
    method: req.method,
    url: req.url,
    path: req.path,
    body: {
      another: "Thing",
      received: JSON.stringify(req.body),
    },
    query: JSON.stringify(req.query),
    cookies: req.cookies,
  });

  if (req.url.replace(/\?.*/, "").includes(secretPath)) {
    req.url = `${secretPath}`;
  }

  return bot.webhookCallback(secretPath)(req, res);
};
