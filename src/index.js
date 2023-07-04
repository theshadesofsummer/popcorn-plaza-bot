const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents, MessagePayload } = require('discord.js');
const roleForReactionData = require('./data/role-for-reactions');
const findInMap = require('./helpers/find-in-map');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.message.partial) await reaction.message.fetch();
	if (reaction.partial) await reaction.fetch;

	if (user.bot || !reaction.message.guild) return;

	const foundKey = findInMap(reaction.message.id, reaction.emoji.id)

	if (foundKey) {
		const roleId = roleForReactionData.get(foundKey);

		// const role = reaction.message.guild.roles.cache.get(roleId);
		// await reaction.message.guild.members.cache.get(user.id).roles.add(role);

		const channel = reaction.message.channel

		const cachedUser = user.partial ? await user.fetch() : user;

		const messagePayload = new MessagePayload(cachedUser, {content: 'hi'});
		await channel.send(messagePayload)
	}
});

client.on('messageReactionRemove', async (reaction, user) => {
	if (reaction.message.partial) await reaction.message.fetch();
	if (reaction.partial) await reaction.fetch;

	if (user.bot || !reaction.message.guild) return;

	const foundKey = findInMap(reaction.message.id, reaction.emoji.id)

	if (foundKey) {
		const roleId = roleForReactionData.get(foundKey);

		const role = reaction.message.guild.roles.cache.get(roleId);
		await reaction.message.guild.members.cache.get(user.id).roles.remove(role);
	}
});

client.login('MTAyMzkyNjY0NjA0NDA5ODU5MA.GyOfoW.ei-ANz9zQznpVYbO9pAdS3z10nvebnzurCX2K8');
