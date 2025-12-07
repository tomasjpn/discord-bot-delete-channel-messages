const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
require("Date");
//--------------------------------------------------------------

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const DELETE_AFTER = 5 * 1000;

//--------------------------------------------------------------

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let lastCleanupDate = null;

client.once("ready", () => {
  setInterval(async () => {
    const currentDate = new Date();

    if (
      currentDate.getHours() === 0 &&
      currentDate.getMinutes() === 0 &&
      lastCleanupDate !== currentDate.toDateString()
    ) {
      lastCleanupDate = currentDate.toDateString();
      await deleteOldMsg();
    }
  }, 30 * 1000);
});

client.login(TOKEN);

async function deleteOldMsg() {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) {
      console.error(`Discord channel ID ${CHANNEL_ID} not found!`);
      return;
    }

    const messages = await channel.messages.fetch({ limit: 100 });

    messages.forEach(async (msg) => {
      try {
        await msg.delete();
        console.log(`Old message from ${msg.author.tag} deleted`);
      } catch (err) {
        console.error("Error while deleting message:", err);
      }
    });
  } catch (err) {
    console.error(err);
  }
}
