const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'faq',
  descrption: 'Returns your message',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${commandName}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(!message.member.roles.cache.some(role => role.id === '934287337314193478')) return;
		}

		message.channel.send("There is no current release date. The game is planned to release in 2022. Please keep up to date with the developers for further information. <#932748202397028383>").catch(error =>{
		})
    }
}
