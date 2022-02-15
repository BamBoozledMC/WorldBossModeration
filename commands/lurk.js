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
			let reason = args.join(" ");
				if(!reason) {
				  lurkreason = "No reason specified";
				}
				else {
				  lurkreason = `${reason}`
				}

				gettimenow = new Date().toString()

			message.channel.send(`**${message.author}** is now lurking.`)
			db.set(`lurking.${message.author.id}`, { reason: lurkreason, startedAT: gettimenow, userID: message.author.id })
		}
		}
}
