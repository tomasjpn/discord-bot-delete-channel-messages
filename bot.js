const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

//--------------------------------------------------------------

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
let lastCleanupDate = null;

//--------------------------------------------------------------

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`discord bot is online as ${client.user.tag}`);

  setInterval(async () => {
    const currentDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin" })
    );
    console.log(`current time: ${currentDate}`);

    if (currentDate.getHours() === 23 && currentDate.getMinutes() === 0) {
      console.log("daily message cleanup will start in 1 hour...");
    } else if (
      currentDate.getHours() === 23 &&
      currentDate.getMinutes() === 30
    ) {
      console.log("daily message cleanup will start in 30 minutes...");
    }

    if (
      currentDate.getHours() === 0 &&
      currentDate.getMinutes() === 0 &&
      currentDate.getSeconds() === 0 &&
      lastCleanupDate !== currentDate.toDateString()
    ) {
      console.log("starting daily message cleanup ...");
      lastCleanupDate = currentDate.toDateString();
      await deleteOldMsg();
      console.log("... daily message cleanup completed");
    }
  }, 30 * 1000);
});

client.login(TOKEN);

async function deleteOldMsg() {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) {
      console.error(`discord channel ID ${CHANNEL_ID} not found!`);
      return;
    }
    console.log(`fetching message data from channel: ${channel.name} ...`);
    const messages = await channel.messages.fetch({ limit: 100 });
    console.log(`... fetched ${messages.size} messages.`);

    console.log("starting to delete messages ...");
    messages.forEach(async (msg) => {
      try {
        await msg.delete();
        console.log(`old message from ${msg.author.tag} deleted`);
      } catch (err) {
        console.error("error while deleting message:", err);
      }
    });
    console.log("... message deletion process completed.");
  } catch (err) {
    console.error(err);
  }
}
