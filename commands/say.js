const config = require('../config.json');
const Discord = require ("discord.js");

module.exports = {
	name: 'say',
    descrption: 'Returns your message',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if (!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		if (message.author.bot) return;
		if (message.content.includes("@everyone"))  return;
		if (message.content.includes("@here")) return;
		let msgtosend = args.join(" ")
		if (!msgtosend) {
			let errMSG = await message.reply('Sorry, but you need to include for me to say!').catch(error =>{
			})
			return errMSG.delete({timeout:3000});
		}

		message.channel.send(msgtosend).catch(error =>{
		})
		message.delete().catch(error =>{
		})
    }
}
