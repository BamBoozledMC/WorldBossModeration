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
	async execute(bot, message, args, prefix) {
		if (!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
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
		.setColor("#d90053")
		.setFooter("Developed by BamBoozled#0882")
		.setTimestamp()

		message.channel.send(linkedusers)
    }
}
