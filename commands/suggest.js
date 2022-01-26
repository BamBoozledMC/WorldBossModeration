const config = require('../config.json');
const Discord = require ("discord.js");

module.exports = {
	name: 'suggest',
  descrption: 'Returns your message',
	cooldown: 30,
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if (message.author.bot) return;
		if(message.channel.id == config.generalID) return;
		if (message.guild.id != "929941845004415046") return
		if (message.content.includes("@everyone"))  return;
		if (message.content.includes("@here")) return;
		let msgtosend = args.join(" ")
		if (!msgtosend) {
			let errMSG = await message.lineReply('Please include a suggestion!').catch(error =>{
			})
			return errMSG.delete({timeout:5000});
		}
		let embed = new Discord.MessageEmbed()
		.setTimestamp()
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setDescription(msgtosend)
		.setColor("GREEN")
		.setTitle("New suggestion:")
		.setFooter('To suggest something use !suggest')

		var Sentembed = await message.guild.channels.cache.get("929941845260255278").send(embed)

        Sentembed.react('<:Upvote:934930260070371389>').then(() => Sentembed.react('<:Downvote:934930252713586688>'));

				message.channel.send("Your suggestion has been submit!").then(message => {
					message.delete({timeout:5000})
				});

		message.delete().catch(error =>{
		})
    }
}
