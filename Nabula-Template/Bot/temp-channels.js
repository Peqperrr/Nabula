/*
 * @file Manages temporary voice channels for a Discord server.
 * @author Maik
 * @version 1.0.0
 */

// Import required discord.js modules.
const { Events, ChannelType, PermissionFlagsBits } = require('discord.js');
// Import the professional logger
const { LoggerUtils } = require('./api/logger.utils.js');

// Create a logger instance for this specific module
const logger = new LoggerUtils('TempChannels');

/**
 * Manages the creation and deletion of temporary voice channels.
 */
class TempChannelsModule {
    /**
     * @param {import('discord.js').Client} client The Discord client instance.
     */
    constructor(client) {
        // The Discord client instance.
        this.client = client;

        // A Set to store the IDs of active temporary channels.
        this.tempChannels = new Set();
        // The ID of the "Join to Create" channel.
        this.creatorChannelId = null;
    }

    /**
     * Initializes the module by registering event handlers.
     */
    init() {
        this.registerEventHandlers();
        logger.info('Temporary channels module initialized successfully.');
    }

    /**
     * Registers the necessary event handlers.
     */
    registerEventHandlers() {
        // Listen for voice state changes (join/leave).
        this.client.on(Events.VoiceStateUpdate, this.handleVoiceStateUpdate.bind(this));
        // Listen for slash commands.
        this.client.on(Events.InteractionCreate, this.handleInteraction.bind(this));
    }

    /**
     * Handles slash command interactions.
     * @param {import('discord.js').Interaction} interaction The interaction object.
     */
    async handleInteraction(interaction) {
        // Only respond to chat input commands.
        if (!interaction.isChatInputCommand()) return;

        const { commandName } = interaction;

        try {
            if (commandName === 'setup-temp-channels') {
                await this.handleSetupCommand(interaction);
            }
        } catch (error) {
            logger.error(`Error handling command "${commandName}":`, error);
            await this.sendErrorMessage(interaction);
        }
    }

    /**
     * Handles the /setup-temp-channels command.
     * @param {import('discord.js').ChatInputCommandInteraction} interaction The interaction object.
     */
    async handleSetupCommand(interaction) {
        // Check for "Manage Channels" permission.
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            await interaction.reply({
                content: 'You need the "Manage Channels" permission to use this command.',
                ephemeral: true,
            });
            return;
        }

        // Defer the reply to allow time for channel creation.
        await interaction.deferReply({ ephemeral: true });

        try {
            const guild = interaction.guild;

            // Create a category for the temporary channels.
            const category = await guild.channels.create({
                name: '🔰 Temporary Channels',
                type: ChannelType.GuildCategory,
            });

            // Create the "Join to Create" voice channel.
            const creatorChannel = await guild.channels.create({
                name: '➕ Create Channel',
                type: ChannelType.GuildVoice,
                parent: category.id,
                permissionOverwrites: [{
                    id: guild.id, // @everyone role
                    allow: [PermissionFlagsBits.Connect],
                }, ],
            });

            // Store the creator channel's ID.
            this.creatorChannelId = creatorChannel.id;

            await interaction.editReply('The temporary channel system has been set up successfully!');
            logger.info(`Temp channel system set up in guild "${guild.name}" (ID: ${guild.id}).`);

        } catch (error) {
            logger.error('Failed to set up temporary channels:', error);
            await this.sendErrorMessage(interaction);
        }
    }

    /**
     * Handles voice state updates to create or delete channels.
     * @param {import('discord.js').VoiceState} oldState The previous voice state.
     * @param {import('discord.js').VoiceState} newState The new voice state.
     */
    async handleVoiceStateUpdate(oldState, newState) {
        const user = newState.member;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;

        // Case 1: User joins the creator channel.
        if (newChannel && newChannel.id === this.creatorChannelId) {
            await this.createTemporaryChannelFor(user, newChannel.parent);
        }

        // Case 2: User leaves a temporary channel, and it becomes empty.
        if (oldChannel && this.tempChannels.has(oldChannel.id) && oldChannel.members.size === 0) {
            await this.deleteTemporaryChannel(oldChannel);
        }
    }

    /**
     * Creates a new temporary voice channel for a user.
     * @param {import('discord.js').GuildMember} user The user who will own the channel.
     * @param {import('discord.js').CategoryChannel} parentCategory The category for the new channel.
     */
    async createTemporaryChannelFor(user, parentCategory) {
        if (!user || !parentCategory) return;

        try {
            const tempChannel = await user.guild.channels.create({
                name: `🎮 ${user.displayName}'s Room`,
                type: ChannelType.GuildVoice,
                parent: parentCategory.id,
                // Give the creator full permissions over their channel.
                permissionOverwrites: [{
                    id: user.id,
                    allow: [
                        PermissionFlagsBits.ManageChannels,
                        PermissionFlagsBits.MuteMembers,
                        PermissionFlagsBits.DeafenMembers,
                        PermissionFlagsBits.MoveMembers,
                    ],
                }, ],
            });

            // Add the new channel's ID to the tracking set.
            this.tempChannels.add(tempChannel.id);
            logger.info(`Created temporary channel "${tempChannel.name}" for ${user.user.tag}.`);

            // Move the user to their new channel.
            await user.voice.setChannel(tempChannel);

        } catch (error) {
            logger.error(`Could not create temporary channel for ${user.user.tag}:`, error);
        }
    }

    /**
     * Deletes an empty temporary voice channel.
     * @param {import('discord.js').VoiceChannel} channel The channel to delete.
     */
    async deleteTemporaryChannel(channel) {
        if (!channel) return;

        try {
            const channelName = channel.name;
            await channel.delete('Temporary channel is empty.');

            // Remove the channel's ID from the tracking set.
            this.tempChannels.delete(channel.id);
            logger.info(`Deleted empty temporary channel "${channelName}".`);

        } catch (error) {
            // Catch error if the channel was already deleted.
            if (error.code === 10003) { // Unknown Channel
                logger.info(`Attempted to delete an already deleted channel (ID: ${channel.id}).`);
                this.tempChannels.delete(channel.id);
            } else {
                logger.error(`Failed to delete temporary channel (ID: ${channel.id}):`, error);
            }
        }
    }

    /**
     * Sends a generic error message in response to an interaction.
     * @param {import('discord.js').CommandInteraction} interaction The interaction to reply to.
     */
    async sendErrorMessage(interaction) {
        const errorMessage = 'Oops! An error occurred. Please try again later.';

        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({ content: errorMessage, ephemeral: true }).catch(() => {});
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true }).catch(() => {});
        }
    }
}

// Export the class for use in other files.
module.exports = TempChannelsModule;
