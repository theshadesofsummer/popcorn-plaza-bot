import {eventInformation} from "../data/event-information.js";

export async function removeFromEventNotification(interaction) {
  if (!eventInformation.isRunning) {
    await interaction.reply({
      content: `The Event is not running anymore!`,
      ephemeral: true
    })
    return;
  }

  const userRoles = interaction.guild.members.cache.get(interaction.user.id).roles

  if (userRoles.cache.get(eventInformation.role.id) === undefined) {
    await interaction.reply({
      content: `You are not subscribed to the event, so the role <@&${eventInformation.role.id}> can't be removed!`,
      ephemeral: true
    })
    return;
  }

  userRoles.remove(eventInformation.role);

  await interaction.reply({
    content: `Hey **${interaction.user.username}**, the Role <@&${eventInformation.role.id}> for this Event of **${eventInformation.game}** was successfully removed!`,
    ephemeral: true
  })
}
