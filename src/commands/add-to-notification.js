import {eventInformation} from "../data/event-information.js";

export async function addToEventNotification(interaction) {
  if (!eventInformation.isRunning) {
    await interaction.reply({
      content: `The Event is not running anymore!`,
      ephemeral: true
    })
    return;
  }

  const userRoles = interaction.guild.members.cache.get(interaction.user.id).roles

  if (userRoles.cache.get(eventInformation.role.id) !== undefined) {
    await interaction.reply({
      content: `You already have the role <@&${eventInformation.role.id}>!`,
      ephemeral: true
    })
    return;
  }

  userRoles.add(eventInformation.role);

  await interaction.reply({
    content: `Hey **${interaction.user.username}**, you got the Role <@&${eventInformation.role.id}> for this Event of **${eventInformation.game}**!`,
    ephemeral: true
  })
}
