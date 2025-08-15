/*
 * @file Manages the shop system for the Discord bot.
 * @author Maik
 * @version 1.0.0
 */

const { Events, EmbedBuilder } = require('discord.js');
const { LoggerUtils } = require('../api/logger.utils.js'); // Corrected Path

const logger = new LoggerUtils('ShopSystem');

class ShopSystemModule {
    constructor(client) {
        this.client = client;
    }

    async init() {
        this.registerEventHandlers();
        logger.info('Shop system module initialized');
    }

    registerEventHandlers() {
        this.client.on(Events.InteractionCreate, this.handleInteraction.bind(this));
    }

    async handleInteraction(interaction) {
        if (!interaction.isCommand()) return;

        try {
            switch (interaction.commandName) {
                case 'shop':
                    await this.handleShopCommand(interaction);
                    break;
                case 'buy':
                    await this.handleBuyCommand(interaction);
                    break;
                default:
                    return;
            }
        } catch (error) {
            logger.error('Error handling shop interaction:', error);
            await this.handleError(interaction);
        }
    }

    async handleShopCommand(interaction) {
        try {
            const shopEmbed = await this.createShopEmbed(interaction.guildId);
            await interaction.reply({ embeds: [shopEmbed] });
        } catch (error) {
            logger.error('Error displaying shop:', error);
            await this.handleError(interaction);
        }
    }

    async handleBuyCommand(interaction) {
        try {
            // TODO: Implement purchase logic with database integration
            await interaction.reply('Purchase system coming soon!');
        } catch (error) {
            logger.error('Error processing purchase:', error);
            await this.handleError(interaction);
        }
    }

    async createShopEmbed(guildId) {
        const embed = new EmbedBuilder()
            .setTitle('Server Shop')
            .setDescription('Welcome to the server shop! Use `/buy <item>` to purchase items.')
            .setColor('#00ff00')
            .setTimestamp();

        // TODO: Add shop items from the database for this specific guild
        embed.addFields({ name: 'Coming Soon', value: 'Items will be available here soon!' });

        return embed;
    }

    async handleError(interaction) {
        const errorMessage = 'An error occurred. Please try again later.';
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}

module.exports = ShopSystemModule;
