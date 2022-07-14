const config = require('../config.json');
const Discord = require ("discord.js");

module.exports = {
	name: 'embedmanager',
  descrption: 'Returns your message',
	aliases: ['embed', 'embeds', 'emanager', 'createembed', 'newembed', 'deleteembed', 'removeembed', 'editembed'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		if (message.member.roles.cache.some(role => role.id === '947756109932937246')) return;
		if (message.author.bot) return;
		if (message.content.includes("@everyone"))  return;
		if (message.content.includes("@here")) return;
		let embedmanagerinfo = new Discord.MessageEmbed()
		.setTitle("Embed Manager")
		.setColor(themecolor)
		.setDescription(`Create and edit server Embeds with ease!\nAccess the Embed Manager via the [Dashboard](https://wbmoderation.com/dashboard) ➜ Miscellaneous ➜ Embed Manager\nIf you're lazy, here is a direct link to the [Embed Manager](https://wbmoderation.com/dashboard/server/${message.guild.id}/embedmanager)\n\n<:info:972496453182316584> At the moment embeds can only be managed via the Web Dashboard, commands are a work in progress.`)
		.setThumbnail(`https://wbmoderation.com/media/file-lines-white.png`)
		.setFooter(`Developed by ${bot.users.cache.get(config.ownerID).tag}`, bot.users.cache.get(config.ownerID).displayAvatarURL({ dynamic: true }))

		message.reply({ embeds: [embedmanagerinfo] }).catch(error =>{
			console.log(error);
		})
    }
}
