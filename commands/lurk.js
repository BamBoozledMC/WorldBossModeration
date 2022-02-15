const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'lurk',
  descrption: 'Returns your message',
	cooldown: 30,
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		let checkiflurk = db.get(`lurking.${message.author.id}`)

		if(checkiflurk) return message.lineReply("You are already lurking!");
		else {
			if (message.content.includes("@everyone"))  return;
			if (message.content.includes("@here")) return;
			let reason = args.join(" ");
				if(!reason) {
				  lurkreason = "No reason specified";
				}
				else {
				  lurkreason = `${reason}`
				}

				gettimenow = new Date().toString()

			message.channel.send(`**${message.author}** is now lurking - **${lurkreason}**`).then(message => {
  			message.delete({timeout:10000})
  		});
			db.set(`lurking.${message.author.id}`, { reason: lurkreason, startedAT: gettimenow, userID: message.author.id })
		}
		}
}
