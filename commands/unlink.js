const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');
const SteamAPI = require('steamapi');
const steam = new SteamAPI(config.steamAPI_KEY);

module.exports = {
	name: 'unlink',
  descrption: 'Unlinking',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${commandName}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		let dbget = db.get(`linked.users.${message.author.id}`)

		if (!dbget) {
			let notlinked = new Discord.MessageEmbed()
			.setTitle(`You're not linked!`)
			.setDescription(`To link your **Steam** account with **World Boss Moderation** head to [wbmoderation.com](https://wbmoderation.com) and click the "Link your Discord & Steam account" button to start the linking proccess!\n\nLinking is completely safe and the only data stored is your Discord user ID and Steam user ID.`)
			.setColor(themecolor)
			.setFooter(`Developed by ${bot.users.cache.get(config.ownerID).tag}`, bot.users.cache.get(config.ownerID).displayAvatarURL({ dynamic: true }))
			.setTimestamp()

			message.reply({embeds: [notlinked]})
		} else if (dbget) {
			let getusersteam = await steam.getUserSummary(dbget.steam)

			let areyousure = new Discord.MessageEmbed()
			.setTitle('Unlink')
			.setDescription(`⚠️ Are you sure you want to unlink your Steam account?\nCurrently linked to **[${getusersteam.nickname}](${getusersteam.url})**`)
			.setColor('ORANGE')
			let areyousuresend = await message.channel.send({embeds: [areyousure]})
			areyousuresend.react('✅').then(() => areyousuresend.react('❌'));

			const filter = (reaction, user) => {
				return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
			};

			areyousuresend.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
				.then(async collected => {
					const reaction = collected.first();

					if (reaction.emoji.name === '✅') {
						areyousuresend.reactions.removeAll()
						let unlinked = new Discord.MessageEmbed()
						.setTitle(`Successfully Unlinked!`)
						.setDescription(`Your Steam (**[${getusersteam.nickname}](${getusersteam.url})**) account has been successfully unlinked and is no longer associated with **World Boss Moderation**\n\nTo re-link or link another account, use \`${prefix}link\``)
						.setThumbnail(getusersteam.avatar.medium)
						.setColor(themecolor)
						.setFooter(`Developed by ${bot.users.cache.get(config.ownerID).tag}`, bot.users.cache.get(config.ownerID).displayAvatarURL({ dynamic: true }))
						.setTimestamp()

						db.delete(`linked.users.${message.author.id}`)
						areyousuresend.edit({content: " ", embeds: [unlinked]})
					} else {
						areyousuresend.reactions.removeAll()
						let unlinked = new Discord.MessageEmbed()
						.setTitle(`Cancelled`)
						.setDescription(`You have cancelled the unlinking proccess and you will **not** be unlinked.`)
						.setColor(themecolor)
						.setFooter(`Developed by ${bot.users.cache.get(config.ownerID).tag}`, bot.users.cache.get(config.ownerID).displayAvatarURL({ dynamic: true }))
						.setTimestamp()
						areyousuresend.edit({content: " ", embeds: [unlinked]})
					}
				})
				.catch(collected => {
					areyousuresend.reactions.removeAll()
					let unlinked = new Discord.MessageEmbed()
					.setTitle(`Automatically Cancelled`)
					.setDescription(`The unlinking proccess was automatically cancelled (user didn't respond in time) and you will **not** be unlinked.`)
					.setColor(themecolor)
					.setFooter(`Developed by ${bot.users.cache.get(config.ownerID).tag}`, bot.users.cache.get(config.ownerID).displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					areyousuresend.edit({content: " ", embeds: [unlinked]})
			    });
		}

    }
}
