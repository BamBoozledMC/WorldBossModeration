const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'enlarge',
  descrption: 'Returns your message',
	aliases: ['bigger', 'makebigger'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${commandName}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		const emotes = (str) => str.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu);
	  let getemojis = emotes(message.content)
		if (!getemojis) return message.reply("Make sure to include an emoji for me to enlarge.")
		let emoji = getemojis[0]
		let info = emoji.split(/<(a?):(\w+):(\d+)>/)
		if (info[0]) {
			let invalidemoji = new Discord.MessageEmbed()
			.setTitle("Invalid Emoji")
			.setColor("RED")
			.setDescription(`${info[0]} couldn't be enlarged.`)
			return message.reply({embeds: [invalidemoji]})
		}
		try {
		let fileext = info[1] ? 'gif' : 'png'
		let url = `https://cdn.discordapp.com/emojis/${info[3]}.${fileext}?size=1024`
		let enlarged = new Discord.MessageEmbed()
		.setTitle(`Successfully enlarged ${info[2]}`)
		.setURL(`${url}`)
		.setImage(url)
		.setColor(themecolor)
		message.reply({ embeds: [enlarged] })
	} catch (e) {
		console.log(e);
		let error = new Discord.MessageEmbed()
		.setTitle("An error occurred")
		.setColor("RED")
		.setDescription(`Something went wrong when trying to enlarge your emoji, try a different one.`)
		return message.reply({embeds: [error]})
	}
    }
}
