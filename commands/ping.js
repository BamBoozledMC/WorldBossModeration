const Discord = require ("discord.js");
const config = require('../config.json');
const ping = require('ping');
const db = require('quick.db');

module.exports = {
	name: 'ping',
	description: 'Checks the bot\'s ping',
	cooldown: 5,
	usage: '!ping',
	args: false,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${__filename.replace(`${__dirname}\\`, "").replace(".js", "")}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		const pingMsg =  await message.channel.send('<a:loading:939665977728176168> Pinging...');
		let localping = await ping.promise.probe('127.0.0.1', {
           timeout: 5,
       });
		let isp_dns = await ping.promise.probe('1.1.1.1', {
	          timeout: 5,
	      });
		try {
			let pingembed = new Discord.MessageEmbed()
			.setTitle("Pong! 🏓")
			.addField("📥 Roundtrip:", `**${(pingMsg.editedTimestamp || pingMsg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)}ms**`)
			.addField("📤 API:", `**${bot.ws.ping}ms**`)
			.addField("<:server:948743195309768746> ISP/DNS:", `**${isp_dns.time}ms**`)
			.addField("🖥️ INTERNAL:", `**${localping.time}ms**`)
			.setColor(themecolor)
			.setTimestamp()
		return pingMsg.edit({ content: ' ', embeds: [pingembed] });
	}catch(e){}
}
}
