const config = require('../config.json');
const Discord = require ("discord.js");

module.exports = {
	name: 'makefact',
  descrption: 'Returns your message',
	aliases: ['createfact'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		if (message.member.roles.cache.some(role => role.id === '947756109932937246')) return;
		if (message.author.bot) return;
		if (message.content.includes("@everyone"))  return;
		if (message.content.includes("@here")) return;
		let thefact = args.join(" ")
		if (!thefact) {
			let errMSG = await message.reply("I can't make a fact if you don't give me one!\nTry again and specify a fact.").catch(error =>{
			})
			return setTimeout(() => errMSG.delete().catch(error => {}), 5000);
		}
		message.delete().catch(error =>{
		})
		let factembed = new Discord.MessageEmbed()
		.setTitle("Fact of the Day <t:1657764000:d>")
		.setColor('RANDOM')
		.setDescription(`${thefact}`)
		.setThumbnail(`https://wbmoderation.com/media/dyk.png`)
		.setTimestamp()

		message.channel.send({ embeds: [factembed] }).catch(error =>{
			console.log(error);
		})
    }
}
