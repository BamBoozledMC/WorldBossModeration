const config = require('../config.json');
const {Discord, MessageAttachment} = require ("discord.js");

module.exports = {
	name: 'millsy',
  descrption: 'Returns your message',
	aliases: ['mills'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if (!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;

		const picture = new MessageAttachment('./british.gif');
		message.channel.send(picture).catch(error =>{
		})
    }
}
