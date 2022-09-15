const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'membercount',
  descrption: 'Returns your message',
	aliases: ['members', 'mc', 'usercount', 'users'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${__filename.replace(`${__dirname}\\`, "").replace(".js", "")}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		let botCount = message.guild.members.cache.filter(member => member.user.bot).size;
		let memberCount = message.guild.memberCount - botCount
		message.channel.send(`There are **${memberCount}** members and **${botCount}** bots`)
    }
}
