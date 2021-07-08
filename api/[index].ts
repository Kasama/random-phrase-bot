import { Telegraf } from "telegraf";

const token = process.env.BOT_TOKEN
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(token);
// Set the bot response
bot.on("text", (ctx: any) => ctx.replyWithHTML("<b>Hellowww</b>"));

const secretPath = `/api/${bot.secretPathComponent()}`;

bot.telegram.sendMessage(41487359, `Test message: My token is ${token}. Listening in the secret path ${secretPath}`)

// Set telegram webhook
// npm install -g localtunnel && lt --port 3000
bot.telegram
  .setWebhook(`https://random-phrase-bot-kasama.vercel.app${secretPath}`)
  .then((e: any) => console.log(`Webhook was setup: ${JSON.stringify(e)}`))
  .catch((e: any) => console.log(`Error setting webhook: ${JSON.stringify(e)}`));

// Set the bot API endpoint
// module.exports = bot.webhookCallback(secretPath)
console.log(`Setting up everything. Path is ${secretPath}`);

export default (req: any, res: any) => {
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

  bot.webhookCallback(secretPath)(req, res);
};
