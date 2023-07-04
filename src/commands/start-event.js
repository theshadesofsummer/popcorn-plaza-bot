import {allowedUserIDs} from "../data/allowed-user-ids.js";
import {eventInformation} from "../data/event-information.js";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder} from "discord.js";

const EVENT_ROLE_NAME = "Event Playah"
export const startEvent = {
  data: new SlashCommandBuilder()
    .setName('start-event')
    .setDescription('Start a new Popcorn Plaza Event!')
    .addStringOption(option =>
      option.setName('game')
        .setDescription('The name of the game in todays tournament')
        .setRequired(true),
    ),
  async execute(interaction) {
    if (!isUserAllowed(interaction.user.id)) {
      await interaction.reply({ content: 'You are not allowed to use this command!', ephemeral: true });
      return;
    }

    if (eventInformation.isRunning) {
      await interaction.reply({
        content: `There already is an of ${eventInformation.game} running this needs to be stopped (with \`/stop-event\` first)!`,
        ephemeral: true,
      })
      return;
    }

    const gameName = interaction.options.getString('game');

    let eventRole;
    if (!await eventRoleExists(interaction)) {
      eventRole = await interaction.guild.roles.create({
        name: EVENT_ROLE_NAME,
        color: 'Orange',
      })
      console.log('created role', EVENT_ROLE_NAME)
    } else {
      console.log('role exists already')
      await interaction.guild.roles.fetch().then(roles => {
        eventRole = roles.find(role => role.name === EVENT_ROLE_NAME)
      })
    }

    eventInformation.isRunning = true;
    eventInformation.game = gameName;
    eventInformation.role = eventRole;

    const addNotification = new ButtonBuilder()
      .setCustomId('add-to-notification')
      .setLabel('Get Notifications')
      .setStyle(ButtonStyle.Success);
    const removeNotification = new ButtonBuilder()
      .setCustomId('remove-from-notification')
      .setLabel('Remove Notifications')
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder()
      .addComponents(addNotification, removeNotification);

    await interaction.reply({
      content: `### Attention @everyone! \n\nA new Popcorn Plaza event is coming right up! \nWe will be playing **${gameName}** today, if you want top be pinged for Lobby Codes and Open Lobbies **click the 'Get Notification' button** below to get the <@&${eventInformation.role.id}> role!`,
      components: [row]
    });
  },
};

const isUserAllowed = userId =>
  allowedUserIDs.includes(userId);

const eventRoleExists = interaction => {
  return interaction.guild.roles.fetch().then(roles => {
    return roles.some(role => role.name === EVENT_ROLE_NAME)
  })
}
