const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

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

client.once("ready", async () => {
  console.log(`Bot is online as ${client.user.tag}`);
  await deleteOldMsg();
});

client.on("messageCreate", async (message) => {
  if (message.channel.id !== CHANNEL_ID) return;

  setTimeout(async () => {
    try {
      await message.delete();
      console.log(`Message from User: ${message.author.tag} deleted`);
    } catch (err) {
      console.error("Message could not get deleted:", err);
    }
  }, DELETE_AFTER);
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
