import {allowedUserIDs} from "../data/allowed-user-ids.js";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder} from "discord.js";

export const startEvent = {
  data: new SlashCommandBuilder()
    .setName('start-event')
    .setDescription('Start a new Popcorn Plaza Event!')
    .addStringOption(option =>
      option.setName('game')
        .setDescription('The name of the game in todays tournament')
        .setRequired(true),
    ).addRoleOption(option =>
      option.setName('role')
        .setDescription('Put in the role which should be pinged for this event if notified')
        .setRequired(true),
    ),
  async execute(interaction) {
    if (!isUserAllowed(interaction.user.id)) {
      await interaction.reply({ content: 'You are not allowed to use this command!', ephemeral: true });
      return;
    }

    const gameName = interaction.options.getString('game');
    const role = interaction.options.getRole('role');

    const addNotification = new ButtonBuilder()
      .setCustomId('add-to-notification')
      .setLabel('Get Notifications')
      .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder()
      .addComponents(addNotification);

    await interaction.reply({
      content: `### Attention @summershades! \n\nA new Popcorn Plaza event is coming right up! \nWe will be playing **${gameName}** today, if you want top be pinged for Lobby Codes and Open Lobbies click the 'Get Notification'-button below to get the ${role.name} role!`,
      components: [row]
    });
  },
};

const isUserAllowed = userId =>
  allowedUserIDs.includes(userId);
