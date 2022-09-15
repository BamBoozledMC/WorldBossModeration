const Discord = require ("discord.js");
const config = require('../config.json');
const ping = require('ping');
const si = require('systeminformation');
const db = require('quick.db');

module.exports = {
	name: 'about',
	description: 'About the bot',
	aliases: ['aboutme', 'aboutbot', 'info', 'botinfo'],
	usage: 'about bot',
	args: false,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${__filename.replace(`${__dirname}\\`, "").replace(".js", "")}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(message.channel.id == config.generalID) return;
		}
		const aboutMsg =  await message.channel.send('<a:loading:939665977728176168> Gathering data...');

		let totalSeconds = (bot.uptime / 1000);
		let days = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.floor(totalSeconds % 60);

		let uptime = `**${days}** Days, **${hours}** Hours, **${minutes}** Minutes and **${seconds}** Seconds`;
		let apiping = `**${bot.ws.ping}ms**`

		let cpu = await si.cpu();
		let cputemp = await si.cpuTemperature();
		let os = await si.osInfo();
		let mem = await si.mem();

		let about = new Discord.MessageEmbed()
		.setTitle(`About ${bot.user.tag}`)
		.setDescription(`World Boss Moderation is a powerful moderation bot created by BamBoozled#0882 with the purpose of serving the World Boss Discord.\nWebsite: https://wbmoderation.com`)
		.addField('<:windows:953463882414948384> OS', `**Platform:** ${os.platform}\n**Distro:** ${os.distro}\n**Arch:** ${os.arch}`)
		.addField('<:inteli5:953467072288014377> CPU', `**Manufacturer:** ${cpu.manufacturer}\n**Brand:** ${cpu.brand}\n**Speed:** ${cpu.speed}GHz\n**Cores:** ${cpu.cores}`)
		.addField('<:ram:953469282661048320> RAM/Memory', `**Total:** ${Math.round(mem.total / 1024 / 1024 / 1024 * 10) / 10}GB\n**Used:** ${Math.round(mem.used / 1024 / 1024 / 1024 * 10) / 10}GB\n**Free:** ${Math.round(mem.free / 1024 / 1024 / 1024 * 10) / 10}GB`)
		.addField("📤 DISCORD API:", `${apiping}`)
		.addField("<:online:934604352419684383> UPTIME:", `${uptime}`)
		.setThumbnail('https://media.discordapp.net/attachments/933574813849632848/934606101847109652/worldboss_bot.jpg')
		.setColor(themecolor)
    .setTimestamp()
		aboutMsg.edit({content: " ", embeds: [about]})

}
}
