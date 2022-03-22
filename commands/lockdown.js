const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'lockdown',
  descrption: 'Returns your message',
	aliases: ['lock', 'addlockchannel', 'addlockch', 'addlockdownchannel', 'addlockdownch', 'removelockchannel', 'removelockch', 'removelockdownchannel', 'removelockdownch', 'rlockchannel', 'rlockch', 'rlockdownchannel', 'rlockdownch', 'lockchannels', 'lockdownchannels'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName) {
		if (!message.member.permissions.has("MANAGE_GUILD") && message.author.id != config.ownerID) return;

		let theargs = args[0]
		if (commandName === 'addlockchannel' || commandName === 'addlockch') return addlockdownchannel(message, theargs);
		if (commandName === 'addlockdownchannel' || commandName === 'addlockdownch') return addlockdownchannel(message, theargs);
		if (commandName === 'removelockchannel' || commandName === 'removelockch') return removelockdownchannel(message, theargs);
		if (commandName === 'removelockdownchannel' || commandName === 'removelockdownch') return removelockdownchannel(message, theargs);
		if (commandName === 'rlockchannel' || commandName === 'rlockch') return removelockdownchannel(message, theargs);
		if (commandName === 'rlockdownchannel' || commandName === 'rlockdownch') return removelockdownchannel(message, theargs);
		if (commandName === 'lockchannels' || commandName === 'lockdownchannels') return lockdownchannels(message);

		if (!args[0]) return locksinglechannel(message, message.channel.id);
		if (args[0].toLowerCase() == 'all') return lockallchannels(message);
		if (!isNaN(args[0].replace(/\D/g,''))) return locksinglechannel(message, args[0].replace(/\D/g,''));



			async function locksinglechannel(message, channel) {
				channel = message.guild.channels.cache.get(channel)
				if(!channel) {
					return message.channel.send(`Specified **channel** is invlaid/doesn't exist!`)
				}

				if (!message.guild.me.permissionsIn(channel).has("MANAGE_ROLES")) return message.channel.send("I don't have the `MANAGE_ROLES` permission in that channel.")
				if (!channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) {
					 return message.channel.send(`**${channel}** is already locked!`)
				}
				let loading = await message.channel.send("<a:loading:939665977728176168> Give me a sec...")
				try {
				await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SEND_MESSAGES: false })
				if (!message.guild.me.permissionsIn(channel).has("SEND_MESSAGES")) await channel.permissionOverwrites.edit(message.guild.me, { SEND_MESSAGES: true })
				if (!message.member.permissionsIn(channel).has("SEND_MESSAGES")) {
				 await channel.permissionOverwrites.edit('932108051924783104', { SEND_MESSAGES: true })
				 await channel.permissionOverwrites.edit('932770457810251857', { SEND_MESSAGES: true })
			 }

				loading.edit(`<:shieldtick:939667770184966186> **${channel}** was locked.`)
			} catch(e) {
				console.log(e);
				return loading.edit(`There was an error: **${e}**`);
			}
			}


			async function lockallchannels(message) {
				var loading = await message.channel.send("<a:loading:939665977728176168> Give me a sec...")
				getchannels = db.get(`lockdownchannels.${message.guild.id}`)
				if (!getchannels) {
					return loading.edit(`There are no lockdown channels stored`)
				}

				try {
				getchannels.forEach(async function (channelID) {
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
			regetchannels.forEach(function (channelID, index) {
				promise = promise.then(async function () {
				channel = message.guild.channels.cache.get(channelID)

				if (!channel.permissionsFor(channel.guild.roles.everyone).has('SEND_MESSAGES')) {
					 return message.channel.send(`**${channel}** was already locked.`)
				}
				try {
				await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SEND_MESSAGES: false })
				if (!message.guild.me.permissionsIn(channel).has("SEND_MESSAGES")) await channel.permissionOverwrites.edit(message.guild.me, { SEND_MESSAGES: true })
				if (!message.member.permissionsIn(channel).has("SEND_MESSAGES")) {
				  channel.permissionOverwrites.edit('932108051924783104', { SEND_MESSAGES: true })
				 channel.permissionOverwrites.edit('932770457810251857', { SEND_MESSAGES: true })
			 }
			 channel.send(`⚠️ The server is in lockdown. Check <#${config.generalID}> for more info.`).catch(error =>{
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
		loading.edit(`<:shieldtick:939667770184966186> The server is now in lockdown, all channels have been locked.`)
		});
	} catch (e) {
		if (e !== 'Break') throw e
		return;
	}
		}


		async function addlockdownchannel(message, theargs) {
			if(!theargs) return message.channel.send(`You must specify a channel to add.`);
			channel = theargs.replace(/\D/g,'')
			if(isNaN(channel)) return message.channel.send(`You must specify a channel to add.`);
			let yes = db.get(`lockdownchannels.${message.guild.id}`)
			if(yes) {
				try {
				yes.forEach(function (channelID) {
					if(channelID == channel) {
						message.channel.send(`<#${channel}> has already been added as a lockdown channel.`);
						throw 'Break';
					}
				});
				} catch (e) {
					if (e !== 'Break') console.log(e);
					return;
				}
			}


			db.push(`lockdownchannels.${message.guild.id}`, channel)
			message.channel.send(`Added <#${channel}> with the ID: \`${channel}\` to the lockdown channels.`)
		}

		async function removelockdownchannel(message, theargs) {
			if(!theargs) return message.channel.send(`You must specify a channel to add.`);
			channel = theargs.replace(/\D/g,'')
			if(isNaN(channel)) return message.channel.send(`You must specify a channel to add.`);
			let yes = db.get(`lockdownchannels.${message.guild.id}`)
			if(yes) {
				var index = yes.indexOf(channel);
					if (index > -1) {
						yes.splice(index, 1);
					} else {
						return message.channel.send(`<#${channel}> has already been added as a lockdown channel.`);
					}
				db.delete(`lockdownchannels.${message.guild.id}`)
				yes.forEach(function (channelID) {
					console.log(channelID);
				db.push(`lockdownchannels.${message.guild.id}`, channelID)
			})
					message.channel.send(`Removed <#${channel}> with the ID: \`${channel}\` from the lockdown channels.`)
			} else {
				return message.channel.send("There are no lockdown channels to remove.")
			}


		}

		async function lockdownchannels(message) {
			let embed = new Discord.MessageEmbed()
			.setTitle("Server Lockdown channels")
			.setFooter("Developed by BamBoozled#0882")
			.setTimestamp()
			.setColor("#d90053")

			let lockchannels = [];
			let yes = db.get(`lockdownchannels.${message.guild.id}`)
			if(yes) {
			yes.forEach(function (channelID) {
				lockchannels.push(`<#${channelID}> (\`${channelID}\`)`)
			});
			embed.setDescription(lockchannels.join('\n'))
		} else {
			embed.setDescription("There are no lockdown channels added.")
		}
			message.channel.send({embeds: [embed]})
		}

    }
}
