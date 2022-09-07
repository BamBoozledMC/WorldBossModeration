const config = require('../config.json');
const {Discord, MessageAttachment} = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'millsy',
  descrption: 'Returns your message',
	aliases: ['mills'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${commandName}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(!message.member.roles.cache.some(role => role.id === '937561741334814810')) return;
		}
		message.channel.send({files: ['./british.gif']}).catch(error =>{
		})
    }
}
