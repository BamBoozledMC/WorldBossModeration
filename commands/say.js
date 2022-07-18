const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'say',
  descrption: 'Returns your message',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		if (message.member.roles.cache.some(role => role.id === '947756109932937246')) return;
		if (message.author.bot) return;
		if (message.content.includes("@everyone"))  return;
		if (message.content.includes("@here")) return;
		let msgtosend = args.join(" ")
		if (!msgtosend) {
			let errMSG = await message.reply('Sorry, but you need to include for me to say!').catch(error =>{
			})
			return setTimeout(() => errMSG.delete().catch(error => {}), 3000);
		}
		message.delete().catch(error =>{
		})

		message.channel.send(msgtosend).catch(error =>{
		})
    }
}
