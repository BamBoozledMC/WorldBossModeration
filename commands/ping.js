const Discord = require ("discord.js");
const config = require('../config.json');
const ping = require('ping');

module.exports = {
	name: 'ping',
	description: 'Checks the bot\'s ping',
	usage: '!ping',
	args: false,
	async execute(bot, message, args, prefix) {
		if(!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(message.channel.id == config.generalID) return;
		}
		let localping = await ping.promise.probe('127.0.0.1', {
           timeout: 5,
       });
		try {
        const pingMsg =  await message.channel.send('Pinging...');
		return pingMsg.edit(`
		Pong! __Roundtrip__: **${
				(pingMsg.editedTimestamp || pingMsg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)
			}ms.** | __API__: **${
				bot.ws.ping
			}ms** | __INTERNAL__: **${
				localping.time
			}ms**
		`);
	}catch(e){}
}
}
