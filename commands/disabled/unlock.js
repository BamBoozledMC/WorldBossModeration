const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'unlock',
  descrption: 'Returns your message',
	aliases: ['unlockdown'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (!message.member.permissions.has("MANAGE_GUILD") && message.author.id != config.ownerID) return;

		if (!args[0]) return unlocksinglechannel(message, message.channel.id);
		if (args[0].toLowerCase() == 'all') return unlockallchannels(message);
		if (!isNaN(args[0].replace(/\D/g,''))) return unlocksinglechannel(message, args[0].replace(/\D/g,''));


		async function unlocksinglechannel(message, channel) {
			channel = message.guild.channels.cache.get(channel)
			if(!channel) {
				return message.channel.send(`Specified **channel** is invlaid/doesn't exist!`)
			}

			if (!message.guild.me.permissionsIn(channel).has("MANAGE_ROLES")) return message.channel.send("I don't have the `MANAGE_ROLES` permission in that channel.")
			if (channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) {
				 return message.channel.send(`**${channel}** is not locked!`)
			}
			let loading = await message.channel.send("<a:loading:939665977728176168> Give me a sec...")
			try {
			await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SEND_MESSAGES: null })
			loading.edit(`<:shieldtick:939667770184966186> **${channel}** was unlocked.`)
		} catch(e) {
			console.log(e);
			return loading.edit(`There was an error: **${e}**`);
		}
		}


		async function unlockallchannels(message) {
			var loading = await message.channel.send("<a:loading:939665977728176168> Give me a sec...")
			getchannels = db.get(`lockdownchannels.${message.guild.id}`)
			if (!getchannels) {
				return loading.edit(`There are no lockdown channels stored`)
			}

			try {
			getchannels.forEach(function (channelID) {
				channel = message.guild.channels.cache.get(channelID)
				if(!channel) {
					var index = getchannels.indexOf(channelID);
						if (index > -1) {
							getchannels.splice(index, 1);
						}
						db.delete(`lockdownchannels.${message.guild.id}`)
						getchannels.forEach(function (channelID) {
							console.log(channelID);
						db.push(`lockdownchannels.${message.guild.id}`, channelID)
					})
					return message.channel.send(`Channel in database (\`${channelID}\`) is invlaid/doesn't exist and has automatically been removed.`)
				}

				if (!message.guild.me.permissionsIn(channel).has("MANAGE_ROLES")) {
					loading.edit(`I don't have the \`MANAGE_ROLES\` permission in the ${channel} channel.\nPlease add this permission and retry the command.`)
					throw 'Break';
				}
			});
		} catch (e) {
			if (e !== 'Break') throw e
			return;
		}

		regetchannels = db.get(`lockdownchannels.${message.guild.id}`)

		try {
			var promise = Promise.resolve();
		regetchannels.forEach(function (channelID) {
			promise = promise.then(async function () {
			channel = message.guild.channels.cache.get(channelID)

			if (channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) {
				 return message.channel.send(`**${channel}** was not locked.`)
			}
			try {
			await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SEND_MESSAGES: null })
		  channel.send(`⚠️ The server is no longer in lockdown and this channel has been unlocked.`).catch(error =>{
			 console.log(`I couldnt send a message in ${channel.name}. ${error}`);
		})
		} catch(e) {
			loading.edit(`There was an error: **${e}**`);
			throw e;
		}
		return new Promise(function (resolve) {
		setTimeout(resolve, 1000);
	});
		});
	});
	promise.then(function () {
	loading.edit(`<:shieldtick:939667770184966186> The server is no longer in lockdown, all channels have been unlocked.`)
	});
} catch (e) {
	if (e !== 'Break') throw e
	return;
}
	}

    }
}
