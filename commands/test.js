const config = require('../config.json');
const {Discord, MessageAttachment} = require ("discord.js");
const canvacord = require("canvacord");

module.exports = {
	name: 'test',
  descrption: 'Returns your message',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if (!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		let msgtosend = args.join(" ")
		if (!msgtosend) {
			let errMSG = await message.reply('Sorry, but you need to include for me to say!').catch(error =>{
			})
			return errMSG.delete({timeout:3000});
		}

		let image = await canvacord.Canvas.ohno("Your mother")
		message.channel.send(new MessageAttachment(image, "image.gif"))


    }
}
