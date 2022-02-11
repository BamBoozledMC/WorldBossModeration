const config = require('../config.json');
const Discord = require ("discord.js");

module.exports = {
	name: 'membercount',
  descrption: 'Returns your message',
	aliases: ['members', 'mc', 'usercount', 'users'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		let botCount = message.guild.members.cache.filter(member => member.user.bot).size;
		let memberCount = message.guild.memberCount - botCount
		message.channel.send(`There are **${memberCount}** members and **${botCount}** bots`)
    }
}
