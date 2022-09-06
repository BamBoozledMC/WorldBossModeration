const config = require('../config.json');
const Discord = require ("discord.js");
const fetch = require('node-fetch');

module.exports = {
	name: 'fungus',
  descrption: 'Returns your message',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if(message.author.id == config.ownerID) {
		let embed = new Discord.MessageEmbed()
		.setColor(themecolor)
		.setTitle(`Fungus!`)
		.setColor("BLUE")
		.setImage('https://media.discordapp.net/attachments/931344525400629288/1014434065455263744/SmartSelect_20220802-093217_Gallery.jpg?width=670&height=702')
		message.channel.send({ embeds: [embed]})
	}
    }
}
