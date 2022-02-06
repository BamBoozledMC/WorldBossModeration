const config = require('../config.json');
const Discord = require ("discord.js");
const fetch = require('node-fetch');

module.exports = {
	name: 'fact',
  descrption: 'Returns your message',
	aliases: ['facts', 'getfact', 'randomfact', 'funfact'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		let loading = await message.channel.send("<a:loading:939665977728176168> Give me a sec...")
		const getfact = await fetch('https://uselessfacts.jsph.pl/random.json?language=en')
		let fact = await getfact.json()
		let embed = new Discord.MessageEmbed()
		.setColor("#d90053")
		.setTitle(`Here is your Fact!`)
		.setURL(`${fact.permalink}`)
		.setDescription(`**${fact.text}**`)
		message.lineReplyNoMention(embed)
		loading.delete()
    }
}
