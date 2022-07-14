const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');
const SteamAPI = require('steamapi');
const steam = new SteamAPI(config.steamAPI_KEY);

module.exports = {
	name: 'linked',
  descrption: 'Linked users',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		if (message.member.roles.cache.some(role => role.id === '947756109932937246')) return;
		let dbget = db.get(`linked.users`)

		let users = []
		for (const p in dbget) {
  		users.push(`<@${dbget[p].discord}> - Steam ID \`${dbget[p].steam}\``)
		}
		userlist = users.join("\n")
		let linkedusers = new Discord.MessageEmbed()
		.setTitle("All linked users")
		.setDescription(userlist)
		.setColor(themecolor)
		.setFooter(`Developed by ${bot.users.cache.get(config.ownerID).tag}`, bot.users.cache.get(config.ownerID).displayAvatarURL({ dynamic: true }))
		.setTimestamp()

		message.channel.send({embeds: [linkedusers]})
    }
}
