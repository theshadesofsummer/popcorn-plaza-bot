import {allowedUserIDs} from "../data/allowed-user-ids.js";
import {eventInformation} from "../data/event-information.js";
import {SlashCommandBuilder} from "discord.js";

export const stopEvent = {
  data: new SlashCommandBuilder()
    .setName('stop-event')
    .setDescription('Stop an existing Event!'),
  async execute(interaction) {
    if (!isUserAllowed(interaction.user.id)) {
      await interaction.reply({ content: 'You are not allowed to use this command!', ephemeral: true });
      return;
    }

    if (!eventInformation.isRunning) {
      await interaction.reply({
        content: `There is no ongoing event!`,
        ephemeral: true,
      })
      return;
    }

    interaction.guild.roles.delete(eventInformation.role)
    console.log("successfully removed event role")

    await interaction.reply({
      content: `### Attention Active Playas! \n\nThanks for participating in todays games of **${eventInformation.game}**, we hope to see you next time again!`,
    });

    eventInformation.isRunning = false;
    eventInformation.game = undefined;
    eventInformation.role = undefined;
  },
};

const isUserAllowed = userId =>
  allowedUserIDs.includes(userId);
