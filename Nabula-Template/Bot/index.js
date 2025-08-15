/*
 * @author Maik
 * @version 1.0.0
 */

// bot/index.js
require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
} = require("discord.js");
const { ModuleManager } = require("./modules/ModuleManager"); // Corrected Path
const { LoggerUtils } = require("./api/logger.utils.js"); // Corrected Path

// Initialize logger
const logger = new LoggerUtils("BotCore");

// Validate environment variables
function validateEnv() {
  const required = ["DISCORD_TOKEN", "CLIENT_ID", "CLIENT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Create a new Discord client with specified intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
});

// Global error handling with logger
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception:", error);
  client.destroy();
  process.exit(1);
});

// Initialize module manager
const moduleManager = new ModuleManager(client);

// Event handler for bot initialization
client.once("ready", async () => {
  logger.info(`Logged in as ${client.user.tag}!`);

  try {
    // Initialize all modules
    await moduleManager.loadModules();

    // Set the bot's presence/status
    client.user.setPresence({
      activities: [
        {
          name: "Managing your server!",
          type: ActivityType.Playing,
        },
      ],
      status: "online",
    });

    logger.info("Bot is fully initialized and ready!");
  } catch (error) {
    logger.error("Error during bot initialization:", error);
  }
});

// Validate environment before starting
try {
  validateEnv();
  client.login(process.env.DISCORD_TOKEN);
} catch (error) {
  logger.error("Failed to start bot:", error);
  process.exit(1);
}
