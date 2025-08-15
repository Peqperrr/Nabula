/*
 * @file Manages the leveling system for the Discord bot.
 * @author Maik
 * @version 1.0.0
 */

const { Events } = require('discord.js');
const { LoggerUtils } = require('../api/logger.utils.js'); // Corrected Path

const logger = new LoggerUtils('LevelSystem');

class LevelSystemModule {
    constructor(client) {
        this.client = client;
        this.cooldowns = new Map();
        this.xpRange = { min: 15, max: 25 };
        this.cooldownTime = 60000; // 1 minute cooldown
    }

    async init() {
        this.registerEventHandlers();
        logger.info('Level system module initialized');
    }

    registerEventHandlers() {
        this.client.on(Events.MessageCreate, this.handleMessage.bind(this));
    }

    async handleMessage(message) {
        if (message.author.bot || !message.guild) return;

        try {
            const userId = message.author.id;
            const guildId = message.guild.id;

            if (this.isOnCooldown(userId, guildId)) return;

            await this.awardXP(message);
            this.setCooldown(userId, guildId);
        } catch (error) {
            logger.error('Error in level system message handler:', error);
        }
    }

    isOnCooldown(userId, guildId) {
        const key = `${userId}-${guildId}`;
        const cooldownExpiry = this.cooldowns.get(key);
        return cooldownExpiry && cooldownExpiry > Date.now();
    }

    setCooldown(userId, guildId) {
        const key = `${userId}-${guildId}`;
        this.cooldowns.set(key, Date.now() + this.cooldownTime);
    }

    async awardXP(message) {
        try {
            const xpAmount = this.calculateXP();
            // TODO: Implement XP award logic with database integration (e.g., find user, add XP, check for level up)
            logger.debug(`Awarded ${xpAmount} XP to user ${message.author.tag}`);
        } catch (error) {
            logger.error('Error awarding XP:', error);
        }
    }

    calculateXP() {
        return Math.floor(Math.random() * (this.xpRange.max - this.xpRange.min + 1)) + this.xpRange.min;
    }
}

module.exports = LevelSystemModule;