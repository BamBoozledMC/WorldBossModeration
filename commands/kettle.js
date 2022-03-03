const config = require('../config.json');
const {Discord, MessageAttachment} = require ("discord.js");

module.exports = {
	name: 'kettle',
    descrption: 'Returns your message',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if(!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(!message.member.roles.cache.some(role => role.id === '937561741334814810')) return;
		}
		const picture = new MessageAttachment('./kettle.jpg');
		message.channel.startTyping()
		await message.channel.send(picture).catch(error =>{
		})
		message.channel.stopTyping()
    }
}
