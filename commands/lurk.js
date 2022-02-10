const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'lurk',
  descrption: 'Returns your message',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		let checkiflurk = db.get(`lurking.${message.author.id}`)

		if(checkiflurk) return message.lineReply("You are already lurking!");
		else {
			message.channel.send(`**${message.author.tag}** is now lurking.`)
			db.set(`lurking.${message.author.id}`, message.author.id)
		}
		}
}
