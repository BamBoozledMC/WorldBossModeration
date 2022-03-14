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
	async execute(bot, message, args, prefix) {
		let dbget = db.get(`linked.users.${message.author.id}`)

		if (!dbget) {
			let notlinked = new Discord.MessageEmbed()
			.setTitle(`You're not linked!`)
			.setDescription(`To link your **Steam** account with **World Boss Moderation** head to [wmb.bamboozledmc.xyz](https://wbm.bamboozledmc.xyz) and click the "Link your Discord & Steam account" button to start the linking proccess!\n\nLinking is completely safe and the only data stored is your Discord user ID and Steam user ID.`)
			.setColor("#d90053")
			.setFooter("Developed by BamBoozled#0882")
			.setTimestamp()

			message.lineReply(notlinked)
		} else if (dbget) {
			let getusersteam = await steam.getUserSummary(dbget.steam)
			let linked = new Discord.MessageEmbed()
			.setTitle(`You're linked!`)
			.setDescription(`Your Steam (**[${getusersteam.nickname}](${getusersteam.url})**) & Discord (**${message.author.tag}**) accounts are linked with **World Boss Moderation**!\n\nIf this is wrong or you'd like to unlink your accounts, use \`${prefix}unlink\``)
			.setThumbnail(getusersteam.avatar.medium)
			.setColor("#d90053")
			.setFooter("Developed by BamBoozled#0882")
			.setTimestamp()

			message.lineReply(linked)
		}

    }
}
