const { SlashCommandBuilder } = require('@discordjs/builders');
const roleForReactionData = require('../data/role-for-reactions');
const allowedUserIds = require('../data/allowed-user-ids');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('add a new role for your server!')
		.addStringOption(option =>
			option.setName('message-id')
				.setDescription('The id of the message that should be observed')
				.setRequired(true),
		).addStringOption(option =>
			option.setName('emoji-id')
				.setDescription('The id of the reaction emote that should be observed')
				.setRequired(true),
		).addRoleOption(option =>
			option.setName('role')
				.setDescription('Put in the role which should be pinged for new listings')
				.setRequired(true),
		),
	async execute(interaction) {
		if (!isUserAllowed(interaction.user.id)) {
			await interaction.reply({ content: 'You are not allowed to use this command!', ephemeral: true });
			return;
		}

		const keyProperties = {};
		keyProperties.messageId = interaction.options.getString('message-id');
		keyProperties.emojiId = interaction.options.getString('emoji-id');

		if (keyAlreadyinSet(keyProperties)) {
			await interaction.reply({ content: 'This message & emoji combination is already in the config!', ephemeral: true });
			return;
		}

		const roleId = interaction.options.getRole('role').id;

		roleForReactionData.set(keyProperties, roleId);

		await interaction.reply({ content: 'Successfully added!', ephemeral: true });
	},
};

const isUserAllowed = userId =>
	allowedUserIds.includes(userId);

const keyAlreadyinSet = keyProperties => {
	const foundKey = Array.from(roleForReactionData.keys()).find(key =>
		key.messageId === keyProperties.messageId &&
		key.emojiId === keyProperties.emojiId
	)
	return !!foundKey;
}