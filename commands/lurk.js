const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'lurk',
  descrption: 'Returns your message',
	aliases: ['afk'],
	cooldown: 60,
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${__filename.replace(`${__dirname}\\`, "").replace(".js", "")}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		let checkiflurk = db.get(`lurking.${message.author.id}`)

		if(checkiflurk) return message.reply("You are already lurking!");
		else {
			if (message.content.includes("@everyone"))  return;
			if (message.content.includes("@here")) return;
			if (message.content.includes("<@&")) return; // role mentions are <@&role_id>
			let reason = args.join(" ");
				if(!reason) {
				  lurkreason = "No reason specified";
				}
				else {
				  lurkreason = `${reason}`
				}

			message.delete().catch(error => {})
			message.channel.send(`**${message.author}** is now lurking - **${lurkreason}**`).then(message => {
				setTimeout(() => message.delete().catch(error => {}), 10000);
  		});
			let currentnick = message.member.nickname ? message.member.nickname : message.author.username
			await message.member.setNickname(`[AFK] ${currentnick}`).catch(error => {});
			db.set(`lurking.${message.author.id}`, { reason: lurkreason, startedAT: Math.round(Date.now() / 1000), userID: message.author.id, name: currentnick })
		}
		}
}
