import { Telegraf } from "telegraf";
// const token = process.env.BOT_TOKEN
const token = "1868471829:AAGrzXa-azZh9QTI53sfeeKWBGdQvUCUxxk";
if (token === undefined) {
    throw new Error("BOT_TOKEN must be provided!");
}
const bot = new Telegraf(token);
// Set the bot response
bot.on("text", (ctx) => ctx.replyWithHTML("<b>Hellowww</b>"));
const secretPath = `/api/${bot.secretPathComponent()}`;
bot.telegram.sendMessage(41487359, `Test message: My token is ${token}. Listening in the secret path ${secretPath}`);
// Set telegram webhook
// npm install -g localtunnel && lt --port 3000
bot.telegram
    .setWebhook(`https://random-phrase-bot-kasama.vercel.app${secretPath}`)
    .then((e) => console.log(`Webhook was setup: ${JSON.stringify(e)}`))
    .catch((e) => console.log(`Error setting webhook: ${JSON.stringify(e)}`));
// Set the bot API endpoint
// module.exports = bot.webhookCallback(secretPath)
console.log(`Setting up everything. Path is ${secretPath}`);
export default (req, res) => {
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
//# sourceMappingURL=%5Bindex%5D.js.map