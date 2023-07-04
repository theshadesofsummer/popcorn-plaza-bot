import dotenv from 'dotenv';
dotenv.config();

import {REST} from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import { Client, Collection, IntentsBitField } from 'discord.js';
import {startEvent} from "./commands/start-event.js";
import {addToEventNotification} from "./commands/add-to-notification.js";
import {stopEvent} from "./commands/stop-event.js";
import {removeFromEventNotification} from "./commands/remove-from-notification.js";

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMessageReactions] });
const commands = [
	startEvent,
	stopEvent
]

export async function setupDiscordBot() {
	await deployCommandsToServer();

	client.commands = getCollectionForCommands();

	client.once('ready', () => {
		console.log('Ready!');
	});

	client.on('interactionCreate', async interaction => {
		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;

			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}

		if (interaction.isButton()) {
			if (interaction.customId === 'add-to-notification') {
				await addToEventNotification(interaction)
			}

			if (interaction.customId === 'remove-from-notification') {
				await removeFromEventNotification(interaction)
			}
		}
	});

	await client.login(process.env.POPCORNPLAZA_BOT_TOKEN);
}

async function deployCommandsToServer() {
	const commandData = []
	for (const command of commands) {
		commandData.push(command.data.toJSON());
	}

	const rest = new REST({ version: '10' }).setToken(process.env.POPCORNPLAZA_BOT_TOKEN);

	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(process.env.POPCORNPLAZA_BOT_CLIENTID),
			{ body: commandData },
		);

		console.log('Successfully reloaded application (/) commands.');
	}
	catch (error) {
		console.error(error);
	}
}

function getCollectionForCommands() {
	const collection = new Collection();

	for (const command of commands) {
		collection.set(command.data.name, command);
	}

	return collection;
}


// const fs = require('node:fs');
// const path = require('node:path');
// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');
//
// const commands = [];
// const commandsPath = path.join(__dirname, 'commands');
// const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
//
// for (const file of commandFiles) {
// 	const filePath = path.join(commandsPath, file);
// 	const command = require(filePath);
// 	commands.push(command.data.toJSON());
// }
// const rest = new REST({ version: '10' }).setToken('MTAyMzkyNjY0NjA0NDA5ODU5MA.GyOfoW.ei-ANz9zQznpVYbO9pAdS3z10nvebnzurCX2K8');
//
// (async () => {
// 	try {
// 		console.log('Started refreshing application (/) commands.');
//
// 		await rest.put(
// 			Routes.applicationCommands('1023926646044098590'),
// 			{ body: commands },
// 		);
//
// 		console.log('Successfully reloaded application (/) commands.');
// 	}
// 	catch (error) {
// 		console.error(error);
// 	}
// })();