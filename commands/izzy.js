const config = require('../config.json');
const {Discord, MessageAttachment} = require ("discord.js");

module.exports = {
	name: 'izzy',
    descrption: 'Returns your message',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if (!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;

		const picture = new MessageAttachment('./tea-time.gif');
		message.channel.send(picture).catch(error =>{
		})
    }
}
