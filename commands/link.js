const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');
const SteamAPI = require('steamapi');
const steam = new SteamAPI(config.steamAPI_KEY);

module.exports = {
	name: 'link',
  descrption: 'Linking',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${__filename.replace(`${__dirname}\\`, "").replace(".js", "")}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
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
			let linked = new Discord.MessageEmbed()
			.setTitle(`You're linked!`)
			.setDescription(`Your Steam (**[${getusersteam.nickname}](${getusersteam.url})**) & Discord (**${message.author.tag}**) accounts are linked with **World Boss Moderation**!\n\nIf this is wrong or you'd like to unlink your accounts, use \`${prefix}unlink\``)
			.setThumbnail(getusersteam.avatar.medium)
			.setColor(themecolor)
			.setFooter(`Developed by ${bot.users.cache.get(config.ownerID).tag}`, bot.users.cache.get(config.ownerID).displayAvatarURL({ dynamic: true }))
			.setTimestamp()

			message.reply({embeds: [linked]})
		}

    }
}
