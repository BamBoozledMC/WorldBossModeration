const config = require('../config.json');
const Discord = require ("discord.js");
const {rps} = require('discord-rps')

module.exports = {
	name: 'rps',
  descrption: 'Returns your message',
	aliases: ['rockpaperscissors', 'scissorspaperrock', 'spr'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		//if (!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		rps(message)
    }
}
