const config = require('../config.json');
const {Discord, MessageAttachment} = require ("discord.js");

module.exports = {
	name: 'bobbo',
    descrption: 'Returns your message',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(!message.member.roles.cache.some(role => role.id === '937561741334814810')) return;
		}
		message.channel.send({files: ['./millsy.png']}).catch(error =>{
		})
    }
}
